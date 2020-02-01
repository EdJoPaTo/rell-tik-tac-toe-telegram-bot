import {ContextMessageUpdate} from 'telegraf'

import {Session} from './types'

/* eslint @typescript-eslint/no-var-requires: warn */
const LocalSession = require('telegraf-session-local')

export interface SessionRaw {
	user: number;
	data: Session;
}

const localSession = new LocalSession({
	// Database name/path, where sessions will be located (default: 'sessions.json')
	database: 'persist/sessions.json',
	// Format of storage/database (default: JSON.stringify / JSON.parse)
	format: {
		serialize: (obj: any) => JSON.stringify(obj, undefined, '\t'),
		deserialize: (str: string) => JSON.parse(str)
	},
	getSessionKey: (ctx: ContextMessageUpdate) => `${ctx.from!.id}`
})

export function getRaw(): readonly SessionRaw[] {
	return localSession.DB
		.get('sessions').value()
		.map(({id, data}: {id: string; data: any}) => {
			const user = Number(id.split(':')[0])
			return {user, data}
		})
}

export function getUser(userId: number): Session | undefined {
	return localSession.DB
		.get('sessions')
		.getById(`${userId}`)
		.get('data')
		.value()
}

export const middleware = (): any => localSession.middleware()
