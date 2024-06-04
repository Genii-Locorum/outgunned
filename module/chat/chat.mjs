import { OutgunnedInteractiveChat } from './interactive-chat.mjs';
import { OutgunnedActorDetails } from '../apps/actorDetails.mjs';

export function addChatListeners(html) {
  html.on('click', '.cardbutton', OutgunnedInteractiveChat.triggerChatButton)
  return
}


export class OutgunnedChat{

//
//Hides Owner-Only sections of chat message from anyone other than the owner and the GM  
static async renderMessageHook (message, html) {
  ui.chat.scrollBottom()
  if (!game.user.isGM) {
    const ownerOnly = html.find('.owner-only')
    const actor = await OutgunnedActorDetails._getParticipant(message.flags.config.partic.particId,message.flags.config.partic.particType);
    const origin = message.flags.config.origin
    for (const zone of ownerOnly) {
      if ((actor && !actor.isOwner) || (!actor && (!game.user.isGM && game.user.id != origin))) {
        zone.style.display = 'none'
      } 
    }
  }
  return
}

}