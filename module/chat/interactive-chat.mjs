import { OutgunnedActorDetails } from "../apps/actorDetails.mjs";
import { OutgunnedDiceRolls } from "../apps/dice-result.mjs";
import { OutgunnedChecks } from "../apps/checks.mjs";

export class OutgunnedInteractiveChat {

static  async triggerChatButton(event){
    ui.chat.scrollBottom()
    const targetElement = event.currentTarget;
    const presetType = targetElement.dataset?.preset;
    const targetChat = $(targetElement).closest('.message');
    let targetChatId = targetChat[0].dataset.messageId;

    let origin = game.user.id;
    let originGM = game.user.isGM;

    //If this is GM then call the handleChatButton, otherwise it's a player in which case trigger Socket emit for the GM to act on
    if (game.user.isGM){
      OutgunnedInteractiveChat.handleChatButton ({presetType, targetChatId, origin, originGM})
    } else {
      game.socket.emit('system.outgunned', {
        type: 'chatUpdate',
        value: {presetType, targetChatId, origin, originGM}
      })
    }
  }

  static async handleChatButton ({presetType, targetChatId, origin, originGM}){
    let targetMsg = game.messages.get(targetChatId);
    let actor = await OutgunnedActorDetails._getParticipant(targetMsg.flags.config.partic.particId,targetMsg.flags.config.partic.particType);
    if (presetType === 'reRoll' || presetType === 'freeRoll' ||presetType === 'allIn') {
      //Update original message and re-render
      await targetMsg.update({
        'flags.config.origin' :origin,
        'flags.config.originGM' : originGM, 
        'flags.config.rollType' : presetType,
        'flags.config.shiftKey' : true,
        'flags.config.reRoll': false,
        'flags.config.freeRoll': false,
        'flags.config.allIn' : false,
        'flags.config.closed': true,
        'flags.config.previousRollResult' :targetMsg.flags.config.rollResult,  
      });
      const reRollhtml = await OutgunnedChecks.startChat(targetMsg.flags.config);
      await targetMsg.update({
        content: reRollhtml});

        //Depending of type of new roll (Re-roll, Free Roll or All In) set the new roll config
 
          await targetMsg.update({
            'flags.config.closed': false,
            'flags.config.keepDice': targetMsg.flags.config.rollResult.pairsDice,
            'flags.config.diceNumber' :   targetMsg.flags.config.originalDiceNumber - targetMsg.flags.config.rollResult.pairsDice.length,
            'flags.config.improve': false,
          });

      //Re-roll the dice
      await OutgunnedChecks.makeRoll(targetMsg.flags.config);
      return
    } 
  }

}