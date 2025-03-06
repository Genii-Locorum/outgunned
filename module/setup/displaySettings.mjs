const SETTINGS = {

    
      mainTextColour: {
        name: "OG.settings.mainTextColour",
        hint: "OG.settings.mainTextColourHint",
        scope: "world",
        config: true,
        type: String,
        default: "black"        
      },
  
      primaryColour: {
        name: "OG.settings.primaryColour",
        hint: "OG.settings.primaryColourHint",
        scope: "world",
        config: true,
        type: String,
        default: "rgb(177,37,26)"
      },
    
      secondaryColour: {
        name: "OG.settings.secondaryColour",
        hint: "OG.settings.secondaryColourHint",
        scope: "world",
        config: true,
        type: String,
        default: "cornsilk"
      },

      directorColour: {
        name: "OG.settings.directorColour",
        hint: "OG.settings.directorColourHint",
        scope: "world",
        config: true,
        type: String,
        default: "rgb(73, 84, 231)"
      },

  
      primaryIcon: {
        name: "OG.settings.primaryIcon",
        hint: "OG.settings.primaryIconHint",
        scope: "world",
        config: true,
        type: String,
        default: "rgb(177,37,26)"
      },
    
      secondaryIcon: {
        name: "OG.settings.secondaryIcon",
        hint: "OG.settings.secondaryIcon",
        scope: "world",
        config: true,
        type: String,
        default: "black"
      },

  }
  
  export class OutgunnedDisplaySettings extends FormApplication {
    static get defaultOptions () {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: 'OG.settings.displaySettings',
        classes: ["outgunned","rulesmenu"],
        id: 'display-settings',
        template: 'systems/outgunned/templates/settings/display-settings.html',
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