import { OutgunnedActor } from "./actors/actor.mjs";
import { OutgunnedItem } from "./items/item.mjs";
import { preloadHandlebarsTemplates } from "./setup/templates.mjs";
import { handlebarsHelper } from './setup/handlebar-helper.mjs';
import { OUTGUNNED } from "./setup/config.mjs";
import { OutgunnedHooks } from './hooks/index.mjs'
import { OutgunnedSystemSocket } from "./apps/socket.mjs"
import * as Chat from "./chat/chat.mjs";
import { registerSettings } from './setup/register-settings.mjs'
import { OutgunnedMenu } from "./setup/layers.mjs"


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.Outgunned = {
    OutgunnedActor,
    OutgunnedItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.OUTGUNNED = OUTGUNNED;

  //Register Settings & Handlebar Helpers
  registerSettings();
  handlebarsHelper();
 
  // Define custom Document classes
  CONFIG.Actor.documentClass = OutgunnedActor;
  CONFIG.Item.documentClass = OutgunnedItem;

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();

});


Hooks.on('ready', async () => {
  game.socket.on('system.outgunned', async data => {
    OutgunnedSystemSocket.callSocket(data)
  });
});

//Remove certain Items types from the list of options to create under the items menu (can still be created directly from the character sheet)
Hooks.on("renderDialog", (dialog, html) => {
  let deprecatedTypes = ["chase","experience"]; // 
  Array.from(html.find("#document-create option")).forEach(i => {
      if (deprecatedTypes.includes(i.value))
      {
          i.remove()
      }
  })
})

OutgunnedHooks.listen()

//Add Chat Log Hooks
Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));

//Add GM Tool Layer
Hooks.on('getSceneControlButtons', OutgunnedMenu.getButtons)
Hooks.on('renderSceneControls', OutgunnedMenu.renderControls)

//Ready Hook
Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

//Hotbar Macros
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.outgunned.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "outgunned.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

//Create a Macro from an Item drop.
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });
}