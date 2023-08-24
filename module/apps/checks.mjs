import { OutgunnedActorDetails } from "./actorDetails.mjs";
import {OutgunnedSelectLists}  from "./select-lists.mjs";
import {OutgunnedDiceRolls} from "./dice-result.mjs";

export class OutgunnedChecks {

  //Roll starter from Skill on Character Sheet  
  static async _onSkillRoll(event){
    const dataset = event.currentTarget.dataset
    let partic =await OutgunnedActorDetails._getParticipantId(this.token,this.actor); 
    let actor = await OutgunnedActorDetails._getParticipant(partic.particId, partic.particType);
    let itemId = dataset.itemid
    let item = actor.items.get(itemId)
  
    await OutgunnedChecks.startCheck ({
      shiftKey: event.shiftKey,
      partic,
      type: 'action',
      rollType: "roll",
      skillScore : item.system.total,
      attScore: actor.system.abilities[item.system.displayAtt].total,
      skillLabel: item.name,
      attLabel: actor.system.abilities[item.system.displayAtt].label,
      defaultAtt: item.system.displayAtt,
      itemId,
      winTitle: item.name,
    })
  }

  //Start the roll process
  static async startCheck(options = {}) {

    //Configure the roll
    let config = await OutgunnedChecks.initiateConfig(options)
    if (config === false) {return}
    
    await OutgunnedChecks.runCheck (config)
  
    return
  }

  // Set Roll and Dialog options for the check
  static async initiateConfig(options){
    let actor = await OutgunnedActorDetails._getParticipant(options.partic.particId, options.partic.particType);
    const config = {
      origin: game.user.id,
      originGM: game.user.isGM,
      shiftKey: options.shiftKey ? options.shiftKey : false,    
      rollType: options.rollType,
      skillScore: options.skillScore ? options.skillScore: 0,
      attScore: options.attScore ? options.attScore: 0,
      skillLabel: options.skillLabel ? options.skillLabel : "",
      attLabel: options.attLabel ? options.attLabel : "",
      defaultAtt: options.defaultAtt ? options.defaultAtt : "",
      label: "",
      difficulty: "critical",
      doubleDiff: 1,
      itemId: options.itemId ? options.itemId: "",
      partic: options.partic,
      diceNumber: 2,
      originalDiceNumber: 2,
      bonusDice: 0,
      closed: false,
      reRoll: false,
      keepDice: [],
      rolledDice: [],
      rollResult: [],
      previousRollResult: [],
      improve: false,
      successLevel: 0,
      freeRoll: true,
      allIn: false,
      type: options.type,
      chatTemplate: 'systems/outgunned/templates/chat/roll-result.html',
      dialogTemplate: 'systems/outgunned/templates/dialog/rollOptions.html',
      winTitle: options.winTitle ? options.winTitle : game.i18n.localize("OG.rollWindow")      
    }  
    return config;
  }

  // Run Check Routines 
  static async runCheck (config) {
    //If Shift key has been held then accept the defaults otherwise call a Dialog box for roll options 
    let actor = await OutgunnedActorDetails._getParticipant(config.partic.particId, config.partic.particType);
    if (!config.shiftKey){
      let usage = await OutgunnedChecks.RollDialog(config);
      if (usage) {
        config.defaultAtt = usage.get('selectAtt');
        config.difficulty = usage.get('difficulty');
        //If difficulty is impossible then ignore the doubledifficulty select - default is normal roll
        if (config.difficulty != 'impossible') {
          config.doubleDiff = Number(usage.get('doubleDiff'));
        }
        config.bonusDice = Number(usage.get('bonusDice'));
        config.attScore = actor.system.abilities[config.defaultAtt].total;
        config.attLabel = actor.system.abilities[config.defaultAtt].label;
      }
    }
  
    //If the roll is from a skill then prep the number of dice and label    
    if (config.type === "action"){
      config.diceNumber = Math.max(config.skillScore + config.attScore + config.bonusDice,2)
      config.diceNumber = Math.min(config.diceNumber,9)
      if (config.rollType === 'roll') {
        config.originalDiceNumber = config.diceNumber
      }
    }

    //Call the dice roll routine
    await OutgunnedChecks.makeRoll (config)
    
    return
  }  


  //Call Dice Roll, calculate Result and store result in rollVal
  static async makeRoll(config) {
    config.label = game.i18n.localize('OG.' + config.type + '.' + config.rollType) +": " + config.attLabel + " - " + config.skillLabel
    let roll = new Roll(config.diceNumber+"D6");
    await roll.roll({ async: true});
    config.roll=roll;
    const results = roll.terms[0] && roll.terms[0].results ? roll.terms[0].results : [];
    let diceRolls = results.reduce((acc, curVal) => [...acc, curVal.result], []);
    config.rolledDice = diceRolls;
    config.rollResult = await OutgunnedDiceRolls.calcResult (diceRolls, config.keepDice)
 

    //On Reroll or FreeRoll check to see if the result has improved or not
    if (config.rollType === 'reRoll') {
      if (config.rollResult.successes.total <= config.previousRollResult.successes.total) {
        config.rollResult = await OutgunnedDiceRolls.reduceSuccess(config.rollResult)
      } else {
        if (config.rollResult.restDice.length > 0) {
          config.allIn = true;
        }  
        config.improve = true;
      }
    } else if (config.rollType === 'freeRoll') {
      if (config.rollResult.successes.total <= config.previousRollResult.successes.total) {
        config.rollResult = config.previousRollResult;
      }  else {
        if (config.rollResult.restDice.length > 0) {
          config.allIn = true;
        }  
        config.improve = true;
      }
    } else if (config.rollType === 'allIn') {
      if (config.rollResult.successes.total <= config.previousRollResult.successes.total) {
        config.rollResult = await OutgunnedDiceRolls.calcResult(diceRolls,[])
        config.allIn = false;
        config.rollResult.restDice = [...config.rollResult.restDice, ...config.keepDice].sort();
      } else {
        config.allIn = false;
        config.improve = true;
      }
    }







    //Calculate the success level - if no hasGenerateSuccess
    config.successLevel = await OutgunnedChecks.successLevel (config)

    //On Roll Check to see if reRoll is an option
    if (config.rollType === 'roll' && config.successLevel > 0) {
      config.reRoll = true;
    } 

    //On Roll Check to see if there are dice to be re-rolled for a free-roll or re-roll
    if (config.rollResult.restDice.length < 1) {
      config.freeRoll = false;
      config.reRoll = false
    }



    //Create the ChatMessage and make the dice roll appear
    const html = await OutgunnedChecks.startChat(config);
    await OutgunnedChecks.showChat(html,config);
  
    return;
  } 


  //Open the roll Modifier Dialog box 
  static async RollDialog (options) {
    let selectAttType = await OutgunnedSelectLists.getAttributeTypes();
    const data = {
      type : options.type,
      label: options.label,
      rollType: options.rollType,
      defaultAtt: options.defaultAtt,
      selectAttType,
    }
    const html = await renderTemplate(options.dialogTemplate,data);
    return new Promise(resolve => {
      let formData = null
      const dlg = new Dialog({
        title: options.winTitle,
        content: html,
        buttons: {
          roll: {
            label: game.i18n.localize("OG.rollDice"),
            callback: html => {
            formData = new FormData(html[0].querySelector('#check-roll-form'))
            return resolve(formData)
            }
          }
        },
      default: 'roll',
      close: () => {}
      },{classes: ["outgunned"]})
      dlg.render(true);
    })
  }


  //Calculate the level of success
  static async successLevel (config) {
    let targetScore = 0;
    let successLevel = 0;
    if (config.difficulty === "basic") {
      targetScore = 1;
    } else if (config.difficulty === "critical") {
      targetScore = 3;
    } else if (config.difficulty === "extreme") {
      targetScore = 9;
    }  else if (config.difficulty === "impossible") {
      targetScore = 27;
    }
    targetScore = targetScore * config.doubleDiff;
    if(config.rollResult.successes.total >= 81) {
      successLevel = 4;
    } else if (config.rollResult.successes.total > targetScore) {
      successLevel = 3;
    } else if (config.rollResult.successes.total >= targetScore) {
      successLevel = 2;
    } else if (config.rollResult.successes.total > 0) {
      successLevel = 1;
    }
    return successLevel;
  }

 // Prep the chat card
  //
  static async startChat(config) {
    let actor = await OutgunnedActorDetails._getParticipant(config.partic.particId,config.partic.particType)
    let diffLabel = game.i18n.localize('OG.difficulty') +": " + game.i18n.localize('OG.'+config.difficulty);
    if (config.doubleDiff === 2) {
      diffLabel = game.i18n.localize('OG.double') +" "+ diffLabel
    }
    if (config.bonusDice > 0) {
        diffLabel = diffLabel + "(+" + config.bonusDice + ")";
      } else if (config.bonusDice < 0) {
        diffLabel = diffLabel + "(" + config.bonusDice + ")";
      }  
    let messageData = {
      origin: config.origin,
      originGM: config.originGM,
      speaker: ChatMessage.getSpeaker({ actor: actor.name }),
      type: config.type,
      rollType: config.rollType,
      label: config.label,
      rollResult: config.rollResult,
      rolledDice: config.rolledDice,
      closed: config.closed,
      reRoll: config.reRoll,
      pairsDice: config.rollResult.pairsDice,
      restDice: config.rollResult.restDice,
      freeRoll: config.freeRoll,
      allIn: config.allIn,
      improve: config.improve,
      actorId: actor._id,
      partic: config.partic,
      successLevel : config.successLevel,
      resultLabel: game.i18n.localize('OG.resultLevel.'+config.successLevel),
      diffLabel: diffLabel,
    }
    const messageTemplate = config.chatTemplate
    let html = await renderTemplate (messageTemplate, messageData);
    return html;
  }  

  // Display the chat card and roll the dice
  static async showChat(html,config) {
    let actor = await OutgunnedActorDetails._getParticipant(config.partic.particId,config.partic.particType)
    let chatData={};
      chatData = {
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls: [config.roll],
        content: html,
        flags: {config: config},
        speaker: {
          actor: actor._id,
          alias: actor.name,
        },
    }
      
    let msg = await ChatMessage.create(chatData);
    return 
  }

}