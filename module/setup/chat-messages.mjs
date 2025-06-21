import { OutgunnedChat } from '../chat/chat.mjs'

export function listen(){
  Hooks.on('renderChatMessageHTML', (app, html, data) => {
    OutgunnedChat.renderMessageHook(app, html, data)
  })
}