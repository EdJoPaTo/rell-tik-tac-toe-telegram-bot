import TelegrafInlineMenu from 'telegraf-inline-menu'

import {createTableText, createBoardOptions} from '../../lib/game-screen'
import {getTable, move} from '../../communication'
import {TableState, FieldState} from '../../types'

export const menu = new TelegrafInlineMenu(async ctx => {
	const tableName = ctx.match![1]
	const table = await getTable(tableName)

	return createTableText(table, ctx.from!.first_name)
})

async function fieldOptions(ctx: any): Promise<Record<string, string>> {
	const tableName = ctx.match![1]
	const table = await getTable(tableName)

	if (table.state === TableState.WaitForPlayer) {
		// Dont show the (empty) board when still waiting for someone else.
		return {}
	}

	return createBoardOptions(table)
}

menu.button('🔄 Update', 'update', {
	/* eslint @typescript-eslint/no-empty-function: off */
	doFunc: () => {}
})

menu.select('cell', fieldOptions, {
	columns: 3,
	setFunc: async (ctx, key) => {
		const tableName = ctx.match![1]
		const table = await getTable(tableName)

		if (table.state !== TableState.Running) {
			await ctx.answerCbQuery('This game has already ended.')
			return
		}

		if (table.whose_turn !== ctx.from!.first_name) {
			await ctx.answerCbQuery('It\'s not your turn right now.')
			return
		}

		const targetedCell = Number(key)
		const cellState = table.board[targetedCell]
		if (cellState !== FieldState.Unset) {
			await ctx.answerCbQuery('This field is already taken.')
			return
		}

		await move(tableName, (ctx as any).session, targetedCell)
	}
})
