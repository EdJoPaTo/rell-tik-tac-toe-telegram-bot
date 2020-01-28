import {existsSync, readFileSync} from 'fs'

import Telegraf, {Extra} from 'telegraf'

import * as userSessions from './user-sessions'
import * as botParts from './bot-parts'

const tokenFilePath = existsSync('/run/secrets') ? '/run/secrets/bot-token.txt' : 'bot-token.txt'
const token = readFileSync(tokenFilePath, 'utf8').trim()
const bot = new Telegraf(token)

if (process.env.NODE_ENV !== 'production') {
  bot.use(async (ctx, next) => {
    const identifier = [
      new Date().toISOString(),
      Number(ctx.update.update_id).toString(16),
      ctx.from && ctx.from.first_name,
      ctx.updateType
    ].join(' ')
    const callbackData = ctx.callbackQuery && ctx.callbackQuery.data
    const inlineQuery = ctx.inlineQuery && ctx.inlineQuery.query
    const messageText = ctx.message && ctx.message.text
    const data = callbackData || inlineQuery || messageText
    console.time(identifier)
    if (next) {
      await next()
    }

    if (data) {
      console.timeLog(identifier, data.length, data.replace(/\n/g, '\\n').slice(0, 50))
    } else {
      console.timeLog(identifier)
    }
  })
}

bot.use(async (ctx, next) => {
  try {
    if (next) {
      await next()
    }
  } catch (error) {
    if (error.message.includes('Too Many Requests')) {
      console.warn('Telegraf Too Many Requests error. Skip.', error)
      return
    }

    if (error.message.includes('RESULT_ID_INVALID')) {
      console.warn('ERROR', error.message)
      return
    }

    console.error('try to send error to user', ctx.update, error)
    let text = '🔥 Something went wrong here!'

    text += '\n'
    text += '\nError: `'
    text += error.message
      .replace(token, '')
    text += '`'

    const target = (ctx.chat || ctx.from!).id
    await ctx.telegram.sendMessage(target, text, Extra.markdown() as any)
  }
})

bot.use(userSessions.middleware())
bot.use(botParts.bot.middleware())

bot.catch((error: any) => {
  console.error('Telegraf Error', error.response || error)
})

async function startup(): Promise<void> {
  await bot.launch()
  console.log(new Date(), 'Bot started as', bot.options.username)
}

startup()
