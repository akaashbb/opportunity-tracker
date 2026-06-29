'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency, formatPercent, formatDate, getStageColor, getPriorityColor, getStatusColor } from '@/lib/formatters'
import { PlusCircle, Search, Pencil, Trash2, Download } from 'lucide-react'

const STAGES = ['', 'Lead', 'Proposal', 'Negotiation', 'Won', 'Lost']
const STATUSES = ['', 'Open', 'Closed']
const PRIORITIES = ['', 'High', 'Medium', 'Low']

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState([])
  const [managers, setManagers] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', stage: '', status: '', priority: '', manager_id: '', customer_id: '' })
  const [deleting, setDeleting] = useState(null)

  const fetchOpps = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    const res = await fetch(`/api/opportunities?${params}`)
    setOpps(await res.json())
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchOpps() }, [fetchOpps])
  useEffect(() => {
    fetch('/api/managers').then(r => r.json()).then(setManagers)
    fetch('/api/customers').then(r => r.json()).then(setCustomers)
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/opportunities/${id}`, { method: 'DELETE' })
    setDeleting(null)
    fetchOpps()
  }

  const exportCSV = () => {
    const headers = ['Opp ID', 'Project', 'Customer', 'Manager', 'Stage', 'Deal Value', 'Cost', 'Profit', 'Profit%', 'Status', 'Priority', 'Closing Date']
    const rows = opps.map(o => [
      o.opp_id, o.project_name, o.customers?.name, o.sales_managers?.name,
      o.stage, o.deal_value, o.cost, o.profit, o.profit_pct, o.status, o.priority, o.closing_date
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `opportunities_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  }

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Opportunities</h1>
          <p className="page-subtitle">{opps.length} records found</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={exportCSV}><Download size={14}/> Export CSV</button>
          <Link href="/opportunities/new" className="btn btn-primary"><PlusCircle size={14}/> Add Opportunity</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={14} />
          <input className="search-input" placeholder="Search project or Opp ID..."
            value={filters.search} onChange={e => setFilter('search', e.target.value)} />
        </div>
        <select className="filter-select" value={filters.stage} onChange={e => setFilter('stage', e.target.value)}>
          {STAGES.map(s => <option key={s} value={s}>{s || 'All Stages'}</option>)}
        </select>
        <select className="filter-select" value={filters.status} onChange={e => setFilter('status', e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Status'}</option>)}
        </select>
        <select className="filter-select" value={filters.priority} onChange={e => setFilter('priority', e.target.value)}>
          {PRIORITIES.map(s => <option key={s} value={s}>{s || 'All Priority'}</option>)}
        </select>
        <select className="filter-select" value={filters.manager_id} onChange={e => setFilter('manager_id', e.target.value)}>
          <option value="">All Managers</option>
          {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="filter-select" value={filters.customer_id} onChange={e => setFilter('customer_id', e.target.value)}>
          <option value="">All Customers</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ search: '', stage: '', status: '', priority: '', manager_id: '', customer_id: '' })}>
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner"/><span>Loading...</span></div>
          ) : opps.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p>No opportunities found. <Link href="/opportunities/new" style={{ color: 'var(--primary-light)' }}>Add one →</Link></p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Opp ID</th>
                  <th>Project Name</th>
                  <th>Customer</th>
                  <th>Manager</th>
                  <th>Stage</th>
                  <th>Deal Value</th>
                  <th>Profit</th>
                  <th>Profit %</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Closing Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {opps.map(o => (
                  <tr key={o.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{o.opp_id}</span></td>
                    <td><span style={{ fontWeight: 600 }}>{o.project_name}</span></td>
                    <td>{o.customers?.name || '—'}</td>
                    <td>{o.sales_managers?.name || '—'}</td>
                    <td>
                      <span className="badge" style={{ background: `${getStageColor(o.stage)}20`, color: getStageColor(o.stage) }}>
                        {o.stage}
                      </span>
                    </td>
                    <td className="font-bold">{formatCurrency(o.deal_value)}</td>
                    <td className="text-success">{formatCurrency(o.profit)}</td>
                    <td>
                      <span style={{ color: o.profit_pct >= 25 ? 'var(--success)' : o.profit_pct >= 10 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
                        {formatPercent(o.profit_pct)}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: `${getPriorityColor(o.priority)}20`, color: getPriorityColor(o.priority) }}>
                        {o.priority}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: `${getStatusColor(o.status)}20`, color: getStatusColor(o.status) }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(o.closing_date)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Link href={`/opportunities/${o.id}/edit`} className="btn btn-ghost btn-sm btn-icon" title="Edit">
                          <Pencil size={13}/>
                        </Link>
                        <button className="btn btn-danger btn-sm btn-icon" title="Delete"
                          onClick={() => handleDelete(o.id)} disabled={deleting === o.id}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
