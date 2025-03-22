# CHANGELOG

## 2.14
- World of Killers changes have been implemented
- Set the "Game Version" setting to "World of Killers"
- It is recommended to use "rgb(89,56,151)" for Primary Colour for Sheets, and Primary Colour for Icons
- There is a new experience type - Blood Debt
- There is now an additional selection on all Roles - "Special Role".  Currently you can choose from "No" for the basic rules or "Killer" for a World of Killers special role.  Selecting Killer adds a second attribute, and sets the number of Free Skill Points to 6 (rather than 2).  Special roles also fill the trope and job slots.
- If you have set the game version to World of Killers, you can set a starting gold value (0 or 1) on Ages.
- There are two new Plan Bs available in Game Settings.  If the game version is set to World of Killers the options in the GM Tools and the display on the Mission sheet are changed
- Missions will show Gold if the game is set to World of Killers
- Guns, gear and rides now show a Gold cost if using World of Killers
- Some additional weapon feats for World of Killers on Guns
- Gear now has feats (like Guns)
- Support actors, for World of Killers, now has a dog/shield icon at the top right of the sheet.  Toggle this on to make the support a Trained Animal (you can enter the species then)
- For World of Killers you can now select a Chase Type of Chase, Hunt or Getaway - the differences are mostly cosmetic, except that only Chases show Rides
- Chases now have Countdown shown irrespective of the game version used
- Plan B icons have been removed from Game Settings as they are now included in the "Dice Font" - but they will now be consistent across the GM Tools, Character Sheet and Mission Sheet 
- I have tried to update the language packs using online translators but I appreciate that these are not always right.  Please feel free to feedback any changes that are needed.
- (Hopefully) all descriptions etc are now use Prosemirror editor rather than TinyMCE giving you some edit/linking options
- PLEASE NOTE:  The Feats tab and data have now been removed from Guns - ensure you have started using the new feats option before migrating to the new version

## 2.13
- There are now some colour settings for you to change text and icon colours.

## 2.12
- Default "Need" for chases set to 18, with validation to maintain a minimum score of 1

## 2.11
- You can now add a mission sheet - this is a type of Actor.  By default this is owned by all players.
- Chases have been added as a type of actor.
- Director's sheet has now been added as a type of actor
- A few error messages corrected to show the appropriate dialogue.


## 2.10
- Death Roulette no longer always rolls "Left for Dead"

## 2.09
- Dice rolls now show Outgunned Dice rather than 1-6 (you still see the values in the chat card).  If you manually roll in chat you will only see numbers
- If using Dice So Nice you will get the icons.  
- Removed the input for "Adrenaline" - reverted back to how it was but see below
- There is a game setting for the version of the game you are running - currently just Outgunned or Adventures
- When using Adventure, Job becomes Background, Mission becomes Treasure and Adrenaline becomes Luck - with appropriate French and German Translations
- When using Adventure, enemies now have Grit that can now change grit to "Bad" as well as Hot or Not.
- When using Adventure, items in storage are replaced with items in backpack
- When using Adventure, gear Items can now be flagged as "Key Items".  This only applies to "Gear", not Guns etc

## 2.08(Beta)
- Free Skill points are no longer part of the Trope score, they are held separately.  When adding a trope you will be able to still add the points.
- There is also a new heading on the "Description" tab that shows the number of Free Skill points spent and a context menu that allows you to clear or spend points.
- The GM can edit the Free Skill points on individual skills under the GM Freeform Edit option
- You may need to edit pre-existing characters to make changes manually.
- Added a new item type for Weapon Feats - these are added to weapons, not to the character.  You will need to enter an icon name from https://fontawesome.com/search (e.g. fa-regular fa-bullseye)
- Weapon Feats are dragged and dropped on to guns and will then show as an icon on the character sheet with a tooltip for the feat name (no real change).  The old "feats" on the weapon sheet have been moved to a tab that's only visible to the GM - more to allow the GM to make updates to the new system.  I will delete this in a future iteration - but left in for now.
- There are game settings for three Plan Bs each with a name and FAS Icon.  GM can activate the options via the GM Tools.  The options are shown on the character sheet as icons below the HEAT section.  There is no validation of the FAS Icon text in game settings but if you can't see them on the character sheet then you probably have a typo in the icon text.  All players will get an alert when the GM triggers a plan B and their character sheets will update.
- As the GM changes Heat all players will get an alert and their character sheets should update automatically.
- Added three new ride types, Pedal Power, Beast of Burden and Spaceship
- The title "Adrenaline" can now be edited when the character sheet is unlocked as it's called different things in different variants of the game.  It does mean that the language packs no longer translate this.
- Added a "Cyber Enahnce" status on the description tab of the character sheet which changes the 8th grit box from Bad to Hot.
- In Game Settings there is now an option to add "Razor's Edge" to gambling rolls.  When activated the Gambling drop down in the Dice Roll dialog box will now show this option
- Conditions can now have two attributes or skills attached to them, providing some flexibility for other OG expansions and homebrew rules


## 2.07(Beta)
- Added a "GM Freedorm Edit" tool under Outgunned tools.  This allows GMs to toggle on this option and directly change Attribute and Skill scores on the character sheet

## 2.06(Beta)
- Added French tranlslation - (thank you to xKuPeD)

## 2.0.5(Beta)
- Change to manifest URL to correct it

## 2.0.4(Beta)
- players can now change cost and other values of gear, guns and rides (no longer restricted to the name)

## 2.0.3(Beta)
- fixed error with imcompatible system.json file

## 2.0.2(Beta)
- Changed Gear, Gun, Ride, Experience items so players can change the name (other items can only have the GM change the name)

## 2.0.1 (Beta1)
- Complete overhaul of the Item Compendiums of the system for Beta GoLive
- Added German language "Anleitung" as Compendium and hereby updated some information in the Englisch "Description" Compendium

## 1.0.16
- Added macros packs which includes Heat Increase/Decrease macros and neutral roll

## 1.0.14
- Updated for Foundry V12
- German Language Pack added (thank you Karsten)
- Added Instructions
- Added "Neutral Roll" - see instructions for details
- Changed Dice Roll chat message to show follow up dice roll options
- Added a Close Roll option to chat message to accept the result
- Added a check so that re-rolls etc are only carried out by one GM (not all of them)
- When making a follow up roll then it is actually made (behind the scenes) by the originating player/GM and not the GM

## 1.0.13
- Fixed an issue with Free Roll not working - thanks to KarstenW for the fix
