import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";
import {OutgunnedUtilities} from "../../apps/utilities.mjs";

export class OutgunnedTropeSheet extends ItemSheet {


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
    context.displayShortAttType = await OutgunnedSelectLists.getShortAttributeTypes(context.displayAttType,this.item.system.attribute1);
    context.attribute1 = context.displayAttType[this.item.system.attribute1]
    context.attribute2 = context.displayShortAttType[this.item.system.attribute2]

    const perSkill = [];
    for (let i of itemData.system.skills){
      perSkill.push(i);
    }
    // Sort Skills
    perSkill.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });
    context.perSkill = perSkill;

    const feats = [];
    for (let i of itemData.system.feats){
      feats.push(i);
    }
    // Sort Feats
    feats.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });
    context.feats = feats;

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
      html.find('.item-delete.skills').click(event => this._onItemDelete(event, 'skills'))
      html.find('.item-delete.feats').click(event => this._onItemDelete(event, 'feats'))

    const dragDrop = new DragDrop({
      dropSelector: '.droppable',
      callbacks: { drop: this._onDrop.bind(this) }
    })
    dragDrop.bind(html[0])
  }

   //Allow for a skill or feats being dragged and dropped on to the profession sheet
   async _onDrop (event, type = 'skill', collectionName = 'skills') {
    event.preventDefault()
    event.stopPropagation()
    if (event?.currentTarget?.classList?.contains('skills')) {
      type = "skill"
      collectionName = "skills"
    } else if (event?.currentTarget?.classList?.contains('feats')) {
      type = "feat"
      collectionName = "feats"
    }
    const dataList = await OutgunnedUtilities.getDataFromDropEvent(event, 'Item')
    const collection = this.item.system[collectionName] ? duplicate(this.item.system[collectionName]) : []
 
    for (const item of dataList) {
      if (!item || !item.system) continue
      if (![type].includes(item.type)) {
        continue
      }
        
        collection.push(item)
    }
    await this.item.update({ [`system.${collectionName}`]: collection })
  }



  //Delete's a skill in the main skill list      
  async _onItemDelete (event, collectionName) {
    const item = $(event.currentTarget).closest('.item')
    const itemId = item.data('item-id')
    const itemIndex = this.item.system[collectionName].findIndex(i => (itemId && i._id === itemId))
    if (itemIndex > -1) {
      const collection = this.item.system[collectionName] ? duplicate(this.item.system[collectionName]) : []
      collection.splice(itemIndex, 1)
      await this.item.update({ [`system.${collectionName}`]: collection })
    }
  }



}
