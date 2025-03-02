/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/outgunned/templates/actor/parts/actor-gear.html",
    "systems/outgunned/templates/actor/parts/actor-description.html",
    "systems/outgunned/templates/actor/parts/actor-feats.html",
    "systems/outgunned/templates/actor/parts/actor-rides.html",
    "systems/outgunned/templates/actor/parts/actor-youLook.html",
    "systems/outgunned/templates/actor/parts/mission-shots.html",
    "systems/outgunned/templates/actor/parts/mission-ride.html",
    "systems/outgunned/templates/actor/parts/mission-villain.html",
    "systems/outgunned/templates/actor/parts/mission-support.html",
    "systems/outgunned/templates/actor/parts/mission-contacts.html",
    "systems/outgunned/templates/actor/parts/director-ride.html",
    "systems/outgunned/templates/actor/parts/director-villain.html",
    "systems/outgunned/templates/actor/parts/director-enemies.html",
    "systems/outgunned/templates/actor/parts/director-support.html",
  ]);
};
