# BCE

This script offers better automatic face expression changes based on events in the club, such as arousal level and activities that show up in chat, both automatic and manual. Manual overrides are respected and retained, unless the manual override corresponds to the blank face.

## How to install and use

With Tampermonkey you can control when and if you want to update BCE, but Tampermonkey is only available for desktop browsers. The manual bookmark will always load the latest version. You can use different methods on different devices, but be mindful of using wildly different versions of BCE: some settings may reset.

### Autoload with Tampermonkey

1. Install Tampermonkey.
1. Open Tampermonkey's dashboard from its button top-right, and go to the Utilities on the right.
1. Paste `https://sidiousious.gitlab.io/bce/bce.user.js` into the "Install from URL" field, and click "Install". Tampermonkey should ask for a confirmation, and then the script will show up in its main view.
1. Reload your BC tab (F5, Ctrl-R), as changes to the script are only picked up on a page refresh.
   Then go to the preferences screen and click onto "BCE Settings" to enable (or disable) components you wish to use.

### Manual bookmark

1. Save `javascript:(() => { fetch('https://sidiousious.gitlab.io/bce/bce.user.js').then(r=>r.text()).then(r=>eval(r)); })();` as a bookmark on your devices.
1. Use the bookmark with the club open, if used on the login page you should see the "SAVE (BCE)" button appear:

- Desktop: use from your bookmarks menu
- Android (Chrome): search for your bookmark in the navigation bar, _not in the bookmarks menu_!
- Others: this should work in any browser that supports the club and [bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet).

## Features

### Automatic relogin

BCE can automatically enter your password, when you lose connection to the game. You can enable this by choosing to save your login after entering your details, but before clicking login, by clicking on the "Save (BCE)" button. You can then populate the login by pressing the name on the left for future logins, and remove it there, also disabling the auto-relogin. **Warning**: this does store your password in plaintext in your local storage, where malicious scripts could theoretically read it.

### Layer-priority editor

BCE allows manual editing of an asset's priority — the value the game uses to decide what item shows over others. When you select an item, you should see either:

- a number field and a validate button at the top-right for clothing,
- a white box at bottom-left for restraints, which when clicked will open up the same UI.

This allow manually overriding the assets' relative positioning, giving better flexibility when doing outfits, or slapping restraints. Note that there's no way to reset the priority to its default value, so you have to take it off and apply the asset again to revert a change.

### Expanded wardrobe slots

Double your wardrobe size to 48 slots at the press of a button. **Warning**: you will lose outfits 25-48, if you ever log in without the setting enabled.

### Customizing expressions

BCE has an expression animator that replaces the game's default animator. It uses both the arousal meter, and messages posted in chat.

#### Arousal expressions

Arousal-based expressions are stored in the `ArousalExpressionStages` map, where you can customize the limit above which the specific variant of the expression will apply. The map is keyed by components name (so `Blush`, `Eyebrows`, `Fluids` for drool and tears, `Eyes` and `Eyes2` for left and right eye respectively, and `Mouth`), and have an array of (Expression, Limit) tuples. `Expression` is the expression to use for that component when arousal gets over `Limit`.

Note that, contrary to the default animator, setting anything other than the default expression for a component will preserve it. Only the basic, "after reset" expressions, will be animated. You can use this to prevent a given component from changing depending on arousal.

#### Chat expressions

You can setup a trigger for a specific chat message (/me or /action, or the game's own messages) to fire an "Event", and cause the associated expression to start.

Triggers for these animations are stored in `bce_ChatTriggers`, where `Trigger` is a regular expression matching the visible text in chat and `Event` is the key of the animation to run in the `bce_EventExpressions` map.

Event-based animations are stored in `bce_EventExpressions` and keyed by type. Here...

- `Duration` is the overall duration of the total duration of the animation, after which it ends. The summed durations inside each expression component should total this amount. Given in milliseconds. A negative duration persists until reset, or overwrite by a higher priority negative duration expression.
- `Priority` is the priority of this animation. Lower priority animations get cancelled by higher priority ones.
- `Expression` is the map of components that take part in this expression.

Inside the `Expression` map above each of the components has an array of what we'll call 'steps'. Steps support three different formats and are applied in order:

- `{ Expression: "HalfOpen", Duration: 1000 }`: set this component's expression to HalfOpen for 1 second
- `{ ExpressionModifier: 2, Duration: 1500 }`: set this component's intensity up by 2 for 1.5 seconds (only works for Blush)
- `{ Skip: true, Duration: 1000 }`: don't do anything with this component for 1 second. This is useful for delaying changes, for example blushing only one second after a kiss.

#### Expression cheatsheet

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
  Eyes2: [
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
