import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";


export class OutgunnedSkillSheet extends ItemSheet {


  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
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
    context.flags = itemData.flags;
    context.isGM =  game.user.isGM;
    context.displayAttType = await OutgunnedSelectLists.getAttributeTypes();
    context.attribute = context.displayAttType[this.item.system.displayAtt]

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.find('.toggle').dblclick((event) => this._itemToggle(event));               
  }

    //Toggle an actor value
    async _itemToggle(event) {
      const property = event.currentTarget.dataset.property;
      let checkProp={};
      let targetScore = 0;
      if (property === "xp"){
        targetScore = Number(event.currentTarget.dataset.target);
        if (targetScore === this.item.system[property]) {targetScore = 0};
        checkProp = {[`system.${property}`] : targetScore}
      } else {
        return
      }
      await this.item.update(checkProp)
    }
}
