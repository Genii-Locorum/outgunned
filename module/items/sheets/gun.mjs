import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";
import {OutgunnedUtilities} from "../../apps/utilities.mjs";

export class OutgunnedGunSheet extends ItemSheet {
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
    context.displayLocList = await OutgunnedSelectLists.getLocationList();
    context.displayMagsList = await OutgunnedSelectLists.getMagsList();

    const weaponfeats = [];
    for (let i of itemData.system.weaponfeats){
      weaponfeats.push(i);
    }
    // Sort Feats
    weaponfeats.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });
    context.weaponfeats = weaponfeats;

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
      html.find('.toggle').dblclick(this.onItemToggle.bind(this));
      html.find('.item-delete.feats').click(event => this._onItemDelete(event, 'weaponfeats'))

      const dragDrop = new DragDrop({
        dropSelector: '.droppable',
        callbacks: { drop: this._onDrop.bind(this) }
      })
      dragDrop.bind(html[0])
  }

  //Handle toggle states
  async onItemToggle(event){
    event.preventDefault();
    const prop=event.currentTarget.closest('.toggle').dataset.property;
    let checkProp = {[`system.feats.${prop}`]: !this.item.system.feats[prop]};
    await this.object.update(checkProp);
    return
  }

//Allow for a feats being dragged and dropped on to the profession sheet
async _onDrop (event, type = 'weaponfeat', collectionName = 'weaponfeats') {
  event.preventDefault()
  event.stopPropagation()
  const dataList = await OutgunnedUtilities.getDataFromDropEvent(event, 'Item')
  const collection = this.item.system[collectionName] ? foundry.utils.duplicate(this.item.system[collectionName]) : []

  for (const item of dataList) {
    if (!item || !item.system) continue
    if (![type].includes(item.type)) {
      continue
    }
      
      collection.push(item)
  }
  await this.item.update({ [`system.${collectionName}`]: collection })
}

//Delete's a feat in the main skill list      
async _onItemDelete (event, collectionName) {
  const item = $(event.currentTarget).closest('.item')
  const itemId = item.data('item-id')
  const itemIndex = this.item.system[collectionName].findIndex(i => (itemId && i._id === itemId))
  if (itemIndex > -1) {
    const collection = this.item.system[collectionName] ? foundry.utils.duplicate(this.item.system[collectionName]) : []
    collection.splice(itemIndex, 1)
    await this.item.update({ [`system.${collectionName}`]: collection })
  } 
}

}
