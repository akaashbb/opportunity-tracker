'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { formatCurrency, shortLabel } from '@/lib/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600 }}>{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa', '#60a5fa']

export default function CustomerChart({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🏆 Top Customers by Deal Value</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => shortLabel(v, 10)} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => formatCurrency(v, 0)} width={72} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="deal_value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
