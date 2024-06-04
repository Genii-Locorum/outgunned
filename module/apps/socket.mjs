import { OutgunnedInteractiveChat } from '../chat/interactive-chat.mjs';
import { OutgunnedChecks } from './checks.mjs';

export class OutgunnedSystemSocket {
  
  static async callSocket (data) {
    switch (data.type){
      case 'chatUpdate':
        if (game.user.isGM) {
            OutgunnedInteractiveChat.handleChatButton(data.value);
        }  
      break; 
      case 'reRoll':
        console.log("reroll")
        await OutgunnedChecks.makeRoll(data.value);
      break;


    }
  }
}