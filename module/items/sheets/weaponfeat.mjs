export class OutgunnedWeaponFeat extends ItemSheet {


  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["outgunned", "sheet", "item"],
      width: 520,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  get template() {
    const path = "systems/outgunned/templates/item";
    return `${path}/${this.item.type}.html`;
  }

  async getData() {
    const context = super.getData();
    const itemData = context.item;
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.isGM =  game.user.isGM;
    return context;
  }
}
