import {Composer} from 'telegraf'

import * as debug from './debug'
import * as menu from './menu'
import * as userCreation from './user-creation'

export const bot = new Composer()

bot.use(userCreation.bot.middleware())

bot.use(debug.bot.middleware())
bot.use(menu.bot.middleware())
