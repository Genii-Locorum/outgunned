import { OutgunnedUtilities } from '../apps/utilities.mjs'
import { OutgunnedChecks } from '../apps/checks.mjs'

class OutgunnedLayer extends foundry.canvas.layers.PlaceablesLayer {

  constructor () {
    super()
    this.objects = {}
  }

  static get layerOptions () {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: 'outgunnedmenu',
      zIndex: 60
    })
  }

  static get documentName () {
    return 'Token'
  }

  get placeables () {
    return []
  }
 
}

  export class OutgunnedMenu {
    static getButtons (controls) {

      let usePlanB1icon = "game-icon game-icon-bullet"
      let usePlanB2icon = "game-icon game-icon-backup"
      let usePlanB3icon = "game-icon game-icon-bluff"
      let usePlanBWOK4icon = "game-icon game-icon-blade"
      let usePlanBWOK2icon = "game-icon game-icon-belmont"

      if (game.settings.get('outgunned','customPlanBIcons')) {
        usePlanB1icon = game.settings.get('outgunned','planBIcon-1')
        usePlanB2icon = game.settings.get('outgunned','planBIcon-2')
        usePlanB3icon = game.settings.get('outgunned','planBIcon-3')
        usePlanBWOK2icon = game.settings.get('outgunned','planBWOKIcon-2')
        usePlanBWOK4icon = game.settings.get('outgunned','planBWOKIcon-4')
      }


      canvas.outgunnedgmtools = new OutgunnedLayer()
      const isGM = game.user.isGM
      const menu={
        name: "outgunnedmenu",
        title: game.i18n.localize('OG.ogTools'),
        layer: "outgunnedgmtools",
        icon: "fas fa-gun",
        visible: true,
        onChange: (event, active) => {
        },
        onToolChange: (event, tool) => {
        },
        tools: {
          ogdummy: {
            icon: '',
            name: 'ogdummy',
            active: false,
            title: '',
            onChange: () => {
            }           
          },
          raiseheat: {
            name: "raiseheat",
            icon: "fas fa-temperature-arrow-up",
            title:  game.i18n.localize('OG.heatIncrease'),
            button: true,
            visible: isGM,
            onChange: async incHeat => { 
              await OutgunnedUtilities.increaseHeat(1)}
          },
          lowerheat: {
            name: "lowerheat",
            icon: "fas fa-temperature-arrow-down",
            title: game.i18n.localize('OG.heatDecrease'),
            button: true,
            visible: isGM,
            onChange: async decHeat => {
              await  OutgunnedUtilities.increaseHeat(-1)}            
          },
          neutralRoll: {
            name: "neutralRoll",
            icon: "fas fa-dice",
            title: game.i18n.localize('OG.neutralRoll'),
            button: true,
            visible: true,
            onChange: async neutralRoll => {
              await OutgunnedChecks._onNeutralRoll()}            
          },
          freeform: {
            name: "freeform",
            icon: "fas fa-pencil",
            title: game.i18n.localize('OG.freeform'),
            toggle: true,
            visible: isGM,
            onChange: async toggle => {
              await OutgunnedUtilities._freeform(toggle)}            
          },
          planB1: {
            name: "planB1",
            icon: usePlanB1icon,
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBName1"),
            button: true,
            visible: isGM,
            onChange: async planB1 => {
              await OutgunnedUtilities._planB("1","planBName1")}            
          },
          planBWOK4: {
            name: "planBWOK4",
            icon: usePlanBWOK4icon,
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBWOKName4"),
            button: true,
            visible: (isGM && game.settings.get("outgunned","ogVersion") === '2'),
            onChange: async planB1 => {
              await OutgunnedUtilities._planB("1","planBWOKName4")}            
          },
          planB2: {
            name: "planB2",
            icon: usePlanB2icon,
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBName2"),
            button: true,
            visible: (isGM && game.settings.get("outgunned","ogVersion") != '2'),
            onChange: async planB1 => {
              await OutgunnedUtilities._planB("2","planBName2")}            
          },
          planBWOK2: {
            name: "planBWOK2",
            icon: usePlanBWOK2icon,
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBWOKName2"),
            button: true,
            visible: (isGM && game.settings.get("outgunned","ogVersion") === '2'),
            onChange: async planB1 => {
              await OutgunnedUtilities._planB("2","planBWOKName2")}            
          },
          planB3: {
            name: "planB3",
            icon: usePlanB3icon,
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBName3"),
            button: true,
            visible: isGM,
            onChange: async planB1 => {
              await OutgunnedUtilities._planB("3","planBName3")}            
          },
        }
      }
      if (Array.isArray(controls)) {
      /* // FoundryVTT v12 */
      menu.tools = Object.keys(menu.tools).reduce((c, i) => {
        if (i === 'ogdummy') {
          return c
        }
        c.push(menu.tools[i])
        return c
      }, [])
      controls.push(menu)
    } else {
      controls.outgunnedmenu = menu
    }  
  }  

  static renderControls (app, html, data) {
    const isGM = game.user.isGM
    const gmMenu = html.querySelector('.fas-fa-tools')?.parentNode
    if (gmMenu && !gmMenu.classList.contains('outgunned-menu')) {
      gmMenu.classList.add('outgunned-menu')
      if (isGM) {
        const menuLi = document.createElement('li')
        const menuButton = document.createElement('button')
        menuButton.classList.add('control', 'ui-control', 'tool', 'icon', 'outgunnedmenu')
        menuButton.type = 'button'
      }
    }
  }

}  

