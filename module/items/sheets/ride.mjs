import {OutgunnedUtilities} from "../../apps/utilities.mjs";

export class OutgunnedRideSheet extends ItemSheet {
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
    const items = [];
    for (let i of itemData.system.items){
      items.push(i);
    }
    // Sort Skills
    items.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });
    context.items = items;

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.find('.item-delete.items').click(event => this._onItemDelete(event, 'items'))
    html.find('.toggle').dblclick(this.onItemToggle.bind(this));

    const dragDrop = new DragDrop({
      dropSelector: '.droppable',
      callbacks: { drop: this._onDrop.bind(this) }
    })
    dragDrop.bind(html[0])
  }

  //Allow for items being dragged and dropped on to the ride sheet
  async _onDrop (event, collectionName = 'items') {
    event.preventDefault()
    event.stopPropagation()
    if (event?.currentTarget?.classList?.contains('items')) {
      collectionName = "items"
    } 

    const dataList = await OutgunnedUtilities.getDataFromDropEvent(event, 'Item')
    const collection = this.item.system[collectionName] ? foundry.utils.duplicate(this.item.system[collectionName]) : []
 
    for (const item of dataList) {
      if (!item || !item.system) continue
      if (item.type != 'gun' && item.type != 'gear') {
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
      const collection = this.item.system[collectionName] ? foundry.utils.duplicate(this.item.system[collectionName]) : []
      collection.splice(itemIndex, 1)
      await this.item.update({ [`system.${collectionName}`]: collection })
    }
  }

    //Handle toggle states
    async onItemToggle(event){
      event.preventDefault();
      const prop=event.currentTarget.closest('.toggle').dataset.property;
      let checkProp={};
      if (['bike','car','nautical','flying','armoured','beast','pedal','space'].includes(prop)) {
        checkProp = {[`system.${prop}`]: !this.item.system[prop]};
      } else {
        return
      }
      await this.object.update(checkProp);
      return
    } 
}
