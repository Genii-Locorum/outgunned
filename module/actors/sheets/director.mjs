import { OutgunnedUtilities } from "../../apps/utilities.mjs";

export class OutgunnedDirectorSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "actor"],
      template: "systems/outgunned/templates/actor/actor-director-sheet.html",
      width: 820,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "ride" }]
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
      context.heat = game.settings.get('outgunned', 'heat');
      context.isGM = game.user.isGM;

      context.enrichedStrongValue = await TextEditor.enrichHTML(
        context.data.system.villain.strongSpots,
        {
          async: true,
          secrets: context.editable
        }
      )  
  
      context.enrichedWeakValue = await TextEditor.enrichHTML(
        context.data.system.villain.weakSpots,
        {
          async: true,
          secrets: context.editable
        }
      )  

      const partics = [];
      const supporters = [];
      const enemies = [];
      const rides = [];
      const chases = [];
      for (let particUuid of actorData.system.participants){
        let partic = await fromUuid(particUuid.uuid)
        if (partic) {
          if (partic.type === 'character') {
            let roleName = partic.system.roleId ? partic.items.get(partic.system.roleId).name : "";
            partics.push({uuid: partic.uuid, name: partic.name, role: roleName})
          } else if (partic.type === 'support') {
            supporters.push(partic)
          } else if (partic.type === 'enemy') {
            partic.system.enemyTypeName = game.i18n.localize('OG.'+partic.system.enemyType)
            partic.system.attackName = game.i18n.localize('OG.'+partic.system.attack.rating)
            partic.system.defenceName = game.i18n.localize('OG.'+partic.system.defence.rating)
            enemies.push(partic)
          } else if (partic.type === 'chase') {
            partic.system.label = game.i18n.localize('OG.'+partic.system.subType)
            chases.push(partic)
          }
        } else {
          supporters.push({uuid: particUuid.uuid, name: game.i18n.localize("OG.invalid"), role: ""})
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
      context.supporters = supporters.sort(OutgunnedUtilities.sortByNameKey);
      context.enemies = enemies.sort(OutgunnedUtilities.sortByNameKey);
      context.chases = chases.sort(OutgunnedUtilities.sortByNameKey);
      context.rides = rides.sort(OutgunnedUtilities.sortByNameKey);
      return context;
  }  

 //Organize and classify Items for Character sheets.
  _prepareCharacterData(context) {
  }

  _prepareItems(context) {
  }  


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
    html.find('.partic-remove').dblclick(this._particRemove.bind(this));                    // Remove a participant from the mission
    html.find('.partic-edit').click(this._particEdit.bind(this));                           // View a participant from the mission
    html.find('.item-create').click(this._onItemCreate.bind(this));                         // Add Inventory Item
    html.find('.ride-edit').click(this._onRideEdit.bind(this));                             // View Ride
    html.find('.ride-refresh').click(this._onRideRefresh.bind(this));                       // Refresh Ride
    html.find('.support-delete').dblclick(this._onSupportDelete.bind(this));                // Delete Ride

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
      if (['character','support','enemy','chase'].includes(partic.type)) {
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
      if (!item || !item.system) continue
      if (![type].includes(item.type)) {
        continue
      }

      //If a Ride and not owned then don't drop
      if (item.type === 'ride' && !item.isOwned) {
        ui.notifications.warn(item.name + " : " +   game.i18n.localize('OG.msg.charDrop'));
        continue
      }

      //Dropping in Ride list
      if (collection.find(el => el.uuid === item.uuid)) {
        ui.notifications.warn(item.name + " : " +   game.i18n.localize('OG.msg.dupItem'));
        continue
      }
      collection.push({uuid:item.uuid})
    }
    await this.actor.update({ [`system.${collectionName}`]: collection })
  }

  async _onRideEdit(event){
    const item = $(event.currentTarget).closest('.item')
    const itemId = item.data('particuuid')
    const ride = await fromUuid(itemId);
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


}
