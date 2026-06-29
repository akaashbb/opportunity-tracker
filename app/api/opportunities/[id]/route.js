import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/opportunities/[id]
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select(`*, customers(id, name, email, phone, region, business_unit), sales_managers(id, name, email, department)`)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

const num = (v) => (v === '' || v === null || v === undefined) ? null : parseFloat(v)

// PUT /api/opportunities/[id]
export async function PUT(request, { params }) {
  const supabase = await createClient()
  const body = await request.json()

  const deal_value = parseFloat(body.deal_value) || 0
  const cost = parseFloat(body.cost) || 0
  const profit = deal_value - cost
  const profit_pct = deal_value > 0 ? (profit / deal_value) * 100 : 0

  const { data, error } = await supabase
    .from('opportunities')
    .update({
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
    })
    .eq('id', params.id)
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/opportunities/[id]
export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { error } = await supabase.from('opportunities').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
