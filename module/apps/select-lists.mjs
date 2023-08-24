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
        newOptions= Object.assign(newOptions,newAbility)
      }  
    }
    return newOptions
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
}