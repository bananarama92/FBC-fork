// ==UserScript==
// @name         FBC-ish - For Better-ish Club
// @namespace    FBC-ish
// @version      5.8
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @run-at       document-end
// @grant        none
// @license      GPL-3.0
// ==/UserScript==

/**
 * @param {() => boolean} predicate
 */
async function waitFor(predicate) {
    while (!predicate()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return true;
}

waitFor(() => (typeof FUSAM === "object" && FUSAM?.present)).then(() => {
    const n = document.createElement("script");
    n.language = "JavaScript";
    n.crossorigin = "anonymous";
    n.src = `https://bananarama92.github.io/FBC-fork/bce.user.js?_=${Date.now()}`;
    document.head.appendChild(n);
});
