import { OutgunnedCharacterSheet } from '../actors/sheets/character.mjs';
import { OutgunnedEnemySheet } from '../actors/sheets/enemy.mjs';
import { OutgunnedSupportSheet } from '../actors/sheets/support.mjs';
import { OutgunnedGearSheet } from '../items/sheets/gear.mjs';
import { OutgunnedSkillSheet } from '../items/sheets/skill.mjs';
import { OutgunnedRoleSheet } from '../items/sheets/role.mjs';
import { OutgunnedFeatSheet } from '../items/sheets/feat.mjs';
import { OutgunnedAgeSheet } from '../items/sheets/age.mjs';
import { OutgunnedTropeSheet } from '../items/sheets/trope.mjs';
import { OutgunnedConditionSheet } from '../items/sheets/condition.mjs';
import { OutgunnedGunSheet } from '../items/sheets/gun.mjs';
import { OutgunnedRideSheet } from '../items/sheets/ride.mjs';
import { OutgunnedEnemyFeatSheet } from '../items/sheets/enemyFeat.mjs';
import { OutgunnedSpecialActionSheet } from '../items/sheets/specialAction.mjs';
import { OutgunnedExperienceSheet } from '../items/sheets/experience.mjs';

export function registerSheets () {
  Actors.unregisterSheet("core", ActorSheet);
  
  Actors.registerSheet('Outgunned', OutgunnedCharacterSheet, {
    types: ['character'],
    makeDefault: true
  })

  Actors.registerSheet('Outgunned', OutgunnedEnemySheet, {
    types: ['enemy'],
    makeDefault: true
  })

  Actors.registerSheet('Outgunned', OutgunnedSupportSheet, {
    types: ['support'],
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
  
  Items.registerSheet('Outgunned', OutgunnedConditionSheet, {
    types: ['condition'],
    makeDefault: true
  }) 

  Items.registerSheet('Outgunned', OutgunnedGunSheet, {
    types: ['gun'],
    makeDefault: true
  })

  Items.registerSheet('Outgunned', OutgunnedRideSheet, {
    types: ['ride'],
    makeDefault: true
  })

  Items.registerSheet('Outgunned', OutgunnedEnemyFeatSheet, {
    types: ['enemyFeat'],
    makeDefault: true
  })

  Items.registerSheet('Outgunned', OutgunnedSpecialActionSheet, {
    types: ['specialAction'],
    makeDefault: true
  })

  Items.registerSheet('Outgunned', OutgunnedExperienceSheet, {
    types: ['experience'],
    makeDefault: true
  })
}