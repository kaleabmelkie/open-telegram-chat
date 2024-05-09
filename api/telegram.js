import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.command('start', (ctx) => {
  ctx.reply(
    "Welcome to the @OpenTelegramChat_bot\n\nPaste any 🇪🇹 phone number and I'll send you a link to open that chat in Telegram. The link will work if the info is correct. It can be either a phone number or a username.",
  )
})

bot.on(message('text'), (ctx) => {
  const phoneNumberStr = ctx.message.text
    .trim()
    .replace(/(\s|\-|\(|\))/gi, '')
    .replace(/^(\+251|0)/, '')

  ctx.reply(
    `https://t.me/${
      Number.isSafeInteger(Number(phoneNumberStr))
        ? `+251${phoneNumberStr}`
        : ctx.message.text.trim().replace(/\s/g, '').replace(/^@/, '')
    }`,
  )
})

await bot.telegram.setWebhook(`https://${process.env.VERCEL_URL}/api/telegram`)

export default async (req, res) => {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body, res)
  } else {
    res.status(200).json('Listening to bot events...')
  }
}
