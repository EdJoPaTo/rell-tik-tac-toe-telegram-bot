import {Markup, Extra, CallbackButton} from 'telegraf'

import {Game, FieldState} from '../types'

const emojis = {
	x: '❌',
	o: '⭕️',
	fieldUnset: '🕳',
	update: '🔄'
}

function emojiForFieldState(state: FieldState): string {
	switch (state) {
		case 'O': return emojis.o
		case 'X': return emojis.x
		default: return emojis.fieldUnset
	}
}

function buttonForField(game: Game, fieldId: number): CallbackButton {
	return Markup.callbackButton(emojiForFieldState(game.field[fieldId]), `turn:${fieldId}`)
}

export function createScreen(game: Game): {text: string, extra: any} {
	let text = ''
	const buttons: any[][] = []

	text += `Player ${emojis.x}: _${game.playerX}_\n`

	if (game.playerX !== game.playerO) {
		text += `Player ${emojis.o}: _${game.playerO}_\n`
	}

	text += `State: *${game.state}*`

	buttons.push([
		Markup.callbackButton(emojis.update + 'Update', 'update')
	])

	if (game.state !== 'wait_for_player') {
		buttons.push([
			buttonForField(game, 0),
			buttonForField(game, 1),
			buttonForField(game, 2)
		])

		buttons.push([
			buttonForField(game, 3),
			buttonForField(game, 4),
			buttonForField(game, 5)
		])

		buttons.push([
			buttonForField(game, 6),
			buttonForField(game, 7),
			buttonForField(game, 8)
		])
	}

	return {
		text,
		extra: Extra.markdown().markup(
			Markup.inlineKeyboard(buttons)
		)
	}
}
