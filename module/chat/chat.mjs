import { OutgunnedInteractiveChat } from './interactive-chat.mjs';
import { OutgunnedActorDetails } from '../apps/actorDetails.mjs';

export function addChatListeners(html) {
  html.addEventListener('click', event => {
    // Check if the clicked element or one of its parents has the class "cardbutton"
    const button = event.target.closest('.cardbutton')
    if (!button) return

    OutgunnedInteractiveChat.triggerChatButton(event)
  })
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