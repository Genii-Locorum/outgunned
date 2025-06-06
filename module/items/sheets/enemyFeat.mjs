export class OutgunnedEnemyFeatSheet extends ItemSheet {


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

    context.enrichedDescriptionValue = await TextEditor.enrichHTML(
      context.data.system.description,
      {
        async: true,
        secrets: context.editable
      }
    )  

    context.enrichedShortDescriptionValue = await TextEditor.enrichHTML(
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
