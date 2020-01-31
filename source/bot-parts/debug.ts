import {Composer} from 'telegraf'

import {getTables, getPlayers, getOpenTables, getPlayerTables} from '../communication'

export const bot = new Composer()

function codeIntoMarkdown(header: string, code: string): string {
	return '*' + header + '*\n```\n' + code + '\n```\n'
}

bot.command('debug', async ctx => {
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'getPlayers',
		JSON.stringify(await getPlayers(), null, '  ')
	))
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'getTables',
		JSON.stringify(await getTables(), null, '  ')
	))
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'getOpenTables',
		JSON.stringify(await getOpenTables((ctx as any).session), null, '  ')
	))
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'getPlayerTables',
		JSON.stringify(await getPlayerTables((ctx as any).session), null, '  ')
	))
})
