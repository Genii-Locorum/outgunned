import {OutgunnedActionDie} from "./outgunnedDice.mjs"
import { OutgunnedDisplaySettings } from "./displaySettings.mjs";
import { OutgunnedplanBSettings } from "./planBSettings.mjs";

export async function registerSettings () {

  let gameVersion = {
    "0": game.i18n.localize("OG.outgunned"),
    "1": game.i18n.localize("OG.adventures"),
    "2": game.i18n.localize("OG.worldOK")
  };  


    //Display Settings Menu Button
    game.settings.registerMenu('outgunned', 'displaySettings', {
      name: 'OG.settings.displaySettings',
      label: 'OG.settings.displaySettingsHint',
      icon: 'fas fa-palette',
      type: OutgunnedDisplaySettings,
      restricted: true
    });
    OutgunnedDisplaySettings.registerSettings()
  
    //Display Settings Menu Button
    game.settings.registerMenu('outgunned', 'planBSettings', {
      name: 'OG.settings.planBSettings',
      label: 'OG.settings.planBSettingsHint',
      icon: 'fas fa-light-emergency-on',
      type: OutgunnedplanBSettings,
      restricted: true
    });
    OutgunnedplanBSettings.registerSettings()


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