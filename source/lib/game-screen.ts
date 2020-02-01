import {markdown as format} from 'telegram-format'

import {FieldState, TableState, TableStateInfo, TableFullInfo} from '../types'

function emojiForFieldState(state: FieldState): string {
	switch (state) {
		case FieldState.O: return '⭕️'
		case FieldState.X: return '❌'
		default: return '🕳'
	}
}

export function createTableText(table: TableFullInfo, yourName: string): string {
	let text = ''

	text += tableStateEmoji(table, yourName)

	text += format.bold(table.name)
	text += '\n'

	text += 'State: '
	text += TableState[table.state]
	text += '\n'

	text += '\n'
	text += table.players
		.map(o => `${emojiForFieldState(o.sign)}${table.whose_turn === o.name ? format.bold(o.name) : format.escape(o.name)}`)
		.join('\n')
	text += '\n'

	return text
}

export function createBoardOptions(table: TableFullInfo): Record<string, string> {
	const result: Record<string, string> = {}

	for (const fieldId of Object.keys(table.board)) {
		result[fieldId] = emojiForFieldState(table.board[Number(fieldId)])
	}

	return result
}

export function tableStateEmoji(table: TableStateInfo, yourName: string): string {
	if (table.state === TableState.WaitForPlayer) {
		return '🕓'
	}

	if (table.state === TableState.Draw) {
		return '🏳️'
	}

	if (table.state === TableState.GameWon) {
		if (table.whose_turn === yourName) {
			return '🥳'
		}

		return '😵'
	}

	// TableState.Running
	if (table.whose_turn === yourName) {
		return '🤔'
	}

	return '😴'
}
