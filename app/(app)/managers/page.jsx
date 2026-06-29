'use client'
import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, Trash2, X, Save } from 'lucide-react'

const empty = { name: '', email: '', department: '', team: '' }

export default function ManagersPage() {
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const res = await fetch('/api/managers')
    setManagers(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openAdd = () => { setForm(empty); setEditing(null); setError(''); setModal(true) }
  const openEdit = (m) => { setForm(m); setEditing(m.id); setError(''); setModal(true) }
  const closeModal = () => { setModal(false); setError('') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const url = editing ? `/api/managers/${editing}` : '/api/managers'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      closeModal(); fetchAll()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this sales manager?')) return
    await fetch(`/api/managers/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const filtered = managers.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()) || m.department?.toLowerCase().includes(search.toLowerCase()))

  const DEPT_COLORS = { Healthcare: '#10b981', Finance: '#3b82f6', Technology: '#8b5cf6', Manufacturing: '#f59e0b', Retail: '#ef4444', default: '#6b7280' }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Managers</h1>
          <p className="page-subtitle">{managers.length} managers registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><PlusCircle size={14}/> Add Manager</button>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="search-input" placeholder="Search managers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Manager Cards Grid */}
      {loading ? <div className="loading"><div className="spinner"/></div> : filtered.length === 0 ? (
        <div className="empty-state"><p>No managers yet. <button onClick={openAdd} style={{ color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}>Add one →</button></p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map(m => {
            const initials = m.name?.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() || 'SM'
            const deptColor = DEPT_COLORS[m.department] || DEPT_COLORS.default
            return (
              <div key={m.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, var(--primary), var(--accent))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: 'white', flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.email || '—'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(m)}><Pencil size={12}/></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(m.id)}><Trash2 size={12}/></button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {m.department && <span className="badge" style={{ background: `${deptColor}20`, color: deptColor }}>{m.department}</span>}
                  {m.team && <span className="badge" style={{ background: 'rgba(148,163,184,0.1)', color: 'var(--text-muted)' }}>{m.team}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Sales Manager' : 'Add Sales Manager'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16}/></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">⚠ {error}</div>}
              <form onSubmit={handleSave}>
                <div className="form-grid" style={{ marginBottom: 16 }}>
                  {[
                    { label: 'Full Name *', key: 'name', req: true, placeholder: 'Akash Kumar' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'akash@company.com' },
                    { label: 'Department', key: 'department', placeholder: 'Healthcare' },
                    { label: 'Team', key: 'team', placeholder: 'South India Sales' },
                  ].map(f => (
                    <div className="form-group" key={f.key}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-control" type={f.type || 'text'} required={f.req}
                        value={form[f.key] || ''} placeholder={f.placeholder}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner"/> : <Save size={13}/>} {saving ? 'Saving...' : 'Save Manager'}
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
