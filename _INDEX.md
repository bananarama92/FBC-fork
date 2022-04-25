[About](.) | [Mobile](mobile.html) | [Toys](toys.html) | [Discord](https://discord.gg/SHJMjEh9VH)

# BCE - Bondage Club Enhancements

This addon to [Bondage Club](https://www.bondageprojects.com/club_game/) offers various mostly small improvements to the game experience. Making the game easier, safer and, in some cases, more immersive for certain types of people. See features below for more details.

## How to install and use

With Tampermonkey you can control when and if you want to update BCE and BCE will be automatically loaded whenever you open the club. Tampermonkey will by default check for updates daily. The manual bookmark will always load the latest version, but has to be clicked each time you (re)open the club. You can use different methods on different devices, but be mindful of using wildly different versions of BCE: some settings may reset.

### Autoload with Tampermonkey

1. Install [Tampermonkey](https://www.tampermonkey.net/) (available for most commonly used browsers).
1. Choose your version: do you want the script to update every time you refresh?  
  a. Yes: use `https://sidiousious.gitlab.io/bce/bce-loader.user.js` ([click me and hit Install on the page that comes up](https://sidiousious.gitlab.io/bce/bce-loader.user.js))  
  b. No: use `https://sidiousious.gitlab.io/bce/bce.user.js` ([click me and hit Install on the page that comes up](https://sidiousious.gitlab.io/bce/bce.user.js))  

If clicking the links above does not give you the option to install:
1. Open Tampermonkey's dashboard from its button top-right, and go to the Utilities on the right.
1. Paste the URL into the "Install from URL" field, and click "Install". Tampermonkey should ask for a confirmation, and then the script will show up in its main view.

Once the script has been installed reload your BC tab (F5, Ctrl-R), as changes to the script are only picked up on a page refresh. You should see a "SAVE (BCE)" button on the login screen. You do not need to use this, unless you want to use the automatic relogin feature.
Then login and go to the preferences screen and click onto "BCE Settings" to enable (or disable) components you wish to use.

### Manual bookmark

1. Save `javascript:(()=>{fetch('https://sidiousious.gitlab.io/bce/bce.user.js').then(r=>r.text()).then(r=>eval(r));})();` as a bookmark on your devices, or [bookmark this link][bookmarklet]
1. Use by opening the bookmark in the bondage club tab on your browser. If used on the login page you should see the "SAVE (BCE)" button appear.

- Desktop: use from your bookmarks menu
- Android (Chrome) or iOS (Safari): search for your bookmark in the navigation bar, _not in the bookmarks menu_!
- Others: this should work in any browser that supports the club and [bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet).

### Mobile

[See detailed guide here](mobile.html)

## Features

At a glance, **everything is entirely optional, enable in settings** (profile -> preferences -> BCE Settings):

- Integration with remote controlled sex toys that work with [buttplug.io](https://buttplug.io) ([Instructions](toys.html))
- Improved automatic facial expressions that play nice with manual control
- Automatic relogin after disconnect
- FPS limiter: save your computer's resources
- [BCX](https://github.com/Jomshir98/bondage-club-extended) loader for both stable and devel
- Clickable links and embedded images from trusted websites in chat (e.g. imgur, Discord)
- Lockpicking helper
- Convenient chat commands, such as `/w <name> <message>` to whisper another player
- Full wardrobe in chatrooms (preview before saving/loading).
- Anti-garble for gagspeak and deafening
- Anti-anti-garble for your own speech: prevent others from understanding you with anti-garbling solutions while gagged
- Alternative arousal calculations
- Blur vision when not wearing glasses
- Notifications for friends coming online or going offline
- Confirmation prompt when leaving the page
- Beeps display their text in chat. Clicking on them takes you directly to the beep.
- Ctrl+Enter to OOC
- Accurate timer inputs
- Club slave as an option for owners under forced labor
- Extended Wardrobe (more slots)
- Modify outfit layering
- Change your nickname
- Save and review profiles of, and add notes to, players you have seen before (incompatible with incognito/private browsing due to saving in browser storage)

### Chat Links and Embeds

![](static/bceEmbeds.png)

BCE allows clicking links posted in chat and embeds images from trusted domains, such as Discord, Imgur and Tenor. Additionally any links you send will always be inside OOC brackets to ensure stutter algorithms do not break your links.

### Instant Messenger

![](static/bceInstantMessenger.png)

BCE includes an optional instant messenger that can be used to message with your friends.

### Require Glasses to See

![](static/bceGlasses.png)

BCE can blur your vision, when your character is not wearing glasses or visors.

### Confirm Leaving the Club

![](static/bceLeaveProtect.png)

BCE can ask you to confirm when navigating away from the club. This protects against accidental back button or refresh. Best combined with saved credentials for automatic relogin, as relogin will still be required.

### Lockpick Helper

![](static/bceLockPick.png)

BCE can give hints in the lockpicking minigame, based on your skill. Do note that lockpicking can still be impossible, if you are tied up too tightly or your skill is too low.

### Full Wardrobe in Chatrooms

![](static/bceFullWardrobe.png)

BCE can allow using the full wardrobe with previews from the singleplayer private room inside online chatrooms.

### Additional Chat Commands for Convenience

![](static/bceCommands.png)

- `/exportlooks <member number> <include restraints: true/false> <include body, eyes, etc: true/false>` allows you to save your or another player's last seen appearance as a string you can later import with BCX or on yourself `/importlooks`. If no member number is given, copies your own appearance. Additional parameters default to "false".
- `/importlooks [looks string]` sets your current appearance to the copied appearance.
- `/w [target's first name] [message]` sends a whisper to the target. No message will be sent if the target cannot be found or if many people with the same name are present in the room. No more danger of the other player disconnecting and you uttering the message out loud in public.
- `/versions` show what versions of BC, BCX and BCE other players in the room are using.
- `/r` resets animations and expressions. You can optionally define part of the face to reset, leaving other parts intact, e.g. `/r eyes`
- `/pose <space separated list of poses>` allows setting or resetting your character's pose. Note that this bypasses restrictions, but will not override poses imposed by items, e.g. short collar chain.
- `/pose list` lists all available poses.

### Friend Presence Notifications

![](static/bceNowOnline.png)

BCE can notify you when friends come and go.

### Beep Enhancements

![](static/bceMessagePreviewDemo.png)

BCE will display a snippet of the message received in beeps in chat, and clicking the message takes you directly to the beep. This functionality is incompatible with BcUtil and disabled, when that addon is detected.

### Accurate Timer Durations

![](static/bceTimerInput.png)

BCE allows you to set timer locks at a greater accuracy. Does not allow exceeding maximum duration of the locks.

### Automatic relogin

BCE can automatically enter your password, when you lose connection to the game. You can enable this by choosing to save your login after entering your details, but before clicking login, by clicking on the "Save (BCE)" button. You can then populate the login by pressing the name on the left for future logins, and remove it there, also disabling the auto-relogin. **Warning**: this does store your password in plaintext in your local storage, where malicious scripts could theoretically read it.

### Forced Labor: Club Slave

![](static/bceForceCS.png)

BCE allows owners to send their submissives to work as club slaves, when both are running the same version of BCE.

### Extended Wardrobe

![](static/bceExtendedWardrobe.png)

BCE allows expanding your wardrobe to 96 slots. Note that this will make the wardrobe open a bit slower.

### Layer-priority editor and ability to loosen/tighten restraints

![](static/bceLayering1.png)
![](static/bceLayering2.png)

BCE allows manual editing of an asset's priority — the value the game uses to decide what item shows over others — as well as the difficulty to struggle out of a restraint. When you select an item, you should see either:

- a number field and a validate button at the top-right for clothing,
- two white boxes at bottom-left for restraints: one will open the option to modify layer priority while the other allows loosening/tightening restraints.

This allow manually overriding the assets' relative positioning, giving better flexibility when doing outfits, or slapping restraints. Note that there's no way to reset the priority to its default value, so you have to take note of it or take it off and put it on again.

**Note**: the difficulty modification is technically cheating and should be used for roleplay purposes only. This does also allow struggling out of items you are not supposed to remove, such as a slave collar. Both of these features can be used to break the game, so use them responsibly. The main intent here is along the lines of choosing whether a shirt goes on top of your pants or vice-versa, or modifying the tightness of a rope tie without having to remove it, modify your bondage skill, and re-apply.

### Customizable automated expressions

BCE has an expression animator that replaces the game's default animator. It uses both the arousal meter, and messages posted in chat, and respects manual changes you make to your face (not overriding them every 2 seconds like the game's own face animator).

Yield control of manual expressions back to the automator by using the chat command `/r`, or you can choose which part of your face to give back e.g. `/r eyes`.

#### Arousal expressions

Arousal-based expressions are just that: your facial expression will change depending on changes to your arousal. This is compatible with both manual and automatic arousal meter. For customization refer to the comments in the example script [`bce-custom-expressions-example.user.js`][custom], which you can separately install via Tampermonkey. Advanced users can host their own bookmarklet for it.

#### Event-driven expressions

Messages in chat can trigger animations on your face. These can vary from the (click actions) to \*roleplayed /me\* messages.

#### Alternative arousal calculations

The arousal system in the game is very basic and regardless of the action your arousal will go up 1% per second. This alternate system changes it to be 0.25-2% per second depending on the activity, number and intensity of vibrators, how much you love the activity and the part of the body it's occurring in. Overall this should result in _slightly_ faster orgasms from loved activities and stacked maxed vibrators while significantly slowing down arousal increase from less loved activities. Your arousal settings are fully respected by these changes.

**Note**: you may see some flickering on the arousal meter when one player is using this while the other one is not.

### Expression cheatsheet

This is for the purposes of customizing [`bce-custom-expressions-example.user.js`][custom]. The lists are in the same order as the menu in the game for the purposes of knowing which is which.

```js
  Eyes: [
    "Closed",
    "Dazed",
    "Shy",
    "Sad",
    "Horny",
    "Lewd",
    "VeryLewd",
    "Heart",
    "HeartPink",
    "LewdHeart",
    "LewdHeartPink",
    "Dizzy",
    "Daydream",
    "ShylyHappy",
    "Angry",
    "Surprised",
    "Scared",
  ],
  Eyes2: [], // Same as Eyes above
  Mouth: [
    "Frown",
    "Sad",
    "Pained",
    "Angry",
    "HalfOpen",
    "Open",
    "Ahegao",
    "Moan",
    "TonguePinch",
    "LipBite",
    "Happy",
    "Devious",
    "Laughing",
    "Grin",
    "Smirk",
    "Pout",
  ],
  Blush: ["Low", "Medium", "High", "VeryHigh", "Extreme", "ShortBreath"],
  Fluids: [
    "DroolLow",
    "DroolMedium",
    "DroolHigh",
    "DroolSides",
    "DroolMessy",
    "DroolTearsLow",
    "DroolTearsMedium",
    "DroolTearsHigh",
    "DroolTearsMessy",
    "DroolTearsSides",
    "TearsHigh",
    "TearsMedium",
    "TearsLow",
  ],
  Emoticon: [
    "Afk",
    "Whisper",
    "Sleep",
    "Hearts",
    "Tear",
    "Hearing",
    "Confusion",
    "Exclamation",
    "Annoyed",
    "Read",
    "RaisedHand",
    "Spectator",
    "ThumbsDown",
    "ThumbsUp",
    "LoveRope",
    "LoveGag",
    "LoveLock",
    "Wardrobe",
    "Gaming",
  ],
  Eyebrows: ["Raised", "Lowered", "OneRaised", "Harsh", "Angry", "Soft"],
```

[View source code and contribute on GitLab](https://gitlab.com/Sidiousious/bce)

[Credits](https://gitlab.com/Sidiousious/bce/-/graphs/main), and:
- Chinese localization by 洛星臣

[custom]: https://sidiousious.gitlab.io/bce/bce-custom-expressions-example.user.js
[bookmarklet]: javascript:(()%3D%3E%7Bfetch('https%3A%2F%2Fsidiousious.gitlab.io%2Fbce%2Fbce.user.js').then(r%3D%3Er.text()).then(r%3D%3Eeval(r))%3B%7D)()%3B
