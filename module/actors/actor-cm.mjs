import { OutgunnedUtilities } from "../apps/utilities.mjs";
import { OutgunnedChecks } from "../apps/checks.mjs";

//Outgunned Menu Options
export const skillMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.skills"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEdit(el, actor, "itemId");
    }
  },
  {
    name: game.i18n.localize("OG.cm.delete"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerDelete(el, actor, "itemId");
    }
  }
]  

export const ageMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.age"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEdit(el, actor, "itemId");
    }
  },
  {
    name: game.i18n.localize("OG.cm.delete"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => (game.user.isGM),
    callback: (el) => {
      const itemId = OutgunnedUtilities.deleteAge(el, actor, "itemId");
    }
  }
]

export const roleMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.role"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEdit(el, actor, "itemId");
    }
  },
  {
    name: game.i18n.localize("OG.cm.delete"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => (game.user.isGM),
    callback: (el) => {
      const itemId = OutgunnedUtilities.deleteRole(el, actor, "itemId");
    }
  }
]

export const tropeMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.trope"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEdit(el, actor, "itemId");
    }
  },
  {
    name: game.i18n.localize("OG.cm.delete"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => (game.user.isGM),
    callback: (el) => {
      const itemId = OutgunnedUtilities.deleteTrope(el, actor, "itemId");
    }
  }
]

export const freeXPMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.freeSkill"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.spend"),
    icon: '<i class="fas fa-pencil"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.spendFreeXP(el, actor);
    }
  },
  {
    name: game.i18n.localize("OG.cm.clear"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => (game.user.isGM),
    callback: (el) => {
      const itemId = OutgunnedUtilities.clearFreeXP(el, actor);
    }
  }
]

export const attributeMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.attribute"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.viewAttribute(el, actor);
    }
  }
]

export const featMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.feat"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEdit(el, actor, "itemId");
    }
  },
  {
    name: game.i18n.localize("OG.cm.delete"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerDelete(el, actor, "itemId");
    }
  }
]

export const conditionMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.condition"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.view"),
    icon: '<i class="fas fa-magnifying-glass"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEdit(el, actor, "itemId");
    }
  },
  {
    name: game.i18n.localize("OG.cm.delete"),
    icon: '<i class="fas fa-trash"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerDelete(el, actor, "itemId");
    }
  }
]

export const spotlightMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.spotlight"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.saveFriend"),
    icon: '<i class="fas fa-heart-pulse"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.spendSpotlight(el, actor, "save");
    }
  },
  {
    name: game.i18n.localize("OG.cm.spendSpotlight"),
    icon: '<i class="fas fa-clapperboard"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.spendSpotlight(el, actor,"spend");
    }
  }
]

export const enemyGritMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.grit"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.maxGrit"),
    icon: '<i class="fas fa-shield-plus"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEditActor(el, actor, "grit");
    }
  },

  {
    name: game.i18n.localize("OG.cm.toggleHot"),
    icon: '<i class="fas fa-fire-flame-curved"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEditHot(el, actor);
    }
  },

  {
    name: game.i18n.localize("OG.cm.toggleBad"),
    icon: '<i class="fas fa-fire-flame-curved"></i>',
    condition: () => (game.settings.get("outgunned","ogVersion") === '1'),
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEditBad(el, actor);
    }
  }
]

export const needMenuOptions = (actor,token) => [
  {
    name: game.i18n.localize("OG.need"),
    icon: "",
    condition: () => true,
    callback: (el) => {}
  },
  {
    name: game.i18n.localize("OG.cm.maxNeed"),
    icon: '<i class="fas fa-square-check"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEditActor(el, actor, "need");
    }
  },

  {
    name: game.i18n.localize("OG.cm.toggleHot"),
    icon: '<i class="fas fa-fire-flame-curved"></i>',
    condition: () => true,
    callback: (el) => {
      const itemId = OutgunnedUtilities.triggerEditNeed(el, actor);
    }
  }  
]