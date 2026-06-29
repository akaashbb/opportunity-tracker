import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: opps, error } = await supabase
    .from('opportunities')
    .select('*, customers(name), sales_managers(name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // --- KPIs ---
  const total = opps.length
  const won = opps.filter(o => o.stage === 'Won').length
  const lost = opps.filter(o => o.stage === 'Lost').length
  const open = opps.filter(o => o.status === 'Open').length
  const totalRevenue = opps.reduce((s, o) => s + (o.deal_value || 0), 0)
  const totalCost = opps.reduce((s, o) => s + (o.cost || 0), 0)
  const totalProfit = opps.reduce((s, o) => s + (o.profit || 0), 0)
  const avgProfitPct = total > 0 ? opps.reduce((s, o) => s + (o.profit_pct || 0), 0) / total : 0
  const winRate = total > 0 ? ((won / total) * 100).toFixed(1) : 0
  const wonRevenue = opps.filter(o => o.stage === 'Won').reduce((s, o) => s + (o.deal_value || 0), 0)

  // --- Monthly revenue (last 12 months) ---
  const monthMap = {}
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    monthMap[key] = { month: key, revenue: 0, profit: 0, cost: 0 }
  }
  opps.forEach(o => {
    if (!o.closing_date) return
    const d = new Date(o.closing_date)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (monthMap[key]) {
      monthMap[key].revenue += o.deal_value || 0
      monthMap[key].profit += o.profit || 0
      monthMap[key].cost += o.cost || 0
    }
  })
  const monthly = Object.values(monthMap)

  // --- Stage distribution ---
  const stageCounts = {}
  opps.forEach(o => { stageCounts[o.stage] = (stageCounts[o.stage] || 0) + 1 })
  const stageData = Object.entries(stageCounts).map(([name, value]) => ({ name, value }))

  // --- By Sales Manager (deals count + profit) ---
  const mgrDeals = {}, mgrProfit = {}
  opps.forEach(o => {
    const name = o.sales_managers?.name || 'Unknown'
    mgrDeals[name] = (mgrDeals[name] || 0) + 1
    mgrProfit[name] = (mgrProfit[name] || 0) + (o.profit || 0)
  })
  const managerDeals = Object.entries(mgrDeals)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 7)
  const managerProfit = Object.entries(mgrProfit)
    .map(([name, profit]) => ({ name, profit }))
    .sort((a, b) => b.profit - a.profit).slice(0, 7)

  // --- Top Customers ---
  const custVal = {}
  opps.forEach(o => {
    const name = o.customers?.name || 'Unknown'
    custVal[name] = (custVal[name] || 0) + (o.deal_value || 0)
  })
  const topCustomers = Object.entries(custVal)
    .map(([name, deal_value]) => ({ name, deal_value }))
    .sort((a, b) => b.deal_value - a.deal_value).slice(0, 6)

  return NextResponse.json({
    kpis: { total, won, lost, open, totalRevenue, totalCost, totalProfit, avgProfitPct, winRate, wonRevenue },
    monthly,
    stageData,
    managerDeals,
    managerProfit,
    topCustomers,
  })
}
