import {Composer} from 'telegraf'
import TelegrafInlineMenu from 'telegraf-inline-menu'

import {menu as myTablesMenu} from './my-tables'
import {menu as openTablesMenu} from './open-tables'

const mainMenu = new TelegrafInlineMenu(ctx => {
	return `Hi ${ctx.from!.first_name}!`
})
mainMenu.setCommand('start')

mainMenu.submenu('My tables', 'my', myTablesMenu)
mainMenu.submenu('Join open tables', 'open', openTablesMenu)

export const bot = new Composer()

bot.use(mainMenu.init({
	backButtonText: 'back…',
	mainMenuButtonText: 'Main Menu…'
}))
