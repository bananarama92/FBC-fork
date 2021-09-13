# BCE

This script offers better automatic face expression changes based on events in the club, such as arousal level and activities that show up in chat, both automatic and manual. Manual overrides are respected and retained, unless the manual override corresponds to the blank face.

## How to install

1. Disable "Items can affect your facial expression" in General settings and "Affect your facial expressions" in Arousal settings
2. Install Tampermonkey (Chrome) or Greasemonkey (Firefox)
3. Navigate to https://gitlab.com/Sidiousious/bce/-/raw/main/bce.user.js and install via the respective extension from step 2.

## Automatic relogin

BCE can automatically enter your password, when you lose connection to the game. After login, open the browser console (usually F12) and enter `_updatePasswordForReconnect('ReplaceThisWithYourPassword')` to save it. This only needs to be done once, unless you delete your browser data. **Warning**: this does store your password in plaintext in your local storage, where malicious scripts could theoretically read it.

## Customizing expressions

Arousal-based expressions are stored in the `faces` map, where you can customize the limit above which the specific variant of the expression will apply. The list of components here is `Blush`, `Eyebrows`, `Fluids` for drool and tears, `Eyes` and `Eyes2` for left and right eye respectively, and `Mouth`.

Event-based animations are stored in `_EventExpressions` and keyed by type. Here...

- `Duration` is the overall duration of the total duration of the animation, after which it ends. The summed durations inside each expression component should total this amount. Given in milliseconds.
- `Priority` is the priority of this animation. Lower priority animations get cancelled by higher priority ones.
- `Expression` is the map of components that take part in this expression.

Inside the `Expression` map above each of the components has an array of what we'll call 'steps'. Steps support three different formats and are applied in order:

- `{ Expression: "HalfOpen", Duration: 1000 }`: set this component's expression to HalfOpen for 1 second
- `{ ExpressionModifier: 2, Duration: 1500 }`: set this component's intensity up by 2 for 1.5 seconds (only works for Blush)
- `{ Skip: true, Duration: 1000 }`: don't do anything with this component for 1 second. This is useful for delaying changes, for example blushing only one second after a kiss.

Triggers for these animations are stored in `_ChatTriggers`, where `Trigger` is a regular expression matching the visible text in chat and `Event` is the key of the animation in the `_EventExpressions` map.