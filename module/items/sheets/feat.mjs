import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";


export class OutgunnedFeatSheet extends ItemSheet {


  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "item"],
      width: 520,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  get template() {
    const path = "systems/outgunned/templates/item";
    return `${path}/${this.item.type}.html`;
  }

  getData() {
    const context = super.getData();
    const itemData = context.item;
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.isGM =  game.user.isGM;
    context.displayUsage = OutgunnedSelectLists.getUsageTypes();
    context.usage = context.displayUsage[this.item.system.usage]

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
      html.find('.toggle').click(this.onItemToggle.bind(this));
  }

  //Handle toggle states
  async onItemToggle(event){
    event.preventDefault();
    const prop=event.currentTarget.closest('.toggle').dataset.property;
    let checkProp={};
    if (prop === 'adrenaline') {
      if (this.item.system.adrenalineCost === 0){  
        checkProp = {'system.adrenalineCost': 1};
      } else {
        checkProp = {'system.adrenalineCost': 0};
      }  
    } else if (prop === 'restricted') {
      checkProp = {'system.restricted': !this.item.system.restricted}
    }    
    await this.object.update(checkProp);
    return
  } 
}
