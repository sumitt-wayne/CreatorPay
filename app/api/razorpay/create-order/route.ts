import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { planId, name, email, phone, telegram_username } = await request.json()

    if (!planId || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: plan } = await supabase
      .from('plans')
      .select('*, profiles(*)')
      .eq('id', planId)
      .single()

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Create Razorpay order
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString('base64')
      },
      body: JSON.stringify({
        amount: plan.price,
        currency: 'INR',
        notes: { planId, subscriberEmail: email, subscriberName: name }
      })
    })

    const order = await razorpayRes.json()

    if (!order.id) {
      return NextResponse.json({ error: 'Could not create order' }, { status: 500 })
    }

    // Calculate expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days)

    // Save pending subscription
    await supabase.from('subscriptions').insert({
      plan_id: planId,
      creator_id: plan.creator_id,
      subscriber_name: name,
      subscriber_email: email,
      subscriber_phone: phone,
      telegram_user_id: telegram_username,
      razorpay_order_id: order.id,
      amount_paid: plan.price,
      status: 'pending',
      expires_at: expiresAt.toISOString()
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      creatorName: plan.profiles.full_name,
      planName: plan.name
    })

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
