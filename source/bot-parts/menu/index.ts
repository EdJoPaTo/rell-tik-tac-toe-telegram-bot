import {Composer} from 'telegraf'
import TelegrafInlineMenu from 'telegraf-inline-menu'
import {markdown as format} from 'telegram-format'

import {Session} from '../../types'

import {menu as myTablesMenu} from './my-tables'
import {menu as openTablesMenu} from './open-tables'

function menuText(ctx: any): string {
	const session = ctx.session as Session

	let text = ''

	text += 'Hi '
	text += ctx.from.first_name
	text += '!\n\n'

	text += 'My public key is:'
	text += ' '
	text +=	format.monospace(shortPubKey(session.pubKey))
	text += '\n'
	text +=	format.monospace(session.pubKey)

	return text
}

function shortPubKey(pubKey: string): string {
	let short = ''
	short += pubKey.slice(0, 4)
	short += '-'
	short += pubKey.slice(-4)
	return short
}

const mainMenu = new TelegrafInlineMenu(menuText)
mainMenu.setCommand('start')

mainMenu.submenu('My tables', 'my', myTablesMenu)
mainMenu.submenu('Join open tables', 'open', openTablesMenu)

mainMenu.urlButton('🦑 Source Code', 'https://github.com/EdJoPaTo/rell-tik-tac-toe-telegram-bot')

export const bot = new Composer()

bot.use(mainMenu.init({
	backButtonText: 'back…',
	mainMenuButtonText: 'Main Menu…'
}))
