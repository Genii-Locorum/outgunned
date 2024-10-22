import {OutgunnedActionDie} from "./outgunnedDice.mjs"

export async function registerSettings () {

  let gameVersion = {
    "0": game.i18n.localize("OG.outgunned"),
    "1": game.i18n.localize("OG.adventures")
  };  

  
  //Choose default difficulty level
  game.settings.register('outgunned', 'defaultDifficulty', {
      name: 'OG.settings.defaultDifficulty',
      hint: 'OG.settings.defaultDifficultyHint',
    scope: 'world',
    config: true,
    default: "critical",
    choices: CONFIG.OUTGUNNED.difficultyList,
    type: String
  });    

  //Choose default type of roll - action or danger
  game.settings.register('outgunned', 'defaultCheckType', {
      name: 'OG.settings.defaultCheckType',
      hint: 'OG.settings.defaultCheckTypeHint',
    scope: 'world',
    config: true,
    default: "action",
    choices: CONFIG.OUTGUNNED.checkList,
    type: String
  });  


  //Choose whether to automatically reduce grit damage for success role
  game.settings.register('outgunned', 'damageControl', {
    name: 'OG.settings.damageControl',
    hint: 'OG.settings.damageControlHint',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  //Choose whether to automatically add bullets on failing a death roulette roll
  game.settings.register('outgunned', 'autoDR', {
    name: 'OG.settings.autoDR',
    hint: 'OG.settings.autoDRHint',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  //Choose whether to include Razor's Edge gamble option
  game.settings.register('outgunned', 'razorsEdge', {
    name: 'OG.settings.razorsEdge',
    hint: 'OG.settings.razorsEdgeHint',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  //Name Plan B option 1
  game.settings.register('outgunned', 'planBName-1', {
    name: 'OG.settings.planBName-1',
    hint: 'OG.settings.planBNameHint',
    scope: 'world',
    config: true,
    default: "Bullet",
    type: String
  });    

  //Icon Plan B option 1
  game.settings.register('outgunned', 'planBIcon-1', {
    name: 'OG.settings.planBIcon-1',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: true,
    default: "fa-solid fa-person-rifle",
    type: String
  });  

  //Name Plan B option 2
  game.settings.register('outgunned', 'planBName-2', {
    name: 'OG.settings.planBName-2',
    hint: 'OG.settings.planBNameHint',
    scope: 'world',
    config: true,
    default: "Backup",
    type: String
  });    

  //Icon Plan B option 2
  game.settings.register('outgunned', 'planBIcon-2', {
    name: 'OG.settings.planBIcon-2',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: true,
    default: "fa-solid fa-heart",
    type: String
  });  
  
  //Name Plan B option 3
  game.settings.register('outgunned', 'planBName-3', {
    name: 'OG.settings.planBName-3',
    hint: 'OG.settings.planBNameHint',
    scope: 'world',
    config: true,
    default: "Bluff",
    type: String
  });      

  //Icon Plan B option 3
  game.settings.register('outgunned', 'planBIcon-3', {
    name: 'OG.settings.planBIcon-3',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: true,
    default: "fa-solid fa-face-hand-peaking",
    type: String
  });  

  //Outgunned Game Version
  game.settings.register('outgunned', 'ogVersion', {
    name: 'OG.settings.ogVersion',
    hint: 'OG.settings.ogVersionHint',
    scope: 'world',
    config: true,
    type: String,
    choices: gameVersion,
    default: 0
  });  


  //Non-visible setting to record heat
  game.settings.register('outgunned', 'heat', {
    name: 'OG.settings.heat',
    hint: 'OG.settings.autoDRHint',
    scope: 'world',
    config: false,
    default: 1,
    type: Number
  });

  //Non-visible setting to record if freeform is available
  game.settings.register('outgunned', 'freeform', {
    name: 'OG.settings.freeform',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean
  });

  //Non-visible setting to record if PlanB option 1 has been used
  game.settings.register('outgunned', 'planB1', {
    name: 'planB1',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean
  });

  //Non-visible setting to record if PlanB option 2 has been used
  game.settings.register('outgunned', 'planB2', {
    name: 'planB2',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean
  });
  
  //Non-visible setting to record if PlanB option 3 has been used
  game.settings.register('outgunned', 'planB3', {
    name: 'planB3',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean
  });  
  
  CONFIG.Dice.terms['a'] = OutgunnedActionDie;

}