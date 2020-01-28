import {Composer} from 'telegraf'

import {Session} from '../types'
import {createUser} from '../communication'

export const bot = new Composer()

bot.use(async (ctx, next) => {
	const session = (ctx as any).session as Session

	if (!session.pubKey) {
		const user = await createUser(ctx.from!.first_name)
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
