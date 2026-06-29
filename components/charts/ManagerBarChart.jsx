'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { formatCurrency, shortLabel } from '@/lib/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#7c3aed', fontSize: 13, fontWeight: 600 }}>
          {payload[0].name === 'count' ? payload[0].value + ' deals' : formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

const COLORS = ['#7c3aed', '#4f46e5', '#8b5cf6', '#6d28d9', '#5b21b6']

export default function ManagerBarChart({ dealsData, profitData }) {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">📊 Deals by Sales Manager</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dealsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => shortLabel(v, 10)} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} name="count">
              {dealsData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">💰 Profit by Sales Manager</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={profitData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => formatCurrency(v, 0)} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => shortLabel(v, 10)} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="profit" radius={[0, 4, 4, 0]} name="profit">
              {profitData.map((_, i) => <Cell key={i} fill={['#10b981', '#34d399', '#059669', '#047857', '#065f46'][i % 5]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
