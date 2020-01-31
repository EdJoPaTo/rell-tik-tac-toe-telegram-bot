import {Composer} from 'telegraf'

import {createPlayer, getPlayer} from '../communication'
import {Session} from '../types'

export const bot = new Composer()

bot.use(async (ctx, next) => {
	const session = (ctx as any).session as Session

	if (session.pubKey) {
		try {
			const row = await getPlayer(session)
			if (!row) {
				throw new Error('player does not exist')
			}
		} catch (_) {
			// Does not exist anymore on backend

			delete session.pubKey
			delete session.privKey
		}
	}

	if (!session.pubKey) {
		const user = await createPlayer(ctx.from!.first_name)
		session.pubKey = user.pubKey
		session.privKey = user.privKey
	}

	if (next) {
		return next()
	}
})

bot.command('reset', ctx => {
	(ctx as any).session = {}
})
