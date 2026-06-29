'use client'
import { useEffect, useState, useCallback } from 'react'
import KPICard from '@/components/KPICard'
import RevenueChart from '@/components/charts/RevenueChart'
import StageChart from '@/components/charts/StageChart'
import ManagerBarChart from '@/components/charts/ManagerBarChart'
import CustomerChart from '@/components/charts/CustomerChart'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      <span>Loading dashboard...</span>
    </div>
  )

  const { kpis = {}, monthly = [], stageData = [], managerDeals = [], managerProfit = [], topCustomers = [] } = data || {}

  const kpiCards = [
    { label: 'Total Opportunities', value: kpis.total || 0, icon: '🎯', color: 'var(--primary)', sub: 'All time' },
    { label: 'Won Deals', value: kpis.won || 0, icon: '✅', color: 'var(--success)', sub: `Win Rate: ${kpis.winRate || 0}%` },
    { label: 'Lost Deals', value: kpis.lost || 0, icon: '❌', color: 'var(--danger)', sub: `Open: ${kpis.open || 0}` },
    { label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue), icon: '💰', color: '#3b82f6', sub: `Won: ${formatCurrency(kpis.wonRevenue)}` },
    { label: 'Total Cost', value: formatCurrency(kpis.totalCost), icon: '📉', color: 'var(--warning)', sub: 'Estimated' },
    { label: 'Total Profit', value: formatCurrency(kpis.totalProfit), icon: '📈', color: 'var(--success)', sub: `Avg: ${formatPercent(kpis.avgProfitPct)}` },
    { label: 'Avg Profit %', value: formatPercent(kpis.avgProfitPct), icon: '💹', color: '#10b981', sub: 'Across all deals' },
    { label: 'Open Pipeline', value: kpis.open || 0, icon: '🔄', color: '#8b5cf6', sub: 'Active opportunities' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Dashboard</h1>
          <p className="page-subtitle">Real-time pipeline insights & performance analytics</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchData}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map(k => (
          <KPICard key={k.label} label={k.label} value={k.value} icon={k.icon} color={k.color} sub={k.sub} />
        ))}
      </div>

      {/* Revenue Trend - Full Width */}
      <div style={{ marginBottom: 16 }}>
        <RevenueChart data={monthly} />
      </div>

      {/* Stage + Customer Charts */}
      <div className="charts-grid" style={{ marginBottom: 16 }}>
        <StageChart data={stageData} />
        <CustomerChart data={topCustomers} />
      </div>

      {/* Manager Charts */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <ManagerBarChart dealsData={managerDeals} profitData={managerProfit} />
      </div>

      {/* Quick Stats Footer */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {[
            { label: 'Conversion Rate', value: `${kpis.winRate || 0}%` },
            { label: 'Total Deals Value', value: formatCurrency(kpis.totalRevenue) },
            { label: 'Total Cost', value: formatCurrency(kpis.totalCost) },
            { label: 'Net Profit', value: formatCurrency(kpis.totalProfit) },
            { label: 'Won Projects', value: kpis.won || 0 },
            { label: 'Lost Projects', value: kpis.lost || 0 },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
