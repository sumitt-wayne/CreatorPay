export async function generateInviteLink(
  botToken: string,
  channelId: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/createChatInviteLink`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          member_limit: 1,
          expire_date: Math.floor(Date.now() / 1000) + 3600
        })
      }
    )
    const data = await response.json()
    return data.result?.invite_link || null
  } catch {
    return null
  }
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      }
    )
    return response.ok
  } catch {
    return false
  }
}

export async function removeMemberFromChannel(
  botToken: string,
  channelId: string,
  telegramUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/banChatMember`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          user_id: telegramUserId,
          revoke_messages: false
        })
      }
    )
    return response.ok
  } catch {
    return false
  }
}
