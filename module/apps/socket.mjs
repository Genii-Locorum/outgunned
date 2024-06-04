import { OutgunnedInteractiveChat } from '../chat/interactive-chat.mjs';
import { OutgunnedChecks } from './checks.mjs';

export class OutgunnedSystemSocket {
  
  static async callSocket (data) {
    //If a target (to) is specified then only carry this out if its this user
    if (!!data.to && game.userId !== data.to) return {

    }
    switch (data.type){
      case 'chatUpdate':
        if (game.user.isGM) {
            OutgunnedInteractiveChat.handleChatButton(data.value);
        }  
      break; 
      case 'reRoll':
        await OutgunnedChecks.makeRoll(data.value);
      break;


    }
  }
}