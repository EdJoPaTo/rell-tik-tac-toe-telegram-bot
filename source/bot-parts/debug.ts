import {Composer} from 'telegraf'

import {getAllUsers, getAllGames, getOngoingGame} from '../communication'

export const bot = new Composer()

function codeIntoMarkdown(header: string, code: string) : string {
	return '*' + header + '*\n```\n' + code + '\n```\n'
}

bot.command('debug', async ctx => {
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'get_all_users',
		JSON.stringify(await getAllUsers(), null, '  ')
	))
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'get_all_games',
		JSON.stringify(await getAllGames(), null, '  ')
	))
	await ctx.replyWithMarkdown(codeIntoMarkdown(
		'get_ongoing_game',
		JSON.stringify(await getOngoingGame((ctx as any).session), null, '  ')
	))
})
