import { OutgunnedCharacterSheet } from '../actors/sheets/character.mjs';
import { AttViewDialog } from '../chat/attributeView.mjs'

export class OutgunnedUtilities {
    static async triggerDelete(el, actor, dataitem) {
        const itemId = await this.getDataset(el, dataitem)
        if (!itemId) {return}
        let name = actor.items.get(itemId).name
        let type = actor.items.get(itemId).type
        let confirmation = await this.confirmation(name, type);
        if (confirmation) {
          await OutgunnedCharacterSheet.confirmItemDelete(actor, itemId);
        }    
        return confirmation
    }

  static async getDataset(el, dataitem) {
    const elem = await el.target ? el.target : el[0];
    const element = await elem?.closest(".item");
    return element.dataset[dataitem];
  }    

  static async confirmation(name, type) {
    let title = ""
      if (type === 'chatMsg') {
        title = game.i18n.localize('OG.'+name)
      } else {
        title = game.i18n.localize('OG.delete') + ":" + game.i18n.localize('OG.'+type) + "(" + name +")";
      }  
    let confirmation = await Dialog.confirm({
      title: title,
      content: game.i18n.localize('OG.proceed'),
    });
    return confirmation;
  }

  static async getDataFromDropEvent (event, entityType = 'Item') {
    if (event.originalEvent) return []
    try {
      const dataList = JSON.parse(event.dataTransfer.getData('text/plain'))
      if (dataList.type === 'Folder' && dataList.documentName === entityType) {
        const folder = await fromUuid(dataList.uuid)
        if (!folder) return []
        return folder.contents
      } else if (dataList.type === entityType) {
        const item = await fromUuid(dataList.uuid)
        if (!item) return []
        return [item]
      } else {
        return []
      }
    } catch (err) {
      return []
    }
  }  

  static async triggerEdit(el, actor, dataitem) {
    const itemId = await this.getDataset(el, dataitem)
    if (!itemId) {return}
    const item = actor.items.get(itemId);
    item.sheet.render(true);
    return 
}  

static async triggerEditActor(el, actor, dataitem) {
let currVal=""
if (dataitem === 'grit') {
  currVal = actor.system.grit.max
}else {
  currVal = actor.system[dataitem]
}
  const data = {
    currVal,
  }
  const html = await renderTemplate('systems/outgunned/templates/dialog/catchPhrase.html',data);
  let result = await new Promise(resolve => {
    let formData = null
    const dlg = new Dialog({
      title: game.i18n.localize('OG.'+dataitem),
      content: html,
      buttons: {
        confirm: {
          label: game.i18n.localize("OG.confirm"),
          callback: html => {
          formData = new FormData(html[0].querySelector('#catchPhrase-form'))
          return resolve(formData)
          }
        }
      },
    default: 'confirm',
    close: () => {}
    },{classes: ["outgunned", "sheet"]})
    dlg.render(true);
  })
  let answer = result.get('newVal') 
  if (dataitem === 'grit') {
    answer = Number(answer);
    if (!answer) {return} 
    await actor.update({'system.grit.max': answer});
  }else {
    await actor.update({[`system.${dataitem}`]: answer});
  }  


  return 
} 

  //Delete Age
  static async deleteAge (el, actor, dataitem) {
    //Check to see age exists and if not warn/stop
    if (!actor.system.ageId) {
      ui.notifications.warn(game.i18n.localize('OG.msg.noAgeDelete'));      
      return}    
    //Check Role has been deleted first
    if (actor.system.roleId) {
      ui.notifications.warn(game.i18n.localize('OG.msg.deleteRole'));
      return;
    }
    let item = actor.items.get(actor.system.ageId)
    let confirmation = await this.confirmation(item.name, item.type);
    if (!confirmation) {
      return
    }  
    //Reset characteristics
    let checkProp = {
      'system.adrenaline.base' : 0,
      'system.adrenaline.value' : 0,
      'system.deathRoulette.base': 0,
      'system.deathRoulette.value': 0,
      'system.ageOptFeat': 0,
      'system.ageFeat': 0,
      'system.ageExp': 0
    };
    await actor.update(checkProp);
      //Now delete age and all feats where source = age
      for (let i of actor.items)
        if ((i.type === 'feat' && i.system.source === 'age') || i.type === 'age') {
          i.delete();
        }
    
  }  

  //Delete Role
  static async deleteRole (el, actor, dataitem) {
    //Check Trope has been deleted first
    if (actor.system.tropeId) {
      ui.notifications.warn(game.i18n.localize('OG.msg.deleteTrope'));
      return;
    }
    if (!actor.system.roleId) {
      ui.notifications.warn(game.i18n.localize('OG.msg.noRoleDelete'));      
      return
    }
    let item = actor.items.get(actor.system.roleId)
    let confirmation = await this.confirmation(item.name, item.type);
    if (!confirmation) {
      return
    }  
    for (let i of actor.items) {
      //Delete all role and feats where source = role 
      if ((i.type === 'feat' && i.system.source === 'role') || (i.type === 'role')) {
        i.delete();
      } else if (i.type === 'skill') {
        //Reset all skill to zero role value
        await i.update({'system.role' : 0})
      }
    }
    //Reset all attribute role points to zero
    let checkProp = {
      'system.abilities.brawn.role': 0,
      'system.abilities.nerves.role': 0,
      'system.abilities.smooth.role': 0,
      'system.abilities.focus.role': 0,
      'system.abilities.crime.role': 0,
    }
    await actor.update(checkProp);  

  }  

  //Delete Trope
  static async deleteTrope (el, actor, dataitem) {
    if (!actor.system.tropeId) {
      ui.notifications.warn(game.i18n.localize('OG.msg.noTropeDelete'));      
      return
    }
    let item = actor.items.get(actor.system.tropeId)
    let confirmation = await this.confirmation(item.name, item.type);
    if (!confirmation) {
      return
    }
    for (let i of actor.items) {
      //Delete all role and feats where source = trope 
      if ((i.type === 'feat' && i.system.source === 'trope') || (i.type === 'trope')) {
        i.delete();
      } else if (i.type === 'skill') {
        //Reset all skill to zero trope value
        await i.update({'system.trope' : 0})
      }  
    }
    //Reset all attribute trope points to zero
    let checkProp = {
      'system.abilities.brawn.trope': 0,
      'system.abilities.nerves.trope': 0,
      'system.abilities.smooth.trope': 0,
      'system.abilities.focus.trope': 0,
      'system.abilities.crime.trope': 0,
    }
    await actor.update(checkProp);
  }  

  static async viewAttribute(el, actor) {
    const elem = await el.target ? el.target : el[0];
    const element = await elem?.closest(".attribute-name");
    const attName = element.dataset.attkey
    const dialogData ={}
    let newScores = await AttViewDialog.create(actor.system.abilities[attName].label,actor.system.abilities[attName].value,actor.system.abilities[attName].role,actor.system.abilities[attName].trope)
    await actor.update({[`system.abilities.${attName}.value`]: newScores.value,
                        [`system.abilities.${attName}.role`]: newScores.role,
                        [`system.abilities.${attName}.trope`]: newScores.trope
    })
  } 

  static async spendAdrenaline(el, actor) {
    if (actor.system.adrenaline.value <6) {
      ui.notifications.warn(game.i18n.localize('OG.msg.notAdrenaline'));
      return
    } 
    if (actor.system.spotlight.value >= actor.system.spotlight.max ) {
      ui.notifications.warn(game.i18n.localize('OG.msg.maxSpotlight'));
      return
    }  
    let checkProp = {
      'system.adrenaline.value': 0,
      'system.spotlight.value': actor.system.spotlight.value +1
    }
    actor.update(checkProp);
  }

  static async saveFriend (actor){
  
    //Create a list of characters except for the current actor
    let characterList = [];
    for (let j of game.actors) {
      if (j.type === 'character' && j.id != actor.id) {
        characterList.push(j);
      }
    };  

    //If the list has no characters then stop the routine
    if (characterList.length < 1){
      ui.notifications.warn(game.i18n.localize('OG.msg.noSave'));    
      return false;   
    }


    const data = {
      type : characterList
    }
  
    let destination = 'systems/outgunned/templates/dialog/characterList.html';
    let winTitle = game.i18n.localize("OG.selectFriend");
    
    const html = await renderTemplate(destination,data);
  
    let usage = await new Promise(resolve => {
      let formData = null
      const dlg = new Dialog({
        title: winTitle,
        content: html,
        buttons: {
          roll: {
            label: game.i18n.localize("OG.confirm"),
            callback: html => {
            formData = new FormData(html[0].querySelector('#selected'))
            return resolve(formData)
            }
          }
        },
      default: 'roll',
      close: () => {}
      })
      dlg.render(true);
    })
 
    let selectedFriendId = ""
    if (usage) {
      selectedFriendId = usage.get('characterList');
    } 
  
    return selectedFriendId
  }




  static async spendSpotlight (el, actor, rollType){
    if (actor.system.spotlight.value < 1) {
      ui.notifications.warn(game.i18n.localize('OG.msg.noSpotlight'));
      return
    }

    let label = game.i18n.localize('OG.spendSpotlight');
    let selectedFriendId = "";
    let target="";
    if (rollType === 'save') {

      selectedFriendId = await OutgunnedUtilities.saveFriend(actor);
      target = game.actors.get(selectedFriendId)
      label = game.i18n.localize('OG.saveFriend') +": "+ target.name;
      if (selectedFriendId === false) {return}
    }


    let roll = new Roll("1D2");
    await roll.roll({ async: true});
    let rollResult = Number(roll.result);

    // Prep the chat card
    //
    let messageData = {
      speaker: ChatMessage.getSpeaker({ actor: actor.name }),
      label,
      rollResult,
      rollType,
    }


    let html = await renderTemplate ('systems/outgunned/templates/chat/spotlight-result.html', messageData);

    // Display the chat card and roll the dice
    let chatData={};
      chatData = {
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        target: target.name,
        rolls: [roll],
        content: html,
        flags: {},
        speaker: {
          actor: actor._id,
          alias: actor.name,
        },
    }
    await ChatMessage.create(chatData);

    //If the roll was 1 then reduce Spotlight by 1
    if (rollResult === 1) {
      await actor.update({'system.spotlight.value': actor.system.spotlight.value -1});
    } else if (rollType === 'save') {
      let target = game.actors.get(selectedFriendId)
      await actor.update({'system.spotlight.value': actor.system.spotlight.value -1});
      if (target.system.spotlight.value < 3) {
        await target.update({'system.spotlight.value': target.system.spotlight.value + 1});
      }  
    }
  }


  static async triggerEditHot (el, actor) {
    const elem = await el.target ? el.target : el[0]
    const targetScore = Number(elem.dataset.target)
    await actor.update({[`system.hot.${targetScore}`]: !actor.system.hot[targetScore]});
  }

  static async increaseHeat (change) {
    let newHeat = game.settings.get('outgunned', 'heat') + Number(change)
    if (newHeat < 1) {newHeat = 1};
    if (newHeat > 12) {newHeat = 12};
    await game.settings.set('outgunned', 'heat', newHeat);
    for (const a of game.actors.contents) {
      if (a.isOwner) {
        a.render(false)
      }
    }
  }

  static async _freeform(toggle) {
    if(!game.user.isGM) {
      return
    }
    await game.settings.set('outgunned', 'freeform', toggle)
  }
}