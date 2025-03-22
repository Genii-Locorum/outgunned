import { OutgunnedUtilities } from '../apps/utilities.mjs'
import { OutgunnedChecks } from '../apps/checks.mjs'

class OutgunnedLayer extends PlaceablesLayer {

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
      canvas.outgunnedgmtools = new OutgunnedLayer()
      const isGM = game.user.isGM
      controls.push({
        icon: "fas fa-gun",
        layer: "outgunnedgmtools",
        name: "outgunnedmenu",
        title: game.i18n.localize('OG.ogTools'),
        visible: true,
        tools: [
          {
            name: "raiseheat",
            icon: "fas fa-temperature-arrow-up",
            title:  game.i18n.localize('OG.heatIncrease'),
            button: true,
            visible: isGM,
            onClick: async incHeat => { 
              await OutgunnedUtilities.increaseHeat(1)}
          },
          {
            name: "lowerheat",
            icon: "fas fa-temperature-arrow-down",
            title: game.i18n.localize('OG.heatDecrease'),
            button: true,
            visible: isGM,
            onClick: async decHeat => {
              await  OutgunnedUtilities.increaseHeat(-1)}            
          },
          {
            name: "neutralRoll",
            icon: "fas fa-dice",
            title: game.i18n.localize('OG.neutralRoll'),
            button: true,
            visible: true,
            onClick: async neutralRoll => {
              await OutgunnedChecks._onNeutralRoll()}            
          },
          {
            name: "freeform",
            icon: "fas fa-pencil",
            title: game.i18n.localize('OG.freeform'),
            toggle: true,
            visible: isGM,
            onClick: async toggle => {
              await OutgunnedUtilities._freeform(toggle)}            
          },
          {
            name: "planB1",
            icon: "game-icon game-icon-bullet",
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBName1"),
            button: true,
            visible: isGM,
            onClick: async planB1 => {
              await OutgunnedUtilities._planB("1","planBName1")}            
          },
          {
            name: "planBWOK4",
            icon: "game-icon game-icon-blade",
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBWOKName4"),
            button: true,
            visible: isGM,
            onClick: async planB1 => {
              await OutgunnedUtilities._planB("1","planBWOKName4")}            
          },
          {
            name: "planB2",
            icon: "game-icon game-icon-backup",
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBName2"),
            button: true,
            visible: (isGM && game.settings.get("outgunned","ogVersion") != '2'),
            onClick: async planB1 => {
              await OutgunnedUtilities._planB("2","planBName2")}            
          },
          {
            name: "planBWOK2",
            icon: "game-icon game-icon-belmont",
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBWOKName2"),
            button: true,
            visible: (isGM && game.settings.get("outgunned","ogVersion") === '2'),
            onClick: async planB1 => {
              await OutgunnedUtilities._planB("2","planBWOKName2")}            
          },
          {
            name: "planB3",
            icon: "game-icon game-icon-bluff",
            title: game.i18n.localize('OG.planB')+":"+game.settings.get("outgunned","planBName3"),
            button: true,
            visible: isGM,
            onClick: async planB1 => {
              await OutgunnedUtilities._planB("3","planBName3")}            
          }
        ]
      })
    }
  
    static renderControls (app, html, data) {
      const isGM = game.user.isGM
      const gmMenu = html.find('.fas-fa-tools').parent()
      gmMenu.addClass('outgunned-menu')
    }
  }  

