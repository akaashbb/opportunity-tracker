'use client'
import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, Trash2, X, Save } from 'lucide-react'

const empty = { name: '', email: '', phone: '', address: '', region: '', business_unit: '' }

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const res = await fetch('/api/customers')
    const data = await res.json()
    setCustomers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openAdd = () => { setForm(empty); setEditing(null); setError(''); setModal(true) }
  const openEdit = (c) => { setForm(c); setEditing(c.id); setError(''); setModal(true) }
  const closeModal = () => { setModal(false); setError('') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const url = editing ? `/api/customers/${editing}` : '/api/customers'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      closeModal(); fetchAll()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return
    await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const filtered = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} customers registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><PlusCircle size={14}/> Add Customer</button>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="search-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          {loading ? <div className="loading"><div className="spinner"/></div> : filtered.length === 0 ? (
            <div className="empty-state"><p>No customers yet. <button onClick={openAdd} style={{ color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}>Add one →</button></p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Region</th><th>Business Unit</th><th>Address</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.email || '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.phone || '—'}</td>
                    <td>{c.region || '—'}</td>
                    <td>{c.business_unit || '—'}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 12 }}>{c.address || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(c)}><Pencil size={13}/></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(c.id)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Customer' : 'Add Customer'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16}/></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">⚠ {error}</div>}
              <form onSubmit={handleSave}>
                <div className="form-grid" style={{ marginBottom: 14 }}>
                  {[
                    { label: 'Company Name *', key: 'name', req: true, placeholder: 'Apollo Hospitals' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'contact@apollo.com' },
                    { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
                    { label: 'Region', key: 'region', placeholder: 'South India' },
                    { label: 'Business Unit', key: 'business_unit', placeholder: 'Healthcare IT' },
                  ].map(f => (
                    <div className="form-group" key={f.key}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-control" type={f.type || 'text'} required={f.req}
                        value={form[f.key] || ''} placeholder={f.placeholder}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="form-group form-full">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" rows={2} value={form.address || ''} placeholder="123 MG Road, Hyderabad"
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner"/> : <Save size={13}/>} {saving ? 'Saving...' : 'Save Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
