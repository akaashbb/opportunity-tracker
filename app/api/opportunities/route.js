import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Convert empty string to null for optional numeric fields
const num = (v) => (v === '' || v === null || v === undefined) ? null : parseFloat(v)

// GET /api/opportunities
export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  let query = supabase
    .from('opportunities')
    .select(`*, customers(id, name, email, phone, region, business_unit), sales_managers(id, name, email, department)`)
    .order('created_at', { ascending: false })

  if (searchParams.get('stage')) query = query.eq('stage', searchParams.get('stage'))
  if (searchParams.get('status')) query = query.eq('status', searchParams.get('status'))
  if (searchParams.get('priority')) query = query.eq('priority', searchParams.get('priority'))
  if (searchParams.get('manager_id')) query = query.eq('manager_id', searchParams.get('manager_id'))
  if (searchParams.get('customer_id')) query = query.eq('customer_id', searchParams.get('customer_id'))
  if (searchParams.get('search')) {
    query = query.or(`project_name.ilike.%${searchParams.get('search')}%,opp_id.ilike.%${searchParams.get('search')}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/opportunities
export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const deal_value = parseFloat(body.deal_value) || 0
  const cost = parseFloat(body.cost) || 0
  const profit = deal_value - cost
  const profit_pct = deal_value > 0 ? (profit / deal_value) * 100 : 0

  const { data, error } = await supabase.from('opportunities').insert([{
    ...body,
    deal_value,
    cost,
    profit: parseFloat(profit.toFixed(2)),
    profit_pct: parseFloat(profit_pct.toFixed(2)),
    probability: num(body.probability),
    customer_id: body.customer_id || null,
    manager_id: body.manager_id || null,
    closing_date: body.closing_date || null,
    start_date: body.start_date || null,
    end_date: body.end_date || null,
    user_id: user.id,
  }]).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
