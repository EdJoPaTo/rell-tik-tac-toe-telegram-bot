import TelegrafInlineMenu from 'telegraf-inline-menu'

import {getOpenTables, joinTable} from '../../communication'

export const menu = new TelegrafInlineMenu(() => {
	return 'If there are open tables you can join one of them.'
})

menu.select('t', options, {
	setParentMenuAfter: true,
	columns: 2,
	getCurrentPage: (ctx: any) => ctx.session.page,
	setPage: (ctx: any, page) => {
		ctx.session.page = page
	},
	setFunc: async (ctx, key) => {
		await joinTable(key, (ctx as any).session)
	}
})

export async function options(ctx: any): Promise<Record<string, string>> {
	const all = await getOpenTables(ctx.session)
	const result: Record<string, string> = {}

	for (const table of all) {
		result[table.name] = table.whose_turn
	}

	return result
}
