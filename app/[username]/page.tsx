import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicCreatorClient from './client'

export default async function CreatorPage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  const { data: creator } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!creator) return notFound()

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('creator_id', creator.id)
    .eq('is_active', true)
    .order('price', { ascending: true })

  return <PublicCreatorClient creator={creator} plans={plans || []} />
}
