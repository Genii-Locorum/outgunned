import { OutgunnedContextMenu } from '../../setup/context-menu.mjs';
import { OutgunnedChecks } from '../../apps/checks.mjs';
import { ItemSelectDialog} from "../../apps/feat-selection-dialog.mjs";
import * as contextMenu from "../actor-cm.mjs";


export class OutgunnedCharacterSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "actor"],
      template: "systems/outgunned/templates/actor/actor-sheet.html",
      width: 970,
      height: 700,
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
    context.ageName = this.actor.system.ageId ? this.actor.items.get(this.actor.system.ageId).name : "";
    context.roleName = this.actor.system.roleId ? this.actor.items.get(this.actor.system.roleId).name : "";
    context.tropeName = this.actor.system.tropeId ? this.actor.items.get(this.actor.system.tropeId).name : "";


    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

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
    const skills =[];
    const feats = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      } else if (i.type === 'skill' ){
          skills.push(i);
      } else if (i.type === 'feat' ){
        feats.push(i);
      }
    }  

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

    // Assign and return
    context.gear = gear;
    context.skills = skills;
    context.feats = feats;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;


    html.find('.item-create').click(this._onItemCreate.bind(this));                       // Add Inventory Item
    html.find('.rollable.skill-name').click(OutgunnedChecks._onSkillRoll.bind(this));             // Rollable skills
    html.find('.actor-toggle').dblclick(this._actorToggle.bind(this));                    // Toggle an actor value (not an item)

    //Character Context Menu
    new OutgunnedContextMenu(html, ".skill-name.contextmenu", contextMenu.skillMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".age.contextmenu", contextMenu.ageMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".role.contextmenu", contextMenu.roleMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".trope.contextmenu", contextMenu.tropeMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".attribute-name.contextmenu", contextMenu.attributeMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".feat-name.contextmenu", contextMenu.featMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".adrenaline-name.contextmenu", contextMenu.adrenalineMenuOptions(this.actor, this.token));
    new OutgunnedContextMenu(html, ".spotlight.contextmenu", contextMenu.spotlightMenuOptions(this.actor, this.token));

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
    const data = duplicate(header.dataset);
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
    return await Item.create(itemData, {parent: this.actor});
  }

  //Toggle an actor value
  async _actorToggle(event) {
    const property = event.currentTarget.dataset.property;
    let checkProp={};
    if (property === "locked") {
      checkProp = {'system.locked': !this.actor.system.locked};
    } else if (property === "grit" || property === "adrenaline" || property === "spotlight" || property === "deathRoulette") {
      let targetScore = Number(event.currentTarget.dataset.target);
      if (targetScore === this.actor.system[property].value) {targetScore = 0};
      targetScore = Math.max(targetScore, this.actor.system[property].min);
      let targetAtt = 'system.' + property + '.value'
      checkProp = {[targetAtt] : targetScore}
    }
    
    await this.actor.update(checkProp);

  }  


  // Change default on Drop Item Create routine for requirements (single items and folder drop)-----------------------------------------------------------------
  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    let newData=[];
    let reqResult = true;
    let errMsg = "";
    let finalise = false;

    for (let k of itemData) {
      //If the character sheet is locked and this isn't gear being dropped then give error message and cancel
      if(k.type!='gear' && this.actor.system.locked) {
        ui.notifications.warn(game.i18n.localize('OG.msg.noDropLocked'));         
        return
      }

      //Test to see if the skill already exists
      if (k.type === 'skill') {
        let exists = await this.itemCheck (k.name, 'skill', newData)
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

          //As we are adding a Role - first check which attribute to improve
          let roleAtt = this.actor.items.get(this.actor.system.roleId).system.attribute
          if (roleAtt === k.system.attribute1) {
            await this.actor.update({[`system.abilities.${k.system.attribute2}.trope`] : 1})
          } else if (roleAtt === k.system.attribute2) {
            await this.actor.update({[`system.abilities.${k.system.attribute1}.trope`] : 1})
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
      newData = await this.finaliseCharacter();
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
      let newItem = duplicate(item)
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

  async finaliseCharacter() {
    let newData =[];
    //Now add the 2 free skills available to new characters
    let newFeats = await this._newItemSelect("",2,'skill','free')
    if (newFeats.length > 0) {
      for (let j of newFeats) {
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
    }

    //Finally for the Trope, add the optional feat if character is Old
    if (this.actor.system.ageOptFeat > 0) {
      newFeats = await this._newItemSelect("",this.actor.system.ageOptFeat,'feat','optFeat')
      if (newFeats.length > 0) {
        for (let j of newFeats) {
          j.system.source = "trope";
          newData.push(j)
        }  
      }  
    }
    return newData;
  }      

}
