import TelegrafInlineMenu from 'telegraf-inline-menu'

import {getPlayerTables, createTable} from '../../communication'
import {TableState} from '../../types'
import {tableStateEmoji} from '../../lib/game-screen'

import {menu as tableMenu} from './table'

export const menu = new TelegrafInlineMenu(() => {
	return 'These are my tables'
})

menu.selectSubmenu('t', options, tableMenu, {
	columns: 2,
	getCurrentPage: (ctx: any) => ctx.session.page,
	setPage: (ctx: any, page) => {
		ctx.session.page = page
	}
})

export async function options(ctx: any): Promise<Record<string, string>> {
	const all = await getPlayerTables(ctx.session)
	const result: Record<string, string> = {}

	for (const table of all) {
		const emoji = tableStateEmoji(table, ctx.from.first_name)

		if (table.state === TableState.WaitForPlayer) {
			result[table.name] = emoji + 'Wait for player…'
		} else {
			result[table.name] = emoji + table.whose_turn
		}
	}

	const sortedKeysByValue = Object.keys(result)
		.sort((a, b) => result[a].localeCompare(result[b]))

	const sortedByValue: Record<string, string> = {}
	for (const key of sortedKeysByValue) {
		sortedByValue[key] = result[key]
	}

	return sortedByValue
}

menu.button('Or create a new table…', 'new', {
	hide: async ctx => {
		const all = await getPlayerTables((ctx as any).session)
		const hasOpenTable = all.some(o => o.state === TableState.WaitForPlayer)

		return hasOpenTable
	},
	doFunc: async ctx => {
		await createTable(new Date().toISOString().replace(/:/g, '-'), (ctx as any).session)
	}
})
