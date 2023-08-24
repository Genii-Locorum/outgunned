import { OutgunnedCharacterSheet } from '../actors/sheets/character.mjs';
import { OutgunnedGearSheet } from '../items/sheets/gear.mjs';
import { OutgunnedSkillSheet } from '../items/sheets/skill.mjs';
import { OutgunnedRoleSheet } from '../items/sheets/role.mjs';
import { OutgunnedFeatSheet } from '../items/sheets/feat.mjs';
import { OutgunnedAgeSheet } from '../items/sheets/age.mjs';
import { OutgunnedTropeSheet } from '../items/sheets/trope.mjs';

export function registerSheets () {
  Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet('Outgunned', OutgunnedCharacterSheet, {
      types: ['character'],
      makeDefault: true
    })

  Items.unregisterSheet('core', ItemSheet)
    Items.registerSheet('Outgunned', OutgunnedGearSheet, {
      types: ['gear'],
      makeDefault: true
    })    

  Items.registerSheet('Outgunned', OutgunnedSkillSheet, {
    types: ['skill'],
    makeDefault: true
  })
  
  Items.registerSheet('Outgunned', OutgunnedRoleSheet, {
    types: ['role'],
    makeDefault: true
  }) 
  
  Items.registerSheet('Outgunned', OutgunnedFeatSheet, {
    types: ['feat'],
    makeDefault: true
  }) 

  Items.registerSheet('Outgunned', OutgunnedAgeSheet, {
    types: ['age'],
    makeDefault: true
  }) 

  Items.registerSheet('Outgunned', OutgunnedTropeSheet, {
    types: ['trope'],
    makeDefault: true
  }) 
}