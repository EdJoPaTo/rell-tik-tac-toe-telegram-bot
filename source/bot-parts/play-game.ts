import {Composer} from 'telegraf'

import {tryJoin, getOngoingGame, doTurn} from '../communication'

import {createScreen} from '../lib/game-screen'

export const bot = new Composer()

bot.command('start', async ctx => {
	let ongoingGame = await getOngoingGame((ctx as any).session)
	if (!ongoingGame) {
		await tryJoin((ctx as any).session)

		ongoingGame = await getOngoingGame((ctx as any).session)
		if (!ongoingGame) {
			throw new Error('could not join a game')
		}
	}

	const {text, extra} = createScreen(ongoingGame)
	await ctx.reply(text, extra)
})

bot.action(/turn:(\d)/, async ctx => {
	let ongoingGame = await getOngoingGame((ctx as any).session)
	if (!ongoingGame) {
		await ctx.reply('no game running. use /start')
		return
	}

	const selectedField = Number(ctx.match![1])

	console.log('try field', selectedField, ctx.match)

	if (ongoingGame.field.length > 0 && ongoingGame.field[selectedField] !== 'unset') {
		await ctx.answerCbQuery('field already set, chose a different one')
		return
	}

	await doTurn((ctx as any).session, selectedField)

	ongoingGame = await getOngoingGame((ctx as any).session)
	if (!ongoingGame) {
		throw new Error('the game vanished?')
	}

	await ctx.answerCbQuery()

	const {text, extra} = createScreen(ongoingGame)
	await ctx.editMessageText(text, extra)
})

bot.action('update', async ctx => {
	try {
		await ctx.answerCbQuery()

		let ongoingGame = await getOngoingGame((ctx as any).session)
		if (!ongoingGame) {
			await ctx.reply('no game running. use /start')
			return
		}

		const {text, extra} = createScreen(ongoingGame)
		await ctx.editMessageText(text, extra)
	} catch (error) {
		if (error.message.includes('message is not modified')) {
			// ignore
			return
		}

		console.error('ERROR while updating message', error)
	}
})
