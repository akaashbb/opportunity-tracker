'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const STAGES = ['Lead', 'Proposal', 'Negotiation', 'Won', 'Lost']
const STATUSES = ['Open', 'Closed']
const PRIORITIES = ['High', 'Medium', 'Low']
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED']

const empty = {
  opp_id: '', project_name: '', customer_id: '', manager_id: '', department: '',
  stage: 'Lead', deal_value: '', cost: '', profit: '', profit_pct: '',
  currency: 'INR', closing_date: '', probability: '', competitor: '',
  status: 'Open', priority: 'Medium', technology: '', start_date: '', end_date: '',
  delivery_manager: '', remarks: '',
}

export default function OpportunityForm({ editId }) {
  const router = useRouter()
  const [form, setForm] = useState(empty)
  const [managers, setManagers] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!editId

  useEffect(() => {
    fetch('/api/managers').then(r => r.json()).then(setManagers)
    fetch('/api/customers').then(r => r.json()).then(setCustomers)
    if (isEdit) {
      setLoading(true)
      fetch(`/api/opportunities/${editId}`).then(r => r.json()).then(data => {
        setForm({ ...empty, ...data, customer_id: data.customer_id || '', manager_id: data.manager_id || '' })
        setLoading(false)
      })
    }
  }, [editId, isEdit])

  const set = (k, v) => {
    setForm(f => {
      const updated = { ...f, [k]: v }
      // Auto-calculate profit & profit%
      if (k === 'deal_value' || k === 'cost') {
        const dv = parseFloat(k === 'deal_value' ? v : f.deal_value) || 0
        const cost = parseFloat(k === 'cost' ? v : f.cost) || 0
        updated.profit = (dv - cost).toFixed(2)
        updated.profit_pct = dv > 0 ? (((dv - cost) / dv) * 100).toFixed(2) : '0'
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const url = isEdit ? `/api/opportunities/${editId}` : '/api/opportunities'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      router.push('/opportunities')
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading...</span></div>

  const Field = ({ label, name, type = 'text', required, children, full, readOnly, className }) => (
    <div className={`form-group ${full ? 'form-full' : ''}`}>
      <label className="form-label">{label}{required && ' *'}</label>
      {children || (
        <input className={`form-control ${className || ''}`} type={type} value={form[name] || ''} readOnly={readOnly}
          onChange={e => !readOnly && set(name, e.target.value)} required={required} />
      )}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Opportunity' : 'Add New Opportunity'}</h1>
          <p className="page-subtitle">{isEdit ? `Editing ${form.opp_id}` : 'Fill in the deal details below'}</p>
        </div>
        <Link href="/opportunities" className="btn btn-ghost"><ArrowLeft size={14}/> Back</Link>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Section: Basic Info */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><div className="card-title">🎯 Opportunity Details</div></div>
          <div className="form-grid">
            <Field label="Opportunity ID" name="opp_id" required><input className="form-control" value={form.opp_id} onChange={e => set('opp_id', e.target.value)} placeholder="OPP001" required /></Field>
            <Field label="Project Name" name="project_name" required><input className="form-control" value={form.project_name} onChange={e => set('project_name', e.target.value)} placeholder="Hospital ERP" required /></Field>
            <Field label="Customer" name="customer_id" required>
              <select className="form-control" value={form.customer_id} onChange={e => set('customer_id', e.target.value)} required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Sales Manager" name="manager_id" required>
              <select className="form-control" value={form.manager_id} onChange={e => set('manager_id', e.target.value)} required>
                <option value="">Select Manager</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <Field label="Department"><input className="form-control" value={form.department} onChange={e => set('department', e.target.value)} placeholder="Healthcare" /></Field>
            <Field label="Technology"><input className="form-control" value={form.technology} onChange={e => set('technology', e.target.value)} placeholder="React, Node.js, AWS" /></Field>
            <Field label="Competitor"><input className="form-control" value={form.competitor} onChange={e => set('competitor', e.target.value)} placeholder="ABC Pvt Ltd" /></Field>
            <Field label="Delivery Manager"><input className="form-control" value={form.delivery_manager} onChange={e => set('delivery_manager', e.target.value)} placeholder="Name" /></Field>
          </div>
        </div>

        {/* Section: Financial */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><div className="card-title">💰 Financial Details</div></div>
          <div className="form-grid">
            <Field label="Currency">
              <select className="form-control" value={form.currency} onChange={e => set('currency', e.target.value)}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Deal Value *"><input className="form-control" type="number" min="0" step="0.01" value={form.deal_value} onChange={e => set('deal_value', e.target.value)} placeholder="5000000" required /></Field>
            <Field label="Estimated Cost *"><input className="form-control" type="number" min="0" step="0.01" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="3500000" required /></Field>
            <Field label="Probability (%)"><input className="form-control" type="number" min="0" max="100" value={form.probability} onChange={e => set('probability', e.target.value)} placeholder="80" /></Field>
            <Field label="Profit (Auto-calculated)">
              <input className="form-control form-calc" readOnly value={form.profit ? `${form.currency === 'INR' ? '₹' : form.currency + ' '}${Number(form.profit).toLocaleString('en-IN')}` : ''} placeholder="Auto-calculated" />
            </Field>
            <Field label="Profit % (Auto-calculated)">
              <input className="form-control form-calc" readOnly value={form.profit_pct ? `${form.profit_pct}%` : ''} placeholder="Auto-calculated" />
            </Field>
          </div>
        </div>

        {/* Section: Status & Dates */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><div className="card-title">📅 Stage, Status & Dates</div></div>
          <div className="form-grid">
            <Field label="Opportunity Stage" required>
              <select className="form-control" value={form.stage} onChange={e => set('stage', e.target.value)} required>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select className="form-control" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Expected Closing Date"><input className="form-control" type="date" value={form.closing_date || ''} onChange={e => set('closing_date', e.target.value)} /></Field>
            <Field label="Project Start Date"><input className="form-control" type="date" value={form.start_date || ''} onChange={e => set('start_date', e.target.value)} /></Field>
            <Field label="Project End Date"><input className="form-control" type="date" value={form.end_date || ''} onChange={e => set('end_date', e.target.value)} /></Field>
          </div>
        </div>

        {/* Remarks */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><div className="card-title">📝 Remarks</div></div>
          <textarea className="form-control" rows={3} value={form.remarks} onChange={e => set('remarks', e.target.value)} placeholder="Customer requested demo, follow up next week..." />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Link href="/opportunities" className="btn btn-ghost">Cancel</Link>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? <span className="spinner" /> : <Save size={14}/>}
            {saving ? 'Saving...' : isEdit ? 'Update Opportunity' : 'Save Opportunity'}
          </button>
        </div>
      </form>
    </div>
  )
}
