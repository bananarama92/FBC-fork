# For Better-ish Club

## Unofficial fork of Sid's For Better Club v5.8.

This is a userscript meant for enhancing the Bondage Club game.

## Contributing

Merge requests via gitlab are welcome. For larger changes, please discuss it in the Discord or via issues first to make sure the change is fitting for the script. Translations for languages supproted by the club itself can be contributed in the `displayText` function following the existing pattern. Search for `displayText` in the script to find all the translatable strings.

## Installation
* Install the [FUSAM](https://sidiousious.gitlab.io/bc-addon-loader/) BC Addon Manager, install the Tampermonkey browser addon and then click on [loader.user.js](https://github.com/bananarama92/FBC-fork/raw/main/loader.user.js)
* Or install the [FUSAM](https://sidiousious.gitlab.io/bc-addon-loader/) BC Addon Manager, followed by assigning (and activating) the following link to a bookmark:
```js
javascript:(()=>{fetch(`https://bananarama92.github.io/FBC-fork/loader.user.js?_=${Date.now()}`).then(r=>r.text()).then(r=>eval(r));})();
```
