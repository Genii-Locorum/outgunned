import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";

export class OutgunnedConditionSheet extends foundry.appv1.sheets.ItemSheet {

  //Turn off App V1 deprecation warnings
  //TODO - move to V2
  static _warnedAppV1 = true

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
    context.flags = itemData.flags;
    context.isGM =  game.user.isGM;
    context.hasOwner = this.item.isEmbedded === true
    context.displayAttType = await OutgunnedSelectLists.getAllAttributeTypes();
    context.attribute = context.displayAttType[this.item.system.attribute]
    context.attribute2 = context.displayAttType[this.item.system.attribute2]
    context.displaySkill = await OutgunnedSelectLists.getSkillList();
    context.skill = context.displaySkill[this.item.system.skill];
    context.skill2 = context.displaySkill[this.item.system.skill2];

    context.enrichedDescriptionValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.data.system.description,
      {
        async: true,
        secrets: context.editable
      }
    )  

    context.enrichedShortDescriptionValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.data.system.shortDesc,
      {
        async: true,
        secrets: context.editable
      }
    )  

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
    if (prop === 'active' || prop === 'common') {
      checkProp = {[`system.${prop}`]: !this.item.system[prop]};
    } else {
      return
    }
    await this.object.update(checkProp);
    return
  } 

}
