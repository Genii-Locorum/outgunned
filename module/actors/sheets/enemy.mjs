import {OutgunnedSelectLists}  from "../../apps/select-lists.mjs";
import { OutgunnedContextMenu } from '../../setup/context-menu.mjs';
import * as contextMenu from "../actor-cm.mjs";

export class OutgunnedEnemySheet extends ActorSheet {

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["outgunned", "sheet", "actor"],
        template: "systems/outgunned/templates/actor/actor-sheet.html",
        width: 300,
        height: 550,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "feats" }]
      });
    }
  
    get template() {
      return `systems/outgunned/templates/actor/actor-${this.actor.type}-sheet.html`;
    }
  
    static confirmItemDelete(actor, itemId) {
      let item = actor.items.get(itemId);
      item.delete();
    }
  
  
    async getData() {
      //Create context for easier access to actor data  
      const context = super.getData();
      const actorData = this.actor.toObject(false);
      context.system = actorData.system;
      context.flags = actorData.flags;
      context.displayDiffList = await OutgunnedSelectLists.getDifficultyList();
      context.displayMultiList = await OutgunnedSelectLists.getDiffMultiList();
      context.displayEnemyList = await OutgunnedSelectLists.getEnemyList();  

      // Prepare enemy data and items.
        this._prepareItems(context);
        this._prepareCharacterData(context);
  
      context.rollData = context.actor.getRollData();
  
      return context;
    }
  
    //Organize and classify Items for Character sheets.
    _prepareCharacterData(context) {
    }
  
    _prepareItems(context) {
      // Initialize containers.
      const feats = [];
      const actions = [];
  
      // Iterate through items, allocating to containers
      for (let i of context.items) {
        i.img = i.img || DEFAULT_TOKEN;
        // Append to gear.
        if (i.type === 'enemyFeat' ){
          feats.push(i);
        } else if (i.type === 'specialAction' ){
          actions.push(i);
        }   
      }  
  
      // Sort Feats by name
      feats.sort(function(a, b){
        let x = a.name;
        let y = b.name;
        if (x < y) {return -1};
        if (x > y) {return 1};
        return 0;
      });
  
      // Sort Actions by name
      actions.sort(function(a, b){
        let x = a.name;
        let y = b.name;
        if (x < y) {return -1};
        if (x > y) {return 1};
        return 0;
      });
  
      // Assign and return
      context.feats = feats;
      context.actions = actions;
    }
  
    /* -------------------------------------------- */
  
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // -------------------------------------------------------------
      // Everything below here is only needed if the sheet is editable
      if (!this.isEditable) return;
  
      html.find('.actor-toggle').dblclick(this._actorToggle.bind(this));                    // Toggle an actor value (not an item)

  
      // Render the item sheet for viewing/editing prior to the editable check.
      html.find('.item-edit').click(ev => {
        const li = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        item.sheet.render(true);
      });
  
      // Delete Inventory Item
      html.find('.item-delete').dblclick(ev => {
        const li = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        item.delete();
        li.slideUp(200, () => this.render(false));
      });
  
     
      // Drag events for macros.
      if (this.actor.isOwner) {
        let handler = ev => this._onDragStart(ev);
        html.find('li.item').each((i, li) => {
          if (li.classList.contains("inventory-header")) return;
          li.setAttribute("draggable", true);
          li.addEventListener("dragstart", handler, false);
        });
      }

      //Context menus
      new OutgunnedContextMenu(html, ".enemy-grit.contextmenu", contextMenu.enemyGritMenuOptions(this.actor, this.token));

    }
  
  //Toggle an actor value
  async _actorToggle(event) {
    const property = event.currentTarget.dataset.property;
    let checkProp={};
    let targetScore = 0;
    if (property === "grit" || property === "adrenaline") {
      targetScore = Number(event.currentTarget.dataset.target);
      if (targetScore === this.actor.system[property].value) {targetScore = 0};
      targetScore = Math.max(targetScore, this.actor.system[property].min);
      let targetAtt = 'system.' + property + '.value'
      checkProp = {[targetAtt] : targetScore}
    } else {
      return
    }
    
    await this.actor.update(checkProp);

  }

  }
  