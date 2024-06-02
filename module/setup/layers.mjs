import { OutgunnedUtilities } from '../apps/utilities.mjs'

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
        activeTool: "select",
        icon: "fas fa-tools",
        layer: "outgunnedgmtools",
        name: "outgunnedmenu",
        title: game.i18n.localize('OG.GMTools'),
        visible: isGM,
        tools: [
          {
            name: "raiseheat",
            icon: "fas fa-temperature-arrow-up",
            title:  game.i18n.localize('OG.heatIncrease'),
            button: true,
            onClick: async incHeat => { 
              await OutgunnedUtilities.increaseHeat(1)}
          },
          {
            name: "lowerheat",
            icon: "fas fa-temperature-arrow-down",
            title: game.i18n.localize('OG.heatDecrease'),
            button: true,
            onClick: async decHeat => {
              await  OutgunnedUtilities.increaseHeat(-1)}            
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

