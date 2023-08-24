import { OutgunnedInteractiveChat } from '../chat/interactive-chat.mjs';

export class OutgunnedSystemSocket {
  
  static async callSocket (data) {
    switch (data.type){
      case 'chatUpdate':
        if (game.user.isGM) {
            OutgunnedInteractiveChat.handleChatButton(data.value);
        }  
      break; 


    }
  }
}