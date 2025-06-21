export class OutgunnedSpecialActionSheet extends foundry.appv1.sheets.ItemSheet {

  //Turn off App V1 deprecation warnings
  //TODO - move to V2
  static _warnedAppV1 = true

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
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.isGM =  game.user.isGM;

    context.enrichedDescriptionValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.data.system.description,
      {
        async: true,
        secrets: context.editable
      }
    )  

    context.enrichedShortDescriptionValue = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.data.system.shortDesc,
      {
        async: true,
        secrets: context.editable
      }
    )  

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
  }
}
