const SETTINGS = {

    

    //Name Plan B option 1
    planBName1: {
      name: 'OG.settings.planBName1',
      hint: 'OG.settings.planBNameHint',
      scope: 'world',
      config: false,
      default: "Bullet",
      type: String
    },    

    //Name Plan B option 2
    planBName2: {
      name: 'OG.settings.planBName2',
      hint: 'OG.settings.planBNameHint',
      scope: 'world',
      config: false,
      default: "Backup",
      type: String
    },

    //Name Plan B option 3
    planBName3: {
      name: 'OG.settings.planBName3',
      hint: 'OG.settings.planBNameHint',
      scope: 'world',
      config: false,
      default: "Bluff",
      type: String
    },      
    
    //Name Plan B WOK option 2
    planBWOKName2: {
      name: 'OG.settings.planBWOKName2',
      hint: 'OG.settings.planBNameHint',
      scope: 'world',
      config: false,
      default: "Belmont",
      type: String
    },      

    //Name Plan B WOK option 4
    planBWOKName4: {
      name: 'OG.settings.planBWOKName4',
      hint: 'OG.settings.planBNameHint',
      scope: 'world',
      config: false,
      default: "Blade",
      type: String
    },      
    
  //Icon Plan B option 1
   "planBIcon-1": {
    name: 'OG.settings.planBIcon-1',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: false,
    default: "fa-solid fa-person-rifle",
    type: String
  },  

  //Icon Plan B option 2
  "planBIcon-2": {
    name: 'OG.settings.planBIcon-2',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: false,
    default: "fa-solid fa-heart",
    type: String
  },
  
  //Icon Plan B option 3
  "planBIcon-3": {
    name: 'OG.settings.planBIcon-3',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: false,
    default: "fa-solid fa-face-hand-peeking",
    type: String
  },

  //Icon Plan World of Killers B option 2
  "planBWOKIcon-2": {
    name: 'OG.settings.planBWOKIcon-2',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: false,
    default: "fa-solid fa-hotel",
    type: String
  },

  //Icon Plan World of Killers B option 4
  "planBWOKIcon-4": {
    name: 'OG.settings.planBWOKIcon-4',
    hint: 'OG.fasIconHint',
    scope: 'world',
    config: false,
    default: "fa-solid fa-swords",
    type: String
  },    

  //Choose whether to use customised Plan B icons
  "customPlanBIcons": {
      name: 'OG.settings.customPlanBIcons',
      hint: 'OG.settings.customPlanBIconsHint',
      scope: 'world',
      config: false,
      default: false,
      type: Boolean
    },


  }
  
  export class OutgunnedplanBSettings extends FormApplication {
    static get defaultOptions () {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: 'OG.settings.displaySettings',
        classes: ["outgunned","rulesmenu"],
        id: 'planB-settings',
        template: 'systems/outgunned/templates/settings/planB-settings.html',
        width: 550,
        height: 'auto',
        closeOnSubmit: true
      })
    }
    
    async getData () {
      const options = {}
      for (const [k, v] of Object.entries(SETTINGS)) {
        options[k] = {
          value: game.settings.get('outgunned', k),
          setting: v
        }
      }
      return options
    }
    
    static registerSettings () {
      for (const [k, v] of Object.entries(SETTINGS)) {
        game.settings.register('outgunned', k, v)
      }
    }
  
    activateListeners (html) {
      super.activateListeners(html)
      html.find('button[name=reset]').on('click', event => this.onResetDefaults(event))
    }
  
    async onResetDefaults (event) {
      event.preventDefault()
      for await (const [k, v] of Object.entries(SETTINGS)) {
        await game.settings.set('outgunned', k, v?.default)
      }
      return this.render()
    }
  
    async _updateObject (event, data) {
      for await (const key of Object.keys(SETTINGS)) {
        game.settings.set('outgunned', key, data[key])
      }
    }  
  
  }    