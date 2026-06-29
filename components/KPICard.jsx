export default function KPICard({ label, value, sub, icon, color = 'var(--primary)', bgColor }) {
  return (
    <div className="kpi-card" style={{ '--kpi-color': color }}>
      {icon && (
        <div className="kpi-icon" style={{ background: bgColor || `${color}20` }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
        </div>
      )}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}
