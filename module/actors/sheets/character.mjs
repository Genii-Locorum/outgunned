import { OutgunnedContextMenu } from '../../setup/context-menu.mjs';
import { OutgunnedChecks } from '../../apps/checks.mjs';
import { ItemSelectDialog} from "../../apps/feat-selection-dialog.mjs";
import * as contextMenu from "../actor-cm.mjs";


export class OutgunnedCharacterSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "actor"],
      template: "systems/outgunned/templates/actor/actor-sheet.html",
      width: 880,
      height: 600,
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


  getData() {
    //Create context for easier access to actor data  
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.isLocked = actorData.system.locked;
    context.ageName = this.actor.system.ageId ? this.actor.items.get(this.actor.system.ageId).name : "";
    context.roleName = this.actor.system.roleId ? this.actor.items.get(this.actor.system.roleId).name : "";
    context.tropeName = this.actor.system.tropeId ? this.actor.items.get(this.actor.system.tropeId).name : "";
    context.heat = game.settings.get('outgunned', 'heat')
    context.planB1 = game.settings.get("outgunned","planB1")
    context.planB1Name = game.settings.get("outgunned","planBName-1")
    context.planB1Icon = game.settings.get("outgunned","planBIcon-1")
    context.planB2 = game.settings.get("outgunned","planB2")
    context.planB2Name = game.settings.get("outgunned","planBName-2")
    context.planB2Icon = game.settings.get("outgunned","planBIcon-2")
    context.planB3 = game.settings.get("outgunned","planB3")
    context.planB3Name = game.settings.get("outgunned","planBName-3")
    context.planB3Icon = game.settings.get("outgunned","planBIcon-3")
    context.planB3Name = game.settings.get("outgunned","planBName-3")

    // Prepare character data and items.
      this._prepareItems(context);
      this._prepareCharacterData(context);

    context.rollData = context.actor.getRollData();

    return context;
  }

  //Organize and classify Items for Character sheets.
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(CONFIG.OUTGUNNED.abilities[k]) ?? k;
    }
  }

  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const guns = [];
    const rides = [];
    const skills =[];
    const feats = [];
    const conditions = [];
    const experiences = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'gear') {
        gear.push(i);
      } else if (i.type === 'gun' ){
        guns.push(i);
      } else if (i.type === 'ride' ){
        rides.push(i);
      } else if (i.type === 'skill' ){
          skills.push(i);
      } else if (i.type === 'experience' ){
        experiences.push(i);
      } else if (i.type === 'feat' ){
        feats.push(i);
      } else if (i.type === 'condition' ){
          i.system.label=""
          i.system.order = 0

          if (i.system.attribute != 'na' && i.system.attribute != 'none') {
            if (i.system.attribute === 'all') {
              i.system.label = game.i18n.localize('OG.' + i.system.attribute)
              i.system.order = 99
            } else {  
              i.system.label = game.i18n.localize(CONFIG.OUTGUNNED.abilities[i.system.attribute]) 
              i.system.order = 1
            }    
          }  
          if (i.system.attribute2 != 'na' && i.system.attribute2 != 'none') {
            if (i.system.attribute2 === 'all') {
              i.system.label = game.i18n.localize('OG.' + i.system.attribute2)
              i.system.order = 99
            } else {  
              i.system.label = i.system.label + " " + game.i18n.localize(CONFIG.OUTGUNNED.abilities[i.system.attribute2]) 
              i.system.order = Math.max(i.system.order,1)
            }    
          }  

          if (i.system.skill != 'na'){
            i.system.label = i.system.label + " " + i.system.skill
            i.system.order = Math.max(i.system.order,3) 
          } 
          
          if (i.system.skill2 != 'na'){
            i.system.label = i.system.label + " " + i.system.skill2
            i.system.order = Math.max(i.system.order,3) 
          } 
          
          
          if (i.system.label === "") {
            i.system.label = game.i18n.localize('OG.other')
            i.system.order = 4
          }

          if ((i.system.shortDesc).length < 1) {
            i.system.shortDescDisplay = "<p>" + game.i18n.localize('OG.none') + "</p>"
          } else {
            i.system.shortDescDisplay = i.system.shortDesc
          }
        conditions.push(i);
      }  
    }  

    // Sort Gear by name
    gear.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    // Sort Guns by name
    guns.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    // Sort Skills by name
    skills.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    // Sort Feats by name
    feats.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    // Sort Conditions by Order and Label
    conditions.sort(function(a, b){
      let x = a.system.order;
      let y = b.system.order;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    // Assign and return
    context.gear = gear;
    context.guns = guns;
    context.rides = rides;    
    context.skills = skills;
    context.feats = feats;
    context.conditions = conditions;
    context.experiences = experiences;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;


    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.find('.item-create').click(this._onItemCreate.bind(this));                       // Add Inventory Item
    html.find('.rollable.skill-name').click(OutgunnedChecks._onSkillRoll.bind(this));     // Rollable skills
    html.find('.actor-toggle').dblclick(this._actorToggle.bind(this));                    // Toggle an actor value (not an item)
    html.find('.item-toggle').dblclick((event) => this._itemToggle(event));               // Toggle an item value (not an actor value)
    html.find(".inline-edit").change(this._inlineEdit.bind(this));                        // Edit an item from the character sheet
    
    //Character Context Menu
    new OutgunnedContextMenu(html, ".skill-name.contextmenu", contextMenu.skillMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".age.contextmenu", contextMenu.ageMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".role.contextmenu", contextMenu.roleMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".trope.contextmenu", contextMenu.tropeMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".attribute-name.contextmenu", contextMenu.attributeMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".feat-name.contextmenu", contextMenu.featMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".adrenaline-name.contextmenu", contextMenu.adrenalineMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".spotlight.contextmenu", contextMenu.spotlightMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".condition-name.contextmenu", contextMenu.conditionMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".catchphrase.contextmenu", contextMenu.catchphraseMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".mission.contextmenu", contextMenu.missionMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".flaw.contextmenu", contextMenu.flawMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".deathRoulette.contextmenu", contextMenu.deathRouletteMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".free.contextmenu", contextMenu.freeXPMenuOptions(this.actor, this.token));
    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
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
    const name = `New ${type.capitalize()}`;
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

  //Toggle an actor value
  async _actorToggle(event) {
    const property = event.currentTarget.dataset.property;
    let checkProp={};
    let targetScore = 0;
    if (property === "locked") {
      checkProp = {'system.locked': !this.actor.system.locked};
    } else if (property === "grit" || property === "adrenaline" || property === "spotlight" || property === "deathRoulette") {
      targetScore = Number(event.currentTarget.dataset.target);
      if (targetScore === this.actor.system[property].value) {targetScore = 0};
      targetScore = Math.max(targetScore, this.actor.system[property].min);
      let targetAtt = 'system.' + property + '.value'
      checkProp = {[targetAtt] : targetScore}
    } else if (property === 'cash') {
      targetScore = Number(event.currentTarget.dataset.target);
      if (targetScore === this.actor.system.cash) {targetScore = 0};
      checkProp = {'system.cash' : targetScore};
    } else if (property === "cyberEnhance") {      
      checkProp = {'system.cyberEnhance': !this.actor.system.cyberEnhance};
    } else {
      return
    }
    
    await this.actor.update(checkProp);

  }  

  //Toggle an item value
  async _itemToggle(event) {
    const property = event.currentTarget.dataset.property;
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    let checkProp={};
    if (property === "active") {
      checkProp = {'system.active': !item.system.active};
    } else if (property === 'worn') {
      checkProp = {'system.location': 'bag'};
    } else if (property === 'bag') {
      checkProp = {'system.location': 'storage'};
    } else if (property === 'storage') {
      checkProp = {'system.location': 'worn'};
    } else if (property === 'armour') {
      let targetScore = Number(event.currentTarget.dataset.target);
      if (targetScore === item.system.armour.value) {targetScore = 0};
      checkProp = {'system.armour.value': targetScore};
    }else {
      return
    }
    await item.update(checkProp);
  } 


  // Change default on Drop Item Create routine for requirements (single items and folder drop)-----------------------------------------------------------------
  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    let newData=[];
    let reqResult = true;
    let errMsg = "";
    let finalise = false;

    for (let k of itemData) {
      //If the character sheet is locked and this isn't gear/guns/rides being dropped then give error message and cancel
      if(k.type!='gear' && k.type!='gun' && k.type!='ride' && this.actor.system.locked) {
        ui.notifications.warn(game.i18n.localize('OG.msg.noDropLocked'));         
        return
      }

      //Test for invalid item types for Character
      if(["enemyFeat","specialAction","weaponfeat"].includes(k.type)) {
        reqResult = false
        errMsg = k.name + " (" + k.type + "): "+ game.i18n.localize('OG.msg.enemyItem') 
      }

      //Test to see if the skill or condition already exists
      if (k.type === 'skill' || k.type === 'condition') {
        let exists = await this.itemCheck (k.name, k.type, newData)
        if (exists) {
          reqResult = false;
          errMsg = k.name + " (" + k.type + "): "+ game.i18n.localize('OG.msg.dupItem') 
        }  
      }
      
      //Test to see if there is already an age on the character sheet
      if (k.type === 'age') {
        if (this.actor.system.ageId ) {
        reqResult = false;
        errMsg = game.i18n.localize('OG.msg.dupAge')
        } else {
          //If no age then check to see if Feat already exists and if not add it  
          for (let j of k.system.feats) {
            let exists = await this.itemCheck (j.name, 'feat', newData)
            if (!exists) {
              j.system.source = "age"
              newData.push(j);
            }    
          }


        }  
      } 

      //Test to see if there is already a role on the character sheet
      if (k.type === 'role') {
        if (this.actor.system.roleId) {
          reqResult = false;
          errMsg = game.i18n.localize('OG.msg.dupRole')       
        } else if (!this.actor.system.ageId) {
          //If the Age doesnt already exist then give warning message
          reqResult = false;
          errMsg = game.i18n.localize('OG.msg.noAge')                  
        } else {
          //If no Role then check to see if Skills already exists.  
          for (let j of k.system.skills) {
            let exists = await this.itemCheck (j.name, 'skill', newData)
            //If the skill doesnt exist add it to the character sheet but with Role score = 1  
            if (!exists) {
              j.system.role = 1
              newData.push(j);
            } else {
              //Otherwsie change the Role score to 1
              for (let i of this.actor.items) {
                if (i.type === 'skill' && i.name === j.name) {
                  await i.update ({'system.role': 1});
                }
              }
            }   
          }
          //Now add the optional Feats
          //Call selector routine with the source item (k), count, itemtype and list source in item
          let newFeats = await this._newItemSelect(k,this.actor.system.ageFeat,'feat','feats')
          if (newFeats.length > 0) {
            for (let j of newFeats) {
              j.system.source = "role";
            newData.push(j)
            }    
          }
        } 
      }  

      //Test to see if there is already a trope on the character sheet
      if (k.type === 'trope') {
        if (this.actor.system.tropeId) {
          reqResult = false;
          errMsg = game.i18n.localize('OG.msg.dupTrope')       
        } else if (!this.actor.system.roleId) {
          //If the Role doesnt already exist then give warning message
          reqResult = false;
          errMsg = game.i18n.localize('OG.msg.noRole')                  
        } else {
          //Set finalise to true so that the character will get to add 2 free skills at the end plus any age related feats
          finalise = true;

          //As we are adding a Trope - first check which attribute to improve
          let roleAtt = this.actor.items.get(this.actor.system.roleId).system.attribute
          //If the role Attribute = one of the Trope attributes then improve the other trope attribute
          if (roleAtt === k.system.attribute1) {
            await this.actor.update({[`system.abilities.${k.system.attribute2}.trope`] : 1})
          } else if (roleAtt === k.system.attribute2) {
            await this.actor.update({[`system.abilities.${k.system.attribute1}.trope`] : 1})
          // Otherwise let the user select which attribute 
          } else {
            let usage = await this.chooseAtt (k.system.attribute1, k.system.attribute2)
            if (usage) {
              await this.actor.update({[`system.abilities.${usage.get('checkAtt')}.trope`] : 1})
            }
          }

          //Then check to see if the trope Skills already exist.  
          for (let j of k.system.skills) {
            let exists = await this.itemCheck (j.name, 'skill', newData)
            //If the skill doesnt exist add it to the character sheet but with Trope score = 1  
            if (!exists) {
              j.system.trope = 1
              newData.push(j);
            } else {
              //Otherwsie change the trope score to 1
              for (let i of this.actor.items) {
                if (i.type === 'skill' && i.name === j.name) {
                  await i.update ({'system.trope': 1});
                }
              }
            }   
          }
          //Now add the optional Feats
          //Call selector routine with the source item (k), count, itemtype and list source in item
          let newFeats = await this._newItemSelect(k,1,'feat','feats')
          if (newFeats.length > 0) {
            for (let j of newFeats) {
              j.system.source = "trope";
            newData.push(j)
            }    
          }
        }
      }  
 
      //Check to see if we can drop the Item
        if (!reqResult) {
          ui.notifications.warn(errMsg);
        } else {

        //If we can then push the item in to the array and then create the single item - to help avoid duplicate skills etc.
        newData.push(k);

        //Now item has been added then if make actor changes depending on the item 
        if (k.type === 'role' || k.type === 'age') {
          let checkProp ={};
          if (k.type === 'role') {
            //For a role add the role name and increase attribute score by 1
            checkProp = {
              [`system.abilities.${k.system.attribute}.role`] : 1
            };
          } else if (k.type === 'age') {
            checkProp = {
              'system.adrenaline.base' : k.system.baseAdrenaline,
              'system.adrenaline.value' : k.system.baseAdrenaline,
              'system.deathRoulette.base': k.system.baseDeathRoulette,
              'system.deathRoulette.value': k.system.baseDeathRoulette,
              'system.ageOptFeat': k.system.optFeat,
              'system.ageFeat': k.system.numFeat,
              'system.ageExp': k.system.baseExperience
            };
          }
        await this.actor.update(checkProp);
        }
      }
    }
    //Now push the items to the character
    await this.actor.createEmbeddedDocuments("Item", newData); 
    
    //Once the Trope and associated items have been added finalise the charactewr
    if (finalise) {
      let count = Math.max(2-this.actor.system.freeXP,0)
      newData = await this.finaliseCharacter("all",count);
      await this.actor.createEmbeddedDocuments("Item", newData); 
    }
    return
  }

  //Check to see if an item already exists on the character sheet based on name and type before dropping it
  async itemCheck (name,type,newData) {
    let itemPresent = false;
    //Check to see if the item exists on the character sheet
    for (let i of this.actor.items) {
      if (i.type === type && i.name === name) {
        itemPresent= true;
        return itemPresent;
      }   
    }

    //Check to see if the item exists in the newData and it is going to be pushed to the character sheet
    for (let i of newData) {
      if (i.type === type && i.name === name) {
        itemPresent= true;
        return itemPresent;
      }   
    }
    return itemPresent
  }

  // When dropping an item with Optional Feats/Skills etc select those items and push to new list-----------------------------------------------------------------
  async _newItemSelect(item,count, itemType, collectionName) {

    //Prepare the list of feats/skills etc that are to be sent to the dialog window
    let newList = []
    const dialogData = {}

    //For 'free' options add all the feats/skills to the list unless the feat is already on the character or the skill score >=3
    if (collectionName === 'free') {
      for (let j of game.items) {
        if (j.type === itemType && j.system.restricted != true) {
          let exists = false
          for (let k of this.actor.items) {
            if (itemType === 'feat' && k.name === j.name && k.type === itemType) {
              exists = true
            } else if (itemType === 'skill' && k.name === j.name && k.type === itemType && k.system.total >=3) {
              exists = true
            }
          }  
          if (!exists) {
          j.selected=false;
            newList.push(j)
          }          
        }
      }
    } else if (collectionName === 'optFeat') {
      let target = this.actor.items.get(this.actor.system.roleId).system.feats
      for (let i = 0; i<2; i++) {
        if (i === 1) {
          target = this.actor.items.get(this.actor.system.tropeId).system.feats
        }
        for (let j of target) {
          let exists = false
          for (let k of this.actor.items) {
            if (k.name === j.name && k.type === 'feat') {
              exists = true
            }
          }      
          if (!exists) {
            newList.push(j)
          }  
        }  
      }  
    } else {
      let newItem = foundry.utils.duplicate(item)
      for (let j of newItem.system[collectionName]){
        //If the item is a feat only include it in the list if it's not already on the character sheet
        if (itemType === 'feat') {
          let exists = false
          for (let k of this.actor.items) {
            if (k.name === j.name && k.type === itemType) {
              exists = true
            }
          }  
          if (!exists) {
            newList.push(j)
          }
        } else {
          newList.push(j)
        }
      }  
    }     
    //Sort the list alphabetically
    newList.sort(function(a, b){
      let x = a.name;
      let y = b.name;
      if (x < y) {return -1};
      if (x > y) {return 1};
      return 0;
    });

    //Prep and open the dialog window
    dialogData.newList= newList
    dialogData.actorId = this.id
    dialogData.optionsCount = count
    dialogData.title = game.i18n.localize('OG.SelectionWindow')
    const selected = await ItemSelectDialog.create(dialogData)

    return selected;  
  }  
 
  //Choose attribute dialog box
  async chooseAtt (opt1, opt2) {
    const data = {
      opt1,
      opt2,
      disp1: this.actor.system.abilities[opt1].label,
      disp2: this.actor.system.abilities[opt2].label,
    }
    const html = await renderTemplate('systems/outgunned/templates/dialog/tropeAtt.html',data);
    return new Promise(resolve => {
      let formData = null
      const dlg = new Dialog({
        title: game.i18n.localize('OG.trope'),
        content: html,
        buttons: {
          confirm: {
            label: game.i18n.localize("OG.confirm"),
            callback: html => {
            formData = new FormData(html[0].querySelector('#trope-attribute-form'))
            return resolve(formData)
            }
          }
        },
      default: 'confirm',
      close: () => {}
      },{classes: ["outgunned", "sheet"]})
      dlg.render(true);
    })
  }

  async finaliseCharacter(option, count) {
    let newData =[];
    //Now add the 2 free skills available to new characters
    if(count>0){
      let newSkills=[];
      newSkills = await this._newItemSelect("",count,'skill','free')
      
      if (newSkills.length > 0) {
        for (let j of newSkills) {
          let exists = await this.itemCheck (j.name, 'skill', newData)
          //If the skill doesnt exist add it to the character sheet but with Free score = 1  
          if (!exists) {
            j.system.free = 1
            newData.push(j);
          } else {
            //Otherwsie change the free score to 1
            for (let i of this.actor.items) {
              if (i.type === 'skill' && i.name === j.name) {
                await i.update ({'system.free': 1});
              }
            }
          }  
        }   
      }    
    }

    //Finally for the Trope, add the optional feat if character is Old
    if (this.actor.system.ageOptFeat > 0 && option === "all") {
      let newFeats = await this._newItemSelect("",this.actor.system.ageOptFeat,'feat','optFeat')
      if (newFeats.length > 0) {
        for (let j of newFeats) {
          j.system.source = "trope";
          newData.push(j)
        }  
      }  
    }
    return newData;
  }      

  // Update NPC skills etc without opening the item sheet
  async _inlineEdit(event){
  event.preventDefault();
    const element = event.currentTarget;
    const li = $(event.currentTarget).closest(".item");
    const item = this.actor.items.get(li.data("itemId"));
    const field = element.dataset.field;
  return item.update ({ [field]: element.value});
}

}
