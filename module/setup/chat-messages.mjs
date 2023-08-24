import { OutgunnedChat } from '../chat/chat.mjs'

export function listen(){
  Hooks.on('renderChatMessage', (app, html, data) => {
    OutgunnedChat.renderMessageHook(app, html, data)
  })
}