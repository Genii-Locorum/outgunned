import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";

export class OutgunnedGearSheet extends ItemSheet {
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

  async getData() {
    const context = super.getData();
    const itemData = context.item;
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }
    context.system = itemData.system;
    context.gameVersion = game.settings.get("outgunned","ogVersion")
    context.flags = itemData.flags;
    context.isGM =  game.user.isGM;
    context.hasOwner = this.item.isEmbedded === true
    context.displayLocList = await OutgunnedSelectLists.getLocationList();

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
      console.log(prop)
      let checkProp={};
      if (prop === 'keyItem') {
        checkProp = {[`system.${prop}`]: !this.item.system[prop]};
      } else {
        return
      }
      await this.object.update(checkProp);
      return
    }  
}
