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

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
    this._prepareCommonData(actorData)
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      ability.label = game.i18n.localize(CONFIG.OUTGUNNED.abilities[key]) ?? key;
      ability.total = Math.min(ability.value + ability.role + ability.trope + ability.xp,3);
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
        i.system.total = Math.min(i.system.value + i.system.role + i.system.trope + i.system.xp,3);
      }

    }  

  }


  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

  }

  _prepareCommonData(actorData) {

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.hp.max = systemData.grit.max;
    systemData.hp.min = systemData.grit.min;
    systemData.hp.value = systemData.grit.max - systemData.grit.value;
  }

}