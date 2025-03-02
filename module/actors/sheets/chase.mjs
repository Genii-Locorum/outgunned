import { OutgunnedUtilities } from "../../apps/utilities.mjs";
import { OutgunnedContextMenu } from '../../setup/context-menu.mjs';
import * as contextMenu from "../actor-cm.mjs";

export class OutgunnedChaseSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "actor"],
      template: "systems/outgunned/templates/actor/actor-chase-sheet.html",
      width: 820,
      height: 600,
    });
  }
  
  get template() {
    return `systems/outgunned/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  async getData() {
    //Create context for easier access to actor data  
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    // Prepare character data and items.
      this._prepareItems(context);
      this._prepareCharacterData(context);
      context.rollData = context.actor.getRollData();
      context.isGM = game.user.isGM;
      const partics = [];
      const rides = [];
      for (let particUuid of actorData.system.participants){
        let partic = await fromUuid(particUuid.uuid)
        if (partic) {
          if (partic.type === 'character') {
            let roleName = partic.system.roleId ? partic.items.get(partic.system.roleId).name : "";
            partics.push({uuid: partic.uuid, name: partic.name, role: roleName})
          } 
        } else {
          partics.push({uuid: particUuid.uuid, name: game.i18n.localize("OG.invalid"), role: ""})
        }  
      }

      for (let rideUuid of actorData.system.rides) {
        let ride = await fromUuid(rideUuid.uuid)
        if (ride) {
          rides.push(ride)
        } else {
          rides.push({uuid: particUuid.uuid, name: game.i18n.localize("OG.invalid"),parent:{name:""}})
        }  
      }

      context.participants = partics.sort(OutgunnedUtilities.sortByNameKey);
      context.rides = rides;
      this._prepareItems(context);
      return context;
  }  

 //Organize and classify Items for Character sheets.
  _prepareCharacterData(context) {
  }

  _prepareItems(context) {
    const specialActions = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      if (i.type==='specialAction') {
        specialActions.push(i)
      }
    }
    context.specialActions = specialActions.sort(OutgunnedUtilities.sortByNameKey)
  }  


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    new OutgunnedContextMenu(html, ".chase-need.contextmenu", contextMenu.needMenuOptions(this.actor, this.token));

    html.find('.partic-remove').dblclick(this._particRemove.bind(this));                    // Remove a participant from the mission
    html.find('.partic-edit').click(this._particEdit.bind(this));                           // View a participant from the mission
    html.find('.ride-edit').click(this._onRideEdit.bind(this));                             // View Ride
    html.find('.ride-refresh').click(this._onRideRefresh.bind(this));                       // Refresh Ride
    html.find('.actor-toggle').dblclick(this._onActorToggle.bind(this));                       // Adjust need/adrenaline

    //Delete Item
    html.find('.item-delete').dblclick(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    //View Item Sheet
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    //Drag/Drop item to sheet
    const dragDrop = new DragDrop({
      dropSelector: '.droppable',
      callbacks: { drop: this._onDrop.bind(this) }
    })
    dragDrop.bind(html[0])
  }  

 //Dropping an actor on to character
 async _onDropActor(event,data) {
  event.preventDefault()
    const dataList = await OutgunnedUtilities.getDataFromDropEvent(event, 'Actor')
    const participants = this.actor.system.participants ? foundry.utils.duplicate(this.actor.system.participants) : []
    for (const partic of dataList) {
      if (!partic || !partic.system) continue
      
      //If the participant dropped is a character
      if (['character'].includes(partic.type)) {
        //Check character is not in participants list
        if (participants.find(el => el.uuid === partic.uuid)) {
          ui.notifications.warn(partic.name + " : " +   game.i18n.localize('OG.msg.dupItem'));
          continue
        }
        participants.push({uuid:partic.uuid})
      } 
    }  
    await this.actor.update({'system.participants': participants})

  }

  //Remove a particpant
  async _particRemove(event, collectionName = "participants") {
    const partic = $(event.currentTarget).closest('.partic')
    const particId = partic.data('particuuid')
    const particIndex = this.actor.system[collectionName].findIndex(i => (particId && i.uuid === particId))
    if (particIndex > -1) {
      const collection = this.actor.system[collectionName] ? foundry.utils.duplicate(this.actor.system[collectionName]) : []
      collection.splice(particIndex, 1)
      await this.actor.update({ [`system.${collectionName}`]: collection })
    }
  }  

  //View a participant
  async _particEdit(event, collectionName = "participants") {
    const partic = $(event.currentTarget).closest('.partic')
    const particId = partic.data('particuuid')
    let person = await fromUuid(particId)
    await person.sheet.render(true);

  }  

  //Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = foundry.utils.duplicate(header.dataset);
    // Initialize a default name.
    let name = `New ${type.capitalize()}`;

    if (type === "shot") {
      data.subtype = header.dataset.subtype;
      name = `New ${data.subtype.capitalize()}`;
    }

    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];


    // Finally, create the item!
    let item =  await Item.create(itemData, {parent: this.actor});
    await item.sheet.render(true);
    return
  }

  //Allow for a ride being dragged and dropped on to the mission sheet
  async _onDrop (event, type = 'ride', collectionName = 'rides') {

    //Pass any actors from drop to _onDropActor
    await this._onDropActor (event)
    const dataList = await OutgunnedUtilities.getDataFromDropEvent(event, 'Item')
    const collection = this.actor.system[collectionName] ? foundry.utils.duplicate(this.actor.system[collectionName]) : []
    for (const item of dataList) {
      if (item.type === 'specialAction') {
        let newData=[]
        if (this.actor.items.find(itm=>itm.type==='specialAction' && itm.name === item.name)) {
          ui.notifications.warn(item.name + " : " +   game.i18n.localize('OG.msg.dupItem'));
        } else {
          newData.push(item)
          await this.actor.createEmbeddedDocuments("Item", newData); 
        }  
        continue
      }
      
      if (!item || !item.system) continue
      if (![type].includes(item.type)) {
        continue
      }
      //If a Ride and not owned then don't drop
      if (item.type === 'ride' && !item.isOwned) {
        ui.notifications.warn(item.name + " : " +   game.i18n.localize('OG.msg.charDrop'));
        continue
      }
      //Dropping in Ride list - only allow if empty
      if (collection.length > 0) {
        ui.notifications.warn(item.name + " : " +   game.i18n.localize('OG.msg.oneRide'));
        continue
      }
      collection.push({uuid:item.uuid})
    }
    await this.actor.update({ [`system.${collectionName}`]: collection })
  }

  async _onRideEdit(event){
    const item = $(event.currentTarget).closest('.item')
    const itemId = item.data('particuuid')
    let ride = await fromUuid(itemId);
    if(!ride) {
      ride = await this.actor.items.get(item.data('itemId'))
    }
    ride.sheet.render(true);
  }

  async _onRideRefresh(event) {
    await this.actor.sheet.render(false);
  }

  async _onSupportDelete(event) {
    const item = $(event.currentTarget).closest('.item')
    const itemId = item.data('particuuid')
    const collectionName = item.data('collection')
    const itemIndex = this.actor.system[collectionName].findIndex(i => (itemId && i.uuid === itemId))
    if (itemIndex > -1) {
      const collection = this.actor.system[collectionName] ? foundry.utils.duplicate(this.actor.system[collectionName]) : []
      collection.splice(itemIndex, 1)
      await this.actor.update({ [`system.${collectionName}`]: collection })
    }  
  }

  async _onActorToggle(event) {
    const property = $(event.currentTarget).data('property')
    let value = $(event.currentTarget).data('target')
    if (property === 'need') {
      await this.actor.update({'system.need.current': value })
    } else if (property === 'speed') {
      let newSpeed = Math.max(Math.min(this.actor.system.speed + Number(value),6),0)
      await this.actor.update({'system.speed': newSpeed })
    } else if (property === 'adrenaline') {
      if (value === this.actor.system.adrenaline.current) {
        value = 0
      }
      await this.actor.update({'system.adrenaline.current': value })
    } 
  }
}
