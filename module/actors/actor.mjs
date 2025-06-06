/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class OutgunnedActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.outgunned || {};

    // Make separate methods for each Actor type (character, enemy, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareSupportData(actorData);
    this._prepareEnemyData(actorData);
    this._prepareMissionData(actorData)
    this._prepareDirectorData(actorData)
    this._prepareChaseData(actorData)
    this._prepareCommonData(actorData)
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.broken = false;
    let totalXP = 0;
    let freeXP = 0;
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      ability.label = game.i18n.localize(CONFIG.OUTGUNNED.abilities[key]) ?? key;
      ability.total = Math.min(ability.value + ability.role + ability.trope + ability.xp,3);
      ability.condition = false
    }
    //Loop through items and apply item specific impacts
    for (let i of actorData.items) {
      if (i.type === "age") {
        systemData.ageId = i._id;
      } else if (i.type === "role") {
        systemData.roleId = i._id;
      } else if (i.type === "trope") {
        systemData.tropeId = i._id;
      }else if (i.type === "skill") {
        totalXP = totalXP + i.system.xp;
        freeXP = freeXP + i.system.free
        i.system.total = Math.min(i.system.value + i.system.role + i.system.trope + i.system.free + i.system.xp,3);
      } else if (i.type === 'condition' && i.system.active) {
        if (i.system.attribute === 'all'){
          systemData.broken = true;
        } else if (i.system.attribute !='na' && i.system.attribute != 'none') {
          systemData.abilities[i.system.attribute].condition = true;
        }
        if (i.system.attribute2 === 'all'){
          systemData.broken = true;
        } else if (i.system.attribute2 !='na' && i.system.attribute2 != 'none') {
          systemData.abilities[i.system.attribute2].condition = true;
        }
      } else if (i.type === 'ride') {
        if (i.system.flying || i.system.nautical || i.system.armoured) {
          i.system.uncommon = true;
        }
      }
    }  

    systemData.advance = Math.floor(totalXP/2)
    systemData.freeXP = freeXP
  }

  _prepareSupportData(actorData) {
    if (actorData.type !== 'support') return;

      const systemData = actorData.system;
      // Loop through ability scores, and add their modifiers to our sheet output.
      for (let [key, ability] of Object.entries(systemData.abilities)) {
        ability.label = game.i18n.localize(CONFIG.OUTGUNNED.abilities[key]) ?? key;
        ability.total = Math.min(ability.value + ability.role + ability.trope + ability.xp,5);
      }
    }    

  _prepareEnemyData(actorData) {
    if (actorData.type !== 'enemy') return;
    // Make modifications to data here. For example:
    const systemData = actorData.system;
  }

  _prepareChaseData(actorData) {
    if (actorData.type !== 'chase') return;
    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.need.max=Math.max(systemData.need.max,1)
  }

  _prepareMissionData(actorData) {
    if (actorData.type !== 'mission') return;
    // Make modifications to data here. For example:
    const systemData = actorData.system;
  }

  _prepareDirectorData(actorData) {
    if (actorData.type !== 'director') return;
    // Make modifications to data here. For example:
    const systemData = actorData.system;
  }

  //Common except for missions
  _prepareCommonData(actorData) {
    if (['mission','director','chase'].includes(actorData.type)) return;
    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.hp.max = systemData.grit.max;
    systemData.hp.min = systemData.grit.min;
    systemData.hp.value = systemData.grit.max - systemData.grit.value;
  }


  /** @override */
  static async create (data, options = {}) {

    //If dropping from compendium check to see if the actor already exists in game.actors and if it does then get the game.actors details rather than create a copy
    if (options.fromCompendium) {
      let tempActor = await (game.actors.filter(actr => actr.name === data.name))[0]
      if (tempActor) {
        return tempActor
      }
    }


    //When creating an actor set basics including tokenlink, bars, displays sight
    if (data.type === 'character') {
      data.prototypeToken = foundry.utils.mergeObject( {
        actorLink: true,
        disposition: 1,
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        sight: {
          enabled: true
        },
        detectionModes: [{
          id: 'basicSight',
          range: 30,
          enabled: true
        }]
      },data.prototypeToken || {})
    } else if (data.type === 'support') {
      data.prototypeToken = foundry.utils.mergeObject({
        actorLink: true,
        disposition: 1,
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        bar2: { attribute: null },
        sight: {
          enabled: true
        },
        detectionModes: [{
          id: 'basicSight',
          range: 30,
          enabled: true
        }]
      },data.prototypeToken || {})
    } else if (data.type === 'mission') {
      data.prototypeToken = foundry.utils.mergeObject( {
        actorLink: true,
        disposition: 1,
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        sight: {
          enabled: false
        },
        texture: {
          src: "systems/outgunned/assets/clapperboard.svg"
        },
      },data.prototypeToken || {})
    } else if (data.type === 'director') {
      data.prototypeToken = foundry.utils.mergeObject( {
        actorLink: true,
        disposition: 1,
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        sight: {
          enabled: false
        },
        texture: {
          src: "systems/outgunned/assets/director-chair.svg"
        },
      },data.prototypeToken || {})
    } else if (data.type === 'chase') {
      data.prototypeToken = foundry.utils.mergeObject( {
        actorLink: true,
        disposition: 1,
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        sight: {
          enabled: false
        },
        texture: {
          src: "systems/outgunned/assets/speedometer.svg"
        },
      },data.prototypeToken || {})
    }  
    let actor = await super.create(data, options)

    //If an actor now add all skills to the sheet
    if (data.type === 'character') {
      let newData = []
      const actorItems = actor.items.filter(i=> ['skill','condition'].includes(i.type))
    
      //Check to see if the new actor has skills and conditions and only add if not.
      for (let i of game.items){
        if (i.type === 'skill' || (i.type === 'condition' && i.system.common)) {
          let currItem = actorItems.filter(j=>j.name === i.name)
          if (currItem.length <1) {          
            newData.push(i)
          }
        }
      }
      await actor.createEmbeddedDocuments("Item", newData);
    } else if (data.type === 'support') {
      actor.update({'system.grit.max': 3});
    } else if (data.type === 'mission') {
      actor.update({'ownership.default': 3,
                    'img':"systems/outgunned/assets/clapperboard.svg"});
    } else if (data.type === 'director') {
      actor.update({'img':"systems/outgunned/assets/director-chair.svg"});
    } else if (data.type === 'chase') {
      actor.update({'img':"systems/outgunned/assets/speedometer.svg"});
    }

     return 

    }
}