'use client'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = { Lead: '#f59e0b', Proposal: '#3b82f6', Negotiation: '#8b5cf6', Won: '#10b981', Lost: '#ef4444' }
const DEFAULT_COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: payload[0].payload.fill, fontSize: 13, fontWeight: 600 }}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export default function StageChart({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🥧 Opportunities by Stage</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
            dataKey="value" nameKey="name" paddingAngle={3}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
