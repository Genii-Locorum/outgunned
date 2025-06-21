import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";
import {OutgunnedUtilities} from "../../apps/utilities.mjs";

export class OutgunnedAgeSheet extends foundry.appv1.sheets.ItemSheet {

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
    context.hasFeats = false
    context.maxBullet = 2
    context.showGold = false
    if (game.settings.get('outgunned','ogVersion') === "2") {
      context.maxBullet = 3
      context.showGold = true
    }

    context.enrichedDescriptionValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.data.system.description,
      {
        async: true,
        secrets: context.editable
      }
    )  

    const feats = [];
    for (let i of itemData.system.feats){
      feats.push(i);
      context.hasFeats = true
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
      html.find('.toggle').click(this.onItemToggle.bind(this));
      html.find('.item-delete.feats').click(event => this._onItemDelete(event, 'feats'))

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
    const target=event.currentTarget.closest('.toggle').dataset.target;
    let checkProp={};
    if (prop === 'numFeat' || prop === 'baseDeathRoulette' || prop === 'baseAdrenaline') {
      checkProp = {[`system.${prop}`]: target};
    } else if (prop === 'optFeat' || prop === 'baseExperience'|| prop === 'gold') {
        if (this.item.system[prop] === 0) {
          checkProp = {[`system.${prop}`]: 1};
      } else {
        checkProp = {[`system.${prop}`]: 0};
      }
    } else {
      return
    }
    await this.object.update(checkProp);
    return
  }  

     //Allow for a feats being dragged and dropped on to the profession sheet
     async _onDrop (event, type = 'feat', collectionName = 'feats') {
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

  //Implement Game Settings for Colours
  static renderSheet (sheet,html) {
    OutgunnedUtilities.displaySettings(sheet);
  }      

}
