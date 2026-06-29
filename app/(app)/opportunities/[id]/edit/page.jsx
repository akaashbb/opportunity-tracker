'use client'
import OpportunityForm from '@/components/OpportunityForm'
import { useParams } from 'next/navigation'

export default function EditOpportunityPage() {
  const params = useParams()
  return <OpportunityForm editId={params.id} />
}
