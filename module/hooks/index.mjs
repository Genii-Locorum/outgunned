import * as RenderItemSheet from './render-item-sheet.mjs'
import * as RenderActorSheet from './render-actor-sheet.mjs'
import * as RenderChatMessage from '../setup/chat-messages.mjs'
import * as RenderDialog from './render-dialog.mjs'
import * as Init from './init.mjs'

export const OutgunnedHooks = {
    listen () {
      Init.listen()
        RenderActorSheet.listen()
        RenderItemSheet.listen()
        RenderDialog.listen()
        RenderChatMessage.listen()
    }
  }