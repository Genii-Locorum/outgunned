import { OutgunnedActorDetails } from "./actorDetails.mjs";
import {OutgunnedSelectLists}  from "./select-lists.mjs";
import {OutgunnedDiceRolls} from "./dice-result.mjs";

export class OutgunnedChecks {

  //Roll starter from Skill on Character Sheet  
  static async _onSkillRoll(event){
    const dataset = event.currentTarget.dataset
    let partic =await OutgunnedActorDetails._getParticipantId(this.token,this.actor); 
    let actor = await OutgunnedActorDetails._getParticipant(partic.particId, partic.particType);
    let itemId = dataset.itemId
    let item = actor.items.get(itemId)
  
    await OutgunnedChecks.startCheck ({
      shiftKey: event.shiftKey,
      partic,
      type: game.settings.get('outgunned', 'defaultCheckType'),
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

  static async _onNeutralRoll () {
    await OutgunnedChecks.startCheck ({
      shiftKey: false,
      type: game.settings.get('outgunned', 'defaultCheckType'),
      rollType: "roll",
      winTitle: game.i18n.localize("OG.neutralRoll"),
      neutralRoll: true
    })
    
  }

  //Death Roulette roll from Character Sheet
  static async _deathRoulette(event,actor) {
    let partic =await OutgunnedActorDetails._getParticipantId(this.token,actor); 
    await OutgunnedChecks.startCheck ({
      shiftKey: true,
      partic,
      deathScore: actor.system.deathRoulette.value,
      type: 'death',
      rollType: "roll",
      winTitle: game.i18n.localize('OG.deathRoulette'),
    })
  }

  //Roll on Attribute from Supporting Character
  static async _onAttributeRoll(event){
    const dataset = event.currentTarget.dataset
    let partic =await OutgunnedActorDetails._getParticipantId(this.token,this.actor); 
    let actor = await OutgunnedActorDetails._getParticipant(partic.particId, partic.particType);
    let attKey = dataset.attkey

    await OutgunnedChecks.startCheck ({
      shiftKey: event.shiftKey,
      partic,
      type: game.settings.get('outgunned', 'defaultCheckType'),
      rollType: "attRoll",
      attScore: actor.system.abilities[attKey].total,
      attLabel: actor.system.abilities[attKey].label,
      winTitle: actor.system.abilities[attKey].label,
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
      deathScore: options.deathScore ? options.deathScore: 0,
      label: "",
      difficulty: game.settings.get('outgunned', 'defaultDifficulty'),
      doubleDiff: 1,
      dangerRoll: false,
      damage: 0,
      itemId: options.itemId ? options.itemId: "",
      partic: options.partic ? options.partic: "",
      diceNumber: 1,
      originalDiceNumber: 1,
      bonusDice: 0,
      closed: false,
      reRoll: false,
      gamble: 0,
      keepDice: [],
      rolledDice: [],
      rollResult: [],
      previousRollResult: [],
      improve: false,
      successLevel: 0,
      freeRoll: true,
      neutralRoll: options.neutralRoll ? options.neutralRoll: false,
      allIn: false,
      type: options.type,
      chatTemplate: 'systems/outgunned/templates/chat/roll-result.html',
      dialogTemplate: 'systems/outgunned/templates/dialog/rollOptions.html',
      winTitle: options.winTitle ? options.winTitle : game.i18n.localize("OG.rollWindow"),      
    }  
    return config;
  }

  // Run Check Routines 
  static async runCheck (config) {
    //If Shift key has been held then accept the defaults otherwise call a Dialog box for roll options 

    let actor = ""
    config.spkrName = game.user.name
    if (!config.neutralRoll) {
      actor = await OutgunnedActorDetails._getParticipant(config.partic.particId, config.partic.particType);
      config.spkrName = actor.name
    }
    if (!config.shiftKey){
      let usage = await OutgunnedChecks.RollDialog(config);
      if (usage) {
        if (config.neutralRoll) {
          config.attScore = Number(usage.get('neutralDice'))
        }  
        config.defaultAtt = usage.get('selectAtt');
        config.dangerRoll = usage.get('dangerRoll');
        config.gamble = Number(usage.get('gamble'));
        config.difficulty = usage.get('difficulty');
        //If difficulty is impossible then ignore the doubledifficulty select - default is normal roll
        if (config.difficulty != 'impossible') {
          config.doubleDiff = Number(usage.get('doubleDiff'));
        }
        config.bonusDice = Number(usage.get('bonusDice'));

        if (config.rollType != 'attRoll' && !config.neutralRoll) {
          config.attScore = actor.system.abilities[config.defaultAtt].total;
          config.attLabel = actor.system.abilities[config.defaultAtt].label;
        }  

        //If this is a danger roll update the check type
        if (config.dangerRoll === 'true') {
          config.type = 'danger';
        } else {
          config.type = 'action'       
        }  
      }
    }
    //If this is a death Roulette roll then remove the Free Roll Option
    if(config.type === "death") {
      config.freeRoll = false;
    }

    //If this is a gamble roll add Bonus Dice
    if (config.gamble > 0) {
      config.bonusDice = config.bonusDice + config.gamble
    }  

    //Check for Condition Penalties for Action & Danger Rolls
    if((config.type === "action" || config.type === "danger") && (config.rollType != 'attRoll' && !config.neutralRoll)) {
      if (actor.system.abilities[config.defaultAtt].condition || actor.system.broken) {
        config.bonusDice --;
      }
      for (let i of actor.items) {
        if (i.type === 'condition' && i.system.active && (i.system.skill === config.skillLabel || i.system.skill2 === config.skillLabel)) {
          config.bonusDice --;
        }
      }  
    }  

    //If the roll is from a skill then prep the number of dice and label    
    if (config.type === "action" || config.type === "danger"){
      config.diceNumber = Math.max(config.skillScore + config.attScore + config.bonusDice,2)
      config.diceNumber = Math.min(config.diceNumber,9)
      if (config.rollType === 'roll' || config.rollType === 'attRoll') {
        config.originalDiceNumber = config.diceNumber
      }
    }

    //Call the dice roll routine
    await OutgunnedChecks.makeRoll (config)
    
    return
  }  


  //Call Dice Roll, calculate Result and store result in rollVal
  static async makeRoll(config) {
    config.label = game.i18n.localize('OG.' + config.type + '.' + config.rollType)
    if (config.rollType === 'attRoll') {
      config.label = config.label +": " + config.attLabel
    } else if (config.type != 'death') {    
      config.label = config.label +": " + config.attLabel + " - " + config.skillLabel
    }  
    if (config.neutralRoll) {
      config.label = config.label + "[" + game.i18n.localize('OG.neutralRoll') + "]"
    }
    let roll = new Roll(config.diceNumber+"D6");
    await roll.evaluate();
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
    config = await OutgunnedChecks.successLevel (config)

    //If this is a damage Roll set the damage, and check for automated reduction
    config.damage = 0
    if (config.type === 'danger') {
      if (config.successLevel > 2) {
        config.damage = 0;
      } else {
        config.damage = Math.min(config.targetScore,12)
      }  
      if (game.settings.get('outgunned', 'damageControl') && config.difficulty != 'impossible') {
        config.damage = Math.max((config.damage - config.rollResult.successes.total),0)
      } 
    }

    //If a gamble roll then add Snakeyes to damage
    if (config.gamble === 1) {
      config.damage = config.damage + config.rollResult.equals[1]
    } else if (config.gamble === 2) {
      config.damage = config.damage + (3* config.rollResult.equals[1])
    }

    //On Action/Danger Roll Check to see if reRoll is an option
    if (config.rollType === 'roll' && config.type != 'death' && config.successLevel > 0) {
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
  
    //If a failed Death Roulette roll & auto game setting active then add bullet to death roulette
    if (config.successLevel === 5 && game.settings.get('outgunned', "autoDR")) {
      let actor = await OutgunnedActorDetails._getParticipant(config.partic.particId, config.partic.particType);
      if (actor.system.deathRoulette.value < 6) {
        await actor.update({'system.deathRoulette.value': actor.system.deathRoulette.value+1});
        ui.notifications.warn(game.i18n.localize('OG.msg.bulletAdded'));    
      }  
    }
    return;
  } 


  //Open the roll Modifier Dialog box 
  static async RollDialog (options) {
    let selectAttType = await OutgunnedSelectLists.getAttributeTypes();
    let razorsEdge=game.settings.get('outgunned','razorsEdge')
    const data = {
      type : options.type,
      label: options.label,
      rollType: options.rollType,
      defaultAtt: options.defaultAtt,
      difficulty: options.difficulty,
      selectAttType,
      neutralRoll: options.neutralRoll,
      razorsEdge,
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

    if (config.type === 'death') {
      if (config.roll.total > config.deathScore) {
        successLevel = 5 //Narrow Escape
      } else {
        successLevel = -1 //Left for Dead
      }    

    } else {  
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
        successLevel = 4;  //Jackpot
      } else if (config.rollResult.successes.total > targetScore) {
        successLevel = 3;  // Higher Success
      } else if (config.rollResult.successes.total >= targetScore) {
        successLevel = 2;  // Success
      } else if (config.rollResult.successes.total > 0) {
        successLevel = 1;  //Partial Failure (some successes)
      }
    }
    config.targetScore = targetScore;
    config.successLevel = successLevel  
    return config;
  }

  // Prep the chat card
  static async startChat(config) {
    let actor = await OutgunnedActorDetails._getParticipant(config.partic.particId,config.partic.particType)
    let diffLabel = game.i18n.localize('OG.difficulty') +": " + game.i18n.localize('OG.'+config.difficulty);
    if (config.doubleDiff === 2) {
      diffLabel = game.i18n.localize('OG.double') +" "+ diffLabel
    }
    if (config.bonusDice > 0) {
        diffLabel = diffLabel + " (+" + config.bonusDice + ")";
      } else if (config.bonusDice < 0) {
        diffLabel = diffLabel + " (" + config.bonusDice + ")";
      }  
    if (config.gamble === 1) {
      diffLabel = diffLabel + " " + game.i18n.localize('OG.gamble')
    } else if (config.gamble === 2) {
      diffLabel = diffLabel + " " + game.i18n.localize('OG.settings.razorsEdge')
    }  

    let actorId = ""
    if (!config.neutralRoll) {
      actorId = actor._id
    }

    let messageData = {
      origin: config.origin,
      originGM: config.originGM,
      speaker: ChatMessage.getSpeaker({ actor: config.spkrName }),
      actor,
      type: config.type,
      rollType: config.rollType,
      label: config.label,
      rollResult: config.rollResult,
      rolledDice: config.rolledDice,
      dangerRoll: config.dangerRoll,
      damage: config.damage,
      closed: config.closed,
      reRoll: config.reRoll,
      pairsDice: config.rollResult.pairsDice,
      restDice: config.rollResult.restDice,
      restDiceLength: config.rollResult.restDice.length,
      freeRoll: config.freeRoll,
      allIn: config.allIn,
      improve: config.improve,
      actorId: actorId,
      partic: config.partic,
      successLevel : config.successLevel,
      resultLabel: game.i18n.localize('OG.resultLevel.'+config.successLevel),
      diffLabel: diffLabel,
      neutralRoll: config.neutralRoll
    }
    const messageTemplate = config.chatTemplate
    let html = await renderTemplate (messageTemplate, messageData);
    return html;
  }  

  // Display the chat card and roll the dice
  static async showChat(html,config) {
    let actor = ""
    let actorId = ""
    if (!config.neutralRoll) {
      actor = await OutgunnedActorDetails._getParticipant(config.partic.particId,config.partic.particType)
      actorId = actor._id
    }  

    let chatData={};
      chatData = {
        user: game.user.id,
        rolls: [config.roll],
        content: html,
        flags: {config: config},
        speaker: {
          actor: actorId,
          alias: config.spkrName,
        },
    }
      
    await ChatMessage.create(chatData);
    return 
  }

}