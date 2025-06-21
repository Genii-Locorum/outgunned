import { OutgunnedUtilities } from "../../apps/utilities.mjs";

export class OutgunnedMissionSheet extends foundry.appv1.sheets.ActorSheet {

  //Turn off App V1 deprecation warnings
  //TODO - move to V2
  static _warnedAppV1 = true

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "actor"],
      template: "systems/outgunned/templates/actor/actor-mission-sheet.html",
      width: 820,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "shots" }]
    });
  }
  
  get template() {
    return `systems/outgunned/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  async getData() {
    //Create context for easier access to actor data  
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    context.goldActors = 0
    context.goldSpent = 0
    context.cashActors = 0
    context.cashSpent = 0

    // Prepare character data and items.
      this._prepareItems(context);
      this._prepareCharacterData(context);
      context.isGM =  game.user.isGM;
      context.gameVersion = game.settings.get('outgunned', 'ogVersion')
      context.rollData = context.actor.getRollData();
      context.customPlanB = game.settings.get("outgunned","customPlanBIcons") 
      context.planB1Name = game.settings.get('outgunned', 'planBName1')
      context.planB1Icon = game.settings.get("outgunned","planBIcon-1")
      context.planB2Name = game.settings.get('outgunned', 'planBName2')
      context.planB2Icon = game.settings.get("outgunned","planBIcon-2")
      context.planB3Name = game.settings.get('outgunned', 'planBName3')
      context.planB3Icon = game.settings.get("outgunned","planBIcon-3")
      context.planB4Name = game.settings.get('outgunned', 'planBWOKName4')
      context.planB4WOKIcon = game.settings.get("outgunned","planBWOKIcon-4")
      context.planB1 = game.settings.get('outgunned', 'planB1')
      context.planB2 = game.settings.get('outgunned', 'planB2')
      context.planB3 = game.settings.get('outgunned', 'planB3')
      if (context.gameVersion === "2") {
        context.planB2Name = game.settings.get('outgunned', 'planBWOKName2')
        context.planB2Icon = game.settings.get("outgunned","planBWOKIcon-2")
      }
      context.heat = game.settings.get('outgunned', 'heat')

      context.enrichedStrongValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        context.data.system.villain.strongSpots,
        {
          async: true,
          secrets: context.editable
        }
      )  
  
      context.enrichedWeakValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        context.data.system.villain.weakSpots,
        {
          async: true,
          secrets: context.editable
        }
      )  

      const partics = [];
      const supporters = [];
      const rides = [];
      for (let particUuid of actorData.system.participants){
        let partic = await fromUuid(particUuid.uuid)
        if (partic) {
          if (partic.type === 'character') {
            let roleName = partic.system.roleId ? partic.items.get(partic.system.roleId).name : "";
            partics.push({uuid: partic.uuid, name: partic.name, role: roleName})
            context.goldActors = context.goldActors + 1 + partic.system.baseGold
            context.cashActors = context.cashActors + partic.system.cash
          } else if (partic.type === 'support') {
            supporters.push(partic)
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
          rides.push({uuid: rideUuid.uuid, name: game.i18n.localize("OG.invalid"),parent:{name:""}})
        }  
      }

      context.goldTotal = actorData.system.goldBF + context.goldActors - context.goldSpent + actorData.system.goldEarned
      context.cashTotal = actorData.system.cashBF + context.cashActors - context.cashSpent + actorData.system.cashEarned
      context.participants = partics.sort(OutgunnedUtilities.sortByNameKey);
      context.supporters = supporters.sort(OutgunnedUtilities.sortByNameKey);
      context.rides = rides.sort(OutgunnedUtilities.sortByNameKey);
      return context;
  }  

 //Organize and classify Items for Character sheets.
  _prepareCharacterData(context) {
  }

  _prepareItems(context) {
    const shots = [];
    const contacts = [];
    const spends = [];

    for (let i of context.items) {
      if (i.type === 'shot') {
        if (i.system.subtype === 'shot') {
          shots.push(i)
        } else if (i.system.subtype === 'contact') {
          contacts.push(i)
        } else if (i.system.subtype === 'spend') {
          spends.push(i)
          context.goldSpent = context.goldSpent + i.system.amount
          context.cashSpent = context.cashSpent + i.system.cash
        }
      }
    }  

    // Sort Shots by name
    shots.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    // Sort Contacts by name
    contacts.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });    

    context.shots=shots
    context.contacts=contacts
    context.spends = spends
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
      if (['character','support'].includes(partic.type)) {
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

    if (type === "shot" || type === "spend") {
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
