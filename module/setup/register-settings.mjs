

export async function registerSettings () {

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

  //Non-visible setting to record heat
  game.settings.register('outgunned', 'heat', {
    name: 'OG.settings.heat',
    hint: 'OG.settings.autoDRHint',
    scope: 'world',
    config: false,
    default: 1,
    type: Number
  });

}