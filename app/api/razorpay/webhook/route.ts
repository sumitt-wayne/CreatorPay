import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { generateInviteLink, sendTelegramMessage } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')!

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = await createClient()

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id

      // Update subscription to active
      const { data: subscription } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          razorpay_payment_id: paymentId,
          starts_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId)
        .select('*, plans(*)')
        .single()

      if (subscription) {
        // Log payment
        await supabase.from('payment_logs').insert({
          subscription_id: subscription.id,
          razorpay_payment_id: paymentId,
          amount: payment.amount,
          status: 'captured',
          webhook_data: event
        })

        // Get creator telegram config
        const { data: creator } = await supabase
          .from('profiles')
          .select('telegram_bot_token, telegram_channel_id, full_name')
          .eq('id', subscription.creator_id)
          .single()

        // Send Telegram invite if configured
        if (
          creator?.telegram_bot_token &&
          creator?.telegram_channel_id &&
          subscription.telegram_user_id
        ) {
          const inviteLink = await generateInviteLink(
            creator.telegram_bot_token,
            creator.telegram_channel_id
          )

          if (inviteLink) {
            await sendTelegramMessage(
              creator.telegram_bot_token,
              subscription.telegram_user_id,
              `<b>Payment Successful!</b>\n\nHi ${subscription.subscriber_name},\n\nYour subscription to <b>${subscription.plans?.name}</b> is now active.\n\nClick below to join the channel:\n${inviteLink}\n\n<i>This link can only be used once and expires in 1 hour.</i>`
            )
          }
        }
      }
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
