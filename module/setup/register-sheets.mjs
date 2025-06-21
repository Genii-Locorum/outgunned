import { OutgunnedCharacterSheet } from '../actors/sheets/character.mjs';
import { OutgunnedEnemySheet } from '../actors/sheets/enemy.mjs';
import { OutgunnedSupportSheet } from '../actors/sheets/support.mjs';
import { OutgunnedMissionSheet } from '../actors/sheets/mission.mjs';
import { OutgunnedDirectorSheet } from '../actors/sheets/director.mjs';
import { OutgunnedChaseSheet } from '../actors/sheets/chase.mjs';
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
import { OutgunnedWeaponFeat } from '../items/sheets/weaponfeat.mjs';
import { OutgunnedShotSheet } from '../items/sheets/shot.mjs';

export function registerSheets () {
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  
  foundry.documents.collections.Actors.registerSheet('Outgunned', OutgunnedCharacterSheet, {
    types: ['character'],
    makeDefault: true
  })

  foundry.documents.collections.Actors.registerSheet('Outgunned', OutgunnedEnemySheet, {
    types: ['enemy'],
    makeDefault: true
  })

  foundry.documents.collections.Actors.registerSheet('Outgunned', OutgunnedSupportSheet, {
    types: ['support'],
    makeDefault: true
  })

  foundry.documents.collections.Actors.registerSheet('Outgunned', OutgunnedMissionSheet, {
    types: ['mission'],
    makeDefault: true
  })

  foundry.documents.collections.Actors.registerSheet('Outgunned', OutgunnedDirectorSheet, {
    types: ['director'],
    makeDefault: true
  })

  foundry.documents.collections.Actors.registerSheet('Outgunned', OutgunnedChaseSheet, {
    types: ['chase'],
    makeDefault: true
  })  

  foundry.documents.collections.Items.unregisterSheet('core', foundry.appv1.sheets.ItemSheet)
    foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedGearSheet, {
      types: ['gear'],
      makeDefault: true
    })    

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedSkillSheet, {
    types: ['skill'],
    makeDefault: true
  })
  
  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedRoleSheet, {
    types: ['role'],
    makeDefault: true
  }) 
  
  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedFeatSheet, {
    types: ['feat'],
    makeDefault: true
  }) 

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedAgeSheet, {
    types: ['age'],
    makeDefault: true
  }) 

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedTropeSheet, {
    types: ['trope'],
    makeDefault: true
  }) 
  
  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedConditionSheet, {
    types: ['condition'],
    makeDefault: true
  }) 

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedGunSheet, {
    types: ['gun'],
    makeDefault: true
  })

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedRideSheet, {
    types: ['ride'],
    makeDefault: true
  })

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedEnemyFeatSheet, {
    types: ['enemyFeat'],
    makeDefault: true
  })

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedSpecialActionSheet, {
    types: ['specialAction'],
    makeDefault: true
  })

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedExperienceSheet, {
    types: ['experience'],
    makeDefault: true
  })
  
  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedWeaponFeat, {
    types: ['weaponfeat'],
    makeDefault: true
  })

  foundry.documents.collections.Items.registerSheet('Outgunned', OutgunnedShotSheet, {
    types: ['shot'],
    makeDefault: true
  })  
}