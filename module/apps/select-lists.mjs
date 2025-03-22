export class OutgunnedSelectLists {

  //Attribute List
  static async getAttributeTypes () {    
    let options = {
      "brawn": game.i18n.localize("OUTGUNNED.AbilityBrawn"),
      "nerves": game.i18n.localize("OUTGUNNED.AbilityNerves"),
      "smooth": game.i18n.localize("OUTGUNNED.AbilitySmooth"),
      "focus": game.i18n.localize("OUTGUNNED.AbilityFocus"),
      "crime": game.i18n.localize("OUTGUNNED.AbilityCrime")  
    }    
    return options;
  }  

  //Attribute List Excluding One attribute
  static async getShortAttributeTypes(options,ignore) {
    let newOptions = {};
    let newAbility = {};
    for (let [key, ability] of Object.entries(options)) {
      if (key != ignore){
        newAbility ={[key]: ability};
        newOptions= Object.assign(newOptions,newAbility);
      }  
    }
    return newOptions
  }

  //Attribute List plus "All"
  static async getAllAttributeTypes () {
    let options = await OutgunnedSelectLists.getAttributeTypes ();
    let newOptions = {};
    let newAbility = {};
    for (let [key, ability] of Object.entries(options)) {
      newAbility ={[key]: ability};
      newOptions= Object.assign(newOptions,newAbility);
    }  
    newOptions= Object.assign(newOptions,{"all": game.i18n.localize("OG.all"), "none": game.i18n.localize("OG.none"), "na": game.i18n.localize("OG.na")});
    return newOptions;
  }

  //Feat Action Usage List
  static getUsageTypes () {    
    let options = {
      "none": game.i18n.localize("OG.none"),
      "quick": game.i18n.localize("OG.quickAction"),
      "full": game.i18n.localize("OG.fullTurn")  
    }    
    return options;
  }  

  //Difficulty List
  static async getDifficultyList () {    
    let options = {
      "basic": game.i18n.localize("OG.basic"),
      "critical": game.i18n.localize("OG.critical"),
      "extreme": game.i18n.localize("OG.extreme"),
      "impossible": game.i18n.localize("OG.impossible")    }    
    return options;
  } 

  //Skill List
  static async getSkillList () {    
    let options = {};
    options= Object.assign(options,{"na": game.i18n.localize("OG.na")});
    for (let i of game.items) {
      if (i.type === 'skill') {
        options= Object.assign(options,{[i.name]: i.name});
      }
    }    
    return options;
  } 

  //Location List
  static async getLocationList () {    
    let options = {
      "worn": game.i18n.localize("OG.worn"),
      "bag": game.i18n.localize("OG.bag"),
      "storage": game.i18n.localize("OG.storage")
    }   
    if (game.settings.get("outgunned","ogVersion") === "1") {
      options= Object.assign(options,{"storage": game.i18n.localize("OG.backpack")});
    }else {
      options= Object.assign(options,{"storage": game.i18n.localize("OG.storage")});
    }  

    return options;
  } 

    //Mags List
    static async getMagsList () {    
      let options = {
        "0":0,
        "1":1,
        "2":2,
        "3":3,
        "4":4    
      }   
      return options;
    } 

    //DifficultyMutliplier List
    static async getDiffMultiList () {    
      let options = {
        "1":1,
        "2":2,
      }   
      return options;
    } 

    //Enemy Type List
    static async getEnemyList () {    
      let options = {
        "goon":game.i18n.localize("OG.goon"),
        "badguy":game.i18n.localize("OG.badguy"),
        "boss":game.i18n.localize("OG.boss"),
      }   
      return options;
    }

    //Experience Type List
    static async getXPList () {    
      let options = {
        "achievement":game.i18n.localize("OG.achievement"),
        "scar":game.i18n.localize("OG.scar"),
        "bond":game.i18n.localize("OG.bond"),
        "reputation":game.i18n.localize("OG.reputation"),
      }   
      if (game.settings.get("outgunned","ogVersion") === "2") {
        options= Object.assign(options,{"blood": game.i18n.localize("OG.blood")});
      }
      return options;
    }

    //Special Role List
    static async getSpecialRoleList () {    
      let options = {
        "no":game.i18n.localize("OG.no"),
        "killer":game.i18n.localize("OG.killer"),
      }   
      return options;
    }

    //Chase Type List
    static async getChaseList () {    
      let options = {
        "chase":game.i18n.localize("OG.chase"),
        "hunt":game.i18n.localize("OG.hunt"),
        "getaway":game.i18n.localize("OG.getaway"),
      }   
      return options;
    }
}


