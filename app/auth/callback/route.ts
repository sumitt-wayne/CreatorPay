import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata.full_name,
          username: user.email?.split('@')[0].replace(/[^a-z0-9]/g, ''),
          avatar_url: user.user_metadata.avatar_url
        })
      }
    }
    return NextResponse.redirect(`${origin}/dashboard`)
  }
  return NextResponse.redirect(`${origin}/login`)
}
