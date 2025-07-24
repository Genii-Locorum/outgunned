import { OutgunnedInteractiveChat } from './interactive-chat.mjs';
import { OutgunnedActorDetails } from '../apps/actorDetails.mjs';

//export function addChatListeners(html) {
//  html.on('click', '.cardbutton', OutgunnedInteractiveChat.triggerChatButton)
  //return
//}


export class OutgunnedChat{
//Hides Owner-Only sections of chat message from anyone other than the owner and the GM  
static async renderMessageHook (message, html) {
  ui.chat.scrollBottom()
  html.querySelectorAll(".cardbutton").forEach(b => b.addEventListener('click', OutgunnedInteractiveChat.triggerChatButton));
  if (!game.user.isGM) {
    const ownerOnly = html.querySelectorAll('.owner-only')


    for (const zone of ownerOnly) {
console.log(game.user.id, message.flags.config.origin)

      const actor = await OutgunnedActorDetails._getParticipant(message.flags.config.partic.particId,message.flags.config.partic.particType);
      if ((actor && !actor.isOwner) || (!actor && (!game.user.isGM && game.user.id != message.flags?.config?.origin))) {
        zone.style.display = 'none'
      } 
    }
  }
  return
}

}