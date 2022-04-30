// ==UserScript==
// @name Bondage Club Enhancements
// @namespace https://www.bondageprojects.com/
// @version 3.1.6
// @description enhancements for the bondage club
// @author Sidious
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match http://localhost:*/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @run-at document-end
// ==/UserScript==
// @ts-check
// eslint-disable-next-line
/// <reference path="./bce.d.ts" />
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-undef */
/* eslint-disable no-implicit-globals */

/**
 *     BCE
 *  Copyright (C) 2022  Sid
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const BCE_VERSION = "3.1.6";
const settingsVersion = 34;

const bceChangelog = `${BCE_VERSION}
- more fixes towards automatic relogin when connection gets rate limited

3.1.5
- dynamically position IM button (further out of the way in main chatroom view)

3.1.4
- fixes towards automatic relogin when connection gets rate limited
- longer handgag
- option for handgagging
- don't reset face on login

3.1.3
- update discord link to https://discord.gg/SHJMjEh9VH

3.1.2
- update bcx to 0.8.2

3.1.1
- R79 hotfix compatibility...

3.1.0
- R79 compatibility

3.0.8
- fix error in searching IM list, when you have friends whose names you do not know
- fix IM search not repopulating list when erasing characters
- sort IM list more often at opportune moments, such as when you click on a friend
- IM metadata no longer shown in popup notifications

3.0.7
- sort IMs by recent activity
- fix timestamps on IMs after reloading page

3.0.6
- hide beeps without messages in IM

3.0.5
- R79Beta3 compatibility

3.0.4
- fix error logs caused by an interaction between IM and BCX's version beeps

3.0.3
- show sent normal beeps in IM
- fix settings label (not BcUtil compatible anymore since 3.0)

3.0.2
- sort IM list by availability when opening IM
- style offline contacts less prominently
- remove offline contacts without history from the list
- fix loading history

3.0.1
- fix IM error when history contains links

3.0.0
- BREAKING CHANGE: instant messenger now uses normal beeps instead of BcUtil-compatible beeps
	- This means you can now use the instant messenger as a full replacement for beeps with all your friends, whether they use BCE or not
- updated Chinese translation

2.12
- add profile saving and viewing past profiles
- add ability to save notes in profiles

2.11
- add support for syncing buttplug.io-compatible vibrators

2.10
- hand clamp gags you for 15 seconds
- add option to allow leashing without a leash (roleplay carrying etc.)
`;

/*
 * Bondage Club Mod Development Kit
 * For more info see: https://github.com/Jomshir98/bondage-club-mod-sdk
 */
/** @type {import('./types/bcModSdk').ModSDKGlobalAPI} */
// eslint-disable-next-line capitalized-comments, multiline-comment-style
// prettier-ignore
// @ts-ignore
// eslint-disable-next-line
const BCE_BC_MOD_SDK=function(){"use strict";const o="1.0.2";function e(o){alert("Mod ERROR:\n"+o);const e=new Error(o);throw console.error(e),e}const t=new TextEncoder;function n(o){return!!o&&"object"==typeof o&&!Array.isArray(o)}function r(o){const e=new Set;return o.filter((o=>!e.has(o)&&e.add(o)))}const a=new Map,i=new Set;function d(o){i.has(o)||(i.add(o),console.warn(o))}function c(o,e){if(0===e.size)return o;let t=o.toString().replaceAll("\r\n","\n");for(const[n,r]of e.entries())t.includes(n)||d(`ModSDK: Patching ${o.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}function s(o){const e=[],t=new Map,n=new Set;for(const r of u.values()){const a=r.patching.get(o.name);if(a){e.push(...a.hooks);for(const[e,i]of a.patches.entries())t.has(e)&&t.get(e)!==i&&d(`ModSDK: Mod '${r.name}' is patching function ${o.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${e}\nPatch1:\n${t.get(e)||""}\nPatch2:\n${i}`),t.set(e,i),n.add(r.name)}}return e.sort(((o,e)=>e.priority-o.priority)),{hooks:e,patches:t,patchesSources:n,final:c(o.original,t)}}function l(o,e=!1){let r=a.get(o);if(r)e&&(r.precomputed=s(r));else{let e=window;const i=o.split(".");for(let t=0;t<i.length-1;t++)if(e=e[i[t]],!n(e))throw new Error(`ModSDK: Function ${o} to be patched not found; ${i.slice(0,t+1).join(".")} is not object`);const d=e[i[i.length-1]];if("function"!=typeof d)throw new Error(`ModSDK: Function ${o} to be patched not found`);const c=function(o){let e=-1;for(const n of t.encode(o)){let o=255&(e^n);for(let e=0;e<8;e++)o=1&o?-306674912^o>>>1:o>>>1;e=e>>>8^o}return((-1^e)>>>0).toString(16).padStart(8,"0").toUpperCase()}(d.toString().replaceAll("\r\n","\n")),l={name:o,original:d,originalHash:c};r=Object.assign(Object.assign({},l),{precomputed:s(l)}),a.set(o,r),e[i[i.length-1]]=function(o){return function(...e){const t=o.precomputed,n=t.hooks,r=t.final;let a=0;const i=d=>{var c,s,l,f;if(a<n.length){const e=n[a];a++;const t=null===(s=(c=w.errorReporterHooks).hookEnter)||void 0===s?void 0:s.call(c,o.name,e.mod),r=e.hook(d,i);return null==t||t(),r}{const n=null===(f=(l=w.errorReporterHooks).hookChainExit)||void 0===f?void 0:f.call(l,o.name,t.patchesSources),a=r.apply(this,e);return null==n||n(),a}};return i(e)}}(r)}return r}function f(){const o=new Set;for(const e of u.values())for(const t of e.patching.keys())o.add(t);for(const e of a.keys())o.add(e);for(const e of o)l(e,!0)}function p(){const o=new Map;for(const[e,t]of a)o.set(e,{name:e,originalHash:t.originalHash,hookedByMods:r(t.precomputed.hooks.map((o=>o.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return o}const u=new Map;function h(o){u.get(o.name)!==o&&e(`Failed to unload mod '${o.name}': Not registered`),u.delete(o.name),o.loaded=!1}function g(o,t,r){"string"==typeof o&&o||e("Failed to register mod: Expected non-empty name string, got "+typeof o),"string"!=typeof t&&e(`Failed to register mod '${o}': Expected version string, got ${typeof t}`),r=!0===r;const a=u.get(o);a&&(a.allowReplace&&r||e(`Refusing to load mod '${o}': it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),h(a));const i=t=>{"string"==typeof t&&t||e(`Mod '${o}' failed to patch a function: Expected function name string, got ${typeof t}`);let n=c.patching.get(t);return n||(n={hooks:[],patches:new Map},c.patching.set(t,n)),n},d={unload:()=>h(c),hookFunction:(t,n,r)=>{c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`);const a=i(t);"number"!=typeof n&&e(`Mod '${o}' failed to hook function '${t}': Expected priority number, got ${typeof n}`),"function"!=typeof r&&e(`Mod '${o}' failed to hook function '${t}': Expected hook function, got ${typeof r}`);const d={mod:c.name,priority:n,hook:r};return a.hooks.push(d),f(),()=>{const o=a.hooks.indexOf(d);o>=0&&(a.hooks.splice(o,1),f())}},patchFunction:(t,r)=>{c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`);const a=i(t);n(r)||e(`Mod '${o}' failed to patch function '${t}': Expected patches object, got ${typeof r}`);for(const[n,i]of Object.entries(r))"string"==typeof i?a.patches.set(n,i):null===i?a.patches.delete(n):e(`Mod '${o}' failed to patch function '${t}': Invalid format of patch '${n}'`);f()},removePatches:o=>{c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`);i(o).patches.clear(),f()},callOriginal:(t,n,r)=>(c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`),"string"==typeof t&&t||e(`Mod '${o}' failed to call a function: Expected function name string, got ${typeof t}`),Array.isArray(n)||e(`Mod '${o}' failed to call a function: Expected args array, got ${typeof n}`),function(o,e,t=window){return l(o).original.apply(t,e)}(t,n,r)),getOriginalHash:t=>("string"==typeof t&&t||e(`Mod '${o}' failed to get hash: Expected function name string, got ${typeof t}`),l(t).originalHash)},c={name:o,version:t,allowReplace:r,api:d,loaded:!0,patching:new Map};return u.set(o,c),Object.freeze(d)}function m(){const o=[];for(const e of u.values())o.push({name:e.name,version:e.version});return o}let w;const y=void 0===window.bcModSdk?window.bcModSdk=function(){const e={version:o,apiVersion:1,registerMod:g,getModsInfo:m,getPatchingInfo:p,errorReporterHooks:Object.seal({hookEnter:null,hookChainExit:null})};return w=e,Object.freeze(e)}():(n(window.bcModSdk)||e("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&e(`Failed to init Mod SDK: Different version already loaded ('1.0.2' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==o&&alert(`Mod SDK warning: Loading different but compatible versions ('1.0.2' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk);return"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y),y}();

async function BondageClubEnhancements() {
	"use strict";

	const SUPPORTED_GAME_VERSIONS = ["R79"];
	const CAPABILITIES = ["clubslave"];

	const w = window;

	if (w.BCE_VERSION) {
		console.warn("BCE already loaded. Skipping load.");
		return;
	}

	const SDK = BCE_BC_MOD_SDK.registerMod("BCE", BCE_VERSION, false);

	w.BCE_VERSION = BCE_VERSION;

	const DISCORD_INVITE_URL = "https://discord.gg/SHJMjEh9VH";

	const BCX_DEVEL_SOURCE =
			"https://jomshir98.github.io/bondage-club-extended/devel/bcx.js",
		BCX_SOURCE =
			"https://raw.githubusercontent.com/Jomshir98/bondage-club-extended/d919ff7dadcdf66f7e324dfc5f611b6dbf566020/bcx.js";

	const BCE_COLOR_ADJUSTMENTS_CLASS_NAME = "bce-colors",
		BCE_LICENSE = "https://gitlab.com/Sidiousious/bce/-/blob/main/LICENSE",
		BCE_MAX_AROUSAL = 99.6,
		BCE_MSG = "BCEMsg",
		BCX_ORIGINAL_MESSAGE = "BCX_ORIGINAL_MESSAGE",
		BEEP_CLICK_ACTIONS = Object.freeze({
			/** @type {"FriendList"} */
			FriendList: "FriendList",
		}),
		DARK_INPUT_CLASS = "bce-dark-input",
		DEFAULT_WARDROBE_SIZE = 24,
		EXPANDED_WARDROBE_SIZE = 96,
		GAGBYPASSINDICATOR = "\uf123",
		GLASSES_BLIND_CLASS = "bce-blind",
		GLASSES_BLUR_TARGET = w.MainCanvas,
		HIDDEN = "Hidden",
		INPUT_WARN_CLASS = "bce-input-warn",
		MESSAGE_TYPES = Object.freeze({
			Activity: "Activity",
			ArousalSync: "ArousalSync",
			Hello: "Hello",
		}),
		TIMER_INPUT_ID = "bce_timerInput",
		WHISPER_CLASS = "bce-whisper-input";

	const EMBED_TYPE = Object.freeze({
		/** @type {"img"} */
		Image: "img",
		/** @type {""} */
		None: "",
	});

	/** @type {"none" | "external" | "stable" | "devel"} */
	let bcxType = "none";

	if (typeof ChatRoomCharacter === "undefined") {
		console.warn("Bondage Club not detected. Skipping BCE initialization.");
		return;
	}

	/** @type {Map<number, BCECharacterState>} */
	const characterStates = new Map();

	/** @type {ToySyncState} */
	const toySyncState = {
		deviceSettings: new Map(),
	};

	/** @type {Readonly<{Top: 11; OverrideBehaviour: 10; ModifyBehaviourHigh: 6; ModifyBehaviourMedium: 5; ModifyBehaviourLow: 4; AddBehaviour: 3; Observe: 0}>} */
	const HOOK_PRIORITIES = {
		Top: 11,
		OverrideBehaviour: 10,
		ModifyBehaviourHigh: 6,
		ModifyBehaviourMedium: 5,
		ModifyBehaviourLow: 4,
		AddBehaviour: 3,
		Observe: 0,
	};

	/**
	 * @type {Settings}
	 */
	let bceSettings = {};

	/**
	 * @type {Readonly<DefaultSettings>}
	 */
	const defaultSettings = {
		expressions: {
			label: "Automatic Arousal Expressions (Replaces Vanilla)",
			sideEffects: (newValue) => {
				if (newValue) {
					// Disable conflicting settings
					Player.ArousalSettings.AffectExpression = false;
				}
				bceLog("expressions", newValue);
			},
			value: false,
			category: "activities",
		},
		activityExpressions: {
			label: "Activity Expressions",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					// Disable conflicting settings
					Player.ArousalSettings.AffectExpression = false;
				}
				bceLog("activityExpressions", newValue);
			},
			category: "activities",
		},
		alternateArousal: {
			label:
				"Alternate Arousal (Replaces Vanilla, requires hybrid/locked arousal meter)",
			value: false,
			sideEffects: (newValue) => {
				sendHello();
				Player.BCEArousal = !!newValue;
				Player.BCEArousalProgress = Math.min(
					BCE_MAX_AROUSAL,
					Player.ArousalSettings.Progress
				);
				bceLog("alternateArousal", newValue);
			},
			category: "activities",
		},
		stutters: {
			label: "Alternative speech stutter",
			value: false,
			sideEffects: (newValue) => {
				bceLog("stutters", newValue);
			},
			category: "activities",
		},
		layeringMenu: {
			label: "Enable layering menus",
			value: false,
			sideEffects: (newValue) => {
				bceLog("layeringMenu", newValue);
			},
			category: "appearance",
		},
		extendedWardrobe: {
			label: "Extended wardrobe slots (96)",
			value: false,
			sideEffects: (newValue) => {
				bceLog("extendedWardrobe", newValue);
				if (newValue) {
					WardrobeSize = EXPANDED_WARDROBE_SIZE;
					loadExtendedWardrobe(Player.Wardrobe);
					// Call compress wardrobe to save existing outfits, if another addon has extended the wardrobe
					CharacterCompressWardrobe(Player.Wardrobe);
				} else {
					// Restore original size
					WardrobeSize = DEFAULT_WARDROBE_SIZE;
					WardrobeFixLength();
					CharacterAppearanceWardrobeOffset = 0;
				}
			},
			category: "appearance",
		},
		privateWardrobe: {
			label: "Replace wardrobe list with character previews",
			value: false,
			sideEffects: (newValue) => {
				bceLog("privateWardrobe", newValue);
			},
			category: "appearance",
		},
		automateCacheClear: {
			label: "Clear Drawing Cache Hourly",
			value: false,
			sideEffects: (newValue) => {
				bceLog("automateCacheClear", newValue);
			},
			category: "performance",
		},
		instantMessenger: {
			label: "Instant messenger",
			value: false,
			sideEffects: (newValue) => {
				bceLog("instantMessenger", newValue);
			},
			category: "chat",
		},
		augmentChat: {
			label: "Chat Links and Embeds",
			value: false,
			sideEffects: (newValue) => {
				bceLog("augmentChat", newValue);
			},
			category: "chat",
		},
		ctrlEnterOoc: {
			label: "Use Ctrl+Enter to OOC",
			value: true,
			sideEffects: (newValue) => {
				bceLog("ctrlEnterOoc", newValue);
			},
			category: "chat",
		},
		whisperInput: {
			label: "Use italics for input when whispering",
			value: true,
			sideEffects: (newValue) => {
				bceLog("whisperInput", newValue);
			},
			category: "chat",
		},
		chatColors: {
			label: "Improve colors for readability",
			value: true,
			sideEffects: (newValue) => {
				if (newValue) {
					document.body.classList.add(BCE_COLOR_ADJUSTMENTS_CLASS_NAME);
				} else {
					document.body.classList.remove(BCE_COLOR_ADJUSTMENTS_CLASS_NAME);
				}
				bceLog("chatColors", newValue);
			},
			category: "chat",
		},
		friendPresenceNotifications: {
			label: "Show friend presence notifications",
			value: false,
			sideEffects: (newValue) => {
				bceLog("friendPresenceNotifications", newValue);
			},
			category: "chat",
		},
		friendOfflineNotifications: {
			label: "Show friends going offline too (requires friend presence)",
			value: false,
			sideEffects: (newValue) => {
				bceLog("friendOfflineNotifications", newValue);
			},
			category: "chat",
		},
		nicknames: {
			label: "Show nicknames",
			value: true,
			sideEffects: (newValue) => {
				bceLog("nicknames", newValue);
				if (!newValue) {
					bceSettings.nickname = "";
					for (const c of Character) {
						if (c.BCEOriginalName) {
							if (c.IsPlayer()) {
								setOwnNickname(c.BCEOriginalName);
							} else {
								c.Name = c.BCEOriginalName;
							}
						}
					}
					sendHello();
				} else if (isString(bceSettings.nickname)) {
					setOwnNickname(bceSettings.nickname);
					sendHello(null, true);
				}
			},
			category: "chat",
		},
		pastProfiles: {
			label: "Save & browse seen profiles (requires refresh)",
			value: false,
			sideEffects: (newValue) => {
				bceLog("pastProfiles", newValue);
			},
			category: "chat",
		},
		gagspeak: {
			label: "Understand All Gagged and when Deafened",
			value: false,
			sideEffects: (newValue) => {
				bceLog("gagspeak", newValue);
			},
			category: "cheats",
		},
		lockpick: {
			label: "Reveal Lockpicking Order Based on Skill",
			value: false,
			sideEffects: (newValue) => {
				bceLog("lockpick", newValue);
			},
			category: "cheats",
		},
		allowLayeringWhileBound: {
			label: "Allow layering menus while bound",
			value: false,
			sideEffects: (newValue) => {
				bceLog("allowLayeringWhileBound", newValue);
			},
			category: "cheats",
		},
		autoStruggle: {
			label: "Make automatic progress while struggling",
			value: false,
			sideEffects: (newValue) => {
				bceLog("autoStruggle", newValue);
			},
			category: "cheats",
		},
		bcx: {
			label: "Load BCX by Jomshir98 (requires refresh - no auto-update)",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					bceSettings.bcxDevel = false;
				}
				bceLog("bcx", newValue);
			},
			category: "addons",
		},
		bcxDevel: {
			label:
				"Load BCX beta (requires refresh - auto-updates, compatibility not guaranteed)",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					bceSettings.bcx = false;
				}
				bceLog("bcxDevel", newValue);
			},
			category: "addons",
		},
		toySync: {
			label: "Enable buttplug.io (requires refresh)",
			value: false,
			sideEffects: (newValue) => {
				bceLog("toySync", newValue);
			},
			category: "buttplug",
		},
		antiAntiGarble: {
			label: "Limited gag anti-cheat: cloth-gag equivalent garbling",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					bceSettings.antiAntiGarbleStrong = false;
					bceSettings.antiAntiGarbleExtra = false;
				}
				bceLog("antiAntiGarble", newValue);
			},
			category: "immersion",
		},
		antiAntiGarbleStrong: {
			label: "Full gag anti-cheat: use equipped gags to determine garbling",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					bceSettings.antiAntiGarble = false;
					bceSettings.antiAntiGarbleExtra = false;
				}
				bceLog("antiAntiGarbleStrong", newValue);
			},
			category: "immersion",
		},
		antiAntiGarbleExtra: {
			label:
				"Extra gag anti-cheat: even more garbling for the most extreme gags",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					bceSettings.antiAntiGarble = false;
					bceSettings.antiAntiGarbleStrong = false;
				}
				bceLog("antiAntiGarbleExtra", newValue);
			},
			category: "immersion",
		},
		blindWithoutGlasses: {
			label: "Require glasses to see",
			value: false,
			sideEffects: (newValue) => {
				if (!newValue) {
					GLASSES_BLUR_TARGET.classList.remove(GLASSES_BLIND_CLASS);
				}
				bceLog("blindWithoutGlasses", newValue);
			},
			category: "immersion",
		},
		leashAlways: {
			label:
				"Allow leashing without wearing a leashable item (requires leasher to have BCE too)",
			value: false,
			sideEffects: (newValue) => {
				bceLog("leashAlways", newValue);
				if (newValue) {
					enableLeashing();
				} else {
					disableLeashing();
				}
			},
			category: "immersion",
		},
		handgag: {
			label: "Clamping hand over mouth affects speech",
			value: true,
			sideEffects: (newValue) => {
				bceLog("handgag", newValue);
			},
			category: "immersion",
		},
		checkUpdates: {
			label: "Check for updates",
			sideEffects: (newValue) => {
				bceLog("checkUpdates", newValue);
			},
			value: true,
			category: "misc",
		},
		relogin: {
			label: "Automatic Relogin on Disconnect",
			sideEffects: (newValue) => {
				bceLog("relogin", newValue);
			},
			value: true,
			category: "misc",
		},
		showQuickAntiGarble: {
			label: "Show gag cheat and anti-cheat options in chat",
			value: false,
			sideEffects: (newValue) => {
				bceLog("showQuickAntiGarble", newValue);
			},
			category: "misc",
		},
		ghostNewUsers: {
			label: "Automatically ghost+blocklist unnaturally new users",
			value: false,
			sideEffects: (newValue) => {
				bceLog("ghostNewUsers", newValue);
			},
			category: "misc",
		},
		accurateTimerLocks: {
			label: "Use accurate timer inputs",
			value: false,
			sideEffects: (newValue) => {
				bceLog("accurateTimerLocks", newValue);
			},
			category: "misc",
		},
		confirmLeave: {
			label: "Confirm leaving the game",
			value: true,
			sideEffects: (newValue) => {
				bceLog("confirmLeave", newValue);
			},
			category: "misc",
		},
		discreetMode: {
			label: "Discreet mode (disable drawing)",
			value: false,
			sideEffects: (newValue) => {
				bceLog("discreetMode", newValue);
				if (newValue) {
					/** @type {HTMLLinkElement} */
					(document.getElementById("favicon")).href =
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFFAADATTAuQQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAEklEQVQ4y2NgGAWjYBSMAggAAAQQAAGFP6pyAAAAAElFTkSuQmCC";
					document.title = "OnlineChat";
				}
			},
			category: "misc",
		},
		tabActivityWorkaround: {
			label: "Keep tab active (requires refresh)",
			value: true,
			sideEffects: (newValue) => {
				bceLog("tabActivityWorkaround", newValue);
			},
			category: "misc",
		},
		fpsCounter: {
			label: "Show FPS counter",
			value: false,
			sideEffects: (newValue) => {
				bceLog("fpsCounter", newValue);
			},
			category: "performance",
		},
		limitFPSInBackground: {
			label: "Limit FPS in background",
			value: false,
			sideEffects: (newValue) => {
				bceLog("limitFPSInBackground", newValue);
			},
			category: "performance",
		},
		limitFPSTo15: {
			label: "Limit FPS to ~15",
			value: false,
			sideEffects: (newValue) => {
				bceLog("limitFPSTo15", newValue);
				if (newValue) {
					bceSettings.limitFPSTo30 = false;
					bceSettings.limitFPSTo60 = false;
				}
			},
			category: "performance",
		},
		limitFPSTo30: {
			label: "Limit FPS to ~30",
			value: false,
			sideEffects: (newValue) => {
				bceLog("limitFPSTo30", newValue);
				if (newValue) {
					bceSettings.limitFPSTo15 = false;
					bceSettings.limitFPSTo60 = false;
				}
			},
			category: "performance",
		},
		limitFPSTo60: {
			label: "Limit FPS to ~60",
			value: false,
			sideEffects: (newValue) => {
				bceLog("limitFPSTo60", newValue);
				if (newValue) {
					bceSettings.limitFPSTo30 = false;
					bceSettings.limitFPSTo15 = false;
				}
			},
			category: "performance",
		},
		nickname: {
			label: "Nickname",
			value: "",
			sideEffects: (newValue) => {
				bceLog("nickname", newValue);
			},
			category: "hidden",
		},
		buttplugDevices: {
			label: "Buttplug Devices",
			value: "",
			sideEffects: (newValue) => {
				bceLog("buttplugDevices", newValue);
				// Don't handle empty string
				if (newValue === "") {
					return;
				}
				try {
					if (!isString(newValue)) {
						throw new Error("expected string for buttplugDevices");
					}
					/** @type {ToySetting[]} */
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const devices = JSON.parse(newValue);
					if (!Array.isArray(devices)) {
						throw new Error("expected array for devices");
					}
					for (const device of devices) {
						toySyncState.deviceSettings.set(device.Name, device);
					}
				} catch (ex) {
					bceError(ex);
				}
			},
			category: "hidden",
		},
	};

	/** @type {SocketEventListenerRegister} */
	const listeners = [];
	/** @type {(event: ServerSocketEvent, cb: SocketEventListener) => void} */
	function registerSocketListener(event, cb) {
		if (!listeners.some((l) => l[1] === cb)) {
			listeners.push([event, cb]);
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			ServerSocket.on(event, cb);
		}
	}

	function appendSocketListenersToInit() {
		SDK.hookFunction(
			"ServerInit",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				for (const [event, cb] of listeners) {
					ServerSocket.on(event, cb);
				}
				return ret;
			}
		);
	}

	function settingsLoaded() {
		return Object.keys(bceSettings).length > 0;
	}

	const bceSettingKey = () => `bce.settings.${Player?.AccountName}`;

	/**
	 * @type {() => Promise<Settings>}
	 */
	const bceLoadSettings = async () => {
		await waitFor(() => !!Player?.AccountName);
		const key = bceSettingKey();
		bceLog("loading settings", key);
		if (!settingsLoaded()) {
			/** @type {Settings} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let settings = JSON.parse(localStorage.getItem(key));

			/** @type {Settings} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const onlineSettings = JSON.parse(
				LZString.decompressFromBase64(Player.OnlineSettings.BCE) || null
			);
			if (
				onlineSettings?.version >= settings?.version ||
				(typeof settings?.version === "undefined" &&
					typeof onlineSettings?.version !== "undefined")
			) {
				settings = onlineSettings;
			}
			if (!settings) {
				bceLog("no settings", key);
				settings = {};
			}

			for (const setting in defaultSettings) {
				if (!Object.prototype.hasOwnProperty.call(defaultSettings, setting)) {
					continue;
				}
				if (!(setting in settings)) {
					if (setting === "activityExpressions" && "expressions" in settings) {
						settings[setting] = settings.expressions;
						continue;
					}
					settings[setting] = defaultSettings[setting].value;
				}
			}
			if (
				typeof settings.version === "undefined" ||
				settings.version < settingsVersion
			) {
				beepChangelog();
			}
			settings.version = settingsVersion;
			bceSettings = settings;
			return settings;
		}
		return bceSettings;
	};

	const bceSaveSettings = () => {
		if (toySyncState.deviceSettings.size > 0) {
			bceSettings.buttplugDevices = JSON.stringify(
				Array.from(toySyncState.deviceSettings.values())
			);
		}
		localStorage.setItem(bceSettingKey(), JSON.stringify(bceSettings));
		Player.OnlineSettings.BCE = LZString.compressToBase64(
			JSON.stringify(bceSettings)
		);
		ServerAccountUpdate.QueueData({
			OnlineSettings: Player.OnlineSettings,
		});
	};

	function postSettings() {
		bceLog("handling settings side effects");
		for (const [k, v] of Object.entries(bceSettings)) {
			if (k in defaultSettings) {
				// @ts-ignore
				defaultSettings[k].sideEffects(v);
			}
		}
		bceSaveSettings();

		// Polyfill old functions
		if (typeof Player.CanChange === "undefined") {
			Player.CanChange = Player.CanChangeOwnClothes;
		}
	}

	// ICONS
	const ICONS = Object.freeze({
		LAYERS:
			"data:image/png;base64,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",
		LOGO: "data:image/png;base64,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d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ZjI0Zjk4NjItYjMyMC00ZWZiLWIwOTEtZjIzYTQwYTYwNjAxIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhhMGY1NmRjLTljYmUtNDMzYS1iMzQ5LWEwOTJmNzczMjFmYiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQzZjM5ZWU5LWQxODEtNGE4NS04ZDg3LWFiNTcyYjYxNGMzNCIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2NDIxMjc4ODYyNDUzMTQiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4yMiIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIj4KICAgPGlwdGNFeHQ6TG9jYXRpb25DcmVhdGVkPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6TG9jYXRpb25DcmVhdGVkPgogICA8aXB0Y0V4dDpMb2NhdGlvblNob3duPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6TG9jYXRpb25TaG93bj4KICAgPGlwdGNFeHQ6QXJ0d29ya09yT2JqZWN0PgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6QXJ0d29ya09yT2JqZWN0PgogICA8aXB0Y0V4dDpSZWdpc3RyeUlkPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6UmVnaXN0cnlJZD4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2I4MGJiZmUtMDUzYi00OTU2LTk1ZjQtNzQxZjExNDY4OTJhIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTAxLTEzVDIxOjM4OjA2Ii8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPHBsdXM6SW1hZ2VTdXBwbGllcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlU3VwcGxpZXI+CiAgIDxwbHVzOkltYWdlQ3JlYXRvcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlQ3JlYXRvcj4KICAgPHBsdXM6Q29weXJpZ2h0T3duZXI+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpDb3B5cmlnaHRPd25lcj4KICAgPHBsdXM6TGljZW5zb3I+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpMaWNlbnNvcj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pmcw/BEAAAACYktHRAD/h4/MvwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YBDgImBvhP/sMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAV50lEQVRo3qXbeYxleXUf8M+977611u7qfZuZnl5mZxiWGQ/YDJjNHmJjTJxEcSQUOf8QW9ixUKLEUXAiWQrGiSI7kWJLJo4dgrETO8IQSARhWMaAGWDGs/dMd0/vXdW119vvkj/er16/qq7qGfAtlfSq7nbuued8z/d8f+dFRVEgR6GrL1UY07ZsUt2ylmkrZpRBgcirb7lUW1suVhbryURiZRV09RQiiUhJoSdRGp5bNWVFW0VFIlFSEomQFAqFTI5VbR2FvjUXHFa4YMGMVWPScKniNRkLibJrFvRFxuy0bEUuUlLVUFjTVUhM6MmNhbMiZVRdVBhXV1NVliCSDLzQk0osWtFVSHVcMqPunBWzalKZH3wr2WPSFa94Ra7qgKpZq8NrlZApNBQmNEAsFjkh8oqdJowbMyZSQpJLdbV0jFt02qRYrK8p13ZF2RX3yV+TccXI5yiETNkhey067aonZUpqGsq6WloolB2w4qJdquEKZUuOeNFlPV19hUJNSZLralq1pqJpFo0QDJGLFt3qkkMbzHg1M0f/s27wHrt0zLlsRduSjn54JFLfN6aNnRKFyJJlk3Z7XjJ8p2WxJNW2YtWqGbEVZWUtTSVdL4pdNmbyhzB28/5I3RGHZPrWLGrqSqUKibIdlj2LGdCxZK+7PG9RhFjJmJIk1bKkrSk1KbVoRk8TL7viiOe9dSRTfzhT1xGkEIuVNew2SOzBvkikL/es2DRSV+23yx2+rSaSqOqpDjy7qq+rY1pVS65nVddV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",
		MUTE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyEAYAAABOr1TyAAAImklEQVR4Xu2ca0wVRxSAF0UbtUYbQTRiYvmh1agVQgIIxvpsaq34wr5itD+0prGlicYm1h9Wm8bG1MRXtcVUjP4xClYttvWB1HoREwRsFDWBSwGVyCWKqdegCKdzmHtYdnbnzu69XHnu92O9uzNnzmPm7O7MoKb1Hr0e6PVAN/YAtBxk4LBh9NvuubO5JqyjFTI6VNcmrOWIj+dXFi7k56Qkfh4+nJ8jI/k5Ksrajvv3+XWPh59ra/m5oICfT5zg5+Ji6/o99uqECdz0/fv5mfq8/XPCM8R+eet2MjL49bFju+oIY67jKcPpmRt+5IgsALPLZ7tnuwEuxiIA/6YiAJ7NCIB3JwLQfAzhrePRtJSRBvBkPAJQG44AuP90n3WfBbhwFwF4ewyiCmBmpsquTjeGVAobU1JsrCwABRoC8NCD6A4O9b/qb9Xfrr8NQO37H6FTpoj2drmAcIVPnRIN3fLjln1b9uk9OtSOtyu/sbHxReMLgO/OI7IRlJ0te/Z1eICse0xCgqynVRQgdt3T8eUqWw5VaktMtJspQj7CjD1l1SoxEDs/QVipaBjN6LqHT/8duxl7ZAFas8ZpYEI0oiZPFgNRfhTpuv5XaV4xA5EFxvyskQUqRAHRFSsfg6jM6T73y/Yh5sDYHSmmgNitaJ378vNpZOytQbqPo51aQqnZmCkKfE9L+WeBGJAwp28L/At6+nQuKC+PBDqVE6Kh2uFiuX9ENWbN4v7JzTUFQCgfYED02SNPH0TTIpqQDvdHhytQ1xdhkzrNiK4OD4g5VGIAmSvtHbxiZSWVzprFmG0OBBxH7MnsjqWoYx4bgOgWcv9VVKhsVo4QLmjePC4oJ0eWoloD8UJjNPfXwpE+z8OWIio1uu996xQ2fz4fMTk5AY6QlSvJZaV9S8NLw80ObL6MsOu9gTA4p3RX6e7SXaK/dH+Kd2ymrLQ0qhiTFrM0pk2Pb/oSYXcrkYZbrYGx2embqhFNq65DbFZqx2LULunRjqJbRMXkx7hifO+iuuyl8pzh/4OF1iEAtuUh5pfBxggE4EU6on5ZPOdBADavY6wHeP0Cor/HTy1GALafZvwG4PoeUctVlSA5JJfa4U7S9SC9SE+VXLv3yX/UHj+Tf9t0A/8BofUBgGufInrzFIjnFYj3D/otU/Dw4sNLDi+RzwlF5iLy+zQNb9cBVI7qGR2ht6Nql/R22q5YvqQGEe07dMg0Iv0H5MoVMuTeJkQ+QmQKP+iHmB3980wE4J9MRB9hVxMQAHHOKG0A4twtVI/sILnUDo1s0oP0EgNIdjjXgNe4u4HxlegHl8thQMrLSbH65YhzdQ4UIroiq8Ygajm0wCSmltPnEXV9Kkf6kxySq5JAelJ9skNVT3b/URUiBqSszGFAdAHPJyLO1cmCLMhusyRLjqEVP5nEO2l3lt1ZZh5ZxeMRtR5UTuzpJFcmgfQSOwLZoW7ZugT5z6hPk/lTWkxZvMKQIVSRcmygilC9j5IR3cFLEhhsFSHDi7AVuwOInqqmbUb08htrEOdaUD2yh+RS6qJ2SQ/Si8qT3s5btq5h/SwbNKh1pFgHZOhQ8e0jWIVytyMAr15CVAs++v3oZYz32Zp4rDvOHedcC6pHcmQPd/E66Ul6O2/ZSUAGD6aASL/U+RekPmf1PBPRtH4rEFPms33hUR2iaYXHEE1zXXEVuNimnKLhRZFFbHNPyrsMNi+QPBHRtPhqRNNeiUNsN2Mq+KwIYe2ORli7NxBNu5zDOKNpcbVxnji2SSg5KTkxOZG1m4Zo2msRSODtUs3GSYim9b+BiPLazHH5f8tyu1sf6r7NAO3VU3qaHLsPdcWXOm0s0zTvG95x3nHB95SeKsEb5R3hHSFar/uX7igCcvMmFXywF+mp7gze7ocRD4c9HCbKoc8K/boiIGdYduVHbhQSvGI9VcLZXxDRetrK2ua67BlC18W3j4ZrSE97AgRu77OZDLZeKPrR6F/bI4QKHm9dcnK73Plu8wd/u3f8J0kIewuqQ4IXX1iNaFrZt0jw8uxKcH/OWCuWzs6W1rc3QhYssI5w4D1HVXNtFaL3rBlfMNhs8l9jEFVtAJp72/IWossZOB8BUE2GqluwV0L0G/+dynYp42ERFlVAjBUfPKAGTi1msNnbUB0ZDQy2m73fe4h5yNNcU74rnx0AlBoOvoPIPzyXrEdCpbUu99d7jPuiHjW+uQZ9F4opJHYDInum1G1CQmfg48UIQGYtg62jWPc4tjHyLGK+/1keAnB94/Wvr28MnZ4kue4ZYn+fVjsFZM6cl53CyODT2xCAN7ci8gB9+DsCcPsqEvpAUAvWHWbuXFnHDzogxpFSUkIK0ORce5vO1/ABxElCajd6YfSi6EUAyzczvpEH6IdMBKBqNdLeWgL8tJrBFvCMASkpUWUguy8HDsvpilR+jARvMAVClqL29kXY35OkI3p7t1MQgE0DGAPlKSx4DbkEslf2WttBAYnzTfvpDqjyIIGbfQ8Q/S+dth5BAGiTs13JtHS6IYkxFcDuApdKvvUKINkfH68KhDHTOOz//oobBaeniz0lI5rRlf8MQYiMdWqiQKxbZzcQIQ+IsYFp02SppjodUfW/znOfvmdk9vDr06c7DcRLC4ioGFf44kXRIHrIwo4WOs3RnIQAWO9mp5Fw7lzIHBps9rLbM3g7iWzpBw/5WvnjQuTlxee/RASgaA+iWslMYPth8PDzYResQ4Otbzcg1oacPCkL0IrhCMDfRxEASnX0VtXwAWIRON+Ie+p9yg4A+lCj191LqxH1azLXKytLZV+w/uuk9enPpQ8e9J+r5T1Y3EQRmBzauDZpkioQoUpZnfy/1khJ4Y5NTTWmPPqvNUaO5Nf1TQLGHldfz3/X1PAz/Rcb4n+tQb87aX/temqF+/bjjxrFdQ9n3/bGXC/73fVs7dW41wM92QP/AwiYoBCInG1iAAAAAElFTkSuQmCC",
		PAINTBRUSH:
			"data:image/png;base64,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",
		TIGHTEN:
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwEAYAAAAHkiXEAAACfklEQVR4Xu2bsU4CQRCGT7ERjbFQMTH4AhpjYeEbGC1MbKww4Q2sodAGW2PjA9jb2RkKjMHeBhsrIxRQKQnGgGDi3MRIwNvBndtdd2gW7ib/zHz/7t5xgSCQlxD4JnBwC+8nV4VKLARSKUhzeQljrwdjPh9Len+T7O9D7/X6T/BowMsLHJ+b85cRS+fLyyCLgBH4sPHsjKUMf0WvrgbP+GEGvL9D/NKjv8y0dH54SAOPhjxsaUnvr8j0NPTebNIMKO/5y0xr59SZL+C14g+CiwvazNec3gG5cd4a19d59UV9CIFEAk50OrICfp8kTCtgZQXSohFRM7XRiIr4r+eZDPj4oAGbmqLFS7QigddXN7YgfCal2JY7YeWy3QakF39eq66v4XM2C+PMjDusB1Z6fk4zYOIknoaT4RYZ9Szq7Q3qWXiOpy7tWTIZmgEIZGxHeylfgolNWj3VKk8dsatWKrTG0QhthRK3Qsx/dKStArNC29ujGaDLiKitpv98qWSWF1v209O/GUEFSY1vt6G+tTU2BHYI39/baUQuZwcf9irSaUhRLNphxPExe8t2J8CZh1sAdeugxt/dAY+NDbu5xF4d7r2lWc0rI7ytLRRib8nNhPhoAGd29+lvhrRatnJgehinvd3w7km7rnFBVwwwDoqrAFcMmOQCYFpXDDDsgCsGGMbEl94VA2QL4psDSspigBImviAxgI+t38pyDTDsvxggBhgmYDi9rAAxQIlAUinKwSBXVoCDaNVKdsUA+R6g5idblBjAhlZNWAxQ4yRRVAJyDaAS0xw/oVmPSW7sJhSeD8du34h/COk/vstUkC+ytRp02g3Bjjrij4Pt4/YJN03BbYn5mYwAAAAASUVORK5CYII=",
		USER: "data:image/png;base64,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",
	});

	const DEVS = [23476];

	/**
	 * @param {string} original - The English message
	 * @param {Record<string, string>} [replacements] - The replacements
	 * @returns {string} - The translated message
	 */
	function displayText(original, replacements = {}) {
		/** @type {Readonly<Record<string, Record<string, string>>>} */
		const translations = Object.freeze({
			CN: {
				"Automatic Arousal Expressions (Replaces Vanilla)":
					"自动欲望表情 (替换原版)",
				"Activity Expressions": "活动表示",
				"Alternate Arousal (Replaces Vanilla, requires hybrid/locked arousal meter)":
					"另一种欲望 (替换原版, 需要混合或锁定欲望条)",
				"Alternative speech stutter": "另一种言语不清",
				"Enable layering menus": "开启服装分层选项",
				"Extended wardrobe slots (96)": "扩展衣柜保存槽 (96个)",
				"Replace wardrobe list with character previews":
					"使用角色预览替换衣柜保存列表",
				"Clear Drawing Cache Hourly": "每小时清除绘图缓存",
				"Instant messenger": "即时通讯",
				"Chat Links and Embeds": "聊天链接和嵌入",
				"Use Ctrl+Enter to OOC": "使用Ctrl+Enter进行OOC发言",
				"Use italics for input when whispering": "悄悄话使用斜体字",
				"Improve colors for readability": "改善颜色以提高可读性",
				"Show friend presence notifications": "显示好友在线通知",
				"Show friends going offline too (requires friend presence)":
					"显示朋友离线通知 (需要启用好友在线通知)",
				"Understand All Gagged and when Deafened":
					"在被堵住嘴和被堵住耳朵时可以听懂所有发言",
				"Reveal Lockpicking Order Based on Skill": "根据技能显示撬锁/开锁顺序",
				"Allow layering menus while bound": "允许在捆绑时用分层菜单",
				"Load BCX by Jomshir98 (requires refresh - no auto-update)":
					"加载 BCX by Jomshir98 (需要刷新 - 无自动更新)",
				"Load BCX beta (requires refresh - auto-updates, compatibility not guaranteed)":
					"加载 BCX beta 测试版 (需要刷新 - 自动升级, 不保证兼容性)",
				"Limited gag anti-cheat: cloth-gag equivalent garbling":
					"有限的堵嘴反作弊: 和布堵嘴相同的乱码",
				"Full gag anti-cheat: use equipped gags to determine garbling":
					"完整的堵嘴反作弊: 使用当前装备的堵嘴来确定乱码",
				"Extra gag anti-cheat: even more garbling for the most extreme gags":
					"扩展的堵嘴反作弊: 对于使用最极端的堵嘴更加混乱",
				"Require glasses to see": "需要眼镜才能看清",
				"Check for updates": "检查更新",
				"Automatic Relogin on Disconnect": "断线后自动重连",
				"Show gag cheat and anti-cheat options in chat":
					"在聊天室里显示堵嘴作弊和反作弊选项",
				"Automatically ghost+blocklist unnaturally new users":
					"自动对不自然的用户无视并添加黑名单",
				"Use accurate timer inputs": "使用准确的计时器输入",
				"Confirm leaving the game": "离开游戏前需要确认",
				"Discreet mode (disable drawing)": "谨慎模式 (禁用绘图)",
				"Keep tab active (requires refresh)":
					"保持标签页处于活动状态 (需要刷新)",
				"Show FPS counter": "显示 FPS 计数器",
				"Limit FPS in background": "在后台时限制FPS",
				"Limit FPS to ~15": "限制 FPS 最高为 ~15",
				"Limit FPS to ~30": "限制 FPS 最高为 ~30",
				"Limit FPS to ~60": "限制 FPS 最高为 ~60",
				"Make automatic progress while struggling": "在挣扎时自动增加进度",
				"Allow leashing without wearing a leashable item (requires leasher to have BCE too)":
					"允许在不佩戴牵引绳的情况下也可以进行牵引（需要牵引者也安装有BCE）",
				"Enable buttplug.io (requires refresh)":
					"启用buttplug.io（需要刷新网页)",
				"This page allows configuration of the synchronization of bluetooth connected toys.":
					"此页面允许配置将BC震动器状态同步到蓝牙连接的玩具",
				"Save & browse seen profiles (requires refresh)":
					"保存并浏览已知的个人资料 (需要刷新)",
				"Chat & Social": "聊天 & 社交",
				"Activities & Arousal": "活动 & 欲望",
				"Appearance & Wardrobe": "外观 & 衣柜",
				"Immersion & Anti-Cheat": "沉浸体验 & 反作弊",
				Performance: "表现",
				Misc: "杂项",
				Cheats: "作弊",
				"Other Addons": "其他插件",
				"Show nicknames": "修改你的昵称",
				"Change your nickname": "修改你的昵称",
				ah: "啊",
				aah: "啊❤",
				mnm: "唔姆",
				nn: "嗯啊",
				mnh: "嗯哈",
				mngh: "唔啊",
				haa: "哈啊",
				nng: "嗯嗯❤",
				mnng: "唔啊❤",
			},
		});

		let text =
			TranslationLanguage in translations &&
			original in translations[TranslationLanguage]
				? translations[TranslationLanguage][original]
				: original;
		for (const [key, val] of Object.entries(replacements)) {
			while (text.includes(key)) {
				text = text.replace(key, val);
			}
		}
		return text;
	}

	window.bceDisplayText = (original, replacements = {}) =>
		displayText(original, replacements);

	/**
	 * @type {(gameVersion: string) => Readonly<{ [key: string]: string }>}
	 */
	const expectedHashes = (gameVersion) => {
		const hashes = {
			ActivityChatRoomArousalSync: "21318CAF",
			ActivitySetArousal: "3AE28123",
			ActivitySetArousalTimer: "A034E6C0",
			ActivityTimerProgress: "6CD388A7",
			AppearanceClick: "0D1455A9",
			AppearanceExit: "AA300341",
			AppearanceLoad: "A14CB302",
			AppearanceRun: "6DDA14A1",
			CharacterAppearanceWardrobeLoad: "A5B63A03",
			CharacterBuildDialog: "E69E1DFE",
			CharacterCompressWardrobe: "8D3B1AB1",
			CharacterDecompressWardrobe: "A9FD29CC",
			CharacterGetCurrent: "A4EA6438",
			CharacterRefresh: "5BF9DA5A",
			CharacterSetActivePose: "0339D069",
			CharacterSetCurrent: "FD267B9B",
			CharacterSetFacialExpression: "D66B4515",
			ChatRoomCharacterItemUpdate: "4EB70443",
			ChatRoomCharacterUpdate: "9D0EEA39",
			ChatRoomClearAllElements: "C49AA2C1",
			ChatRoomClick: "79E651EB",
			ChatRoomCreateElement: "AD7CBE68",
			ChatRoomCurrentTime: "A462DD3A",
			ChatRoomDrawBackground: "898C1B12",
			ChatRoomDrawCharacterOverlay: "4AE4AD9E",
			ChatRoomKeyDown: "B4BFDB0C",
			ChatRoomListManipulation: "75D28A8B",
			ChatRoomMessage: "48A4F3CC",
			ChatRoomResize: "9D52CF52",
			ChatRoomRun: "07117155",
			ChatRoomSendChat: "7F540ED0",
			ChatRoomStart: "9CB3783A",
			CommandExecute: "12B2BAA4",
			CommandParse: "534545CD",
			CommonClick: "1F6DF7CB",
			CommonColorIsValid: "390A2CE4",
			CommonSetScreen: "17692CD7",
			DialogClick: "CE16B270",
			DialogDraw: "302268CE",
			DialogDrawItemMenu: "A6FE3967",
			DialogLeave: "354CBC00",
			DrawBackNextButton: "0DE5491B",
			DrawButton: "63FDE2B2",
			DrawCheckbox: "00FD87EB",
			DrawImageEx: "3D3D74F5",
			DrawImageResize: "8CF55F04",
			DrawProcess: "053C046E",
			DrawText: "C1BF0F50",
			DrawTextFit: "F9A1B11E",
			ElementCreateInput: "2B2603E4",
			ElementCreateTextArea: "9A16F87A",
			ElementIsScrolledToEnd: "D28B0638",
			ElementPosition: "CC4E3C82",
			ElementRemove: "60809E60",
			ElementScrollToEnd: "1AC45575",
			ElementValue: "B647E0E6",
			FriendListShowBeep: "6C0449BB",
			GLDrawResetCanvas: "EDF1631A",
			InformationSheetRun: "1079019C",
			InventoryGet: "E666F671",
			InventoryItemMiscLoversTimerPadlockClick: "B8F431EB",
			InventoryItemMiscLoversTimerPadlockDraw: "87818D41",
			InventoryItemMiscLoversTimerPadlockExit: "D316C21B",
			InventoryItemMiscLoversTimerPadlockLoad: "6931D8FF",
			InventoryItemMiscMistressTimerPadlockClick: "7DCDC57B",
			InventoryItemMiscMistressTimerPadlockDraw: "DC5D4BB4",
			InventoryItemMiscMistressTimerPadlockExit: "479A8F6F",
			InventoryItemMiscMistressTimerPadlockLoad: "8B23B841",
			InventoryItemMiscOwnerTimerPadlockClick: "B36A6AD3",
			InventoryItemMiscOwnerTimerPadlockDraw: "2E431407",
			InventoryItemMiscOwnerTimerPadlockExit: "4A0243F9",
			InventoryItemMiscOwnerTimerPadlockLoad: "06E1141F",
			InventoryItemMiscTimerPasswordPadlockClick: "CB736461",
			InventoryItemMiscTimerPasswordPadlockDraw: "953C9EF8",
			InventoryItemMiscTimerPasswordPadlockExit: "7323E56D",
			InventoryItemMiscTimerPasswordPadlockLoad: "D7F9CCA4",
			LoginClick: "8A3B973F",
			LoginRun: "B40EF142",
			LoginSetSubmitted: "C88F4A8E",
			MainRun: "B09F3B95",
			MouseIn: "CA8B839E",
			NotificationDrawFavicon: "AB88656B",
			NotificationRaise: "E8F29646",
			NotificationTitleUpdate: "0E92F3ED",
			OnlineGameAllowChange: "3779F42C",
			OnlineProfileClick: "9EF4F64F",
			OnlineProfileExit: "53E58C94",
			OnlineProfileLoad: "04F6A136",
			OnlineProfileRun: "8388DFE2",
			RelogRun: "10AF5A60",
			RelogExit: "2DFB2DAD",
			ServerAccountBeep: "D93AD698",
			ServerAppearanceBundle: "94A27A29",
			ServerAppearanceLoadFromBundle: "76D1CC95",
			ServerClickBeep: "3E6277BE",
			ServerConnect: "845E50A6",
			ServerDisconnect: "0D4630FA",
			ServerInit: "BBE09687",
			ServerOpenFriendList: "25665C3F",
			ServerSend: "90A61F57",
			SkillGetWithRatio: "16620445",
			SpeechGarbleByGagLevel: "276CFF37",
			SpeechGetTotalGagLevel: "E8051EA2",
			StruggleDexterity: "95812A41",
			StruggleDrawLockpickProgress: "A9C2DBBC",
			StruggleFlexibility: "148CEB8F",
			StruggleStrength: "7980C89B",
			TextGet: "4DDE5794",
			TextLoad: "ADF7C890",
			TimerInventoryRemove: "FE03BE6F",
			TimerProcess: "19F09E1E",
			WardrobeClick: "D388FE7D",
			WardrobeExit: "EE83FF29",
			WardrobeFastLoad: "545CB8FD",
			WardrobeFastSave: "B62385C1",
			WardrobeFixLength: "CA3334C6",
			WardrobeLoad: "C343A4C7",
			WardrobeRun: "9616EB3A",
		};

		switch (gameVersion) {
			default:
				break;
		}

		return Object.freeze(hashes);
	};

	/**
	 * @type {(...args: unknown[]) => void}
	 */
	const bceLog = (...args) => {
		console.debug("BCE", `${w.BCE_VERSION}:`, ...args);
	};

	/**
	 * @type {(...args: unknown[]) => void}
	 */
	const bceInfo = (...args) => {
		console.info("BCE", `${w.BCE_VERSION}:`, ...args);
	};

	/**
	 * @type {(...args: unknown[]) => void}
	 */
	const bceWarn = (...args) => {
		console.warn("BCE", `${w.BCE_VERSION}:`, ...args);
	};

	/**
	 * @type {(...args: unknown[]) => void}
	 */
	const bceError = (...args) => {
		console.error("BCE", `${w.BCE_VERSION}:`, ...args);
	};

	/** @type {string[]} */
	const deviatingHashes = [];
	/** @type {string[]} */
	const skippedFunctionality = [];

	/** @type {(functionName: string, patches: Record<string,string>, affectedFunctionality: string) => void} */
	const patchFunction = (functionName, patches, affectedFunctionality) => {
		// Guard against patching a function that has been modified by another addon not using the shared SDK on supported versions.
		if (
			deviatingHashes.includes(functionName) &&
			SUPPORTED_GAME_VERSIONS.includes(GameVersion)
		) {
			bceError(
				`Skipping patching of ${functionName} due to detected deviation. Impact: ${affectedFunctionality}\n\nSee /bcedebug in a chatroom for more information.`
			);
			skippedFunctionality.push(affectedFunctionality);
			return;
		}
		SDK.patchFunction(functionName, patches);
	};

	/**
	 * @type {(node: HTMLElement | HTMLElement[] | string) => void}
	 */
	const bceChatNotify = (node) => {
		const div = document.createElement("div");
		div.setAttribute("class", "ChatMessage bce-notification");
		div.setAttribute("data-time", ChatRoomCurrentTime());
		div.setAttribute("data-sender", Player.MemberNumber.toString());
		if (typeof node === "string") {
			div.appendChild(document.createTextNode(node));
		} else if (Array.isArray(node)) {
			div.append(...node);
		} else {
			div.appendChild(node);
		}

		const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
		if (document.getElementById("TextAreaChatLog") !== null) {
			document.getElementById("TextAreaChatLog").appendChild(div);
			if (ShouldScrollDown) {
				ElementScrollToEnd("TextAreaChatLog");
			}
		}
	};

	/**
	 * @type {(title: string, text: string) => void}
	 */
	const bceBeepNotify = (title, text) => {
		SDK.callOriginal("ServerAccountBeep", [
			{
				MemberNumber: Player.MemberNumber,
				MemberName: "BCE",
				ChatRoomName: title,
				Private: true,
				Message: text,
				ChatRoomSpace: "",
			},
		]);
	};

	/**
	 * @type {(text: string, duration?: number, properties?: Partial<ServerBeep>) => Promise<void>}
	 */
	const bceNotify = async (text, duration = 5000, properties = {}) => {
		await waitFor(
			() => !!Player && new Date(ServerBeep?.Timer || 0) < new Date()
		);

		ServerBeep = {
			Timer: Date.now() + duration,
			Message: text,
			...properties,
		};
	};

	w.bceSendAction = (text) => {
		ServerSend("ChatRoomChat", {
			Content: "Beep",
			Type: "Action",
			Dictionary: [
				// EN
				{ Tag: "Beep", Text: "msg" },
				// CN
				{ Tag: "发送私聊", Text: "msg" },
				// DE
				{ Tag: "Biep", Text: "msg" },
				// FR
				{ Tag: "Sonner", Text: "msg" },
				// Message itself
				{ Tag: "msg", Text: text },
			],
		});
	};

	w.bceSettingValue = (key) =>
		key in bceSettings ? bceSettings[key] : defaultSettings[key].value;

	w.bceAnimationEngineEnabled = () =>
		!!bceSettings.expressions || !!bceSettings.activityExpressions;

	// Expressions init method for custom expressions
	// eslint-disable-next-line camelcase
	w.bce_initializeDefaultExpression = () => {
		// Here to not break customizer script
	};

	/**
	 * @type {(duration: number) => Duration}
	 */
	const durationToComponents = (duration) => {
		let seconds = Math.floor(duration / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		hours -= days * 24;
		minutes = minutes - days * 24 * 60 - hours * 60;
		seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
		return {
			days,
			hours,
			minutes,
			seconds,
		};
	};

	/**
	 * @type {(dateFuture: Date) => Duration}
	 */
	const timeUntilDate = (dateFuture) => {
		// https://stackoverflow.com/a/13904621/1780502 - jackcogdill
		const dateNow = new Date();
		return durationToComponents(dateFuture.getTime() - dateNow.getTime());
	};

	/**
	 * @type {(timestamp: string | number | Date, days: number, hours: number, minutes: number, seconds: number) => number}
	 */
	const addToTimestamp = (timestamp, days, hours, minutes, seconds) => {
		if (!days) {
			days = 0;
		}
		if (!hours) {
			hours = 0;
		}
		if (!minutes) {
			minutes = 0;
		}
		if (!seconds) {
			seconds = 0;
		}
		const date = new Date(timestamp);
		date.setDate(date.getDate() + days);
		date.setHours(date.getHours() + hours);
		date.setMinutes(date.getMinutes() + minutes);
		date.setSeconds(date.getSeconds() + seconds);
		return date.getTime();
	};

	await functionIntegrityCheck();
	bceStyles();
	extendedWardrobe();
	automaticReconnect();
	hiddenMessageHandler();
	await bceLoadSettings();
	postSettings();
	appendSocketListenersToInit();
	bceLog(bceSettings);
	discreetMode();
	commonPatches();
	const bcxLoad = loadBCX();
	beepImprovements();
	settingsPage();
	alternateArousal();
	chatAugments();
	automaticExpressions();
	layeringMenu();
	cacheClearer();
	lockpickHelp();
	commands();
	chatRoomOverlay();
	privateWardrobe();
	antiGarbling();
	autoGhostBroadcast();
	blindWithoutGlasses();
	friendPresenceNotifications();
	accurateTimerInputs();
	logCharacterUpdates();
	forcedClubSlave();
	fpsCounter();
	instantMessenger();
	tabActivityWorkaround();
	autoStruggle();
	nicknames();
	leashAlways();
	clampGag();
	toySync();
	pastProfiles();

	await bcxLoad;

	// Post ready when in a chat room
	await bceNotify(`Bondage Club Enhancements v${w.BCE_VERSION} Loaded`);

	Player.BCE = BCE_VERSION;
	if (bceSettings.checkUpdates) {
		checkUpdate();
	}

	async function functionIntegrityCheck() {
		await waitFor(() => GameVersion !== "R0");
		for (const [func, hash] of Object.entries(expectedHashes(GameVersion))) {
			if (!w[func]) {
				bceWarn(`Expected function ${func} not found.`);
				continue;
			}
			if (typeof w[func] !== "function") {
				bceWarn(`Expected function ${func} is not a function.`);
				continue;
			}
			// eslint-disable-next-line
			const actualHash = SDK.getOriginalHash(func);
			if (actualHash !== hash) {
				bceError(
					`Function ${func} has been modified before BCE, potential incompatibility: ${actualHash}`
				);
				deviatingHashes.push(func);
			}
		}
	}

	async function checkUpdate() {
		await sleep(5000);
		// Version check
		bceLog("checking for updates...");
		fetch(
			`https://sidiousious.gitlab.io/bce/bce.user.js?_=${
				(Date.now() / 1000 / 3600) | 0
			}`
		)
			.then((r) => r.text())
			.then((r) => {
				const [, latest] = /@version (.*)$/mu.exec(r);
				bceLog("latest version:", latest);
				if (latest !== BCE_VERSION) {
					// Create beep
					bceBeepNotify(
						displayText("Update"),
						displayText(
							`Your version of BCE is outdated and may not be supported. Please update.

	Your version: $Version
	Latest version: $Latest

	Changelog available on GitLab (raw) and Discord:
	- https://gitlab.com/Sidiousious/bce/-/commits/main/
	- $DiscordUrl`,
							{
								$Version: BCE_VERSION,
								$Latest: latest,
								$DiscordUrl: DISCORD_INVITE_URL,
							}
						)
					);
				}
			})
			.catch((e) => {
				bceError("BCE update checker error:", e);
			});
	}

	/**
	 * @type {(func: () => boolean, cancelFunc: () => boolean) => Promise<boolean>}
	 */
	async function waitFor(func, cancelFunc = () => false) {
		while (!func()) {
			if (cancelFunc()) {
				return false;
			}
			// eslint-disable-next-line no-await-in-loop
			await sleep(10);
		}
		return true;
	}

	function commonPatches() {
		// DrawBackNextButton patch to allow overriding hover text position
		patchFunction(
			"DrawBackNextButton",
			{
				"Disabled, ArrowWidth": "Disabled, ArrowWidth, tooltipPosition",
				"DrawButtonHover(Left, Top, Width, Height,":
					"DrawButtonHover(tooltipPosition?.X || Left, tooltipPosition?.Y || Top, tooltipPosition?.Width || Width, tooltipPosition?.Height || Height,",
			},
			"Tooltip positions may be incorrect."
		);

		// CommandExecute patch to fix /whitelistadd and /whitelistremove
		patchFunction(
			"CommandExecute",
			{
				"key.indexOf(CommandsKey + C.Tag) == 0)": `key.substring(1) === C.Tag)`,
			},
			"Whitelist commands will not work."
		);
	}

	function fpsCounter() {
		let lastFrame = -1;

		/** @type {(ms: number) => number} */
		const expectedFrameTime = (ms) => (1000 / ms) | 0;

		SDK.hookFunction(
			"MainRun",
			HOOK_PRIORITIES.Observe,
			/** @type {(args: DOMHighResTimeStamp[], next: (args: DOMHighResTimeStamp[]) => void) => void} */
			(args, next) => {
				const [time] = args;
				if (lastFrame >= 0) {
					let ftl = 0;
					if (bceSettings.limitFPSInBackground && !document.hasFocus()) {
						ftl = 10;
					} else if (bceSettings.limitFPSTo15) {
						ftl = 15;
					} else if (bceSettings.limitFPSTo30) {
						ftl = 30;
					} else if (bceSettings.limitFPSTo60) {
						ftl = 60;
					}
					if (lastFrame + expectedFrameTime(ftl) > time) {
						requestAnimationFrame(MainRun);
						return;
					}
				}
				const frameTime = time - lastFrame;
				lastFrame = time;
				next(args);
				if (bceSettings.fpsCounter) {
					DrawTextFit(
						(Math.round(10000 / frameTime) / 10).toString(),
						15,
						12,
						30,
						"white",
						"black"
					);
				}
			}
		);
	}

	function beepImprovements() {
		if (typeof StartBcUtil === "function") {
			bceBeepNotify(
				displayText("Incompatibility"),
				displayText(
					"BCE is incompatible with BCUtil. Some functionality from BCE may not work. BCUtil's wardrobe, appearance, and instant messaging functionality are all available within BCE. Go to BCE settings and enable the relevant options, then disable BCUtil to migrate fully to BCE. This beep will appear every time BCE detects BCUtil as having loaded before BCE."
				)
			);
			return;
		}
		// ServerAccountBeep patch for beep notification improvements in chat
		patchFunction(
			"ServerAccountBeep",
			{
				// eslint-disable-next-line no-template-curly-in-string
				'ChatRoomSendLocal(`<a onclick="ServerOpenFriendList()">(${ServerBeep.Message})</a>`);': `{
					const beepId = FriendListBeepLog.length - 1;
					ChatRoomSendLocal(\`<a id="bce-beep-reply-\${beepId}">\u21a9\ufe0f</a><a class="bce-beep-link" id="bce-beep-\${beepId}">(\${ServerBeep.Message}\${ChatRoomHTMLEntities(data.Message ? \`: \${bceStripBeepMetadata(data.Message.length > 150 ? data.Message.substring(0, 150) + "..." : data.Message)}\` : "")})</a>\`);
					if (document.getElementById("bce-beep-reply-" + beepId)) {
						document.getElementById(\`bce-beep-reply-\${beepId}\`).onclick = (e) => {
							e.preventDefault();
							ElementValue("InputChat", \`/beep \${data.MemberNumber} \${ElementValue("InputChat").replace(/^\\/(beep|w) \\S+ ?/u, '')}\`);
							document.getElementById('InputChat').focus();
						};
					}
					if (document.getElementById("bce-beep-" + beepId)) {
						document.getElementById(\`bce-beep-\${beepId}\`).onclick = (e) => {
							e.preventDefault();
							ServerOpenFriendList();
							FriendListModeIndex = 1;
							FriendListShowBeep(\`\${beepId}\`);
						};
					}
				}`,
			},
			"Beeps are not enhanced by BCE."
		);
	}

	function accurateTimerInputs() {
		const timerInputElement = `ElementPosition("${TIMER_INPUT_ID}", 1400, 930, 250, 70);document.getElementById('${TIMER_INPUT_ID}').disabled = false;`;

		// Lover locks
		patchFunction(
			"InventoryItemMiscLoversTimerPadlockDraw",
			{
				"// Draw buttons to add/remove time if available": `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && (C.IsLoverOfPlayer() || C.IsOwnedByPlayer())) {${timerInputElement}} else`,
			},
			"Accurate timer inputs are not available for lover locks."
		);
		patchFunction(
			"InventoryItemMiscLoversTimerPadlockClick",
			{
				"InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);":
					'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);',
			},
			"Accurate timer inputs are not available for lover locks."
		);

		// Mistress locks
		patchFunction(
			"InventoryItemMiscMistressTimerPadlockDraw",
			{
				"// Draw buttons to add/remove time if available": `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && (LogQuery("ClubMistress", "Management") || (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber))) {${timerInputElement}} else`,
			},
			"Accurate timer inputs are not available for mistress locks."
		);
		patchFunction(
			"InventoryItemMiscMistressTimerPadlockClick",
			{
				"InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);":
					'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);',
			},
			"Accurate timer inputs are not available for mistress locks."
		);

		// Owner locks
		patchFunction(
			"InventoryItemMiscOwnerTimerPadlockDraw",
			{
				"// Draw buttons to add/remove time if available": `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && C.IsOwnedByPlayer()) {${timerInputElement}} else`,
			},
			"Accurate timer inputs are not available for owner locks."
		);
		patchFunction(
			"InventoryItemMiscOwnerTimerPadlockClick",
			{
				"InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 3600);":
					'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 3600);',
			},
			"Accurate timer inputs are not available for owner locks."
		);

		// Password timer
		patchFunction(
			"InventoryItemMiscTimerPasswordPadlockDraw",
			{
				"// Draw buttons to add/remove time if available": `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && Player.MemberNumber == Property.LockMemberNumber) {${timerInputElement}} else`,
			},
			"Accurate timer inputs are not available for password locks."
		);
		patchFunction(
			"InventoryItemMiscTimerPasswordPadlockClick",
			{
				"InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);":
					'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);',
			},
			"Accurate timer inputs are not available for password locks."
		);

		const loadLockTimerInput = () => {
			let defaultValue = "0d0h5m0s";
			if (DialogFocusSourceItem?.Property?.RemoveTimer) {
				const parsedTime = timeUntilDate(
					new Date(DialogFocusSourceItem.Property.RemoveTimer)
				);
				defaultValue = `${parsedTime.days}d${parsedTime.hours}h${parsedTime.minutes}m${parsedTime.seconds}s`;
			}
			ElementCreateInput(TIMER_INPUT_ID, "text", defaultValue, "11");
			ElementPosition(TIMER_INPUT_ID, -100, -100, 0, 0);
			// @ts-ignore
			document.getElementById(TIMER_INPUT_ID).disabled = true;
			/** @type {HTMLInputElement} */
			// @ts-ignore
			const timerInput = document.getElementById(TIMER_INPUT_ID);
			timerInput.onchange = function onchange() {
				/** @type {{ value: string }} */
				// @ts-ignore - value does exist on this type
				const { value } = this;

				// Validate input
				if (!/^[0-9]*d?[0-9]*h?[0-9]*m?[0-9]*s?$/u.test(value)) {
					return;
				}

				/** @type {Duration} */
				const additions = {
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
				};
				value.replace(
					/([0-9]+)[dhms]/gu,
					/** @type {(match: string, number: string) => string} */
					(match, number) => {
						switch (match.slice(-1)) {
							case "d":
								additions.days = parseInt(number);
								if (additions.days > 7) {
									additions.days = 7;
								}
								break;
							case "h":
								additions.hours = parseInt(number);
								if (additions.hours > 23) {
									additions.hours = 23;
								}
								break;
							case "m":
								additions.minutes = parseInt(number);
								if (additions.minutes > 59) {
									additions.minutes = 59;
								}
								break;
							case "s":
								additions.seconds = parseInt(number);
								if (additions.seconds > 59) {
									additions.seconds = 59;
								}
								break;
							default:
								break;
						}
						return "";
					}
				);
				DialogFocusSourceItem.Property.RemoveTimer = addToTimestamp(
					Date.now(),
					additions.days,
					additions.hours,
					additions.minutes,
					additions.seconds
				);
				if (
					DialogFocusSourceItem.Property.RemoveTimer - Date.now() >
					(DialogFocusItem?.Asset?.MaxTimer || 604800) * 1000
				) {
					DialogFocusSourceItem.Property.RemoveTimer =
						Date.now() + (DialogFocusItem?.Asset?.MaxTimer || 604800) * 1000;
				}
				if (CurrentScreen === "ChatRoom") {
					ChatRoomCharacterItemUpdate(
						CharacterGetCurrent(),
						DialogFocusSourceItem.Asset.Group.Name
					);
					const until = timeUntilDate(
						new Date(DialogFocusSourceItem.Property.RemoveTimer)
					);
					let timeMessage = "";
					if (DialogFocusSourceItem.Property.ShowTimer) {
						timeMessage =
							" to $days days, $hours hours, $minutes minutes, and $seconds seconds";
					}
					bceSendAction(
						displayText(
							`$PlayerName changed the timer on the $ItemName on $TargetName $GroupName ${timeMessage}`,
							{
								$PlayerName: Player.Name,
								$ItemName: DialogFocusItem?.Asset?.Description?.toLowerCase(),
								$TargetName: CharacterGetCurrent()?.Name,
								$GroupName:
									CharacterGetCurrent()?.FocusGroup?.Description?.toLowerCase(),
								$days: until.days.toString(),
								$hours: until.hours.toString(),
								$minutes: until.minutes.toString(),
								$seconds: until.seconds.toString(),
							}
						)
					);
				}
			};
		};

		const timerLoadMethods = [
			"InventoryItemMiscLoversTimerPadlockLoad",
			"InventoryItemMiscMistressTimerPadlockLoad",
			"InventoryItemMiscOwnerTimerPadlockLoad",
			"InventoryItemMiscTimerPasswordPadlockLoad",
		];
		const timerExitMethods = [
			"InventoryItemMiscLoversTimerPadlockExit",
			"InventoryItemMiscMistressTimerPadlockExit",
			"InventoryItemMiscOwnerTimerPadlockExit",
			"InventoryItemMiscTimerPasswordPadlockExit",
		];

		for (const fn of timerLoadMethods) {
			SDK.hookFunction(
				fn,
				HOOK_PRIORITIES.AddBehaviour,
				// eslint-disable-next-line no-loop-func
				(args, next) => {
					const ret = next(args);
					if (bceSettings.accurateTimerLocks) {
						loadLockTimerInput();
					}
					return ret;
				}
			);
		}

		for (const fn of timerExitMethods) {
			SDK.hookFunction(
				fn,
				HOOK_PRIORITIES.AddBehaviour,
				// eslint-disable-next-line no-loop-func
				(args, next) => {
					const ret = next(args);
					if (bceSettings.accurateTimerLocks) {
						ElementRemove(TIMER_INPUT_ID);
					}
					return ret;
				}
			);
		}
	}

	// Load BCX
	async function loadBCX() {
		await waitFor(settingsLoaded);

		if (w.BCX_Loaded) {
			bcxType = "external";
			bceLog("BCX already loaded, skipping loadBCX()");
			return;
		}

		/** @type {string} */
		let source = null;
		if (bceSettings.bcx) {
			source = BCX_SOURCE;
			bcxType = "stable";
		} else if (bceSettings.bcxDevel) {
			source = BCX_DEVEL_SOURCE;
			bcxType = "devel";
		} else {
			return;
		}
		bceInfo("Loading BCX from", source);
		// Allow BCX to read where it was loaded from
		w.BCX_SOURCE = source;
		await fetch(source)
			.then((resp) => resp.text())
			.then((resp) => {
				resp = resp.replace(
					"sourceMappingURL=bcx.js.map",
					`sourceMappingURL=${source}.map`
				);
				bceLog(resp);
				eval(resp);
			});
		bceInfo("Loaded BCX");
	}

	async function commands() {
		await waitFor(() => !!Commands);
		bceLog("registering additional commands");

		/** @type {Command[]} */
		const cmds = [
			{
				Tag: "bcedebug",
				Description: displayText(
					"Get debug information to share with developers."
				),
				Action: async () => {
					/** @type {Map<string, string>} */
					const info = new Map();
					info.set("Browser", navigator.userAgent);
					info.set(
						"Game Version",
						`${GameVersion}${
							SUPPORTED_GAME_VERSIONS.includes(GameVersion)
								? ""
								: " (unsupported)"
						}`
					);
					info.set("WebGL Version", GLVersion);
					info.set("BCE Version", BCE_VERSION);
					info.set(
						"BCE Enabled Settings",
						`\n- ${Object.entries(bceSettings)
							.filter(([k, v]) => v || k === "version")
							.map(([k, v]) => `${k}: ${v.toString()}`)
							.join("\n- ")}`
					);
					if (toySyncState.client?.Connected) {
						info.set(
							"Buttplug.io Devices",
							toySyncState.client.Devices.map(
								(d) => `${d.Name} (${d.AllowedMessages.join(",")})`
							).join(", ")
						);
					}
					info.set(
						"SDK Mods",
						`\n- ${BCE_BC_MOD_SDK.getModsInfo()
							.map((m) => `${m.name} @ ${m.version}`)
							.join("\n- ")}`
					);
					info.set("Modified Functions (non-SDK)", deviatingHashes.join(", "));
					info.set(
						"Skipped Functionality for Compatibility",
						`\n- ${skippedFunctionality.join("\n- ")}`
					);
					const print = Array.from(info)
						.map(([k, v]) => `${k}: ${v}`)
						.join("\n");
					bceChatNotify(`${print}\n\nThis has been copied to your clipboard.`);
					await navigator.clipboard.writeText(print);
					if (skippedFunctionality.length > 0) {
						bceChatNotify(
							"If you are running another addon that modifies the game, but is not listed above, please tell its developer to use https://github.com/Jomshir98/bondage-club-mod-sdk to hook into the game instead. This is a very cheap and easy way for addon developers to almost guarantee compatibility with other addons."
						);
					}
				},
			},
			{
				Tag: "bcechangelog",
				Description: displayText("Show recent BCE changelog"),
				Action: () => {
					bceChatNotify(bceChangelog);
				},
			},
			{
				Tag: "exportlooks",
				Description: displayText(
					"[target member number] [includeBinds: true/false] [total: true/false]: Copy your or another player's appearance in a format that can be imported with BCX"
				),
				Action: async (_, _command, args) => {
					const [target, includeBindsArg, total] = args;
					/** @type {Character} */
					let targetMember = null;
					if (!target) {
						targetMember = Player;
					} else {
						targetMember = Character.find(
							(c) => c.MemberNumber === parseInt(target)
						);
					}
					if (!targetMember) {
						bceInfo("Could not find member", target);
						return;
					}
					const includeBinds = includeBindsArg === "true";
					// LockMemberNumber

					const clothes = targetMember.Appearance.filter(
						(a) =>
							a.Asset.Group.Category === "Appearance" &&
							a.Asset.Group.AllowNone &&
							a.Asset.Group.Clothing
					);

					const appearance = [...clothes];
					if (includeBinds) {
						appearance.push(
							...targetMember.Appearance.filter(
								(a) =>
									a.Asset.Group.Category === "Item" &&
									!["ItemNeck", "ItemNeckAccessories"].includes(
										a.Asset.Group.Name
									) &&
									!a.Asset.Group.BodyCosplay
							)
						);
					}

					/** @type {ItemBundle[]} */
					const looks = (
						total === "true" ? targetMember.Appearance : appearance
					).map((i) => {
						const property = i.Property ? { ...i.Property } : {};
						if (property?.LockMemberNumber) {
							property.LockMemberNumber = Player.MemberNumber;
						}
						return {
							Group: i.Asset.Group.Name,
							Name: i.Asset.Name,
							Color: i.Color,
							Difficulty: i.Difficulty,
							Property: property,
						};
					});

					const targetName = targetMember.IsPlayer()
						? "yourself"
						: targetMember.Name;

					await navigator.clipboard.writeText(JSON.stringify(looks));
					bceChatNotify(
						displayText(`Exported looks for $TargetName copied to clipboard`, {
							$TargetName: targetName,
						})
					);
				},
			},
			{
				Tag: "importlooks",
				Description: displayText(
					"[looks string]: Import looks from a string (BCX or BCE export)"
				),
				Action: (_, command) => {
					if (!Player.CanChange() || !OnlineGameAllowChange()) {
						bceChatNotify(
							displayText(
								"You cannot change your appearance while bound or during online games, such as LARP."
							)
						);
						return;
					}

					const [, bundleString] = command.split(" ");
					if (!bundleString) {
						bceChatNotify(displayText("No looks string provided"));
						return;
					}
					try {
						/** @type {ItemBundle[]} */
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const bundle = bundleString.startsWith("[")
							? JSON.parse(bundleString)
							: JSON.parse(LZString.decompressFromBase64(bundleString));

						if (
							!Array.isArray(bundle) ||
							bundle.length === 0 ||
							!bundle[0].Group
						) {
							throw new Error("Invalid bundle");
						}

						// Keep items you cannot unlock in your appearance
						for (const item of Player.Appearance) {
							if (item.Property?.LockedBy && !DialogCanUnlock(Player, item)) {
								/** @type {ItemBundle} */
								const itemBundle = {
									Group: item.Asset.Group.Name,
									Name: item.Asset.Name,
									Color: item.Color,
									Difficulty: item.Difficulty,
									Property: item.Property,
								};
								const idx = bundle.findIndex(
									(v) => v.Group === item.Asset.Group.Name
								);
								if (idx < 0) {
									bundle.push(itemBundle);
								} else {
									bundle[idx] = itemBundle;
								}
							}
						}
						ServerAppearanceLoadFromBundle(
							Player,
							"Female3DCG",
							bundle,
							Player.MemberNumber
						);
						ChatRoomCharacterUpdate(Player);
						bceChatNotify(displayText("Applied looks"));
					} catch (e) {
						console.error(e);
						bceChatNotify(displayText("Could not parse looks"));
					}
				},
			},
			{
				Tag: "beep",
				Description: displayText("[membernumber] [message]: beep someone"),
				Action: (_, command, args) => {
					const [target] = args,
						[, , ...message] = command.split(" "),
						msg = message?.join(" ");
					if (!target || !msg || !/^\d+$/u.test(target)) {
						bceChatNotify(displayText(`beep target or message not provided`));
						return;
					}
					const targetMemberNumber = parseInt(target);
					if (!Player.FriendList.includes(targetMemberNumber)) {
						bceChatNotify(
							displayText(`$Target is not in your friend list`, {
								$Target: target,
							})
						);
						return;
					}
					ServerSend("AccountBeep", {
						BeepType: "",
						MemberNumber: targetMemberNumber,
						Message: msg,
						IsSecret: true,
					});
					FriendListBeepLog.push({
						MemberNumber: targetMemberNumber,
						MemberName: Player.FriendNames.get(targetMemberNumber),
						ChatRoomName: null,
						Sent: true,
						Private: false,
						Time: new Date(),
						Message: msg,
					});
					const beepId = FriendListBeepLog.length - 1;
					const link = document.createElement("a");
					link.href = `#beep-${beepId}`;
					link.onclick = (e) => {
						e.preventDefault();
						ServerOpenFriendList();
						FriendListModeIndex = 1;
						FriendListShowBeep(beepId);
					};
					link.textContent = displayText(
						"(Beep to $Name ($Number): $Message)",
						{
							$Name: Player.FriendNames.get(targetMemberNumber),
							$Number: targetMemberNumber.toString(),
							$Message: msg.length > 150 ? `${msg.substring(0, 150)}...` : msg,
						}
					);
					link.classList.add("bce-beep-link");
					bceChatNotify(link);
				},
			},
			{
				Tag: "w",
				Description: displayText(
					"[target name] [message]: whisper the target player. Use first name only. Finds the first person in the room with a matching name, left-to-right, top-to-bottom."
				),
				Action: (_, command, args) => {
					const [target] = args,
						[, , ...message] = command.split(" "),
						msg = message?.join(" "),
						targetMembers = ChatRoomCharacter.filter(
							(c) =>
								c.Name.split(" ")[0]?.toLowerCase() === target?.toLowerCase()
						);
					if (!target || targetMembers.length === 0) {
						bceChatNotify(`Whisper target not found: ${target}`);
					} else if (targetMembers.length > 1) {
						bceChatNotify(
							displayText(
								"Multiple whisper targets found: $Targets. You can still whisper the player by clicking their name.",
								{
									$Targets: targetMembers
										.map((c) => `${c.Name} (${c.MemberNumber})`)
										.join(", "),
								}
							)
						);
					} else if (!msg) {
						bceChatNotify(displayText(`No message provided`));
					} else {
						const targetMemberNumber = targetMembers[0].MemberNumber;
						const originalTarget = ChatRoomTargetMemberNumber;
						ChatRoomTargetMemberNumber = targetMemberNumber;
						ElementValue(
							"InputChat",
							`${
								msg.length > 0 && [".", "/"].includes(msg[0]) ? "\u200b" : ""
							}${msg}`
						);
						// True to skip history
						ChatRoomSendChat(true);
						ChatRoomTargetMemberNumber = originalTarget;
					}
				},
			},
			{
				Tag: "versions",
				Description: displayText(
					"show versions of the club, BCE, and BCX in use by players"
				),
				Action: () => {
					/** @type {(chars: Character[]) => string} */
					const versionOutput = (chars) =>
						chars
							.map(
								(a) =>
									`${a.Name} (${a.MemberNumber}) club ${
										a.OnlineSharedSettings?.GameVersion
									}${
										bcx?.getCharacterVersion(a.MemberNumber)
											? ` BCX ${bcx.getCharacterVersion(a.MemberNumber)}`
											: ""
									}${
										a.BCE
											? `\nBCE v${
													a.BCE
											  } Alt Arousal: ${a.BCEArousal?.toString()}`
											: ""
									}`
							)
							.filter((a) => a)
							.join("\n\n");

					bceChatNotify(versionOutput(ChatRoomCharacterDrawlist));
					bceLog(versionOutput(ChatRoomCharacter));
				},
			},
		];

		// Skip history patch for /w
		patchFunction(
			"ChatRoomSendChat",
			{
				"ChatRoomSendChat()": `ChatRoomSendChat(skipHistory)`,
				"ChatRoomLastMessage.push(msg);": `if (!skipHistory) ChatRoomLastMessage.push(msg);`,
			},
			"Whispers sent via /w will trigger items such as the automated shock collar and futuristic training belt."
		);

		// Patch to allow /importlooks to exceed 1000 characters
		w.InputChat?.removeAttribute("maxlength");
		patchFunction(
			"ChatRoomCreateElement",
			{
				'document.getElementById("InputChat").setAttribute("maxLength", 1000);':
					"",
			},
			"You may be unable to /importlooks due to the chat input being limited in length."
		);

		for (const c of cmds) {
			if (Commands.some((a) => a.Tag === c.Tag)) {
				bceLog("already registered", c);
				continue;
			}
			Commands.push(c);
		}
	}

	// Create settings page
	async function settingsPage() {
		await waitFor(() => !!PreferenceSubscreenList);

		bceLog("initializing");

		const settingsPerPage = 9,
			settingsYIncrement = 70,
			settingsYStart = 225;

		const settingsPageCount = (category) =>
			Math.ceil(
				Object.values(defaultSettings).filter((v) => v.category === category)
					.length / settingsPerPage
			);

		/** @type {[number, number, number, number]} */
		const discordInvitePosition = [1650, 810, 250, 50];
		/** @type {[number, number, number, number]} */
		const licensePosition = [1650, 870, 250, 50];
		let currentPageNumber = 0;

		/** @type {SettingsCategory | null} */
		let currentCategory = null;
		/**
		 * Excludes hidden
		 * @type {SettingsCategory[]}
		 */
		const settingsCategories = [
			"chat",
			"activities",
			"appearance",
			"immersion",
			"performance",
			"misc",
			"cheats",
			"addons",
			"buttplug",
		];
		const settingCategoryLabels = {
			chat: "Chat & Social",
			activities: "Activities & Arousal",
			appearance: "Appearance & Wardrobe",
			immersion: "Immersion & Anti-Cheat",
			performance: "Performance",
			misc: "Misc",
			cheats: "Cheats",
			addons: "Other Addons",
			buttplug: "Buttplug.io Toys",
			hidden: "",
		};

		const vibratingSlots = [
			"None",
			...new Set(
				Asset.filter(
					(a) =>
						a.AllowEffect?.includes("Vibrating") ||
						a.AllowEffect?.includes("Egged")
				).map((a) => a.Group.Name)
			),
		];

		/** @type {[number, number, number, number]} */
		const scanButtonPosition = [1650, 225, 150, 50];

		const currentDefaultSettings = (category) =>
			Object.entries(defaultSettings).filter(
				([, v]) => v.category === category && v.value === !!v.value
			);

		w.PreferenceSubscreenBCESettingsLoad = function () {
			currentPageNumber = 0;
		};
		w.PreferenceSubscreenBCESettingsExit = function () {
			bceSaveSettings();
			PreferenceSubscreen = "";
			PreferenceMessage = "";
		};
		w.PreferenceSubscreenBCESettingsRun = function () {
			w.MainCanvas.getContext("2d").textAlign = "left";
			DrawText(
				displayText("Bondage Club Enhancements Settings"),
				300,
				125,
				"Black",
				"Gray"
			);
			DrawButton(...discordInvitePosition, "", "White", "");
			DrawText(
				displayText("Join Discord"),
				discordInvitePosition[0] + 20,
				discordInvitePosition[1] + discordInvitePosition[3] / 2,
				"Black",
				""
			);
			DrawButton(...licensePosition, "", "White", "");
			DrawText(
				displayText("License"),
				licensePosition[0] + 20,
				licensePosition[1] + licensePosition[3] / 2,
				"Black",
				""
			);
			DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

			if (currentCategory) {
				let y = settingsYStart;
				for (const [settingName, defaultSetting] of currentDefaultSettings(
					currentCategory
				).slice(
					currentPageNumber * settingsPerPage,
					currentPageNumber * settingsPerPage + settingsPerPage
				)) {
					DrawCheckbox(
						300,
						y,
						64,
						64,
						displayText(defaultSetting.label),
						!!bceSettings[settingName]
					);
					y += settingsYIncrement;
				}
				if (currentCategory === "buttplug") {
					DrawText(
						displayText(
							"This page allows configuration of the synchronization of bluetooth connected toys."
						),
						300,
						350,
						"Black",
						"Gray"
					);
					if (bceSettings.toySync) {
						if (!toySyncState.client?.Connected) {
							DrawText(
								displayText("Still connecting or connection failed..."),
								300,
								450,
								"Black",
								"Gray"
							);
						} else {
							w.MainCanvas.getContext("2d").textAlign = "center";
							DrawButton(
								...scanButtonPosition,
								"Scan",
								toySyncState.client.isScanning ? "Grey" : "White",
								"",
								toySyncState.client.isScanning ? "Already scanning" : null,
								toySyncState.client.isScanning
							);
							w.MainCanvas.getContext("2d").textAlign = "left";
							DrawText(displayText("Device Name"), 300, 420, "Black", "Gray");
							DrawText(
								displayText("Synchronized Slot"),
								800,
								420,
								"Black",
								"Gray"
							);
							y = 500;
							for (const d of toySyncState.client.Devices.filter((dev) =>
								dev.AllowedMessages.includes(0)
							)) {
								let deviceSettings = toySyncState.deviceSettings.get(d.Name);
								if (!deviceSettings) {
									deviceSettings = {
										Name: d.Name,
										SlotName: "None",
									};
									toySyncState.deviceSettings.set(d.Name, deviceSettings);
								}
								const currentIdx = vibratingSlots.indexOf(
									deviceSettings.SlotName
								);
								let nextIdx = 0,
									previousIdx = 0;
								if (currentIdx <= 0) {
									previousIdx = vibratingSlots.length - 1;
								} else {
									previousIdx = currentIdx - 1;
								}
								if (currentIdx === vibratingSlots.length - 1) {
									nextIdx = 0;
								} else {
									nextIdx = currentIdx + 1;
								}
								DrawText(d.Name, 300, y, "Black", "Gray");

								w.MainCanvas.getContext("2d").textAlign = "center";
								DrawBackNextButton(
									800,
									y - 32,
									450,
									64,
									displayText(deviceSettings.SlotName),
									"white",
									"",
									() => displayText(vibratingSlots[previousIdx]),
									() => displayText(vibratingSlots[nextIdx])
								);
								w.MainCanvas.getContext("2d").textAlign = "left";
								y += settingsYIncrement;
								if (y > 950) {
									break;
								}
							}
						}
					}
				} else {
					DrawText(
						`${currentPageNumber + 1} / ${settingsPageCount(currentCategory)}`,
						1700,
						230,
						"Black",
						"Gray"
					);
					DrawButton(1815, 180, 90, 90, "", "White", "Icons/Next.png");
				}
			} else {
				let y = settingsYStart;
				for (const category of settingsCategories) {
					DrawButton(300, y, 400, 64, "", "White");
					DrawTextFit(
						displayText(settingCategoryLabels[category]),
						310,
						y + 32,
						380,
						"Black"
					);
					y += settingsYIncrement;
				}
			}
			w.MainCanvas.getContext("2d").textAlign = "center";
		};
		// eslint-disable-next-line complexity
		w.PreferenceSubscreenBCESettingsClick = function () {
			let y = settingsYStart;
			if (MouseIn(1815, 75, 90, 90)) {
				if (currentCategory === null) {
					PreferenceSubscreenBCESettingsExit();
				} else {
					currentCategory = null;
				}
			} else if (MouseIn(...licensePosition)) {
				open(BCE_LICENSE, "_blank");
			} else if (MouseIn(...discordInvitePosition)) {
				open(DISCORD_INVITE_URL, "_blank");
			} else if (currentCategory !== null) {
				if (MouseIn(1815, 180, 90, 90) && currentCategory !== "buttplug") {
					currentPageNumber += 1;
					currentPageNumber %= settingsPageCount(currentCategory);
				} else {
					for (const [settingName, defaultSetting] of currentDefaultSettings(
						currentCategory
					).slice(
						currentPageNumber * settingsPerPage,
						currentPageNumber * settingsPerPage + settingsPerPage
					)) {
						if (MouseIn(300, y, 64, 64)) {
							bceSettings[settingName] = !bceSettings[settingName];
							defaultSetting.sideEffects(bceSettings[settingName]);
						}
						y += settingsYIncrement;
					}
				}
				if (currentCategory === "buttplug" && toySyncState.client?.Connected) {
					if (MouseIn(...scanButtonPosition)) {
						if (!toySyncState.client.isScanning) {
							toySyncState.client.startScanning();
						}
						return;
					}
					y = 500;
					for (const d of toySyncState.client.Devices.filter((dev) =>
						dev.AllowedMessages.includes(0)
					)) {
						if (!MouseIn(800, y - 32, 450, 64)) {
							continue;
						}
						const deviceSettings = toySyncState.deviceSettings.get(d.Name);
						const currentIdx = vibratingSlots.indexOf(deviceSettings.SlotName);
						let nextIdx = 0,
							previousIdx = 0;
						if (currentIdx <= 0) {
							previousIdx = vibratingSlots.length - 1;
						} else {
							previousIdx = currentIdx - 1;
						}
						if (currentIdx === vibratingSlots.length - 1) {
							nextIdx = 0;
						} else {
							nextIdx = currentIdx + 1;
						}

						if (MouseX < 800 + 450 / 2) {
							deviceSettings.SlotName = vibratingSlots[previousIdx];
						} else {
							deviceSettings.SlotName = vibratingSlots[nextIdx];
						}

						y += settingsYIncrement;
						if (y > 950) {
							break;
						}
					}
				}
			} else {
				for (const category of settingsCategories) {
					if (MouseIn(300, y, 400, 64)) {
						currentCategory = category;
						currentPageNumber = 0;
						break;
					}
					y += settingsYIncrement;
				}
			}
		};

		SDK.hookFunction(
			"DrawButton",
			HOOK_PRIORITIES.ModifyBehaviourMedium,
			(args, next) => {
				// 7th argument is image URL
				switch (args[6]) {
					case "Icons/BCESettings.png":
						args[6] = ICONS.LOGO;
						break;
					default:
						break;
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"TextGet",
			HOOK_PRIORITIES.ModifyBehaviourHigh,
			(args, next) => {
				switch (args[0]) {
					case "HomepageBCESettings":
						return displayText("BCE Settings");
					default:
						return next(args);
				}
			}
		);
		PreferenceSubscreenList.push("BCESettings");

		/** @type {(e: KeyboardEvent) => void} */
		function keyHandler(e) {
			if (e.key === "Escape" && currentCategory !== null) {
				currentCategory = null;
				e.stopPropagation();
				e.preventDefault();
			}
		}

		document.addEventListener("keydown", keyHandler, true);
		document.addEventListener("keypress", keyHandler, true);
	}

	async function lockpickHelp() {
		await waitFor(() => !!StruggleDrawLockpickProgress);

		/** @type {(s: number) => () => number} */
		const newRand = (s) =>
			function () {
				s = Math.sin(s) * 10000;
				return s - Math.floor(s);
			};

		const pinSpacing = 100,
			pinWidth = 200,
			x = 1575,
			y = 300;

		SDK.hookFunction(
			"StruggleDrawLockpickProgress",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				if (bceSettings.lockpick) {
					const seed = parseInt(StruggleLockPickOrder.join(""));
					const rand = newRand(seed);
					const threshold = SkillGetWithRatio("LockPicking") / 20;
					const hints = StruggleLockPickOrder.map((a) => {
						const r = rand();
						return r < threshold ? a : false;
					});
					for (let p = 0; p < hints.length; p++) {
						// Replicates pin rendering in the game Struggle.js
						const xx =
							x - pinWidth / 2 + (0.5 - hints.length / 2 + p) * pinSpacing;
						if (hints[p]) {
							DrawText(
								`${StruggleLockPickOrder.indexOf(p) + 1}`,
								xx,
								y,
								"blue"
							);
						}
					}
				}
				return next(args);
			}
		);
	}

	function automaticReconnect() {
		const localStoragePasswordsKey = "bce.passwords";
		w.bceUpdatePasswordForReconnect = () => {
			let name = "";
			if (CurrentScreen === "Login") {
				name = ElementValue("InputName").toUpperCase();
			} else if (CurrentScreen === "Relog") {
				name = Player.AccountName;
			}
			/** @type {Passwords} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let passwords = JSON.parse(
				localStorage.getItem(localStoragePasswordsKey)
			);
			if (!passwords) {
				passwords = {};
			}
			passwords[name] = ElementValue("InputPassword");
			localStorage.setItem(localStoragePasswordsKey, JSON.stringify(passwords));
		};

		w.bceClearPassword = (accountname) => {
			/** @type {Passwords} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const passwords = JSON.parse(
				localStorage.getItem(localStoragePasswordsKey)
			);
			if (
				!passwords ||
				!Object.prototype.hasOwnProperty.call(passwords, accountname)
			) {
				return;
			}
			delete passwords[accountname];
			localStorage.setItem(localStoragePasswordsKey, JSON.stringify(passwords));
		};

		let lastClick = Date.now();

		async function loginCheck() {
			await waitFor(() => CurrentScreen === "Login");

			/** @type {() => Passwords} */
			const loadPasswords = () =>
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				JSON.parse(localStorage.getItem(localStoragePasswordsKey));

			/** @type {{ passwords: Passwords, posMaps: Record<string, string> }} */
			const loginData = {
				passwords: loadPasswords() || {},
				posMaps: {},
			};

			SDK.hookFunction("LoginRun", HOOK_PRIORITIES.Top, (args, next) => {
				const ret = next(args);
				if (Object.keys(loginData.passwords).length > 0) {
					DrawText(
						displayText("Saved Logins (BCE)"),
						170,
						35,
						"White",
						"Black"
					);
				}
				DrawButton(1250, 385, 180, 60, displayText("Save (BCE)"), "White");

				let y = 60;
				for (const user in loginData.passwords) {
					if (
						!Object.prototype.hasOwnProperty.call(loginData.passwords, user)
					) {
						continue;
					}
					loginData.posMaps[y] = user;
					DrawButton(10, y, 350, 60, user, "White");
					DrawButton(355, y, 60, 60, "X", "White");
					y += 70;
				}
				return ret;
			});

			SDK.hookFunction("LoginClick", HOOK_PRIORITIES.Top, (args, next) => {
				const ret = next(args);
				if (MouseIn(1250, 385, 180, 60)) {
					bceUpdatePasswordForReconnect();
					loginData.posMaps = {};
					loginData.passwords = loadPasswords() || {};
				}
				const now = Date.now();
				if (now - lastClick < 150) {
					return ret;
				}
				lastClick = now;
				for (const pos in loginData.posMaps) {
					if (!Object.prototype.hasOwnProperty.call(loginData.posMaps, pos)) {
						continue;
					}
					const idx = parseInt(pos);
					if (MouseIn(10, idx, 350, 60)) {
						ElementValue("InputName", loginData.posMaps[idx]);
						ElementValue(
							"InputPassword",
							loginData.passwords[loginData.posMaps[idx]]
						);
					} else if (MouseIn(355, idx, 60, 60)) {
						bceClearPassword(loginData.posMaps[idx]);
						loginData.posMaps = {};
						loginData.passwords = loadPasswords() || {};
					}
				}
				return ret;
			});

			CurrentScreenFunctions.Run = LoginRun;
			CurrentScreenFunctions.Click = LoginClick;
		}
		loginCheck();

		let breakCircuit = false;

		async function relog() {
			if (breakCircuit || !bceSettings.relogin) {
				return;
			}
			breakCircuit = true;
			/** @type {Passwords} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let passwords = JSON.parse(
				localStorage.getItem(localStoragePasswordsKey)
			);
			bceLog("Attempting to log in again as", Player.AccountName);
			if (!passwords) {
				passwords = {};
			}
			if (!passwords[Player.AccountName]) {
				// eslint-disable-next-line no-alert
				alert("Automatic reconnect failed!");
				return;
			}
			LoginSetSubmitted();
			ServerSend("AccountLogin", {
				AccountName: Player.AccountName,
				Password: passwords[Player.AccountName],
			});
			await waitFor(() => CurrentScreen !== "Relog");
			await sleep(500);
			SDK.callOriginal("ServerAccountBeep", [
				{
					MemberNumber: Player.MemberNumber,
					MemberName: "VOID",
					ChatRoomName: "VOID",
					Private: true,
					Message: displayText("Reconnected!"),
					ChatRoomSpace: "",
				},
			]);
		}

		SDK.hookFunction("RelogRun", HOOK_PRIORITIES.Top, (args, next) => {
			const forbiddenReasons = ["ErrorDuplicatedLogin"];
			if (!forbiddenReasons.includes(LoginErrorMessage)) {
				if (
					Player?.AccountName &&
					ServerIsConnected &&
					!LoginSubmitted &&
					ServerSocket.connected
				) {
					relog();
				}
			} else if (!breakCircuit) {
				SDK.callOriginal("ServerAccountBeep", [
					{
						MemberNumber: Player.MemberNumber,
						MemberName: Player.Name,
						ChatRoomName: displayText("ERROR"),
						Private: true,
						Message: displayText(
							"Signed in from a different location! Refresh the page to re-enable relogin in this tab."
						),
						ChatRoomSpace: "",
					},
				]);
				breakCircuit = true;
			}
			return next(args);
		});

		SDK.hookFunction("RelogExit", HOOK_PRIORITIES.Top, (args, next) => {
			breakCircuit = false;
			return next(args);
		});

		SDK.hookFunction(
			"ServerDisconnect",
			HOOK_PRIORITIES.ModifyBehaviourHigh,
			/** @type {(args: [unknown, boolean], next: (args: [unknown, boolean]) => void) => void} */
			(args, next) => {
				const [, force] = args;
				args[1] = false;
				const ret = next(args);
				if (force) {
					bceWarn("Forcefully disconnected", args);
					ServerSocket.disconnect();
					if (
						isString(args[0]) &&
						["ErrorRateLimited", "ErrorDuplicatedLogin"].includes(args[0])
					) {
						// Reconnect after 3-6 seconds if rate limited
						bceWarn("Reconnecting...");
						setTimeout(() => {
							bceWarn("Connecting...");
							ServerInit();
						}, 3000 + Math.round(Math.random() * 3000));
					} else {
						bceWarn("Disconnected.");
					}
				}
				return ret;
			}
		);
	}

	function bceStyles() {
		const css = `
		.bce-beep-link {
			text-decoration: none;
		}
		#TextAreaChatLog .bce-notification,
		#TextAreaChatLog .bce-notification {
			background-color: #D696FF;
			color: black;
		}
		#TextAreaChatLog[data-colortheme="dark"] .bce-notification,
		#TextAreaChatLog[data-colortheme="dark2"] .bce-notification {
			background-color: #481D64;
			color: white;
		}
		.bce-img-link {
			vertical-align: top;
		}
		.bce-img {
			max-height: 25rem;
			max-width: 90%;
			display: inline;
			border:1px solid red;
			padding: 0.1rem;
		}
		.bce-color {
			width: 0.8em;
			height: 0.8em;
			display: inline-block;
			vertical-align: middle;
			border: 0.1em solid black;
			margin-right: 0.1em;
		}
		.${BCE_COLOR_ADJUSTMENTS_CLASS_NAME} .${DARK_INPUT_CLASS}.${INPUT_WARN_CLASS} {
			background-color: #400000 !important;
		}
		.${INPUT_WARN_CLASS} {
			background-color: yellow !important;
		}
		#TextAreaChatLog a,
		.bce-message a {
			color: #003f91;
			cursor: pointer;
		}
		#TextAreaChatLog a:visited,
		.bce-message a {
			color: #380091;
		}
		.${BCE_COLOR_ADJUSTMENTS_CLASS_NAME} div.ChatMessageWhisper,
		.${BCE_COLOR_ADJUSTMENTS_CLASS_NAME} div.ChatMessageWhisper {
			color: #646464;
		}
		.${BCE_COLOR_ADJUSTMENTS_CLASS_NAME} #TextAreaChatLog[data-colortheme="dark"] div.ChatMessageWhisper,
		.${BCE_COLOR_ADJUSTMENTS_CLASS_NAME} #TextAreaChatLog[data-colortheme="dark2"] div.ChatMessageWhisper {
			color: #828282;
		}
		#TextAreaChatLog[data-colortheme="dark"] a,
		#TextAreaChatLog[data-colortheme="dark2"] a,
		.bce-message a {
			color: #a9ceff;
		}
		#TextAreaChatLog[data-colortheme="dark"] a:visited,
		#TextAreaChatLog[data-colortheme="dark2"] a:visited,
		.bce-message a {
			color: #3d91ff;
		}
		.${GLASSES_BLIND_CLASS} {
			filter: blur(0.24vw);
		}
		.${WHISPER_CLASS} {
			font-style: italic;
		}
		.${BCE_COLOR_ADJUSTMENTS_CLASS_NAME} .${DARK_INPUT_CLASS} {
			background-color: #111;
			color: #eee;
			border-color: #333;
		}
		a.bce-button {
			text-decoration: none;
		}
		.bce-hidden {
			display: none !important;
		}
		.bce-false-hidden {
			position: absolute;
			border: 0;
			margin: 0;
			padding: 0;
			top: 0;
			left: 0;
			width: 0.1px;
			height: 0.1px;
			opacity: 0.01;
		}
		#bce-instant-messenger {
			display: flex;
			z-index: 100;
			position: fixed;
			width: 80%;
			height: 70%;
			top: 5%;
			left: 10%;
			padding: 0;
			margin: 0;
			flex-direction: row;
			background-color: #111;
			color: #eee;
			border: 0.2em solid white;
		}
		#bce-friend-list {
			width: 100%;
			overflow-x: hidden;
			overflow-y: scroll;
		}
		.bce-friend-list-entry {
			padding: 1em;
		}
		.bce-friend-list-entry-name {
			font-weight: bold;
			display: flex;
			flex-direction: column;
		}
		.bce-friend-list-selected {
			font-style: italic;
			border-top: 0.1em solid white;
			border-bottom: 0.1em solid white;
			background-color: #222;
		}
		#bce-message-container {
			width: 100%;
			height: 90%;
			font-size: 1.5rem;
			font-family: Arial, sans-serif;
		}
		#bce-message-right-container {
			width: 80%;
			display: flex;
			flex-direction: column;
			border-left: 0.1em solid white;
		}
		#bce-message-input {
			width: 100%;
			height: 10%;
			border: 0;
			padding: 0;
			margin: 0;
			background-color: #222;
			color: #eee;
			font-size: 1.5rem;
		}
		.bce-friend-list-unread {
			background-color: #a22;
		}
		.bce-message-divider {
			margin: 0.5em 2em;
			border-bottom: 0.2em solid white;
		}
		.bce-message {
			padding: 0.2em 0.4em;
			position: relative;
		}
		.bce-message::before {
			content: attr(data-time);
			float: right;
			color: gray;
			font-size: 0.5em;
			margin-right: 0.2em;
			font-style: italic;
		}
		.bce-message-sender {
			text-shadow: 0.05em 0.05em #eee;
			font-weight: bold;
		}
		.bce-message-Emote, .bce-message-Action {
			font-style: italic;
			color: gray;
		}
		.bce-message-Message .bce-message-sender {
			text-shadow: 0.05em 0.05em #eee;
		}
		.bce-friend-history {
			overflow-y: scroll;
			overflow-x: hidden;
			height: 100%;
		}
		.bce-friend-list-handshake-false,
		.bce-friend-list-handshake-pending {
			text-decoration: line-through;
			color: gray;
		}
		#bce-message-left-container {
			display: flex;
			flex-direction: column;
			width: 20%;
			height: 100%;
		}
		#bce-friend-search {
			border: 0;
			border-bottom: 0.1em solid white;
			padding: 0.5em;
			height: 1em;
			background-color: #222;
			color: #eee;
		}
		.bce-profile-open {
			margin-right: 0.5em;
		}
		`;
		const head = document.head || document.getElementsByTagName("head")[0];
		const style = document.createElement("style");
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
	}

	function chatAugments() {
		// CTRL+Enter OOC implementation
		patchFunction(
			"ChatRoomKeyDown",
			{
				"ChatRoomSendChat()":
					'if (bceSettingValue("ctrlEnterOoc") && event.ctrlKey && ElementValue("InputChat")?.trim()) ElementValue("InputChat", "(" + ElementValue("InputChat"));ChatRoomSendChat()',
			},
			"No OOC on CTRL+Enter."
		);

		// CommandParse patch for link OOC in whispers
		patchFunction(
			"CommandParse",
			{
				"// Regular chat":
					"// Regular chat\nmsg = bceMessageReplacements(msg);",
				"// The whispers get sent to the server and shown on the client directly":
					"// The whispers get sent to the server and shown on the client directly\nmsg = bceMessageReplacements(msg);",
			},
			"No link or OOC parsing for sent whispers."
		);

		const startSounds = ["..", "--"];
		const endSounds = ["...", "~", "~..", "~~", "..~"];
		const eggedSounds = [
			"ah",
			"aah",
			"mnn",
			"nn",
			"mnh",
			"mngh",
			"haa",
			"nng",
			"mnng",
		];
		/**
		 * StutterWord will add s-stutters to the beginning of words and return 1-2 words, the original word with its stutters and a sound, based on arousal
		 * @type {(word: string, forceStutter?: boolean) => string[]}
		 */
		function stutterWord(word, forceStutter) {
			if (!word?.length) {
				return [word];
			}

			/** @type {(wrd: string) => string} */
			const addStutter = (wrd) =>
				/^\p{L}/u.test(wrd)
					? `${wrd.substring(0, /\uD800-\uDFFF/u.test(wrd[0]) ? 2 : 1)}-${wrd}`
					: wrd;

			const maxIntensity = Math.max(
				0,
				...Player.Appearance.filter((a) => a.Property?.Intensity > -1).map(
					(a) => a.Property.Intensity
				)
			);

			const eggedBonus = maxIntensity * 5;
			const chanceToStutter =
				(Math.max(0, Player.ArousalSettings.Progress - 10 + eggedBonus) * 0.5) /
				100;

			const chanceToMakeSound =
				(Math.max(
					0,
					Player.ArousalSettings.Progress / 2 - 20 + eggedBonus * 2
				) *
					0.5) /
				100;

			const r = Math.random();
			for (let i = Math.min(4, Math.max(1, maxIntensity)); i >= 1; i--) {
				if (
					r < chanceToStutter / i ||
					(i === 1 && forceStutter && chanceToStutter > 0)
				) {
					word = addStutter(word);
				}
			}
			const results = [word];
			if (maxIntensity > 0 && Math.random() < chanceToMakeSound) {
				const startSound =
					startSounds[Math.floor(Math.random() * startSounds.length)];
				const sound =
					eggedSounds[Math.floor(Math.random() * eggedSounds.length)];
				const endSound =
					endSounds[Math.floor(Math.random() * endSounds.length)];
				results.push(" ", `${startSound}${displayText(sound)}${endSound}`);
			}
			return results;
		}

		w.bceMessageReplacements = (msg) => {
			const words = [msg];
			let firstStutter = true,
				inOOC = false;
			const newWords = [];
			for (let i = 0; i < words.length; i++) {
				// Handle other whitespace
				const whitespaceIdx = words[i].search(/[\s\r\n]/u);
				if (whitespaceIdx >= 1) {
					// Insert remainder into list of words
					words.splice(i + 1, 0, words[i].substring(whitespaceIdx));
					// Truncate current word to whitespace
					words[i] = words[i].substring(0, whitespaceIdx);
				} else if (whitespaceIdx === 0) {
					// Insert remainder into list of words
					words.splice(i + 1, 0, words[i].substring(1));
					// Keep space in the message
					[words[i]] = words[i];
					newWords.push(words[i]);
					continue;
				}
				// Handle OOC
				const oocIdx = words[i].search(/[()]/u);
				if (oocIdx > 0) {
					// Insert remainder into list of words
					words.splice(i + 1, 0, words[i].substring(oocIdx + 1));
					// Insert OOC marker into list of words, before remainder
					words.splice(i + 1, 0, words[i].substring(oocIdx, oocIdx + 1));
					// Truncate current word to OOC
					words[i] = words[i].substring(0, oocIdx);
				} else if (oocIdx === 0 && words[i].length > 1) {
					// Insert remainder into list of words
					words.splice(i + 1, 0, words[i].substring(1));
					// Keep OOC marker in the message
					[words[i]] = words[i];
				}

				if (words[i] === "(") {
					inOOC = true;
				}

				if (bceParseUrl(words[i]) && !inOOC) {
					newWords.push("( ");
					newWords.push(words[i]);
					newWords.push(" )");
				} else if (bceSettings.stutters && !inOOC) {
					newWords.push(...stutterWord(words[i], firstStutter));
					firstStutter = false;
				} else {
					newWords.push(words[i]);
				}

				if (words[i] === ")") {
					inOOC = false;
				}
			}
			return newWords.join("");
		};

		function bceChatAugments() {
			if (CurrentScreen !== "ChatRoom" || !bceSettings.augmentChat) {
				return;
			}
			const chatLogContainerId = "TextAreaChatLog",
				// Handle chat events
				handledAttributeName = "data-bce-handled",
				unhandledChat = document.querySelectorAll(
					`.ChatMessage:not([${handledAttributeName}=true])`
				);
			for (const chatMessageElement of unhandledChat) {
				chatMessageElement.setAttribute(handledAttributeName, "true");
				if (
					chatMessageElement.classList.contains("ChatMessageChat") ||
					chatMessageElement.classList.contains("ChatMessageWhisper")
				) {
					const scrolledToEnd = ElementIsScrolledToEnd(chatLogContainerId);
					// eslint-disable-next-line no-loop-func
					const scrollToEnd = () => {
						if (scrolledToEnd) {
							ElementScrollToEnd(chatLogContainerId);
						}
					};
					processChatAugmentsForLine(chatMessageElement, scrollToEnd);
					if (scrolledToEnd) {
						ElementScrollToEnd(chatLogContainerId);
					}
				}
			}
		}

		createTimer(bceChatAugments, 500);
	}

	async function automaticExpressions() {
		await waitFor(() => CurrentScreen === "ChatRoom");

		patchFunction(
			"StruggleStrength",
			{
				'CharacterSetFacialExpression(Player, "Blush", "Low");':
					'CharacterSetFacialExpression(Player, "Blush", "Low", 10);',
				'CharacterSetFacialExpression(Player, "Blush", "Medium");':
					'CharacterSetFacialExpression(Player, "Blush", "Medium", 10);',
				'CharacterSetFacialExpression(Player, "Blush", "High");':
					'CharacterSetFacialExpression(Player, "Blush", "High", 10);',
				'CharacterSetFacialExpression(Player, "Fluids", "DroolMessy");':
					'CharacterSetFacialExpression(Player, "Fluids", "DroolMessy", 10);',
				'CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null);':
					'CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null, 10);',
				"StruggleProgressStruggleCount ==": "StruggleProgressStruggleCount >=",
			},
			"Resetting blush, fluids and eyebrows after brute force struggling"
		);

		patchFunction(
			"StruggleFlexibility",
			{
				'CharacterSetFacialExpression(Player, "Blush", "Low");':
					'CharacterSetFacialExpression(Player, "Blush", "Low", 10);',
				'CharacterSetFacialExpression(Player, "Blush", "Medium");':
					'CharacterSetFacialExpression(Player, "Blush", "Medium", 10);',
				'CharacterSetFacialExpression(Player, "Blush", "High");':
					'CharacterSetFacialExpression(Player, "Blush", "High", 10);',
				'CharacterSetFacialExpression(Player, "Eyes2", "Closed");':
					'CharacterSetFacialExpression(Player, "Eyes2", "Closed", 10);',
				'CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null);':
					'CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null, 10);',
				"StruggleProgressStruggleCount ==": "StruggleProgressStruggleCount >=",
			},
			"Resetting blush, eyes2 and eyebrows after flexibility struggling"
		);

		patchFunction(
			"StruggleDexterity",
			{
				'CharacterSetFacialExpression(Player, "Blush", "Low");':
					'CharacterSetFacialExpression(Player, "Blush", "Low", 10);',
				'CharacterSetFacialExpression(Player, "Blush", "Medium");':
					'CharacterSetFacialExpression(Player, "Blush", "Medium", 10);',
				'CharacterSetFacialExpression(Player, "Blush", "High");':
					'CharacterSetFacialExpression(Player, "Blush", "High", 10);',
				'CharacterSetFacialExpression(Player, "Eyes", "Dazed");':
					'CharacterSetFacialExpression(Player, "Eyes", "Dazed", 10);',
				'CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null);':
					'CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null, 10);',
				"StruggleProgressStruggleCount ==": "StruggleProgressStruggleCount >=",
			},
			"Resetting blush, eyes and eyebrows after dexterity struggling"
		);

		if (!w.bce_ArousalExpressionStages) {
			// eslint-disable-next-line camelcase
			w.bce_ArousalExpressionStages = {
				Blush: [
					{ Expression: "High", Limit: 100 },
					{ Expression: "Medium", Limit: 60 },
					{ Expression: "Low", Limit: 10 },
					{ Expression: null, Limit: 0 },
				],
				Eyebrows: [
					{ Expression: "Soft", Limit: 80 },
					{ Expression: "Lowered", Limit: 50 },
					{ Expression: "Raised", Limit: 20 },
					{ Expression: null, Limit: 0 },
				],
				Fluids: [
					{ Expression: "DroolMedium", Limit: 100 },
					{ Expression: "DroolLow", Limit: 40 },
					{ Expression: null, Limit: 0 },
				],
				Eyes: [
					{ Expression: "Closed", Limit: 100 },
					{ Expression: "Surprised", Limit: 90 },
					{ Expression: "Horny", Limit: 70 },
					{ Expression: "Dazed", Limit: 20 },
					{ Expression: null, Limit: 0 },
				],
				Eyes2: [
					{ Expression: "Closed", Limit: 100 },
					{ Expression: "Surprised", Limit: 90 },
					{ Expression: "Horny", Limit: 70 },
					{ Expression: "Dazed", Limit: 20 },
					{ Expression: null, Limit: 0 },
				],
			};
		}

		/** @type {{[key: string]: string[]}} */
		const bceExpressionModifierMap = Object.freeze({
			Blush: [null, "Low", "Medium", "High", "VeryHigh", "Extreme"],
		});

		const AUTOMATED_AROUSAL_EVENT_TYPE = "AutomatedByArousal",
			DEFAULT_EVENT_TYPE = "DEFAULT",
			MANUAL_OVERRIDE_EVENT_TYPE = "ManualOverride",
			POST_ORGASM_EVENT_TYPE = "PostOrgasm";

		/** @type {ExpressionEvent[]} */
		const bceExpressionsQueue = [];
		let lastUniqueId = 0;

		/** @type {() => number} */
		function newUniqueId() {
			lastUniqueId = (lastUniqueId + 1) % (Number.MAX_SAFE_INTEGER - 1);
			return lastUniqueId;
		}

		/** @type {(evt: ExpressionEvent) => void} */
		function pushEvent(evt) {
			if (!evt) {
				return;
			}
			switch (evt.Type) {
				case AUTOMATED_AROUSAL_EVENT_TYPE:
				case POST_ORGASM_EVENT_TYPE:
					if (!bceSettings.expressions) {
						return;
					}
					break;
				case MANUAL_OVERRIDE_EVENT_TYPE:
					break;
				default:
					if (!bceSettings.activityExpressions) {
						return;
					}
			}
			const time = Date.now();
			// Deep copy
			/** @type {ExpressionEvent} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const event = JSON.parse(JSON.stringify(evt));
			event.At = time;
			event.Until = time + event.Duration;
			event.Id = newUniqueId();
			if (typeof event.Priority !== "number") {
				event.Priority = 1;
			}
			if (event.Expression) {
				for (const t of Object.values(event.Expression)) {
					for (const exp of t) {
						exp.Id = newUniqueId();
						if (typeof exp.Priority !== "number") {
							exp.Priority = 1;
						}
						if (typeof exp.Duration !== "number") {
							exp.Duration = event.Duration;
						}
					}
				}
			}
			if (event.Poses) {
				for (const p of event.Poses) {
					p.Id = newUniqueId();
					if (typeof p.Priority !== "number") {
						p.Priority = 1;
					}
					p.Pose = p.Pose.map(
						// eslint-disable-next-line no-loop-func
						(
							/** @type {string | PoseEx} */
							v
						) => {
							/** @type {string} */
							// @ts-ignore
							const poseName = v;
							return {
								Pose: poseName,
								Category: PoseFemale3DCG.find((a) => a.Name === v)?.Category,
							};
						}
					);
				}
			}
			bceExpressionsQueue.push(event);
		}

		if (!w.bce_EventExpressions) {
			// eslint-disable-next-line camelcase
			w.bce_EventExpressions = {
				PostOrgasm: {
					Type: POST_ORGASM_EVENT_TYPE,
					Duration: 20000,
					Priority: 10000,
					Expression: {
						Blush: [
							{ Expression: "Extreme", Duration: 5000 },
							{ ExpressionModifier: -1, Duration: 5000 },
							{ ExpressionModifier: -1, Duration: 5000, Priority: 1000 },
							{ ExpressionModifier: -1, Duration: 5000, Priority: 200 },
						],
						Eyes: [
							{ Expression: "Closed", Duration: 8500 },
							{ Expression: "Heart", Duration: 7500 },
							{ Expression: "Sad", Duration: 4000, Priority: 200 },
						],
						Eyes2: [
							{ Expression: "Closed", Duration: 8000 },
							{ Expression: "Heart", Duration: 8000 },
							{ Expression: "Sad", Duration: 4000, Priority: 200 },
						],
						Mouth: [
							{ Expression: "Ahegao", Duration: 5000 },
							{ Expression: "Moan", Duration: 5000 },
							{ Expression: "HalfOpen", Duration: 10000, Priority: 200 },
						],
						Fluids: [
							{ Expression: "DroolMessy", Duration: 5000 },
							{ Expression: "DroolSides", Duration: 9000, Priority: 400 },
							{ Expression: "DroolLow", Duration: 6000, Priority: 200 },
						],
						Eyebrows: [
							{ Expression: "Soft", Duration: 10000 },
							{ Expression: "Lowered", Duration: 5000, Priority: 200 },
							{ Expression: null, Duration: 5000, Priority: 1 },
						],
					},
				},
				Pout: {
					Type: "Pout",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Pout", Duration: -1 }],
						Eyes: [{ Expression: "Dazed", Duration: -1 }],
						Eyes2: [{ Expression: "Dazed", Duration: -1 }],
						Eyebrows: [{ Expression: "Harsh", Duration: -1 }],
					},
				},
				ResetBrows: {
					Type: "ResetBrows",
					Duration: -1,
					Expression: {
						Eyebrows: [{ Expression: null, Duration: -1 }],
					},
				},
				RaiseBrows: {
					Type: "RaiseBrows",
					Duration: -1,
					Expression: {
						Eyebrows: [{ Expression: "Raised", Duration: -1 }],
					},
				},
				Confused: {
					Type: "Confused",
					Duration: -1,
					Expression: {
						Eyebrows: [{ Expression: "OneRaised", Duration: -1 }],
					},
				},
				Smirk: {
					Type: "Smirk",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Smirk", Duration: -1 }],
					},
				},
				Wink: {
					Type: "Wink",
					Duration: 1500,
					Expression: {
						Eyes: [{ Expression: "Closed", Duration: 1500 }],
					},
				},
				Laugh: {
					Type: "Laugh",
					Duration: 8000,
					Expression: {
						Mouth: [
							{ Expression: "Laughing", Duration: 1000 },
							{ Expression: "Grin", Duration: 200 },
							{ Expression: "Laughing", Duration: 1000 },
							{ Expression: "Happy", Duration: 200 },
							{ Expression: "Laughing", Duration: 800 },
							{ Expression: "Grin", Duration: 400 },
							{ Expression: "Laughing", Duration: 800 },
							{ Expression: "Happy", Duration: 400 },
							{ Expression: "Laughing", Duration: 600 },
							{ Expression: "Grin", Duration: 600 },
							{ Expression: "Laughing", Duration: 600 },
							{ Expression: "Happy", Duration: 600 },
							{ Expression: "Laughing", Duration: 200 },
							{ Expression: "Grin", Duration: 200 },
							{ Expression: "Laughing", Duration: 200 },
							{ Expression: "Happy", Duration: 200 },
						],
					},
				},
				Giggle: {
					Type: "Giggle",
					Duration: 4000,
					Expression: {
						Mouth: [
							{ Expression: "Laughing", Duration: 800 },
							{ Expression: "Grin", Duration: 200 },
							{ Expression: "Laughing", Duration: 700 },
							{ Expression: "Happy", Duration: 200 },
							{ Expression: "Laughing", Duration: 600 },
							{ Expression: "Grin", Duration: 200 },
							{ Expression: "Laughing", Duration: 500 },
							{ Expression: "Grin", Duration: 200 },
							{ Expression: "Laughing", Duration: 400 },
							{ Expression: "Happy", Duration: 200 },
						],
					},
				},
				Chuckle: {
					Type: "Chuckle",
					Duration: 4000,
					Expression: {
						Mouth: [{ Expression: "Grin", Duration: 4000 }],
					},
				},
				Smile: {
					Type: "Smile",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Grin", Duration: -1 }],
					},
				},
				Blink: {
					Type: "Blink",
					Duration: 200,
					Expression: {
						Eyes: [{ Expression: "Closed", Duration: 200 }],
						Eyes2: [{ Expression: "Closed", Duration: 200 }],
					},
				},
				Grin: {
					Type: "Grin",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: "Horny", Duration: -1 }],
						Eyes2: [{ Expression: "Horny", Duration: -1 }],
						Mouth: [{ Expression: "Grin", Duration: -1 }],
					},
				},
				Cuddle: {
					Type: "Cuddle",
					Duration: 10000,
					Priority: 150,
					Expression: {
						Mouth: [{ Expression: "Happy", Duration: 10000 }],
						Eyes: [{ Expression: "ShylyHappy", Duration: 10000 }],
						Eyes2: [{ Expression: "ShylyHappy", Duration: 10000 }],
						Eyebrows: [{ Expression: "Raised", Duration: 10000 }],
					},
				},
				Blush: {
					Type: "Blush",
					Duration: 10000,
					Expression: {
						Blush: [{ ExpressionModifier: 1, Duration: 10000 }],
					},
				},
				Choke: {
					Type: "Choke",
					Duration: 4000,
					Priority: 150,
					Expression: {
						Blush: [{ ExpressionModifier: 3, Duration: 4000 }],
						Eyes: [
							{ Expression: "VeryLewd", Duration: 3000 },
							{ Expression: "Sad", Duration: 1000 },
						],
						Eyes2: [
							{ Expression: "VeryLewd", Duration: 3000 },
							{ Expression: "Sad", Duration: 1000 },
						],
						Eyebrows: [{ Expression: "Harsh", Duration: 4000 }],
					},
				},
				Stimulated: {
					Type: "Stimulated",
					Duration: 5000,
					Priority: 400,
					Expression: {
						Blush: [{ ExpressionModifier: 2, Duration: 5000 }],
						Eyes: [
							{ Expression: "VeryLewd", Duration: 4000 },
							{ Expression: "Sad", Duration: 1000 },
						],
						Eyes2: [
							{ Expression: "VeryLewd", Duration: 4000 },
							{ Expression: "Sad", Duration: 1000 },
						],
						Eyebrows: [{ Expression: "Soft", Duration: 5000 }],
					},
				},
				StimulatedLong: {
					Type: "StimulatedLong",
					Duration: 20000,
					Priority: 400,
					Expression: {
						Blush: [{ ExpressionModifier: 1, Duration: 20000 }],
					},
				},
				Shock: {
					Type: "Shock",
					Duration: 15000,
					Priority: 1000,
					Expression: {
						Blush: [
							{ ExpressionModifier: 5, Duration: 10000 },
							{ ExpressionModifier: -1, Duration: 2000 },
							{ ExpressionModifier: -1, Duration: 2000 },
							{ ExpressionModifier: -1, Duration: 1000 },
						],
						Eyes: [
							{ Expression: "Dizzy", Duration: 1000 },
							{ Expression: "Scared", Duration: 8000 },
							{ Expression: "Surprised", Duration: 7000 },
						],
						Eyes2: [
							{ Expression: "Dizzy", Duration: 1000 },
							{ Expression: "Scared", Duration: 8000 },
							{ Expression: "Surprised", Duration: 7000 },
						],
						Eyebrows: [{ Expression: "Soft", Duration: 15000 }],
						Mouth: [
							{ Expression: "Pained", Duration: 10000 },
							{ Expression: "Angry", Duration: 5000 },
						],
					},
				},
				ShockLight: {
					Type: "ShockLight",
					Duration: 5000,
					Priority: 900,
					Expression: {
						Blush: [{ ExpressionModifier: 2, Duration: 5000 }],
						Eyes: [
							{ Expression: "Dizzy", Duration: 2000 },
							{ Expression: "Surprised", Duration: 3000 },
						],
						Eyes2: [
							{ Expression: "Dizzy", Duration: 2000 },
							{ Expression: "Surprised", Duration: 3000 },
						],
						Eyebrows: [{ Expression: "Soft", Duration: 5000 }],
						Mouth: [{ Expression: "Angry", Duration: 5000 }],
					},
				},
				Hit: {
					Type: "Hit",
					Duration: 7000,
					Priority: 500,
					Expression: {
						Blush: [{ Expression: "VeryHigh", Duration: 7000 }],
						Eyes: [
							{ Expression: "Daydream", Duration: 1000 },
							{ Expression: "Closed", Duration: 3000 },
							{ Expression: "Daydream", Duration: 3000 },
						],
						Eyes2: [
							{ Expression: "Daydream", Duration: 1000 },
							{ Expression: "Closed", Duration: 3000 },
							{ Expression: "Daydream", Duration: 3000 },
						],
						Eyebrows: [{ Expression: "Soft", Duration: 7000 }],
					},
				},
				Spank: {
					Type: "Spank",
					Duration: 3000,
					Priority: 300,
					Expression: {
						Eyes: [{ Expression: "Lewd", Duration: 3000 }],
						Eyes2: [{ Expression: "Lewd", Duration: 3000 }],
						Eyebrows: [{ Expression: "Soft", Duration: 3000 }],
					},
				},
				Kiss: {
					Type: "Kiss",
					Duration: 2000,
					Priority: 200,
					Expression: {
						Mouth: [{ Expression: "HalfOpen", Duration: 2000 }],
					},
				},
				KissOnLips: {
					Type: "KissOnLips",
					Duration: 2000,
					Priority: 200,
					Expression: {
						Eyes: [{ Expression: "Closed", Duration: 2000 }],
						Eyes2: [{ Expression: "Closed", Duration: 2000 }],
						Mouth: [{ Expression: "HalfOpen", Duration: 2000 }],
						Blush: [
							{ Skip: true, Duration: 1000 },
							{ ExpressionModifier: 1, Duration: 1000 },
						],
					},
				},
				LongKiss: {
					Type: "LongKiss",
					Duration: 4000,
					Priority: 200,
					Expression: {
						Eyes: [{ Expression: "Closed", Duration: 4000 }],
						Eyes2: [{ Expression: "Closed", Duration: 4000 }],
						Mouth: [{ Expression: "Open", Duration: 4000 }],
						Blush: [
							{ Skip: true, Duration: 1000 },
							{ ExpressionModifier: 1, Duration: 1000 },
							{ ExpressionModifier: 1, Duration: 2000 },
						],
					},
				},
				Disoriented: {
					Type: "Disoriented",
					Duration: 8000,
					Priority: 250,
					Expression: {
						Eyes: [{ Expression: "Dizzy", Duration: 8000 }],
						Eyes2: [{ Expression: "Dizzy", Duration: 8000 }],
						Eyebrows: [{ Expression: "Raised", Duration: 8000 }],
						Blush: [{ ExpressionModifier: 2, Duration: 8000 }],
					},
				},
				Angry: {
					Type: "Angry",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Angry", Duration: -1 }],
						Eyes: [{ Expression: "Angry", Duration: -1 }],
						Eyes2: [{ Expression: "Angry", Duration: -1 }],
						Eyebrows: [{ Expression: "Angry", Duration: -1 }],
					},
				},
				Sad: {
					Type: "Sad",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Frown", Duration: -1 }],
						Eyes: [{ Expression: "Shy", Duration: -1 }],
						Eyes2: [{ Expression: "Shy", Duration: -1 }],
						Eyebrows: [{ Expression: "Soft", Duration: -1 }],
					},
				},
				Worried: {
					Type: "Worried",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: "Surprised", Duration: -1 }],
						Eyes2: [{ Expression: "Surprised", Duration: -1 }],
						Eyebrows: [{ Expression: "Soft", Duration: -1 }],
					},
				},
				Distressed: {
					Type: "Distressed",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: "Scared", Duration: -1 }],
						Eyes2: [{ Expression: "Scared", Duration: -1 }],
						Eyebrows: [{ Expression: "Soft", Duration: -1 }],
						Mouth: [{ Expression: "Angry", Duration: -1 }],
					},
				},
				Reset: {
					Type: "Reset",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: null, Duration: -1 }],
						Eyes: [{ Expression: null, Duration: -1 }],
						Eyes2: [{ Expression: null, Duration: -1 }],
						Eyebrows: [{ Expression: null, Duration: -1 }],
						Blush: [{ Expression: null, Duration: -1 }],
						Fluids: [{ Expression: null, Duration: -1 }],
					},
				},
				Cry: {
					Type: "Cry",
					Duration: -1,
					Expression: {
						Fluids: [{ Expression: "TearsMedium", Duration: -1 }],
					},
				},
				DroolReset: {
					Type: "DroolReset",
					Duration: -1,
					Expression: {
						Fluids: [{ Expression: null, Duration: -1 }],
					},
				},
				DroolSides: {
					Type: "DroolSides",
					Duration: -1,
					Expression: {
						Fluids: [{ Expression: "DroolSides", Duration: -1 }],
					},
				},
				BareTeeth: {
					Type: "BareTeeth",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Angry", Duration: -1 }],
					},
				},
				Happy: {
					Type: "Happy",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Happy", Duration: -1 }],
					},
				},
				Frown: {
					Type: "Frown",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Frown", Duration: -1 }],
					},
				},
				Glare: {
					Type: "Glare",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: "Angry", Duration: -1 }],
						Eyes2: [{ Expression: "Angry", Duration: -1 }],
						Eyebrows: [{ Expression: "Harsh", Duration: -1 }],
					},
				},
				NarrowEyes: {
					Type: "NarrowEyes",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: "Horny", Duration: -1 }],
						Eyes2: [{ Expression: "Horny", Duration: -1 }],
					},
				},
				OpenEyes: {
					Type: "OpenEyes",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: null, Duration: -1 }],
						Eyes2: [{ Expression: null, Duration: -1 }],
					},
				},
				CloseEyes: {
					Type: "CloseEyes",
					Duration: -1,
					Expression: {
						Eyes: [{ Expression: "Closed", Duration: -1 }],
						Eyes2: [{ Expression: "Closed", Duration: -1 }],
					},
				},
				CloseMouth: {
					Type: "CloseMouth",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: null, Duration: -1 }],
					},
				},
				OpenMouth: {
					Type: "OpenMouth",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "Moan", Duration: -1 }],
					},
				},
				LipBite: {
					Type: "LipBite",
					Duration: -1,
					Expression: {
						Mouth: [{ Expression: "LipBite", Duration: -1 }],
					},
				},
				Lick: {
					Type: "Lick",
					Duration: 4000,
					Priority: 200,
					Expression: {
						Mouth: [{ Expression: "Ahegao", Duration: 4000 }],
						Blush: [{ ExpressionModifier: 1, Duration: 4000 }],
					},
				},
				GagInflate: {
					Type: "GagInflate",
					Duration: 4000,
					Priority: 400,
					Expression: {
						Eyes: [{ Expression: "Lewd", Duration: 4000 }],
						Eyes2: [{ Expression: "Lewd", Duration: 4000 }],
						Blush: [
							{ ExpressionModifier: 2, Duration: 2000 },
							{ ExpressionModifier: -1, Duration: 2000 },
						],
					},
				},
				Iced: {
					Type: "Iced",
					Duration: 4000,
					Priority: 500,
					Expression: {
						Eyes: [
							{ Expression: "Surprised", Duration: 3000 },
							{ Expression: null, Duration: 1000 },
						],
						Eyes2: [
							{ Expression: "Surprised", Duration: 3000 },
							{ Expression: null, Duration: 1000 },
						],
						Mouth: [{ Expression: "Angry", Duration: 4000 }],
					},
				},
				AllFours: {
					Type: "AllFours",
					Duration: -1,
					Poses: [{ Pose: ["AllFours"], Duration: -1 }],
				},
				SpreadKnees: {
					Type: "SpreadKnees",
					Duration: -1,
					Poses: [{ Pose: ["KneelingSpread"], Duration: -1 }],
				},
				Hogtied: {
					Type: "Hogtied",
					Duration: -1,
					Poses: [{ Pose: ["Hogtied"], Duration: -1 }],
				},
				Handstand: {
					Type: "Handstand",
					Duration: -1,
					Poses: [{ Pose: ["Suspension", "OverTheHead"], Duration: -1 }],
				},
				Stretch: {
					Type: "Stretch",
					Priority: 100,
					Duration: 6000,
					Poses: [
						{ Pose: ["OverTheHead"], Duration: 1000 },
						{ Pose: ["Yoked"], Duration: 1000 },
						{ Pose: ["BaseUpper"], Duration: 1000 },
						{ Pose: ["Spread"], Duration: 1000 },
						{ Pose: ["LegsClosed"], Duration: 1000 },
						{ Pose: ["BaseLower"], Duration: 1000 },
					],
				},
				SpreadLegs: {
					Type: "SpreadLegs",
					Duration: -1,
					Poses: [{ Pose: ["Spread"], Duration: -1 }],
				},
				JumpingJacks: {
					Type: "JumpingJacks",
					Priority: 100,
					Duration: 8000,
					Poses: [
						{ Pose: ["OverTheHead", "Spread"], Duration: 1000 },
						{ Pose: ["BaseUpper", "LegsClosed"], Duration: 1000 },
						{ Pose: ["OverTheHead", "Spread"], Duration: 1000 },
						{ Pose: ["BaseUpper", "LegsClosed"], Duration: 1000 },
						{ Pose: ["OverTheHead", "Spread"], Duration: 1000 },
						{ Pose: ["BaseUpper", "LegsClosed"], Duration: 1000 },
						{ Pose: ["OverTheHead", "Spread"], Duration: 1000 },
						{ Pose: ["BaseUpper", "LegsClosed"], Duration: 1000 },
					],
				},
			};
		}

		if (!w.bce_ActivityTriggers) {
			// eslint-disable-next-line camelcase
			w.bce_ActivityTriggers = [
				{
					Event: "Blush",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-ItemMouth-PoliteKiss$/u,
						},
					],
				},
				{
					Event: "Stretch",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^stretches($| her)/u,
						},
					],
				},
				{
					Event: "JumpingJacks",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^does jumping[ -]?jacks/u,
						},
					],
				},
				{
					Event: "AllFours",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(gets on all fours|starts crawling)/u,
						},
					],
				},
				{
					Event: "SpreadKnees",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^spreads(( her legs)? on)? her knees/u,
						},
					],
				},
				{
					Event: "SpreadLegs",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^spreads her legs/u,
						},
					],
				},
				{
					Event: "Handstand",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(does a handstand|stands on her hands)/u,
						},
					],
				},
				{
					Event: "Hogtied",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^lies( down)? on (the floor|her (tummy|stomach))/u,
						},
					],
				},
				{
					Event: "Blush",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^blushes/u,
						},
					],
				},
				{
					Event: "Chuckle",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^chuckles/u,
						},
					],
				},
				{
					Event: "Laugh",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^laughs/u,
						},
					],
				},
				{
					Event: "Giggle",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^giggles/u,
						},
					],
				},
				{
					Event: "Smirk",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(smirk(s|ing)|.*with a smirk)/u,
						},
					],
				},
				{
					Event: "Wink",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^winks/u,
						},
					],
				},
				{
					Event: "Pout",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^pouts/u,
						},
					],
				},
				{
					Event: "Blink",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^blinks/u,
						},
					],
				},
				{
					Event: "Frown",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^frowns/u,
						},
					],
				},
				{
					Event: "Grin",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(grins|is grinning)/u,
						},
					],
				},
				{
					Event: "Confused",
					Type: "Emote",
					Matchers: [
						{
							Tester:
								/^((seems|looks) (confused|curious|suspicious)|raises an eyebrow)/u,
						},
					],
				},
				{
					Event: "CloseMouth",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^closes her mouth/u,
						},
					],
				},
				{
					Event: "OpenMouth",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^opens her mouth/u,
						},
					],
				},
				{
					Event: "Happy",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(looks|seems|is|gets|smiles) happ(il)?y/u,
						},
					],
				},
				{
					Event: "Smile",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^smiles/u,
						},
					],
				},
				{
					Event: "Distressed",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(looks|seems|is|gets) distressed/u,
						},
					],
				},
				{
					Event: "Sad",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(looks|seems|is|gets) sad/u,
						},
					],
				},
				{
					Event: "Worried",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(looks|seems|is|gets) (worried|surprised)/u,
						},
					],
				},
				{
					Event: "BareTeeth",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(bares her teeth|snarls)/u,
						},
					],
				},
				{
					Event: "Angry",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(looks angr(il)?y|(gets|is|seems) angry)/u,
						},
					],
				},
				{
					Event: "Glare",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^(glares|looks harshly|gives a (glare|harsh look))/u,
						},
					],
				},
				{
					Event: "OpenEyes",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^opens her eyes/u,
						},
					],
				},
				{
					Event: "NarrowEyes",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^((squints|narrows) her eyes|narrowly opens her eyes)/u,
						},
					],
				},
				{
					Event: "CloseEyes",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^closes her eyes/u,
						},
					],
				},
				{
					Event: "ResetBrows",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^lowers her eyebrows/u,
						},
					],
				},
				{
					Event: "RaiseBrows",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^raises her eyebrows/u,
						},
					],
				},
				{
					Event: "DroolSides",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^drools/u,
						},
					],
				},
				{
					Event: "Cry",
					Type: "Emote",
					Matchers: [
						{
							Tester:
								/^(starts to cry|sheds .* tears?|eyes( start( to)?)? leak)/u,
						},
					],
				},
				{
					Event: "Reset",
					Type: "Emote",
					Matchers: [
						{
							Tester: /^'s (expression|face) returns to normal/u,
						},
					],
				},
				{
					Event: "Shock",
					Type: "Action",
					Matchers: [
						{
							Tester:
								/^(ActionActivityShockItem|FuturisticVibratorShockTrigger|FuturisticChastityBeltShock\w+|(TriggerShock|(ShockCollar|Collar(Auto)?ShockUnit|(LoveChastityBelt|SciFiPleasurePanties)Shock)Trigger)(1|2))$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
					],
				},
				{
					Event: "ShockLight",
					Type: "Action",
					Matchers: [
						{
							Tester:
								/^(TriggerShock|(ShockCollar|Collar(Auto)?ShockUnit|(LoveChastityBelt|SciFiPleasurePanties)Shock)Trigger)0$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
					],
				},
				{
					Event: "Hit",
					Type: "Action",
					Matchers: [
						{
							Tester: /^ActionActivitySpankItem$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
					],
				},
				{
					Event: "Spank",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-ItemButt-Spank$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
						{
							Tester: /^ChatSelf-ItemButt-Spank$/u,
						},
					],
				},
				{
					Event: "Cuddle",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-.*-Cuddle$/u,
						},
						{
							Tester: /^ChatSelf-.*-Cuddle$/u,
						},
					],
				},
				{
					Event: "Stimulated",
					Type: "Action",
					Matchers: [
						{
							Tester: /^ActionActivityMasturbateItem$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
					],
				},
				{
					Event: "StimulatedLong",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-.*-(Masturbate|Penetrate).*$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
						{
							Tester: /^ChatSelf-.*-(Masturbate|Penetrate).*$/u,
						},
					],
				},
				{
					Event: "KissOnLips",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-ItemMouth-Kiss$/u,
						},
					],
				},
				{
					Event: "Kiss",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-.*-Kiss$/u,
							Criteria: {
								SenderIsPlayer: true,
							},
						},
					],
				},
				{
					Event: "Disoriented",
					Type: "Action",
					Matchers: [
						{
							Tester: /^(KneelDown|StandUp)Fail$/u,
						},
					],
				},
				{
					Event: "LipBite",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatSelf-ItemMouth-Bite$/u,
						},
					],
				},
				{
					Event: "Lick",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-.*-(Lick|MasturbateTongue)$/u,
							Criteria: {
								SenderIsPlayer: true,
							},
						},
					],
				},
				{
					Event: "DroolReset",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-ItemMouth-Caress$/u,
							Criteria: {
								TargetIsPlayer: true,
							},
						},
						{
							Tester: /^ChatSelf-ItemMouth-Caress$/u,
						},
					],
				},
				{
					Event: "LongKiss",
					Type: "Activity",
					Matchers: [
						{
							Tester: /^ChatOther-ItemMouth-FrenchKiss$/u,
						},
					],
				},
			];
		}

		registerSocketListener(
			"ChatRoomMessage",
			(
				/** @type {ChatMessage} */
				data
			) => {
				activityTriggers: for (const trigger of w.bce_ActivityTriggers.filter(
					(t) => t.Type === data.Type
				)) {
					for (const matcher of trigger.Matchers) {
						if (matcher.Tester.test(data.Content)) {
							if (matcher.Criteria) {
								if (
									matcher.Criteria.SenderIsPlayer &&
									data.Sender !== Player.MemberNumber
								) {
									continue;
								} else if (
									matcher.Criteria.TargetIsPlayer &&
									data.Dictionary?.find((t) =>
										/^(Target|Destination)Character(Name)?$/u.test(t.Tag)
									)?.MemberNumber !== Player.MemberNumber
								) {
									continue;
								} else if (
									matcher.Criteria.DictionaryMatchers &&
									!matcher.Criteria.DictionaryMatchers.some((m) =>
										data.Dictionary?.find((t) =>
											// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
											Object.keys(m).every((k) => m[k] === t[k])
										)
									)
								) {
									continue;
								}
								// Criteria met
								pushEvent(w.bce_EventExpressions[trigger.Event]);
							} else if (
								data.Sender === Player.MemberNumber ||
								data.Dictionary?.some(
									// eslint-disable-next-line no-loop-func
									(t) =>
										/^(Target|Destination)Character(Name)?$/u.test(t.Tag) &&
										t.MemberNumber === Player.MemberNumber
								)
							) {
								// Lacking criteria, check for presence of player as source or target
								pushEvent(w.bce_EventExpressions[trigger.Event]);
								break activityTriggers;
							}
						}
					}
				}
			}
		);

		/** @type {(faceComponent: string) => [string | null, boolean]} */
		function expression(t) {
			const properties = Player.Appearance.filter(
				(a) => a.Asset.Group.Name === t
			)[0].Property;
			return [properties?.Expression || null, !properties?.RemoveTimer];
		}

		/** @type {(faceComponent: string, newExpression: string, color: string) => void} */
		function setExpression(t, n, color) {
			if (!n) {
				n = null;
			}
			for (let i = 0; i < Player.Appearance.length; i++) {
				if (Player.Appearance[i].Asset.Group.Name === t) {
					if (!Player.Appearance[i].Property) {
						Player.Appearance[i].Property = {};
					}
					Player.Appearance[i].Property.Expression = n;
					if (color) {
						Player.Appearance[i].Color = color;
					}
					break;
				}
			}
		}

		/** @type {{[key: string]: { Conflicts: string[] }}} */
		const poseCategories = {
			BodyFull: {
				Conflicts: [
					"BodyUpper",
					"BodyLower",
					// eslint-disable-next-line no-undefined
					undefined,
				],
			},
			BodyUpper: {
				Conflicts: ["BodyFull"],
			},
			BodyLower: {
				Conflicts: ["BodyFull"],
			},
		};

		const faceComponents = [
			"Eyes",
			"Eyes2",
			"Eyebrows",
			"Mouth",
			"Fluids",
			"Emoticon",
			"Blush",
		];

		// When first initializing, set the current face as manual override
		pushEvent({
			Type: MANUAL_OVERRIDE_EVENT_TYPE,
			Duration: -1,
			Expression: faceComponents
				.map((t) => {
					const [expr] = expression(t);
					return [t, expr];
				})
				.filter((v) => v[1] !== null)
				.map((v) => [v[0], [{ Expression: v[1] }]])
				// eslint-disable-next-line no-inline-comments
				.reduce((a, v) => ({ ...a, [/** @type {string} */ (v[0])]: v[1] }), {}),
		});

		let lastOrgasm = 0,
			orgasmCount = 0,
			wasDefault = false;

		let PreviousArousal = Player.ArousalSettings;

		const ArousalMeterDirection = {
			None: 0,
			Down: 1,
			Up: 2,
		};
		let PreviousDirection = ArousalMeterDirection.Up;

		Commands.push({
			Tag: "r",
			Description: displayText(
				"[part of face or 'all']: resets expression overrides on part of or all of face"
			),
			Action: (args) => {
				if (args.length === 0 || args === "all") {
					bceExpressionsQueue.push(
						...bceExpressionsQueue
							.splice(0, bceExpressionsQueue.length)
							.filter((e) => e.Type === MANUAL_OVERRIDE_EVENT_TYPE && e.Poses)
					);
					bceChatNotify(displayText("Reset all expressions"));
				} else {
					const component = `${args[0].toUpperCase()}${args
						.substring(1)
						.toLowerCase()}`;
					for (const e of bceExpressionsQueue.filter((a) => a.Expression)) {
						if (component === "Eyes" && "Eyes2" in e.Expression) {
							delete e.Expression.Eyes2;
						}
						if (component in e.Expression) {
							delete e.Expression[component];
						}
					}
					bceChatNotify(
						displayText(`Reset expression on $component`, {
							$component: component,
						})
					);
				}
			},
		});

		Commands.push({
			Tag: "anim",
			Description: displayText("['list' or name of emote]: run an animation"),
			Action: (_1, _2, args) => {
				if (!bceSettings.activityExpressions) {
					bceChatNotify(
						displayText(
							"Activity expressions are not enabled in BCE settings. Unable to run animations."
						)
					);
					return;
				}
				if (args[0] === "list") {
					bceChatNotify(
						displayText(`Available animations: $anims`, {
							$anims: Object.keys(w.bce_EventExpressions).join(", "),
						})
					);
				}
				const animation = Object.keys(w.bce_EventExpressions).find(
					(a) => a.toLowerCase() === args[0]?.toLowerCase()
				);
				if (animation) {
					pushEvent(w.bce_EventExpressions[animation]);
				}
			},
		});

		Commands.push({
			Tag: "pose",
			Description: displayText("['list' or list of poses]: set your pose"),
			Action: (_1, _2, poses) => {
				if (poses[0] === "list") {
					const categories = [
						...new Set(PoseFemale3DCG.map((a) => a.Category)),
					];
					for (const category of categories) {
						const list = PoseFemale3DCG.filter(
							(a) => a.Category === category
						)?.map((a) => a.Name);
						list.sort();
						bceChatNotify(`=> ${category}:\n${list.join("\n")}\n\n`);
					}
					return;
				}
				if (!bceAnimationEngineEnabled()) {
					bceChatNotify(
						displayText(
							"Warning: both expression settings in BCE are disabled. Animation engine disabled. Pose may not be synchronized or set."
						)
					);
				}
				bceExpressionsQueue.forEach((e) => {
					if (e.Type === MANUAL_OVERRIDE_EVENT_TYPE) {
						e.Poses = [];
					} else if (e.Poses?.length > 0) {
						e.Poses.forEach((p) => {
							if (p.Pose.length === 0) {
								return;
							}
							if (typeof p.Pose[0] === "string") {
								return;
							}
							/** @type {PoseEx[]} */
							// @ts-ignore
							const poseList = p.Pose;
							p.Pose = poseList.filter((pp) => pp.Category);
						});
					}
				});
				CharacterSetActivePose(
					Player,
					PoseFemale3DCG.filter((p) =>
						poses.includes(p.Name.toLowerCase())
					).map((p) => p.Name),
					false
				);
			},
		});

		patchFunction(
			"TimerInventoryRemove",
			{
				CharacterSetFacialExpression: `if (!bceAnimationEngineEnabled()) CharacterSetFacialExpression`,
			},
			"Facial features resetting after item or struggle events"
		);

		SDK.hookFunction(
			"CharacterSetFacialExpression",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				// eslint-disable-next-line prefer-const
				let [C, AssetGroup, Expression, Timer, Color] = args;
				if (
					!isCharacter(C) ||
					!isString(AssetGroup) ||
					(!isString(Expression) && Expression !== null) ||
					!C.IsPlayer() ||
					!bceAnimationEngineEnabled()
				) {
					return next(args);
				}
				const duration =
						typeof Timer === "number" && Timer > 0 ? Timer * 1000 : -1,
					e = {},
					types = [AssetGroup];
				if (AssetGroup === "Eyes") {
					types.push("Eyes2");
				} else if (AssetGroup === "Eyes1") {
					types[0] = "Eyes";
				}
				if (
					!Color ||
					!isStringOrStringArray(Color) ||
					!CommonColorIsValid(Color)
				) {
					// eslint-disable-next-line no-undefined
					Color = undefined;
				}
				for (const t of types) {
					e[t] = [{ Expression, Duration: duration, Color }];
				}
				const evt = {
					Type: MANUAL_OVERRIDE_EVENT_TYPE,
					Duration: duration,
					Expression: e,
				};
				// @ts-ignore
				pushEvent(evt);
				return CustomArousalExpression();
			}
		);

		SDK.hookFunction(
			"CharacterSetActivePose",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				// eslint-disable-next-line prefer-const
				let [C, Pose] = args;
				if (
					!isCharacter(C) ||
					(!isStringOrStringArray(Pose) && Pose !== null) ||
					!C.IsPlayer() ||
					!bceAnimationEngineEnabled()
				) {
					return next(args);
				}
				if (!Pose || (Array.isArray(Pose) && Pose.every((p) => !p))) {
					Pose = ["BaseUpper", "BaseLower"];
				}
				const p = {};
				p.Pose = Array.isArray(Pose) ? Pose : [Pose];
				p.Duration = -1;
				const evt = {
					Type: MANUAL_OVERRIDE_EVENT_TYPE,
					Duration: -1,
					Poses: [p],
				};
				pushEvent(evt);
				return CustomArousalExpression();
			}
		);

		registerSocketListener(
			"ChatRoomSyncPose",
			(
				/** @type {{ MemberNumber: number; Character?: Character; Pose: string | string[]; }} */
				data
			) => {
				if (data === null || typeof data !== "object") {
					return;
				}
				if (!bceAnimationEngineEnabled()) {
					return;
				}
				if (data.MemberNumber === Player.MemberNumber) {
					CharacterSetActivePose(Player, data.Pose, true);
				}
			}
		);

		registerSocketListener(
			"ChatRoomSyncSingle",
			(
				/** @type {ChatRoomSyncSingleEvent} */
				data
			) => {
				if (data === null || typeof data !== "object") {
					return;
				}
				if (!bceAnimationEngineEnabled()) {
					return;
				}
				if (data.Character?.MemberNumber === Player.MemberNumber) {
					CharacterSetActivePose(Player, data.Character.ActivePose, true);
				}
			}
		);

		// This is called once per interval to check for expression changes
		// eslint-disable-next-line complexity
		function CustomArousalExpression() {
			if (!bceAnimationEngineEnabled() || !Player?.AppearanceLayers) {
				return;
			}

			// Ensure none of the expressions have remove timers on them; we handle timers here
			Player.Appearance.filter(
				(a) =>
					faceComponents.includes(a.Asset.Group.Name) && a.Property?.RemoveTimer
			).forEach((a) => {
				delete a.Property.RemoveTimer;
			});

			Player.ArousalSettings.AffectExpression = false;

			if (orgasmCount < Player.ArousalSettings.OrgasmCount) {
				orgasmCount = Player.ArousalSettings.OrgasmCount;
			} else if (orgasmCount > Player.ArousalSettings.OrgasmCount) {
				Player.ArousalSettings.OrgasmCount = orgasmCount;
				ActivityChatRoomArousalSync(Player);
			}

			// Reset everything when face is fully default
			let isDefault = true;
			for (const t of faceComponents) {
				if (expression(t)[0]) {
					isDefault = false;
				}
			}
			if (isDefault) {
				PreviousArousal.Progress = 0;
				PreviousDirection = ArousalMeterDirection.Up;
				if (!wasDefault) {
					for (let i = 0; i < bceExpressionsQueue.length; i++) {
						if (bceExpressionsQueue[i].Type === AUTOMATED_AROUSAL_EVENT_TYPE) {
							continue;
						}
						bceExpressionsQueue[i].Expression = {};
					}
				}
				wasDefault = true;
			} else {
				wasDefault = false;
			}

			// Detect arousal movement
			const arousal = Player.ArousalSettings.Progress;
			let direction = PreviousDirection;
			if (arousal < PreviousArousal.Progress) {
				direction = ArousalMeterDirection.Down;
			} else if (arousal > PreviousArousal.Progress) {
				direction = ArousalMeterDirection.Up;
			}
			PreviousDirection = direction;

			const lastOrgasmAdjustment = () => {
				// Only boost up to the expression at arousal 90
				const lastOrgasmMaxArousal = 90,
					lastOrgasmMaxBoost = 30,
					orgasms = Player.ArousalSettings.OrgasmCount || 0;
				const lastOrgasmBoostDuration = Math.min(300, 60 + orgasms * 5),
					secondsSinceOrgasm = ((Date.now() - lastOrgasm) / 10000) | 0;
				if (secondsSinceOrgasm > lastOrgasmBoostDuration) {
					return 0;
				}
				return Math.min(
					Math.max(0, lastOrgasmMaxArousal - arousal),
					(lastOrgasmMaxBoost *
						(lastOrgasmBoostDuration - secondsSinceOrgasm)) /
						lastOrgasmBoostDuration
				);
			};

			// Handle events
			const OrgasmRecoveryStage = 2;
			if (
				PreviousArousal.OrgasmStage !== OrgasmRecoveryStage &&
				Player.ArousalSettings.OrgasmStage === OrgasmRecoveryStage &&
				bceExpressionsQueue.filter((a) => a.Type === POST_ORGASM_EVENT_TYPE)
					.length === 0
			) {
				pushEvent(w.bce_EventExpressions.PostOrgasm);
				lastOrgasm = Date.now();
			}

			// Keep track of desired changes
			/** @type {{ [key: string]: ExpressionStage }} */
			const desiredExpression = {};

			/** @type {{ [key: string]: { Id: number; Pose: string; Category?: string; Duration: number; Priority: number; Type: string }}} */
			let desiredPose = {};

			/** @type {{ [key: string]: ExpressionStage }} */
			const nextExpression = {};

			/** @type {(expression: string, stage: ExpressionStage, next: ExpressionEvent, faceComponent: string) => void} */
			const trySetNextExpression = (e, exp, next, t) => {
				const priority = exp.Priority || next.Priority || 0;
				if (!nextExpression[t] || nextExpression[t].Priority <= priority) {
					nextExpression[t] = {
						Id: exp.Id,
						Expression: e,
						Duration: exp.Duration,
						Priority: priority,
						Color: exp.Color,
					};
				}
			};

			// Calculate next expression
			for (let j = 0; j < bceExpressionsQueue.length; j++) {
				const next = bceExpressionsQueue[j];
				let active = false;
				if (next.Until > Date.now() || next.Until - next.At < 0) {
					if (Object.keys(next.Expression || {}).length > 0) {
						for (const t of Object.keys(next.Expression)) {
							let durationNow = Date.now() - next.At;
							for (let i = 0; i < next.Expression[t].length; i++) {
								/** @type {ExpressionStage} */
								const exp = next.Expression[t][i];
								durationNow -= exp.Duration;
								if (durationNow < 0 || exp.Duration < 0) {
									active = true;
									if (!exp.Skip) {
										if (
											exp.ExpressionModifier &&
											t in bceExpressionModifierMap
										) {
											const [current] = expression(t);
											if (!exp.Applied) {
												/** @type {number} */
												let idx =
													bceExpressionModifierMap[t].indexOf(current) +
													exp.ExpressionModifier;
												if (idx >= bceExpressionModifierMap[t].length) {
													idx = bceExpressionModifierMap[t].length - 1;
												} else if (idx < 0) {
													idx = 0;
												}
												trySetNextExpression(
													bceExpressionModifierMap[t][idx],
													exp,
													next,
													t
												);
												bceExpressionsQueue[j].Expression[t][i].Applied = true;
											} else {
												// Prevent being overridden by other expressions while also not applying a change
												trySetNextExpression(current, exp, next, t);
											}
										} else {
											trySetNextExpression(exp.Expression, exp, next, t);
										}
									}
									break;
								}
							}
						}
					}
					if (next.Poses?.length) {
						let durationNow = Date.now() - next.At;
						for (const pose of next.Poses) {
							durationNow -= pose.Duration;
							if (durationNow < 0 || pose.Duration < 0) {
								active = true;
								for (const pp of pose.Pose) {
									/** @type {PoseEx} */
									// @ts-ignore
									const p = pp;
									const priority = pose.Priority || next.Priority || 0;
									if (
										!desiredPose[p.Category] ||
										desiredPose[p.Category].Priority <= priority
									) {
										desiredPose[p.Category] = {
											Id: pose.Id,
											Pose: p.Pose,
											Category: p.Category,
											Duration: pose.Duration,
											Priority: priority,
											Type: next.Type,
										};
									}
								}
								break;
							}
						}
					}
				}
				if (!active) {
					const last = bceExpressionsQueue.splice(j, 1);
					j--;
					if (
						!bceSettings.expressions &&
						last.length > 0 &&
						last[0].Expression
					) {
						for (const t of Object.keys(last[0].Expression)) {
							trySetNextExpression(
								null,
								{ Duration: -1 },
								{
									Priority: 0,
									Type: DEFAULT_EVENT_TYPE,
									Duration: 500,
								},
								t
							);
						}
					}
				}
			}

			// Garbage collect unused expressions - this should occur before manual expressions are detected
			for (let j = 0; j < bceExpressionsQueue.length; j++) {
				for (const t of Object.keys(bceExpressionsQueue[j].Expression || {})) {
					if (!nextExpression[t] || nextExpression[t].Duration > 0) {
						continue;
					}
					const nextId = nextExpression[t].Id,
						nextPriority = nextExpression[t].Priority;

					for (
						let i = 0;
						i < bceExpressionsQueue[j].Expression[t].length;
						i++
					) {
						const exp = bceExpressionsQueue[j].Expression[t][i];
						if (
							exp.Duration < 0 &&
							(exp.Id < nextId || exp.Priority < nextPriority)
						) {
							bceExpressionsQueue[j].Expression[t].splice(i, 1);
							i--;
						}
					}
					if (bceExpressionsQueue[j].Expression[t].length === 0) {
						delete bceExpressionsQueue[j].Expression[t];
					}
				}
				for (let k = 0; k < bceExpressionsQueue[j].Poses?.length; k++) {
					const pose = bceExpressionsQueue[j].Poses[k];
					/** @type {PoseEx[]} */
					// @ts-ignore
					const poseList = pose.Pose;
					const desiredIsNewerAndInfinite = poseList.every(
						// eslint-disable-next-line no-loop-func
						(p) =>
							desiredPose[p.Category]?.Duration < 0 &&
							desiredPose[p.Category]?.Id > pose.Id &&
							(desiredPose[p.Category]?.Type === MANUAL_OVERRIDE_EVENT_TYPE ||
								bceExpressionsQueue[j].Type !== MANUAL_OVERRIDE_EVENT_TYPE)
					);
					if (pose.Duration < 0 && desiredIsNewerAndInfinite) {
						bceExpressionsQueue[j].Poses.splice(k, 1);
						k--;
					}
				}
				if (
					Object.keys(bceExpressionsQueue[j].Expression || {}).length === 0 &&
					bceExpressionsQueue[j].Poses?.length === 0
				) {
					bceExpressionsQueue.splice(j, 1);
					j--;
				}
			}

			// Clean up unused poses
			let needsPoseUpdate = false,
				needsRefresh = false;
			if (Player.ActivePose) {
				for (let i = 0; i < Player.ActivePose.length; i++) {
					const pose = Player.ActivePose[i];
					const p = PoseFemale3DCG.find((pp) => pp.Name === pose);
					if (
						!p?.Category &&
						Object.values(desiredPose).every((v) => v.Pose !== pose)
					) {
						Player.ActivePose.splice(i, 1);
						i--;
						needsPoseUpdate = true;
						needsRefresh = true;
					}
				}
			}

			// Handle arousal-based expressions
			outer: for (const t of Object.keys(w.bce_ArousalExpressionStages)) {
				const [exp] = expression(t);
				// eslint-disable-next-line init-declarations
				let chosenExpression;
				for (const face of w.bce_ArousalExpressionStages[t]) {
					const limit =
						face.Limit - (direction === ArousalMeterDirection.Up ? 0 : 1);
					if (arousal + lastOrgasmAdjustment() >= limit) {
						if (face.Expression !== exp) {
							chosenExpression = face.Expression;
							break;
						} else {
							continue outer;
						}
					}
				}
				if (typeof chosenExpression !== "undefined") {
					const e = {};
					e[t] = [{ Expression: chosenExpression, Duration: -1, Priority: 0 }];
					pushEvent({
						Type: AUTOMATED_AROUSAL_EVENT_TYPE,
						Duration: -1,
						Priority: 0,
						// @ts-ignore
						Expression: e,
					});
				}
			}

			for (const t of faceComponents) {
				const [exp] = expression(t),
					nextExp = nextExpression[t] || {
						Duration: -1,
						Expression: null,
					};
				if (
					nextExp.Expression !== exp &&
					typeof nextExp.Expression !== "undefined"
				) {
					desiredExpression[t] = { ...nextExp };
				}
			}

			if (Object.keys(desiredExpression).length > 0) {
				for (const t of Object.keys(desiredExpression)) {
					setExpression(
						t,
						desiredExpression[t].Expression,
						desiredExpression[t].Color
					);
					ServerSend("ChatRoomCharacterExpressionUpdate", {
						Name: desiredExpression[t].Expression,
						Group: t,
						Appearance: ServerAppearanceBundle(Player.Appearance),
					});
				}

				needsRefresh = true;
			}

			// Figure out desiredPose conflicts
			function resolvePoseConflicts() {
				const maxPriority = Math.max(
						...Object.values(desiredPose).map((p) => p.Priority)
					),
					maxPriorityPoses = Object.entries(desiredPose).filter(
						(p) => p[1].Priority === maxPriority
					);
				let [maxPriorityPose] = maxPriorityPoses;
				if (maxPriorityPoses.length > 1) {
					const maxId = Math.max(...maxPriorityPoses.map((p) => p[1].Id)),
						maxIdPoses = maxPriorityPoses.filter((p) => p[1].Id === maxId);
					[maxPriorityPose] = maxIdPoses;
				} else if (maxPriorityPoses.length === 0) {
					return 0;
				}
				let deleted = 0;
				const conflicts = poseCategories[maxPriorityPose[0]]?.Conflicts || [];
				for (const conflict of conflicts.filter((c) => c in desiredPose)) {
					delete desiredPose[conflict];
					deleted++;
				}
				return deleted;
			}
			while (resolvePoseConflicts() > 0) {
				// Intentionally empty
			}

			if (Object.keys(desiredPose).length === 0) {
				desiredPose = {
					BodyUpper: {
						Pose: "BaseUpper",
						Duration: -1,
						Id: newUniqueId(),
						Priority: 0,
						Type: DEFAULT_EVENT_TYPE,
					},
					BodyLower: {
						Pose: "BaseLower",
						Duration: -1,
						Id: newUniqueId(),
						Priority: 0,
						Type: DEFAULT_EVENT_TYPE,
					},
				};
			}
			const basePoseMatcher = /^Base(Lower|Upper)$/u;
			let newPose = Object.values(desiredPose)
				.map((p) => p.Pose)
				.filter((p) => !basePoseMatcher.test(p));
			if (newPose.length === 0) {
				newPose = null;
			}
			if (JSON.stringify(Player.ActivePose) !== JSON.stringify(newPose)) {
				SDK.callOriginal("CharacterSetActivePose", [Player, newPose, true]);
				needsPoseUpdate = true;
				needsRefresh = true;
			}

			if (needsPoseUpdate) {
				ServerSend("ChatRoomCharacterPoseUpdate", {
					Pose: Player.ActivePose,
				});
			}

			if (needsRefresh) {
				CharacterRefresh(Player, false, false);
			}

			PreviousArousal = { ...Player.ArousalSettings };
		}

		createTimer(CustomArousalExpression, 250);
	}

	async function layeringMenu() {
		await waitFor(() => !!Player?.AppearanceLayers);

		const canAccessLayeringMenus = () => {
			const c = CharacterGetCurrent();
			return (
				bceSettings.layeringMenu &&
				(bceSettings.allowLayeringWhileBound ||
					(Player.CanInteract() &&
						c?.FocusGroup?.Name &&
						!InventoryGroupIsBlocked(c, c.FocusGroup.Name)))
			);
		};

		// Pseudo-items that we do not want to process for color copying
		const ignoredColorCopiableAssets = [
			"LeatherCrop",
			"LeatherWhip",
			"ShockCollarRemote",
			"SpankingToys",
			"VibratorRemote",
		];
		const colorCopiableAssets = Asset.filter(
			(ass) =>
				AssetGroup.filter(
					(a) =>
						a.Name.startsWith("Item") &&
						!/\d$/u.test(a.Name) &&
						a.Asset.find((b) => b.Name === ass.Name)
				).length > 1
		)
			.filter((v, i, a) => a.findIndex((as) => as.Name === v.Name) === i)
			.map((a) => a.Name)
			.filter((a) => !ignoredColorCopiableAssets.includes(a));

		let lastItem = null;
		const layerPriority = "bce_LayerPriority";

		/** @type {(item: Item) => void} */
		function updateItemPriorityFromLayerPriorityInput(item) {
			if (item) {
				const priority = parseInt(ElementValue(layerPriority));
				if (!item.Property) {
					item.Property = { OverridePriority: priority };
				} else {
					item.Property.OverridePriority = priority;
				}
			}
		}

		SDK.hookFunction(
			"AppearanceExit",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				if (CharacterAppearanceMode === "") {
					ElementRemove(layerPriority);
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"AppearanceLoad",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				ElementCreateInput(layerPriority, "number", "", "20");
				ElementPosition(layerPriority, -1000, -1000, 0);
				return ret;
			}
		);

		SDK.hookFunction(
			"AppearanceRun",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				if (bceSettings.layeringMenu) {
					const C = CharacterAppearanceSelection;
					if (CharacterAppearanceMode === "Cloth") {
						DrawText(displayText("Priority"), 70, 35, "White", "Black");
						ElementPosition(layerPriority, 60, 105, 100);
						DrawButton(
							110,
							70,
							90,
							90,
							"",
							"White",
							"Icons/Accept.png",
							displayText("Set Priority")
						);
						const item = C.Appearance.find(
							(a) => a.Asset.Group === C.FocusGroup
						);
						if (!lastItem || lastItem !== item) {
							if (!item) {
								ElementValue(layerPriority, "");
							} else {
								ElementValue(
									layerPriority,
									(
										C.AppearanceLayers.find((a) => a.Asset === item.Asset)
											?.Priority || 0
									).toString()
								);
							}
						}
						lastItem = item;
					} else {
						ElementPosition(layerPriority, -1000, -1000, 0);
					}
				}
				return ret;
			}
		);

		SDK.hookFunction(
			"AppearanceClick",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				if (bceSettings.layeringMenu) {
					const C = CharacterAppearanceSelection;
					if (MouseIn(110, 70, 90, 90) && CharacterAppearanceMode === "Cloth") {
						const item = C.Appearance.find(
							(a) => a.Asset.Group?.Name === C.FocusGroup?.Name
						);
						updateItemPriorityFromLayerPriorityInput(item);
						CharacterRefresh(C, false);
					}
				}
				return next(args);
			}
		);

		/** @type {(C: Character, item: Item) => boolean} */
		function assetVisible(C, item) {
			return item && !!C.AppearanceLayers.find((a) => a.Asset === item.Asset);
		}

		/** @type {(C: Character, item: Item) => boolean} */
		function assetWorn(C, item) {
			return item && !!C.Appearance.find((a) => a === item);
		}

		/** @type {"Priority" | "Difficulty"} */
		let priorityField = "Priority",
			prioritySubscreen = false;
		const FIELDS = Object.freeze({
			/** @type {"Priority"} */
			Priority: "Priority",
			/** @type {"Difficulty"} */
			Difficulty: "Difficulty",
		});

		/** @type {(C: Character, FocusItem: Item, field: "Priority" | "Difficulty") => void} */
		function prioritySubscreenEnter(C, FocusItem, field) {
			DialogFocusItem = FocusItem;
			prioritySubscreen = true;
			priorityField = field;
			let initialValue = 0;
			switch (field) {
				case FIELDS.Priority:
					initialValue = C.AppearanceLayers.find(
						(a) => a.Asset === FocusItem.Asset
					).Priority;
					break;
				case FIELDS.Difficulty:
					initialValue = C.Appearance.find((a) => a === FocusItem).Difficulty;
					break;
				default:
					break;
			}
			ElementCreateInput(layerPriority, "number", "", "20");
			ElementValue(layerPriority, initialValue.toString());
		}
		function prioritySubscreenExit() {
			prioritySubscreen = false;
			ElementRemove(layerPriority);
			DialogFocusItem = null;
		}

		for (const func of ["DialogLeave", "DialogLeaveItemMenu"]) {
			SDK.hookFunction(
				func,
				HOOK_PRIORITIES.OverrideBehaviour,
				// eslint-disable-next-line no-loop-func
				(args, next) => {
					if (prioritySubscreen) {
						prioritySubscreenExit();
						return;
					}
					next(args);
				}
			);
		}

		SDK.hookFunction(
			"DialogDrawItemMenu",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const [C] = args;
				if (isCharacter(C) && canAccessLayeringMenus()) {
					const focusItem = InventoryGet(C, C.FocusGroup?.Name);
					if (assetWorn(C, focusItem)) {
						DrawButton(
							10,
							890,
							52,
							52,
							"",
							"White",
							ICONS.TIGHTEN,
							displayText("Loosen or tighten")
						);
						if (
							colorCopiableAssets.includes(focusItem.Asset.Name) &&
							Player.CanInteract()
						) {
							DrawButton(
								10,
								832,
								52,
								52,
								"",
								"White",
								ICONS.PAINTBRUSH,
								displayText(`Copy colors to other $Item`, {
									$Item: focusItem.Asset.Description.toLowerCase(),
								})
							);
						}
					}
					if (assetVisible(C, focusItem)) {
						DrawButton(
							10,
							948,
							52,
							52,
							"",
							"White",
							ICONS.LAYERS,
							displayText("Modify layering priority")
						);
					}
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"DialogDraw",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				const C = CharacterGetCurrent(),
					focusItem = InventoryGet(C, C.FocusGroup?.Name);
				if (prioritySubscreen) {
					if (canAccessLayeringMenus()) {
						if (focusItem) {
							// Localization guide: valid options for priorityField can be seen in the "const FIELDS" object above
							DrawText(
								displayText(`Set item ${priorityField}`),
								950,
								150,
								"White",
								"Black"
							);
							DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
							ElementPosition(layerPriority, 950, 210, 100);
							DrawButton(
								900,
								280,
								90,
								90,
								"",
								"White",
								"Icons/Accept.png",
								// Localization guide: valid options for priorityField can be seen in the "const FIELDS" object above
								displayText(`Set ${priorityField}`)
							);
							return null;
						}
						prioritySubscreenExit();
					} else {
						prioritySubscreenExit();
					}
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"DialogClick",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				if (!canAccessLayeringMenus()) {
					return next(args);
				}
				const C = CharacterGetCurrent(),
					focusItem = InventoryGet(C, C.FocusGroup?.Name);
				if (focusItem) {
					if (prioritySubscreen) {
						if (MouseIn(1815, 75, 90, 90)) {
							prioritySubscreenExit();
						} else if (MouseIn(900, 280, 90, 90)) {
							savePrioritySubscreenChanges(C, focusItem);
						}
						return null;
					}
					if (assetWorn(C, focusItem) && MouseIn(10, 890, 52, 52)) {
						prioritySubscreenEnter(C, focusItem, FIELDS.Difficulty);
						return null;
					} else if (assetVisible(C, focusItem) && MouseIn(10, 948, 52, 52)) {
						prioritySubscreenEnter(C, focusItem, FIELDS.Priority);
						return null;
					} else if (
						assetWorn(C, focusItem) &&
						MouseIn(10, 832, 52, 52) &&
						colorCopiableAssets.includes(focusItem.Asset.Name) &&
						Player.CanInteract()
					) {
						copyColors(C, focusItem);
						return null;
					}
				}
				return next(args);
			}
		);

		/** @type {(C: Character, focusItem: Item) => void} */
		function copyColors(C, focusItem) {
			for (const item of C.Appearance) {
				copyColorTo(item);
			}
			if (CurrentScreen === "ChatRoom") {
				ChatRoomCharacterUpdate(C);
				bceSendAction(
					displayText(
						"$PlayerName $ItemName colors spread from her $ItemGroup",
						{
							$PlayerName: Player.Name,
							$ItemName: focusItem.Asset.Description.toLowerCase(),
							$ItemGroup: focusItem.Asset.Group.Description.toLowerCase(),
						}
					)
				);
			} else {
				CharacterRefresh(C);
			}

			/** @type {(item: Item) => void} */
			function copyColorTo(item) {
				if (item.Asset.Name === focusItem.Asset.Name) {
					if (Array.isArray(focusItem.Color)) {
						if (Array.isArray(item.Color)) {
							for (
								let i = 0;
								i < item.Color.length && i < focusItem.Color.length;
								i++
							) {
								item.Color[item.Color.length - (i + 1)] =
									focusItem.Color[focusItem.Color.length - (i + 1)];
							}
						} else {
							item.Color = focusItem.Color[focusItem.Color.length - 1];
						}
					} else if (Array.isArray(item.Color)) {
						for (let i = 0; i < item.Color.length; i++) {
							item.Color[i] = focusItem.Color;
						}
					} else {
						item.Color = [...focusItem.Color];
					}
				}
			}
		}

		/** @type {(C: Character, focusItem: Item) => void} */
		function savePrioritySubscreenChanges(C, focusItem) {
			switch (priorityField) {
				case FIELDS.Priority:
					updateItemPriorityFromLayerPriorityInput(focusItem);
					break;
				case FIELDS.Difficulty:
					{
						const newDifficulty = parseInt(ElementValue(layerPriority));
						let action = null;
						if (focusItem.Difficulty > newDifficulty) {
							action = "loosens";
						} else if (focusItem.Difficulty < newDifficulty) {
							action = "tightens";
						}
						focusItem.Difficulty = newDifficulty;
						bceSendAction(
							displayText(`$PlayerName ${action} $TargetName $ItemName`, {
								$PlayerName: Player.Name,
								$TargetName: C.Name,
								$ItemName: focusItem.Asset.Description.toLowerCase(),
							})
						);
					}
					break;
				default:
					break;
			}
			bceLog("updated item", focusItem);
			CharacterRefresh(C, false, false);
			ChatRoomCharacterItemUpdate(C, C.FocusGroup?.Name);
			prioritySubscreenExit();
		}
	}

	function cacheClearer() {
		const cacheClearInterval = 1 * 60 * 60 * 1000;

		w.bceClearCaches = async function () {
			const start = Date.now();
			if (
				!(await waitFor(
					// Only clear when in chat room and not inspecting a character
					() => CurrentScreen === "ChatRoom" && !CurrentCharacter,
					() => Date.now() - start > cacheClearInterval
				))
			) {
				return;
			}
			if (!bceSettings.automateCacheClear) {
				return;
			}

			bceLog("Clearing caches");
			if (GLDrawCanvas.GL.textureCache) {
				GLDrawCanvas.GL.textureCache.clear();
			}
			GLDrawResetCanvas();
			const oldOnlineCharacters = Character.filter(
				(c) =>
					c.IsOnline?.() &&
					!ChatRoomCharacter.some((cc) => cc.MemberNumber === c.MemberNumber)
			);
			oldOnlineCharacters.forEach((c) => CharacterDelete(c.AccountName));
			Character.filter((c) => c.IsOnline?.()).forEach((c) =>
				CharacterRefresh(c, false, false)
			);
		};

		const clearCaches = () => {
			if (bceSettings.automateCacheClear) {
				w.bceClearCaches();
			}
		};

		createTimer(clearCaches, cacheClearInterval);
	}

	function chatRoomOverlay() {
		SDK.hookFunction(
			"ChatRoomDrawCharacterOverlay",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				const [C, CharX, CharY, Zoom] = args;
				if (
					isCharacter(C) &&
					typeof CharX === "number" &&
					typeof CharY === "number" &&
					typeof Zoom === "number" &&
					C.BCE &&
					ChatRoomHideIconState === 0
				) {
					DrawImageResize(
						ICONS.USER,
						CharX + 275 * Zoom,
						CharY,
						50 * Zoom,
						50 * Zoom
					);
					DrawTextFit(
						C.BCE,
						CharX + 300 * Zoom,
						CharY + 40 * Zoom,
						50 * Zoom,
						DEVS.includes(C.MemberNumber) ? "#b33cfa" : "White",
						"Black"
					);
					if (
						C.BCE &&
						characterStates.get(C.MemberNumber)?.clamped > Date.now()
					) {
						DrawImageResize(
							ICONS.MUTE,
							CharX + 75 * Zoom,
							CharY + 50 * Zoom,
							50 * Zoom,
							50 * Zoom
						);
					}
				}
				return ret;
			}
		);
	}

	/** @type {(target: number, requestReply?: boolean) => void} */
	function sendHello(target = null, requestReply = false) {
		/** @type {BCEChatMessage} */
		const message = {
			Type: HIDDEN,
			Content: BCE_MSG,
			Sender: Player.MemberNumber,
			Dictionary: {
				message: {
					type: MESSAGE_TYPES.Hello,
					version: BCE_VERSION,
					alternateArousal: !!bceSettings.alternateArousal,
					replyRequested: requestReply,
					capabilities: CAPABILITIES,
					nick: Player.BCEOriginalName ? Player.Name : null,
				},
			},
		};
		if (target) {
			message.Target = target;
		}
		ServerSend("ChatRoomChat", message);
	}
	if (ServerIsConnected) {
		sendHello(null, true);
	}

	async function hiddenMessageHandler() {
		await waitFor(() => ServerSocket && ServerIsConnected);

		registerSocketListener(
			"ChatRoomMessage",
			// eslint-disable-next-line complexity
			(
				/** @type {BCEChatMessage} */
				data
			) => {
				if (data.Type !== HIDDEN) {
					return;
				}
				if (data.Content === "BCEMsg") {
					const sender = Character.find((a) => a.MemberNumber === data.Sender);
					if (!sender) {
						return;
					}
					const { message } = data.Dictionary;
					switch (message.type) {
						case MESSAGE_TYPES.Hello:
							sender.BCE = message.version;
							sender.BCEArousal = message.alternateArousal || false;
							sender.BCECapabilities = message.capabilities;
							if (bceSettings.nicknames) {
								const newName = removeNonPrintables(message.nick);
								if (newName && newName.length <= 20) {
									if (!sender.BCEOriginalName) {
										sender.BCEOriginalName = sender.Name;
									}
									sender.Name = newName;
									if (sender.BCEOriginalName === sender.Name) {
										delete sender.BCEOriginalName;
									}
								} else if (sender.BCEOriginalName) {
									sender.Name = sender.BCEOriginalName;
									delete sender.BCEOriginalName;
								}
							}
							if (message.replyRequested) {
								sendHello(sender.MemberNumber);
							}
							break;
						case MESSAGE_TYPES.ArousalSync:
							sender.BCEArousal = message.alternateArousal || false;
							sender.BCEArousalProgress = message.progress || 0;
							sender.BCEEnjoyment = message.enjoyment || 1;
							break;
						case MESSAGE_TYPES.Activity:
							// Sender is owner and player is not already wearing a club slave collar
							if (
								sender.MemberNumber === Player.Ownership?.MemberNumber &&
								!Player.Appearance.some(
									(a) => a.Asset.Name === "ClubSlaveCollar"
								)
							) {
								bceStartClubSlave();
							}
							break;
						default:
							break;
					}
				}
			}
		);

		registerSocketListener(
			"ChatRoomSyncMemberJoin",
			(
				/** @type {ChatRoomSyncMemberJoinEvent} */
				data
			) => {
				if (data.MemberNumber !== Player.MemberNumber) {
					sendHello(data.MemberNumber);
				}
			}
		);

		registerSocketListener("ChatRoomSync", () => {
			sendHello();
		});
	}

	async function privateWardrobe() {
		await waitFor(() => !!Player);

		let inCustomWardrobe = false,
			/** @type {Character} */
			targetCharacter = null;

		/** @type {string} */
		let appearanceBackup = null;

		SDK.hookFunction(
			"CharacterAppearanceWardrobeLoad",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				const [C] = args;
				if (bceSettings.privateWardrobe && CurrentScreen === "Appearance") {
					inCustomWardrobe = true;
					targetCharacter = isCharacter(C) ? C : CharacterGetCurrent();
					CommonSetScreen("Character", "Wardrobe");
					return null;
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"AppearanceLoad",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				if (inCustomWardrobe) {
					CharacterAppearanceBackup = appearanceBackup;
				}
				return ret;
			}
		);

		SDK.hookFunction(
			"WardrobeLoad",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				appearanceBackup = CharacterAppearanceBackup;
				return next(args);
			}
		);

		SDK.hookFunction(
			"WardrobeRun",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const playerBackup = Player;
				if (inCustomWardrobe) {
					// Replace Player with target character in rendering
					Player = targetCharacter;
				}
				const ret = next(args);
				if (inCustomWardrobe) {
					Player = playerBackup;
				}
				DrawText(
					`Page: ${((WardrobeOffset / 12) | 0) + 1}/${WardrobeSize / 12}`,
					300,
					35,
					"White"
				);
				return ret;
			}
		);

		SDK.hookFunction(
			"WardrobeExit",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				if (!inCustomWardrobe) {
					return next(args);
				}
				CommonSetScreen("Character", "Appearance");
				inCustomWardrobe = false;
				return null;
			}
		);

		SDK.hookFunction(
			"WardrobeFastLoad",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				const [C] = args;
				if (inCustomWardrobe && isCharacter(C) && C.IsPlayer()) {
					args[0] = targetCharacter;
					args[2] = false;
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"WardrobeFastSave",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				const [C] = args;
				if (inCustomWardrobe && isCharacter(C) && C.IsPlayer()) {
					args[0] = targetCharacter;
				}
				return next(args);
			}
		);

		/** @type {(e: KeyboardEvent) => void} */
		function keyHandler(e) {
			if (!bceSettings.privateWardrobe) {
				return;
			}
			if (e.key === "Escape" && inCustomWardrobe) {
				WardrobeExit();
				e.stopPropagation();
				e.preventDefault();
			}
		}

		document.addEventListener("keydown", keyHandler, true);
		document.addEventListener("keypress", keyHandler, true);
	}

	async function antiGarbling() {
		await waitFor(() => !!SpeechGarbleByGagLevel);

		// Antigarble patch for message printing
		patchFunction(
			"ChatRoomMessage",
			{
				"div.innerHTML = msg;": `div.innerHTML = msg;
				if (data.Type === "Whisper") {
					let repl = document.createElement("a");
					repl.href = "#";
					repl.onclick = (e) => {
						e.preventDefault();
						ElementValue("InputChat", \`/w \${SenderCharacter.Name.split(' ')[0]} \${ElementValue("InputChat").replace(/^\\/(beep|w) \\S+ ?/u, '')}\`);
						window.InputChat.focus();
					};
					repl.classList.add("bce-button");
					repl.textContent = '\u21a9\ufe0f';
					div.prepend(repl);
				}`,
				"const chatMsg": `const clientGagged = data.Content.endsWith('\\uf123');data.Content = data.Content.replace(/[\\uE000-\\uF8FF]/gu, '');const chatMsg`,
				"msg += chatMsg;": `msg += chatMsg;
			if (bceSettingValue("gagspeak") && SpeechGetTotalGagLevel(SenderCharacter) > 0 && !clientGagged) {
				let original = data.Content;
				if (data.Type === "Whisper" && data.Dictionary?.some(d => d.Tag === "${BCX_ORIGINAL_MESSAGE}")) {
					original = data.Dictionary.find(d => d.Tag === "${BCX_ORIGINAL_MESSAGE}").Text;
				}
				original = ChatRoomHTMLEntities(original);
				if (original.toLowerCase().trim() !== chatMsg.toLowerCase().trim()) {
					msg += \` (\${original})\`
				}
			}`,
			},
			"No anti-garbling."
		);

		// ServerSend hook for client-side gagspeak, priority lower than BCX's whisper dictionary hook
		SDK.hookFunction("ServerSend", 0, (args, next) => {
			if (args.length < 2) {
				return next(args);
			}
			const [message, data] = args;
			if (!isString(message) || !isChatMessage(data)) {
				return next(args);
			}
			if (message === "ChatRoomChat") {
				switch (data.Type) {
					case "Whisper":
						{
							const idx = data.Dictionary?.findIndex(
								(d) => d.Tag === BCX_ORIGINAL_MESSAGE
							);
							if (
								idx >= 0 &&
								(bceSettings.antiAntiGarble ||
									bceSettings.antiAntiGarbleStrong ||
									bceSettings.antiAntiGarbleExtra)
							) {
								data.Dictionary.splice(idx, 1);
							}
						}
						break;
					case "Chat":
						{
							const gagLevel = SpeechGetTotalGagLevel(Player);
							if (gagLevel > 0) {
								if (bceSettings.antiAntiGarble) {
									data.Content =
										SpeechGarbleByGagLevel(1, data.Content) +
										GAGBYPASSINDICATOR;
								} else if (bceSettings.antiAntiGarbleExtra && gagLevel > 24) {
									const icIndicator = "\uF124";
									let inOOC = false;
									data.Content = `${data.Content.split("")
										.map((c) => {
											switch (c) {
												case "(":
													inOOC = true;
													return c;
												case ")":
													inOOC = false;
													return c;
												default:
													return inOOC ? c : icIndicator;
											}
										})
										.join("")
										.replace(
											new RegExp(`${icIndicator}+`, "gu"),
											"m"
										)}${GAGBYPASSINDICATOR}`;
								} else if (
									bceSettings.antiAntiGarbleStrong ||
									bceSettings.antiAntiGarbleExtra
								) {
									data.Content =
										SpeechGarbleByGagLevel(gagLevel, data.Content) +
										GAGBYPASSINDICATOR;
								}
							}
						}
						break;
					default:
						break;
				}
			}
			return next([message, data, ...args.slice(2)]);
		});

		SDK.hookFunction(
			"ChatRoomResize",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				if (
					bceSettings.showQuickAntiGarble &&
					!bceSettings.discreetMode &&
					CharacterGetCurrent() === null &&
					CurrentScreen === "ChatRoom" &&
					document.getElementById("InputChat")
				) {
					ElementPosition("InputChat", 1356, 950, 700, 82);
				}
				return ret;
			}
		);

		// X, Y, width, height. X and Y centered.
		/** @type {[number, number, number, number]} */
		const gagAntiCheatMenuPosition = [1700, 908, 200, 45],
			/** @type {[number, number, number, number]} */
			gagCheatMenuPosition = [1700, 908 + 45, 200, 45],
			tooltipPosition = { X: 1000, Y: 910, Width: 200, Height: 90 };

		SDK.hookFunction(
			"ChatRoomRun",
			HOOK_PRIORITIES.ModifyBehaviourHigh,
			(args, nextFunc) => {
				const ret = nextFunc(args);

				if (w.InputChat) {
					/** @type {() => boolean} */
					const isWhispering = () =>
						w.InputChat?.value.startsWith("/w ") ||
						!!w.ChatRoomTargetMemberNumber;
					if (
						w.InputChat?.classList.contains(WHISPER_CLASS) &&
						!isWhispering()
					) {
						w.InputChat.classList.remove(WHISPER_CLASS);
					} else if (bceSettings.whisperInput && isWhispering()) {
						w.InputChat?.classList.add(WHISPER_CLASS);
					}
					if (Player.ChatSettings?.ColorTheme?.startsWith("Dark")) {
						if (!w.InputChat.classList.contains(DARK_INPUT_CLASS)) {
							w.InputChat.classList.add(DARK_INPUT_CLASS);
						}
					} else if (w.InputChat.classList.contains(DARK_INPUT_CLASS)) {
						w.InputChat.classList.remove(DARK_INPUT_CLASS);
					}
					if (
						w.InputChat.value.length > 1000 &&
						(!w.InputChat.value.startsWith("/") ||
							w.InputChat.value.startsWith("/w "))
					) {
						w.InputChat.classList.add(INPUT_WARN_CLASS);
					} else {
						w.InputChat.classList.remove(INPUT_WARN_CLASS);
					}
				}

				if (!bceSettings.showQuickAntiGarble || bceSettings.discreetMode) {
					return ret;
				}
				const shorttip = displayText("Gagging"),
					tooltip = displayText("Antigarble anti-cheat strength");

				let color = "white",
					label = "None";

				const disableBoth = () => displayText("$tip: None", { $tip: tooltip }),
					enableLimited = () => displayText("$tip: Limited", { $tip: tooltip }),
					enableStrong = () => displayText("$tip: Full", { $tip: tooltip }),
					// eslint-disable-next-line sort-vars
					enableExtra = () => displayText("$tip: Extra", { $tip: tooltip });

				let next = enableLimited,
					previous = enableExtra;

				if (bceSettings.antiAntiGarble) {
					color = "yellow";
					label = "Limited";
					next = enableStrong;
					previous = disableBoth;
				} else if (bceSettings.antiAntiGarbleStrong) {
					color = "red";
					label = "Full";
					next = enableExtra;
					previous = enableLimited;
				} else if (bceSettings.antiAntiGarbleExtra) {
					color = "purple";
					label = "Extra";
					next = disableBoth;
					previous = enableStrong;
				}
				DrawBackNextButton(
					...gagAntiCheatMenuPosition,
					// Localization guide: ignore, covered by localizing the arrow functions above
					displayText(`$tip: ${label}`, { $tip: shorttip }),
					color,
					"",
					previous,
					next,
					// eslint-disable-next-line no-undefined
					undefined,
					// eslint-disable-next-line no-undefined
					undefined,
					tooltipPosition
				);

				/** @type {[string, string, string, () => string, () => string, boolean, number, Position]} */
				const gagCheatMenuParams = bceSettings.gagspeak
					? [
							displayText("Understand: Yes"),
							"green",
							"",
							() => displayText("Understand gagspeak: No"),
							() => displayText("Understand gagspeak: No"),
							// eslint-disable-next-line no-undefined
							undefined,
							// eslint-disable-next-line no-undefined
							undefined,
							tooltipPosition,
					  ]
					: [
							"Understand: No",
							"white",
							"",
							() => displayText("Understand gagspeak: Yes"),
							() => displayText("Understand gagspeak: Yes"),
							// eslint-disable-next-line no-undefined
							undefined,
							// eslint-disable-next-line no-undefined
							undefined,
							tooltipPosition,
					  ];
				DrawBackNextButton(...gagCheatMenuPosition, ...gagCheatMenuParams);

				return ret;
			}
		);

		SDK.hookFunction(
			"ChatRoomClick",
			HOOK_PRIORITIES.ModifyBehaviourHigh,
			(args, nextFunc) => {
				if (bceSettings.showQuickAntiGarble && !bceSettings.discreetMode) {
					if (MouseIn(...gagAntiCheatMenuPosition)) {
						const disableAll = () => {
								bceSettings.antiAntiGarble = false;
								bceSettings.antiAntiGarbleStrong = false;
								bceSettings.antiAntiGarbleExtra = false;
								defaultSettings.antiAntiGarble.sideEffects(false);
								defaultSettings.antiAntiGarbleStrong.sideEffects(false);
								defaultSettings.antiAntiGarbleExtra.sideEffects(false);
							},
							enableLimited = () => {
								bceSettings.antiAntiGarble = true;
								defaultSettings.antiAntiGarble.sideEffects(true);
							},
							enableStrong = () => {
								bceSettings.antiAntiGarbleStrong = true;
								defaultSettings.antiAntiGarbleStrong.sideEffects(true);
							},
							// eslint-disable-next-line sort-vars
							enableExtra = () => {
								bceSettings.antiAntiGarbleExtra = true;
								defaultSettings.antiAntiGarbleExtra.sideEffects(true);
							};
						let next = enableLimited,
							previous = enableExtra;
						if (bceSettings.antiAntiGarble) {
							next = enableStrong;
							previous = disableAll;
						} else if (bceSettings.antiAntiGarbleStrong) {
							next = enableExtra;
							previous = enableLimited;
						} else if (bceSettings.antiAntiGarbleExtra) {
							next = disableAll;
							previous = enableStrong;
						}
						if (
							MouseX <
							gagAntiCheatMenuPosition[0] + gagAntiCheatMenuPosition[2] / 2
						) {
							previous();
							bceSaveSettings();
						} else {
							next();
							bceSaveSettings();
						}
					} else if (MouseIn(...gagCheatMenuPosition)) {
						bceSettings.gagspeak = !bceSettings.gagspeak;
						defaultSettings.gagspeak.sideEffects(bceSettings.gagspeak);
						bceSaveSettings();
					}
				}
				return nextFunc(args);
			}
		);

		if (CurrentScreen === "ChatRoom") {
			CurrentScreenFunctions.Run = ChatRoomRun;
			CurrentScreenFunctions.Click = ChatRoomClick;
			CurrentScreenFunctions.Resize = ChatRoomResize;
			ChatRoomResize(false);
		}
	}

	async function alternateArousal() {
		await waitFor(() => !!ServerSocket && ServerIsConnected);
		Player.BCEArousalProgress = Math.min(
			BCE_MAX_AROUSAL,
			Player.ArousalSettings.Progress
		);
		Player.BCEEnjoyment = 1;
		let lastSync = 0;
		const enjoymentMultiplier = 0.2;

		registerSocketListener(
			"ChatRoomSyncArousal",
			(
				/** @type {{ MemberNumber: number; Progress: number; }} */
				data
			) => {
				if (data.MemberNumber === Player.MemberNumber) {
					// Skip player's own sync messages since we're tracking locally
					return;
				}
				const target = ChatRoomCharacter.find(
					(c) => c.MemberNumber === data.MemberNumber
				);
				if (!target) {
					return;
				}
				target.BCEArousalProgress = Math.min(
					BCE_MAX_AROUSAL,
					data.Progress || 0
				);
				target.ArousalSettings.Progress = Math.round(target.BCEArousalProgress);
			}
		);

		patchFunction(
			"ActivitySetArousalTimer",
			{
				"if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;": `
				if (!C.BCEArousal) {
					if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;
				} else {
					if (Max === 100) Max = 105;
					const fromMax = Max - (C.BCEArousal ? C.BCEArousalProgress : C.ArousalSettings.Progress);
					if (Progress > 0 && fromMax < Progress) {
						if (fromMax <= 0) {
							Progress = 0;
						} else if (C.BCEArousal) {
							Progress = Math.floor(fromMax / ${enjoymentMultiplier} / C.BCEEnjoyment);
						} else {
							Progress = fromMax;
						}
					}
				}
			`,
				"if (Progress < -25) Progress = -25;": `
				if (!C.BCEArousal) {
					if (Progress < -25) Progress = -25;
				} else {
					if (Progress < -20) Progress = -20;
				}`,
				"if (Progress > 25) Progress = 25;": `
				if (!C.BCEArousal) {
					if (Progress > 25) Progress = 25;
				} else {
					if (Progress > 20) Progress = 20;
				}`,
			},
			"Alternate arousal algorithm will be incorrect."
		);

		SDK.hookFunction(
			"ActivityChatRoomArousalSync",
			HOOK_PRIORITIES.Observe,
			(args, next) => {
				const [C] = args;
				if (isCharacter(C) && C.IsPlayer() && CurrentScreen === "ChatRoom") {
					const message = {
						Type: HIDDEN,
						Content: BCE_MSG,
						Dictionary: {
							message: {
								type: MESSAGE_TYPES.ArousalSync,
								version: BCE_VERSION,
								alternateArousal: bceSettings.alternateArousal,
								progress: C.BCEArousalProgress,
								enjoyment: C.BCEEnjoyment,
							},
						},
					};
					ServerSend("ChatRoomChat", message);
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"ActivitySetArousal",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const [C, Progress] = args;
				const ret = next(args);
				if (
					isCharacter(C) &&
					typeof Progress === "number" &&
					Math.abs(C.BCEArousalProgress - Progress) > 3
				) {
					C.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, Progress);
				}
				return ret;
			}
		);

		SDK.hookFunction(
			"ActivitySetArousalTimer",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const [C, , , Factor] = args;
				if (isCharacter(C) && typeof Factor === "number") {
					C.BCEEnjoyment = 1 + (Factor > 1 ? Math.round(Math.log2(Factor)) : 0);
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"ActivityTimerProgress",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const [C, progress] = args;
				if (isCharacter(C) && typeof progress === "number") {
					if (!C.BCEArousalProgress) {
						C.BCEArousalProgress = 0;
					}
					C.BCEArousalProgress +=
						progress *
						(progress > 0 ? C.BCEEnjoyment * enjoymentMultiplier : 1);
					C.BCEArousalProgress = Math.min(
						BCE_MAX_AROUSAL,
						C.BCEArousalProgress
					);
					if (C.BCEArousal) {
						C.ArousalSettings.Progress = Math.round(C.BCEArousalProgress);
						args[1] = 0;
						const ret = next(args);
						if (C.IsPlayer() && Date.now() - lastSync > 2100) {
							lastSync = Date.now();
							ActivityChatRoomArousalSync(C);
						}
						return ret;
					}
				}
				return next(args);
			}
		);

		patchFunction(
			"TimerProcess",
			{
				"// If the character is egged, we find the highest intensity factor and affect the progress, low and medium vibrations have a cap\n\t\t\t\t\t\t\tlet Factor = -1;": `
				let Factor = -1;
				if (Character[C].BCEArousal) {
					let maxIntensity = 0;
					let vibes = 0;
					let noOrgasmVibes = 0;
					for (let A = 0; A < Character[C].Appearance.length; A++) {
						let Item = Character[C].Appearance[A];
						let ZoneFactor = PreferenceGetZoneFactor(Character[C], Item.Asset.ArousalZone) - 2;
						if (InventoryItemHasEffect(Item, "Egged", true) && typeof Item.Property?.Intensity === "number" && !isNaN(Item.Property.Intensity) && Item.Property.Intensity >= 0 && ZoneFactor >= 0) {
							if (Item.Property.Intensity >= 0) {
								vibes++;
								if (!PreferenceGetZoneOrgasm(Character[C], Item.Asset.ArousalZone)) {
									noOrgasmVibes++;
								}
								maxIntensity = Math.max(Item.Property.Intensity, maxIntensity);
								Factor += Item.Property.Intensity + ZoneFactor + 1;
							}
						}
					}
					// Adds the fetish value to the factor
					if (Factor >= 0) {
						var Fetish = ActivityFetishFactor(Character[C]);
						if (Fetish > 0) Factor = Factor + Math.ceil(Fetish / 3);
						if (Fetish < 0) Factor = Factor + Math.floor(Fetish / 3);
					}

					let maxProgress = 100;
					switch (maxIntensity) {
						case 0:
							maxProgress = 40 + vibes * 5;
							break;
						case 1:
							maxProgress = 70 + vibes * 5;
							break;
						default:
							maxProgress = vibes === 0 || vibes > noOrgasmVibes ? 100 : 95;
							break;
					}
					const topStepInterval = 2;
					let stepInterval = topStepInterval;
					if (Factor < 0) {
						ActivityVibratorLevel(Character[C], 0);
					} else {
						if (Factor < 1) {
							ActivityVibratorLevel(Character[C], 1);
							maxProgress = Math.min(maxProgress, 35);
							stepInterval = 5;
						} else if (Factor < 2) {
							ActivityVibratorLevel(Character[C], 1);
							maxProgress = Math.min(maxProgress, 65);
							stepInterval = 4;
						} else if (Factor < 3) {
							maxProgress = Math.min(maxProgress, 95);
							stepInterval = 3;
							ActivityVibratorLevel(Character[C], 2);
						} else {
							ActivityVibratorLevel(Character[C], Math.min(4, Math.floor(Factor)));
						}
						if (maxProgress === 100) {
							maxProgress = 105;
						}
						let maxIncrease = maxProgress - Character[C].ArousalSettings.Progress;
						if (TimerLastArousalProgressCount % stepInterval === 0 && maxIncrease > 0) {
							Character[C].BCEEnjoyment = 1 + (Factor > 1 ? Math.round(1.5*Math.log2(Factor)) : 0);
							ActivityTimerProgress(Character[C], 1);
						}
					}
				} else {
				`,
				"if ((Factor == -1)) {ActivityVibratorLevel(Character[C], 0);}\n\n\t\t\t\t\t\t}": `if (Factor == -1) {
						ActivityVibratorLevel(Character[C], 0);
					}
				}
			} else {
				ActivityVibratorLevel(Character[C], 0);
			}`,
				"// No decay if there's a vibrating item running": `// No decay if there's a vibrating item running
			Character[C].BCEEnjoyment = 1;`,
			},
			"Alternative arousal algorithm will be incorrect."
		);
	}

	async function autoGhostBroadcast() {
		await waitFor(() => !!ServerSocket && ServerIsConnected);
		registerSocketListener(
			"ChatRoomSyncMemberJoin",
			(
				/** @type {ChatRoomSyncMemberJoinEvent} */
				data
			) => {
				if (
					bceSettings.ghostNewUsers &&
					Date.now() - data.Character.Creation < 30000
				) {
					ChatRoomListManipulation(
						Player.BlackList,
						true,
						data.Character.MemberNumber
					);
					ChatRoomListManipulation(
						Player.GhostList,
						true,
						data.Character.MemberNumber
					);
					bceLog(
						"Blacklisted",
						data.Character.Name,
						data.Character.MemberNumber,
						"registered",
						(Date.now() - data.Character.Creation) / 1000,
						"seconds ago"
					);
				}
			}
		);
	}

	async function blindWithoutGlasses() {
		await waitFor(() => !!Player && !!Player.Appearance);

		function checkBlindness() {
			if (!bceSettings.blindWithoutGlasses) {
				return;
			}

			const glasses = [
					"Glasses1",
					"Glasses2",
					"Glasses3",
					"Glasses4",
					"Glasses5",
					"Glasses6",
					"SunGlasses1",
					"SunGlasses2",
					"SunGlassesClear",
					"CatGlasses",
					"VGlasses",
					"FuturisticVisor",
					"InteractiveVisor",
					"InteractiveVRHeadset",
					"FuturisticMask",
				],
				hasGlasses = !!Player.Appearance.find((a) =>
					glasses.includes(a.Asset.Name)
				);
			if (
				hasGlasses &&
				GLASSES_BLUR_TARGET.classList.contains(GLASSES_BLIND_CLASS)
			) {
				GLASSES_BLUR_TARGET.classList.remove(GLASSES_BLIND_CLASS);
				bceChatNotify(
					displayText("Having recovered your glasses you can see again!")
				);
			} else if (
				!hasGlasses &&
				!GLASSES_BLUR_TARGET.classList.contains(GLASSES_BLIND_CLASS)
			) {
				GLASSES_BLUR_TARGET.classList.add(GLASSES_BLIND_CLASS);
				bceChatNotify(
					displayText("Having lost your glasses your eyesight is impaired!")
				);
			}
		}

		SDK.hookFunction("MainRun", HOOK_PRIORITIES.Observe, (args, next) => {
			checkBlindness();
			return next(args);
		});
	}

	async function friendPresenceNotifications() {
		await waitFor(() => !!Player && ServerSocket && ServerIsConnected);

		function checkFriends() {
			if (
				!bceSettings.friendPresenceNotifications &&
				!bceSettings.instantMessenger
			) {
				return;
			}
			ServerSend("AccountQuery", { Query: "OnlineFriends" });
		}
		createTimer(checkFriends, 20000);

		/** @type {Friend[]} */
		let lastFriends = [];
		registerSocketListener(
			"AccountQueryResult",
			(
				/** @type {{ Query: string; Result: Friend[] }} */
				data
			) => {
				if (
					CurrentScreen === "FriendList" ||
					CurrentScreen === "Relog" ||
					CurrentScreen === "Login"
				) {
					return;
				}
				if (!bceSettings.friendPresenceNotifications) {
					return;
				}
				if (data.Query !== "OnlineFriends") {
					return;
				}
				const friendMemberNumbers = data.Result.map((f) => f.MemberNumber),
					offlineFriends = lastFriends
						.map((f) => f.MemberNumber)
						.filter((f) => !friendMemberNumbers.includes(f)),
					onlineFriends = friendMemberNumbers.filter(
						(f) => !lastFriends.some((ff) => ff.MemberNumber === f)
					);
				if (onlineFriends.length) {
					const list = onlineFriends
						.map((f) => {
							const { MemberNumber, MemberName } = data.Result.find(
								(d) => d.MemberNumber === f
							);
							return `${MemberName} (${MemberNumber})`;
						})
						.join(", ");
					bceNotify(displayText(`Now online: $list`, { $list: list }), 5000, {
						ClickAction: BEEP_CLICK_ACTIONS.FriendList,
					});
				}
				if (bceSettings.friendOfflineNotifications && offlineFriends.length) {
					const list = offlineFriends
						.map((f) => {
							const { MemberNumber, MemberName } = lastFriends.find(
								(d) => d.MemberNumber === f
							);
							return `${MemberName} (${MemberNumber})`;
						})
						.join(", ");
					bceNotify(displayText(`Now offline: $list`, { $list: list }), 5000, {
						ClickAction: BEEP_CLICK_ACTIONS.FriendList,
					});
				}
				lastFriends = data.Result;
			}
		);

		SDK.hookFunction(
			"ServerClickBeep",
			HOOK_PRIORITIES.OverrideBehaviour,
			(args, next) => {
				if (
					ServerBeep.Timer > Date.now() &&
					MouseIn(CurrentScreen === "ChatRoom" ? 0 : 500, 0, 1000, 50) &&
					CurrentScreen !== "FriendList"
				) {
					switch (ServerBeep.ClickAction) {
						case BEEP_CLICK_ACTIONS.FriendList:
							ServerOpenFriendList();
							return null;
						default:
							break;
					}
				}
				return next(args);
			}
		);
	}

	async function logCharacterUpdates() {
		await waitFor(() => ServerSocket && ServerIsConnected);

		registerSocketListener(
			"ChatRoomSyncSingle",
			(
				/** @type {ChatRoomSyncSingleEvent} */
				data
			) => {
				if (data?.Character?.MemberNumber !== Player.MemberNumber) {
					return;
				}
				bceLog("Player appearance updated by", data.SourceMemberNumber);
			}
		);

		registerSocketListener(
			"ChatRoomSyncItem",
			(
				/** @type {ChatRoomSyncItemEvent} */
				data
			) => {
				if (data?.Item?.Target !== Player.MemberNumber) {
					return;
				}
				bceLog(
					"Player's worn item",
					data.Item.Name,
					"in group",
					data.Item.Group,
					"updated by",
					data.Source,
					"to",
					data.Item
				);
			}
		);
	}

	async function forcedClubSlave() {
		const patch = (async function patchDialog() {
			await waitFor(
				() =>
					!!CommonCSVCache["Screens/Online/ChatRoom/Dialog_Online.csv"] &&
					CommonCSVCache["Screens/Online/ChatRoom/Dialog_Online.csv"].length >
						150
			);

			const clubSlaveDialog = [
				[
					"160",
					"100",
					displayText("([BCE] Force her to become a Club Slave.)"),
					displayText("(She will become a Club Slave for the next hour.)"),
					"bceSendToClubSlavery()",
					"bceCanSendToClubSlavery()",
				],
				[
					"160",
					"",
					displayText("([BCE] Force her to become a Club Slave.)"),
					displayText(
						"(Requires both to use compatible versions of BCE and the target to not already be a club slave.)"
					),
					"",
					"!bceCanSendToClubSlavery()",
				],
			];

			const idx =
				CommonCSVCache["Screens/Online/ChatRoom/Dialog_Online.csv"].findIndex(
					(v) => v[0] === "160"
				) + 1;
			CommonCSVCache["Screens/Online/ChatRoom/Dialog_Online.csv"].splice(
				idx,
				0,
				...clubSlaveDialog
			);

			/** @type {(c: Character) => void} */
			const appendDialog = (c) => {
				if (!c.Dialog || c.Dialog.some((v) => v.Modded)) {
					return;
				}
				c.Dialog.splice(
					idx,
					0,
					...clubSlaveDialog.map((v) => ({
						Stage: v[0],
						NextStage: v[1],
						Option: v[2]
							.replace("DialogCharacterName", c.Name)
							.replace("DialogPlayerName", Player.Name),
						Result: v[3]
							.replace("DialogCharacterName", c.Name)
							.replace("DialogPlayerName", Player.Name),
						Function:
							(v[4].trim().substring(0, 6) === "Dialog" ? "" : "ChatRoom") +
							v[4],
						Prerequisite: v[5],
						Modded: true,
					}))
				);
			};

			for (const c of ChatRoomCharacter.filter(
				(cc) => !cc.IsPlayer() && cc.IsOnline()
			)) {
				appendDialog(c);
			}

			SDK.hookFunction(
				"CharacterBuildDialog",
				HOOK_PRIORITIES.AddBehaviour,
				(args, next) => {
					const ret = next(args);
					const [C] = args;
					if (isCharacter(C) && C.IsOnline()) {
						appendDialog(C);
					}
					return ret;
				}
			);
		})();

		w.bceSendToClubSlavery = function () {
			/** @type {BCEChatMessage} */
			const message = {
				Type: HIDDEN,
				Content: BCE_MSG,
				Sender: Player.MemberNumber,
				Dictionary: {
					message: {
						type: MESSAGE_TYPES.Activity,
						version: BCE_VERSION,
						activity: "ClubSlavery",
					},
				},
			};
			ServerSend("ChatRoomChat", message);
			DialogLeave();
		};

		w.bceCanSendToClubSlavery = function () {
			const C = CurrentCharacter;
			if (!C) {
				return false;
			}
			return (
				C.BCECapabilities?.includes("clubslave") &&
				!C.Appearance.some((a) => a.Asset.Name === "ClubSlaveCollar")
			);
		};

		w.bceGotoRoom = (roomName) => {
			ChatRoomJoinLeash = roomName;
			DialogLeave();
			ChatRoomClearAllElements();
			if (CurrentScreen === "ChatRoom") {
				ServerSend("ChatRoomLeave", "");
				CommonSetScreen("Online", "ChatSearch");
			} else {
				ChatRoomStart("", "", "MainHall", "Introduction", BackgroundsTagList);
			}
		};

		w.bceStartClubSlave = async () => {
			const managementScreen = "Management";

			bceSendAction(
				displayText(
					`$PlayerName gets grabbed by two maids and escorted to management to serve as a Club Slave.`,
					{ $PlayerName: Player.Name }
				)
			);

			const room = ChatRoomData.Name;
			ChatRoomClearAllElements();
			ServerSend("ChatRoomLeave", "");
			ChatRoomLeashPlayer = null;
			CommonSetScreen("Room", managementScreen);

			await waitFor(() => !!ManagementMistress);

			CharacterSetActivePose(Player, "Kneel", false);
			// eslint-disable-next-line require-atomic-updates
			ManagementMistress.Stage = "320";
			ManagementMistress.CurrentDialog = displayText(
				"(You get grabbed by a pair of maids and brought to management.) Your owner wants you to be a Club Slave. Now strip."
			);
			CharacterSetCurrent(ManagementMistress);

			await waitFor(
				() => CurrentScreen !== managementScreen || !CurrentCharacter
			);

			w.bceGotoRoom(room);
		};

		w.ChatRoombceSendToClubSlavery = w.bceSendToClubSlavery;
		w.ChatRoombceCanSendToClubSlavery = w.bceCanSendToClubSlavery;

		await patch;
	}

	// BcUtil-compatible instant messaging with friends
	function instantMessenger() {
		w.bceStripBeepMetadata = (msg) => msg.split("\uf124")[0].trimEnd();

		// Build the DOM
		const container = document.createElement("div");
		container.classList.add("bce-hidden");
		container.id = "bce-instant-messenger";
		const leftContainer = document.createElement("div");
		leftContainer.id = "bce-message-left-container";
		const friendList = document.createElement("div");
		friendList.id = "bce-friend-list";
		const rightContainer = document.createElement("div");
		rightContainer.id = "bce-message-right-container";
		const messageContainer = document.createElement("div");
		messageContainer.id = "bce-message-container";
		const messageInput = document.createElement("textarea");
		messageInput.id = "bce-message-input";
		messageInput.setAttribute("maxlength", "2000");

		const friendSearch = document.createElement("input");
		friendSearch.id = "bce-friend-search";
		friendSearch.setAttribute(
			"placeholder",
			displayText("Search for a friend")
		);

		const onlineClass = "bce-friend-list-handshake-completed";
		const offlineClass = "bce-friend-list-handshake-false";

		container.appendChild(leftContainer);
		container.appendChild(rightContainer);
		leftContainer.appendChild(friendSearch);
		leftContainer.appendChild(friendList);
		rightContainer.appendChild(messageContainer);
		rightContainer.appendChild(messageInput);
		document.body.appendChild(container);

		const storageKey = () =>
			`bce-instant-messenger-state-${Player.AccountName.toLowerCase()}`;

		/** @type {number | null} */
		let activeChat = null;

		let unreadSinceOpened = 0;

		/** @typedef {{ author: string, authorId: number, type: "Emote" | "Action" | "Message", message: string, color: string, createdAt: number }} RawHistory */
		/** @typedef {{ unread: number, statusText: HTMLElement, listElement: HTMLElement, historyRaw: RawHistory[], history: HTMLElement, online: boolean }} IMFriendHistory */
		/** @type {Map<number, IMFriendHistory>} */
		const friendMessages = new Map();

		const scrollToBottom = () => {
			const friend = friendMessages.get(activeChat);
			if (friend) {
				friend.history.scrollTop = friend.history.scrollHeight;
			}
		};

		const saveHistory = () => {
			const history = {};
			friendMessages.forEach((friend, id) => {
				if (friend.historyRaw.length === 0) {
					return;
				}
				const historyLength = Math.min(friend.historyRaw.length, 100);
				history[id] = {
					historyRaw: friend.historyRaw.slice(-historyLength),
				};
			});
			localStorage.setItem(storageKey(), JSON.stringify(history));
		};

		/** @type {(friendId: number) => void} */
		const changeActiveChat = (friendId) => {
			const friend = friendMessages.get(friendId);
			messageInput.disabled = !friend?.online;
			messageContainer.innerHTML = "";
			for (const f of friendMessages.values()) {
				f.listElement.classList.remove("bce-friend-list-selected");
			}
			if (friend) {
				friend.listElement.classList.add("bce-friend-list-selected");
				friend.listElement.classList.remove("bce-friend-list-unread");
				messageContainer.appendChild(friend.history);
				friend.unread = 0;
			}

			const previousFriend = friendMessages.get(activeChat);
			if (previousFriend) {
				const divider = previousFriend.history.querySelector(
					".bce-message-divider"
				);
				if (divider) {
					previousFriend.history.removeChild(divider);
				}
			}

			sortIM();

			activeChat = friendId;
			scrollToBottom();
		};

		/** @type {(friendId: number, sent: boolean, beep: Beep, skipHistory: boolean, createdAt: Date) => void} */
		// eslint-disable-next-line complexity
		const addMessage = (friendId, sent, beep, skipHistory, createdAt) => {
			const friend = friendMessages.get(friendId);
			if (!friend || beep.BeepType) {
				return;
			}

			/** @type {{ messageType?: "Message" | "Emote" | "Action"; messageColor?: string; }?} */
			// @ts-ignore
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const details = JSON.parse(
				beep.Message?.split("\n")
					.find((line) => line.startsWith("\uf124"))
					?.substring(1) ?? "{}"
			);

			/** @type {"Message" | "Emote" | "Action"} */
			const messageType = ["Message", "Emote", "Action"].includes(
				details?.messageType
			)
				? `${details.messageType}`
				: "Message";
			const messageColor = details?.messageColor ?? "#ffffff";
			const messageText = beep.Message?.split("\n")
				.filter((line) => !line.startsWith("\uf124"))
				.join("\n")
				.trimEnd();

			if (!messageText) {
				bceLog("skipped empty beep", friendId, beep, sent, skipHistory);
				return;
			}

			const scrolledToEnd =
				friend.history.scrollHeight -
					friend.history.scrollTop -
					friend.history.clientHeight <
				1;
			const message = document.createElement("div");
			message.classList.add("bce-message");
			message.classList.add(sent ? "bce-message-sent" : "bce-message-received");
			message.classList.add(`bce-message-${messageType}`);
			message.setAttribute("data-time", createdAt.toLocaleString());

			const author = sent ? Player.Name : beep.MemberName;

			switch (messageType) {
				case "Emote":
					message.textContent = `*${author}${messageText}*`;
					break;
				case "Action":
					message.textContent = `*${messageText}*`;
					break;
				case "Message":
					{
						const sender = document.createElement("span");
						sender.classList.add("bce-message-sender");
						if (messageColor) {
							sender.style.color = messageColor;
						}
						sender.textContent = `${author}: `;
						message.appendChild(sender);
						message.appendChild(document.createTextNode(messageText));
					}
					break;
				default:
					message.textContent = messageText;
					break;
			}

			if (!skipHistory) {
				friend.historyRaw.push({
					author,
					authorId: sent ? Player.MemberNumber : beep.MemberNumber,
					message: messageText,
					type: messageType,
					color: messageColor,
					createdAt: Date.now(),
				});

				friend.listElement.setAttribute(
					"data-last-updated",
					Date.now().toString()
				);

				if (friendId !== activeChat) {
					friend.listElement.classList.add("bce-friend-list-unread");
					friend.unread++;
				}
				if (
					friend.unread === 1 &&
					(container.classList.contains("bce-hidden") ||
						friendId !== activeChat)
				) {
					const divider = document.createElement("div");
					divider.classList.add("bce-message-divider");
					friend.history.appendChild(divider);
				}

				if (container.classList.contains("bce-hidden")) {
					unreadSinceOpened++;
				}
			}
			const noop = () => null;
			processChatAugmentsForLine(
				message,
				scrolledToEnd ? scrollToBottom : noop
			);

			friend.history.appendChild(message);
			if (scrolledToEnd) {
				scrollToBottom();
			}

			saveHistory();
		};

		/** @type {(friendId: number) => IMFriendHistory} */
		const handleUnseenFriend = (friendId) => {
			if (!friendMessages.has(friendId)) {
				/** @type {IMFriendHistory} */
				const friendData = {
					statusText: document.createElement("span"),
					listElement: document.createElement("div"),
					historyRaw: [],
					history: document.createElement("div"),
					unread: 0,
					online: false,
				};
				friendData.listElement.id = `bce-friend-list-entry-${friendId}`;
				friendData.listElement.classList.add("bce-friend-list-entry");
				friendData.listElement.onclick = () => {
					changeActiveChat(friendId);
				};

				friendData.history.classList.add("bce-friend-history");

				const name = document.createElement("div");
				name.classList.add("bce-friend-list-entry-name");
				name.textContent = Player.FriendNames.get(friendId) || "";
				friendData.listElement.appendChild(name);

				const memberNumber = document.createElement("div");
				memberNumber.classList.add("bce-friend-list-entry-member-number");
				memberNumber.textContent = friendId.toString();
				friendData.listElement.appendChild(memberNumber);

				friendData.listElement.appendChild(friendData.statusText);

				friendList.appendChild(friendData.listElement);

				friendMessages.set(friendId, friendData);
			}
			return friendMessages.get(friendId);
		};

		/** @type {{ [key: string]: { historyRaw: RawHistory[] } }} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const history = JSON.parse(localStorage.getItem(storageKey()) || "{}");
		for (const [friendIdStr, friendHistory] of Object.entries(history)) {
			const friendId = parseInt(friendIdStr);
			const friend = handleUnseenFriend(friendId);
			friend.historyRaw = friendHistory.historyRaw;
			for (const hist of friendHistory.historyRaw) {
				addMessage(
					friendId,
					hist.authorId === Player.MemberNumber,
					{
						Message: `${hist.message}\n\n\uf124${JSON.stringify({
							messageType: hist.type,
							messageColor: hist.color,
						})}`,
						MemberNumber: hist.authorId,
						MemberName: hist.author,
					},
					true,
					hist.createdAt ? new Date(hist.createdAt) : new Date(0)
				);
				if (hist.createdAt) {
					friend.listElement.setAttribute(
						"data-last-updated",
						hist.createdAt.toString()
					);
				}
			}
		}

		messageInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				let messageText = messageInput.value;
				if (messageText.trim() === "") {
					return;
				}
				messageInput.value = "";

				/** @type {"Message" | "Emote" | "Action"} */
				let messageType = "Message";
				if (messageText.startsWith("/me ")) {
					messageText = messageText.substring(4);
					if (!/^[', ]/u.test(messageText)) {
						messageText = ` ${messageText}`;
					}
					messageType = "Emote";
				} else if (messageText.startsWith("/action ")) {
					messageText = messageText.substring(8);
					messageType = "Action";
				} else if (/^\*[^*]/u.test(messageText)) {
					messageText = messageText.substring(1);
					if (!/^[', ]/u.test(messageText)) {
						messageText = ` ${messageText}`;
					}
					messageType = "Emote";
				} else if (/^\*\*/u.test(messageText)) {
					messageText = messageText.substring(2);
					messageType = "Action";
				}

				/** @type {Beep} */
				const message = {
					MemberNumber: activeChat,
					MemberName: Player.FriendNames.get(activeChat) || "aname",
					IsSecret: true,
					Message: `${messageText}\n\n\uf124${JSON.stringify({
						messageType,
						messageColor: Player.LabelColor,
					})}`,
				};
				addMessage(activeChat, true, message, false, new Date());
				FriendListBeepLog.push({
					...message,
					Sent: true,
					Private: false,
					Time: new Date(),
					ChatRoomName: null,
				});
				ServerSend("AccountBeep", message);
			}
		});

		friendSearch.onkeyup = () => {
			const search = friendSearch.value.toLowerCase();
			for (const friendId of friendMessages.keys()) {
				const friend = friendMessages.get(friendId);
				const friendName = Player.FriendNames.get(friendId)?.toLowerCase();
				if (search === "") {
					friend.listElement.classList.remove("bce-hidden");
				} else if (
					!friendId.toString().includes(search) &&
					!friendName?.includes(search)
				) {
					friend.listElement.classList.add("bce-hidden");
				} else {
					friend.listElement.classList.remove("bce-hidden");
				}
			}
			sortIM();
		};

		registerSocketListener(
			"AccountQueryResult",
			(
				/** @type {{ Query: string; Result: Friend[] }} */
				data
			) => {
				if (data.Query !== "OnlineFriends") {
					return;
				}
				if (data.Result && bceSettings.instantMessenger) {
					for (const friend of data.Result) {
						const f = handleUnseenFriend(friend.MemberNumber);
						f.online = true;
						f.statusText.textContent = displayText("Online");
						f.listElement.classList.remove(offlineClass);
						f.listElement.classList.add(onlineClass);
					}
					for (const friendId of Array.from(friendMessages.keys()).filter(
						(f) => !data.Result.some((f2) => f2.MemberNumber === f)
					)) {
						const f = friendMessages.get(friendId);
						f.online = false;
						f.statusText.textContent = displayText("Offline");
						f.listElement.classList.remove(onlineClass);
						f.listElement.classList.add(offlineClass);
					}
					if (!data.Result.some((f) => f.MemberNumber === activeChat)) {
						// Disable input, current user is offline
						messageInput.disabled = true;
					} else {
						// Enable input, current user is online
						messageInput.disabled = false;
					}
				}
			}
		);

		function sortIM() {
			[...friendList.children]
				.sort((a, b) => {
					const notA = !a.classList.contains(onlineClass);
					const notB = !b.classList.contains(onlineClass);
					if ((notA && notB) || (!notA && !notB)) {
						const aUpdatedAt = a.getAttribute("data-last-updated");
						const bUpdatedAt = b.getAttribute("data-last-updated");
						const au = /^\d+$/u.test(aUpdatedAt) ? parseInt(aUpdatedAt) : 0;
						const bu = /^\d+$/u.test(bUpdatedAt) ? parseInt(bUpdatedAt) : 0;
						return bu - au;
					}
					if (notA) {
						return 1;
					}
					return -1;
				})
				.forEach((node) => {
					friendList.removeChild(node);
					friendList.appendChild(node);
				});
		}

		SDK.hookFunction(
			"ServerAccountBeep",
			HOOK_PRIORITIES.OverrideBehaviour,
			/** @type {(args: Beep[], next: (args: Beep[]) => void) => void} */
			(args, next) => {
				const [beep] = args;
				if (
					beep &&
					typeof beep === "object" &&
					!beep.BeepType &&
					bceSettings.instantMessenger
				) {
					addMessage(beep.MemberNumber, false, beep, false, new Date());
				}
				next(args);
			}
		);

		SDK.hookFunction(
			"ServerSend",
			HOOK_PRIORITIES.Observe,
			/** @type {(args: [string, Beep], next: (args: [string, Beep]) => void) => void} */
			(args, next) => {
				const [command, beep] = args;
				if (
					command === "AccountBeep" &&
					!beep?.BeepType &&
					isString(beep?.Message) &&
					!beep.Message.includes("\uf124")
				) {
					addMessage(beep.MemberNumber, true, beep, false, new Date());
				}
				return next(args);
			}
		);

		/**
		 * Get the position of the IM button dynamically based on current screen properties
		 * @type {() => [number, number, number, number]}
		 */
		function buttonPosition() {
			if (
				CurrentScreen === "ChatRoom" &&
				document.getElementById("TextAreaChatLog")?.offsetParent !== null
			) {
				return [5, 905, 60, 60];
			}
			return [70, 905, 60, 60];
		}

		SDK.hookFunction(
			"DrawProcess",
			HOOK_PRIORITIES.AddBehaviour,
			/** @type {(args: DOMHighResTimeStamp[], next: (args: DOMHighResTimeStamp[]) => void) => void} */
			(args, next) => {
				next(args);
				if (bceSettings.instantMessenger) {
					DrawButton(
						...buttonPosition(),
						"",
						unreadSinceOpened ? "Red" : "White",
						"Icons/Small/Chat.png",
						displayText("Instant Messenger"),
						false
					);
				}
			}
		);

		SDK.hookFunction(
			"CommonClick",
			HOOK_PRIORITIES.OverrideBehaviour,
			/** @type {(args: (MouseEvent | TouchEvent)[], next: (args: (MouseEvent | TouchEvent)[]) => void) => void} */
			(args, next) => {
				if (bceSettings.instantMessenger && MouseIn(...buttonPosition())) {
					sortIM();
					container.classList.toggle("bce-hidden");
					ServerSend("AccountQuery", { Query: "OnlineFriends" });
					unreadSinceOpened = 0;
					scrollToBottom();
					NotificationReset("Beep");
					return;
				}
				next(args);
			}
		);

		SDK.hookFunction(
			"NotificationRaise",
			HOOK_PRIORITIES.ModifyBehaviourHigh,
			/** @type {(args: [string, Partial<{ body: string }>], next: (args: [string, Partial<{ body: string }>]) => void) => void} */
			(args, next) => {
				if (args[0] === "Beep" && args[1].body) {
					args[1].body = bceStripBeepMetadata(args[1].body);
				}
				return next(args);
			}
		);

		/** @type {(e: KeyboardEvent) => void} */
		function keyHandler(e) {
			if (!bceSettings.instantMessenger) {
				return;
			}
			if (e.key === "Escape" && !container.classList.contains("bce-hidden")) {
				container.classList.add("bce-hidden");
				e.stopPropagation();
				e.preventDefault();
			}
		}

		document.addEventListener("keydown", keyHandler, true);
		document.addEventListener("keypress", keyHandler, true);
	}

	async function extendedWardrobe() {
		await waitFor(() => !!ServerSocket);

		SDK.hookFunction(
			"CharacterDecompressWardrobe",
			HOOK_PRIORITIES.ModifyBehaviourMedium,
			(args, next) => {
				let wardrobe = next(args);
				if (
					isWardrobe(wardrobe) &&
					bceSettings.expandedWardrobe &&
					wardrobe.length < EXPANDED_WARDROBE_SIZE
				) {
					wardrobe = loadExtendedWardrobe(wardrobe);
				}
				return wardrobe;
			}
		);

		SDK.hookFunction(
			"CharacterCompressWardrobe",
			HOOK_PRIORITIES.Top,
			/** @type {(args: (ItemBundle[][] | string)[][], next: (args: (ItemBundle[][] | string)[][]) => string) => string} */
			(args, next) => {
				const [wardrobe] = args;
				if (isWardrobe(wardrobe)) {
					const additionalWardrobe = wardrobe.slice(DEFAULT_WARDROBE_SIZE);
					if (additionalWardrobe.length > 0) {
						Player.OnlineSettings.BCEWardrobe = LZString.compressToUTF16(
							JSON.stringify(additionalWardrobe)
						);
						args[0] = wardrobe.slice(0, DEFAULT_WARDROBE_SIZE);
						ServerAccountUpdate.QueueData({
							OnlineSettings: Player.OnlineSettings,
						});
					}
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"LoginResponse",
			HOOK_PRIORITIES.Top,
			/** @type {(args: Character[], next: (args: Character[]) => void) => void} */
			(args, next) => {
				const [{ BCEWardrobe }] = args;
				if (isString(BCEWardrobe)) {
					Player.BCEWardrobe = BCEWardrobe;
				}
				return next(args);
			}
		);
	}

	/** @type {(wardrobe: ItemBundle[][]) => ItemBundle[][]} */
	function loadExtendedWardrobe(wardrobe) {
		if (bceSettings.extendedWardrobe) {
			WardrobeSize = EXPANDED_WARDROBE_SIZE;
			WardrobeFixLength();
		}
		if (Player.BCEWardrobe) {
			Player.OnlineSettings.BCEWardrobe = Player.BCEWardrobe;
			Player.BCEWardrobe = null;
			ServerAccountUpdate.QueueData({
				BCEWardrobe: null,
				OnlineSettings: Player.OnlineSettings,
			});
		}
		if (Player.OnlineSettings.BCEWardrobe) {
			/** @type {ItemBundle[][]} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const additionalItemBundle = JSON.parse(
				LZString.decompressFromUTF16(Player.OnlineSettings.BCEWardrobe)
			);
			if (isWardrobe(additionalItemBundle)) {
				for (let i = DEFAULT_WARDROBE_SIZE; i < EXPANDED_WARDROBE_SIZE; i++) {
					const additionalIdx = i - DEFAULT_WARDROBE_SIZE;
					if (additionalIdx >= additionalItemBundle.length) {
						break;
					}
					wardrobe[i] = additionalItemBundle[additionalIdx];
				}
			}
		}
		return wardrobe;
	}

	async function beepChangelog() {
		await waitFor(() => !!Player?.AccountName);
		await sleep(5000);
		bceBeepNotify(
			displayText("BCE Changelog"),
			displayText(
				`BCE has received significant updates since you last used it. See /bcechangelog in a chatroom.`
			)
		);
	}

	/** @type {(word: string) => URL | false} */
	function bceParseUrl(word) {
		try {
			const url = new URL(word);
			if (!["http:", "https:"].includes(url.protocol)) {
				return false;
			}
			return url;
		} catch {
			return false;
		}
	}

	/** @type {(url: URL) => "img" | ""} */
	function bceAllowedToEmbed(url) {
		if (
			[
				"cdn.discordapp.com",
				"media.discordapp.com",
				"i.imgur.com",
				"tenor.com",
				"c.tenor.com",
				"i.redd.it",
				"puu.sh",
			].includes(url.host) &&
			/\/[^/]+\.(png|jpe?g|gif)$/u.test(url.pathname)
		) {
			return EMBED_TYPE.Image;
		}
		return EMBED_TYPE.None;
	}

	/** @type {(chatMessageElement: Element, scrollToEnd: () => void) => void} */
	function processChatAugmentsForLine(chatMessageElement, scrollToEnd) {
		const newChildren = [];
		for (const node of chatMessageElement.childNodes) {
			if (node.nodeType !== Node.TEXT_NODE) {
				newChildren.push(node);
				/** @type {HTMLElement} */
				// @ts-ignore
				const el = node;
				if (
					el.classList.contains("ChatMessageName") ||
					el.classList.contains("bce-message-Message")
				) {
					newChildren.push(document.createTextNode(" "));
				}
				continue;
			}
			const contents = node.textContent.trim(),
				words = [contents];
			for (let i = 0; i < words.length; i++) {
				// Handle other whitespace
				const whitespaceIdx = words[i].search(/[\s\r\n]/u);
				if (whitespaceIdx >= 1) {
					words.splice(i + 1, 0, words[i].substring(whitespaceIdx));
					words[i] = words[i].substring(0, whitespaceIdx);
				} else if (whitespaceIdx === 0) {
					words.splice(i + 1, 0, words[i].substring(1));
					[words[i]] = words[i];
					newChildren.push(document.createTextNode(words[i]));
					continue;
				}

				// Handle url linking
				const url = bceParseUrl(words[i].replace(/(^\(+|\)+$)/gu, ""));
				if (url) {
					// Embed or link
					/** @type {HTMLElement | Text} */
					let domNode = null;
					const linkNode = document.createElement("a");
					switch (bceAllowedToEmbed(url)) {
						case EMBED_TYPE.Image:
							{
								const imgNode = document.createElement("img");
								imgNode.src = url.href;
								imgNode.alt = url.href;
								imgNode.onload = scrollToEnd;
								imgNode.classList.add("bce-img");
								linkNode.classList.add("bce-img-link");
								domNode = imgNode;
							}
							break;
						default:
							domNode = document.createTextNode(url.href);
							break;
					}
					linkNode.href = url.href;
					linkNode.title = url.href;
					linkNode.target = "_blank";
					linkNode.appendChild(domNode);
					newChildren.push(linkNode);
				} else if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/u.test(words[i])) {
					const color = document.createElement("span");
					color.classList.add("bce-color");
					color.style.background = words[i];
					newChildren.push(color);
					newChildren.push(document.createTextNode(words[i]));
				} else {
					newChildren.push(document.createTextNode(words[i]));
				}
			}
		}
		while (chatMessageElement.firstChild) {
			chatMessageElement.removeChild(chatMessageElement.firstChild);
		}
		for (const child of newChildren) {
			chatMessageElement.appendChild(child);
		}
	}

	function discreetMode() {
		/** @type {(args: [unknown], next: (args: [unknown]) => unknown) => unknown} */
		const discreetModeHook = (args, next) => {
			if (bceSettings.discreetMode) {
				return;
			}
			// eslint-disable-next-line consistent-return
			return next(args);
		};

		SDK.hookFunction(
			"ChatRoomDrawBackground",
			HOOK_PRIORITIES.Top,
			discreetModeHook
		);

		SDK.hookFunction("DrawCharacter", HOOK_PRIORITIES.Top, discreetModeHook);
		SDK.hookFunction(
			"NotificationDrawFavicon",
			HOOK_PRIORITIES.Top,
			discreetModeHook
		);

		SDK.hookFunction(
			"DrawImageEx",
			HOOK_PRIORITIES.Top,
			/** @type {(args: [string | HTMLImageElement | HTMLCanvasElement], next: (args: [string | HTMLImageElement | HTMLCanvasElement]) => boolean) => boolean} */
			(args, next) => {
				if (bceSettings.discreetMode) {
					if (!args) {
						return false;
					}
					const ignoredImages =
						/(^Backgrounds\/(?!Sheet(White)?|grey|White\.)|\b(Kneel|Arousal|Activity|Asylum|Cage|Cell|ChangeLayersMouth|Diaper|Kidnap|Logo|Player|Remote|Restriction|SpitOutPacifier|Struggle|Therapy|Orgasm\d|Poses|HouseVincula|Seducer\w+)\b|^data:|^Assets\/(?!Female3DCG\/Emoticon\/(Afk|Sleep|Read|Gaming|Hearing|Thumbs(Up|Down))\/))/u;
					if (isString(args[0]) && ignoredImages.test(args[0])) {
						return false;
					}
					// @ts-ignore
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					if (args[0]?.src && ignoredImages.test(args[0].src)) {
						return false;
					}
				}
				return next(args);
			}
		);

		SDK.hookFunction(
			"NotificationTitleUpdate",
			HOOK_PRIORITIES.Top,
			(args, next) => {
				if (bceSettings.discreetMode) {
					const notificationCount = NotificationGetTotalCount(1);
					document.title = `${
						notificationCount > 0 ? `(${notificationCount}) ` : ""
					}${displayText("OnlineChat")}`;
					return;
				}
				// eslint-disable-next-line consistent-return
				return next(args);
			}
		);
	}

	function tabActivityWorkaround() {
		if (!bceSettings.tabActivityWorkaround) {
			return;
		}
		// Quiet white noise
		const audioUrl =
			"data:audio/aac;base64,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";

		const el = document.createElement("audio");
		el.src = audioUrl;
		el.autoplay = true;
		el.loop = true;
		el.style.display = "none";
		// Disable playing over chromecast etc.
		el.disableRemotePlayback = true;
		// Set to almost muted
		el.volume = 0.000001;
		document.body.appendChild(el);
	}

	function autoStruggle() {
		const allowAllDialogExpressions = () => {
			if (!bceAnimationEngineEnabled()) {
				return;
			}
			if (
				StruggleProgressAuto >= 0 ||
				StruggleProgressChallenge <= 0 ||
				!CharacterGetCurrent()?.IsPlayer()
			) {
				return;
			}
			DialogAllowBlush = true;
			DialogAllowEyebrows = true;
			DialogAllowFluids = true;
		};

		createTimer(() => {
			if (!bceSettings.autoStruggle) {
				return;
			}

			if (typeof StruggleProgress !== "number" || StruggleProgress < 0) {
				return;
			}

			if (StruggleProgressCurrentMinigame === "Strength") {
				allowAllDialogExpressions();
				StruggleStrength(false);
			} else if (StruggleProgressCurrentMinigame === "Flexibility") {
				if (StruggleProgressFlexCircles?.length > 0) {
					allowAllDialogExpressions();
					StruggleFlexibility(false, true);
					StruggleProgressFlexCircles.splice(0, 1);
				}
			}
		}, 60);

		createTimer(() => {
			if (!bceSettings.autoStruggle) {
				return;
			}

			if (typeof StruggleProgress !== "number" || StruggleProgress < 0) {
				return;
			}
			if (StruggleProgressCurrentMinigame === "Dexterity") {
				// Duplicated logic from StruggleDexterity
				const distMult = Math.max(
					-0.5,
					Math.min(
						1,
						(85 -
							Math.abs(
								StruggleProgressDexTarget - StruggleProgressDexCurrent
							)) /
							75
					)
				);
				if (distMult > 0.5) {
					allowAllDialogExpressions();
					StruggleDexterity(false);
				}
			}
		}, 0);
	}

	function nicknames() {
		if (isString(bceSettings.nickname)) {
			setOwnNickname(bceSettings.nickname);
		}

		/** @type {[number, number, number, number]} */
		const nickButtonPosition = [475, 100, 60, 60];
		/** @type {[number, number, number, number]} */
		const exitButtonPosition = [1815, 75, 90, 90];
		let nickInputVisible = false;
		const nickInputName = "bce-nick-input";

		function showNickInput() {
			nickInputVisible = true;
			let name = "";
			if (isString(bceSettings.nickname)) {
				name = bceSettings.nickname;
			}
			ElementCreateInput(nickInputName, "text", name, "20");
		}

		function hideNickInput() {
			if (!Player.BCEOriginalName) {
				Player.BCEOriginalName = Player.Name;
			}
			bceSettings.nickname = ElementValue(nickInputName);
			setOwnNickname(bceSettings.nickname);
			bceSaveSettings();
			ElementRemove(nickInputName);
			nickInputVisible = false;
			sendHello();
		}

		SDK.hookFunction(
			"InformationSheetRun",
			HOOK_PRIORITIES.AddBehaviour,
			/** @type {(args: unknown[], next: (args: unknown[]) => unknown) => unknown} */
			(args, next) => {
				if (bceSettings.nicknames) {
					if (
						InformationSheetSelection?.BCEOriginalName &&
						InformationSheetSelection.BCEOriginalName !==
							InformationSheetSelection.Name
					) {
						w.MainCanvas.getContext("2d").textAlign = "left";
						DrawText(
							displayText("Official Name: ") +
								InformationSheetSelection.BCEOriginalName,
							550,
							75,
							"grey",
							"black"
						);
						w.MainCanvas.getContext("2d").textAlign = "center";
					}
					if (InformationSheetSelection?.IsPlayer()) {
						DrawButton(
							...nickButtonPosition,
							"",
							"white",
							"Icons/Small/Preference.png",
							displayText("Change your nickname")
						);
					}
				}
				// eslint-disable-next-line consistent-return
				return next(args);
			}
		);

		SDK.hookFunction(
			"InformationSheetRun",
			HOOK_PRIORITIES.OverrideBehaviour,
			/** @type {(args: unknown[], next: (args: unknown[]) => unknown) => unknown} */
			(args, next) => {
				if (bceSettings.nicknames && nickInputVisible) {
					DrawButton(
						...exitButtonPosition,
						"",
						"white",
						"Icons/Accept.png",
						displayText("Save this nickname")
					);
					DrawText(
						displayText("Set your nickname here. Leave empty to reset."),
						1000,
						400,
						"black",
						"black"
					);
					ElementPosition(nickInputName, 1000, 500, 500);
					return;
				}
				// eslint-disable-next-line consistent-return
				return next(args);
			}
		);

		SDK.hookFunction(
			"InformationSheetClick",
			HOOK_PRIORITIES.AddBehaviour,
			/** @type {(args: unknown[], next: (args: unknown[]) => unknown) => unknown} */
			(args, next) => {
				if (
					bceSettings.nicknames &&
					InformationSheetSelection?.IsPlayer() &&
					MouseIn(...nickButtonPosition)
				) {
					showNickInput();
				}
				// eslint-disable-next-line consistent-return
				return next(args);
			}
		);

		SDK.hookFunction(
			"InformationSheetClick",
			HOOK_PRIORITIES.OverrideBehaviour,
			/** @type {(args: unknown[], next: (args: unknown[]) => unknown) => unknown} */
			(args, next) => {
				if (bceSettings.nicknames && nickInputVisible) {
					if (MouseIn(...exitButtonPosition)) {
						hideNickInput();
					}
					return;
				}
				// eslint-disable-next-line consistent-return
				return next(args);
			}
		);

		/** @type {(e: KeyboardEvent) => void} */
		function keyHandler(e) {
			if (e.key === "Escape" && nickInputVisible) {
				hideNickInput();
				e.stopPropagation();
				e.preventDefault();
			}
		}

		document.addEventListener("keydown", keyHandler, true);
		document.addEventListener("keypress", keyHandler, true);
	}

	/** @type {(newName: string) => void} */
	function setOwnNickname(newName) {
		if (!Player.BCEOriginalName) {
			Player.BCEOriginalName = Player.Name;
		}
		if (!newName) {
			newName = Player.BCEOriginalName;
		}
		if (newName !== Player.BCEOriginalName) {
			newName = removeNonPrintables(newName);
		}
		if (newName !== Player.Name) {
			bceSendAction(
				displayText("$OldName is now known as $NewName", {
					$OldName: Player.Name,
					$NewName: newName,
				})
			);
		}
		Player.Name = newName;
		if (Player.Name === Player.BCEOriginalName) {
			delete Player.BCEOriginalName;
		}
	}

	function enableLeashing() {
		const emoticon = Player.Appearance.find((a) => a.Asset.Name === "Emoticon");
		if (!emoticon) {
			bceWarn("Could not find emoticon asset.");
			return;
		}
		if (!emoticon.Property) {
			emoticon.Property = { Effect: ["Leash"] };
		} else if (!emoticon.Property.Effect) {
			emoticon.Property.Effect = ["Leash"];
		} else if (!emoticon.Property.Effect.includes("Leash")) {
			emoticon.Property.Effect.push("Leash");
		}
		ChatRoomCharacterUpdate(Player);
	}

	function disableLeashing() {
		const emoticon = Player.Appearance.find((a) => a.Asset.Name === "Emoticon");
		if (emoticon?.Property?.Effect?.includes("Leash")) {
			emoticon.Property.Effect = emoticon.Property.Effect.filter(
				(e) => e !== "Leash"
			);
		}
		ChatRoomCharacterUpdate(Player);
	}

	async function leashAlways() {
		await waitFor(() =>
			Player?.Appearance?.some((a) => a.Asset.Name === "Emoticon")
		);
		const emoticon = Player.Appearance.find((a) => a.Asset.Name === "Emoticon");
		if (Array.isArray(emoticon.Asset.AllowEffect)) {
			emoticon.Asset.AllowEffect.push("Leash");
		} else {
			emoticon.Asset.AllowEffect = ["Leash"];
		}

		if (bceSettings.leashAlways) {
			enableLeashing();
		} else {
			disableLeashing();
		}
	}

	function clampGag() {
		registerSocketListener(
			"ChatRoomMessage",
			(
				/** @type {ChatMessage} */
				data
			) => {
				const targetMemberNumber =
					data &&
					Array.isArray(data.Dictionary) &&
					data.Dictionary.find((d) => d.Tag === "TargetCharacter")
						?.MemberNumber;
				if (
					data?.Content === "ChatOther-ItemMouth-HandGag" &&
					targetMemberNumber
				) {
					let s = characterStates.get(targetMemberNumber);
					if (!s) {
						s = {
							clamped: 0,
						};
					}
					s.clamped = Date.now() + 45000;
					characterStates.set(targetMemberNumber, s);
				}
			}
		);

		SDK.hookFunction(
			"SpeechGetTotalGagLevel",
			HOOK_PRIORITIES.ModifyBehaviourLow,
			/** @type {(args: [Character, boolean], next: (args: [Character, boolean]) => number) => number} */
			(args, next) => {
				let level = next(args);
				if (
					bceSettings.handgag &&
					characterStates.get(args[0].MemberNumber)?.clamped > Date.now()
				) {
					level += 2;
				}
				return level;
			}
		);
	}

	function toySync() {
		// Handles synchronizing in-game vibrators with real bluetooth devices via buttplut.io
		if (!bceSettings.toySync) {
			return;
		}

		const frame = document.createElement("iframe");
		frame.src = "./changelog.html";
		frame.classList.add("bce-false-hidden");
		const script = document.createElement("script");
		const notifierScript = document.createElement("script");
		frame.onload = () => {
			frame.contentDocument.head.appendChild(notifierScript);
			frame.contentDocument.head.appendChild(script);
		};
		bceInfo("Loading buttplug.io");

		const onload = async () => {
			bceInfo("Loaded Buttplug.io");
			/** @type {import('./types/buttplug.io.1.0.17')} */
			// @ts-ignore
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const bp = frame.contentWindow.Buttplug;

			/** @type {import('./types/buttplug.io.1.0.17').ButtplugClient} */
			const client = new bp.ButtplugClient("BceToySync");
			client.addListener(
				"deviceadded",
				(
					/** @type {import('./types/buttplug.io.1.0.17').ButtplugClientDevice} */
					device
				) => {
					bceLog("Device connected", device);
					bceChatNotify(
						displayText(`Vibrator connected: $DeviceName`, {
							$DeviceName: device.Name,
						})
					);
					const deviceSettings = toySyncState.deviceSettings.get(device.Name);
					if (deviceSettings) {
						delete deviceSettings.LastIntensity;
					}
				}
			);
			client.addListener(
				"deviceremoved",
				(
					/** @type {import('./types/buttplug.io.1.0.17').ButtplugClientDevice} */
					device
				) => {
					bceLog("Device disconnected", device);
					bceChatNotify(
						displayText(`Vibrator disconnected: $DeviceName`, {
							$DeviceName: device.Name,
						})
					);
				}
			);
			client.addListener("scanningfinished", (data) => {
				bceLog("Scanning finished", data);
			});

			const connector = new bp.ButtplugWebsocketConnectorOptions();
			connector.Address = "ws://127.0.0.1:12345";
			try {
				await client.connect(connector);
				bceInfo("Connected buttplug.io");
			} catch (ex) {
				if (ex) {
					// eslint-disable-next-line no-alert
					alert(
						displayText(
							"buttplug.io is enabled, but server could not be contacted at ws://127.0.0.1:12345. Is Intiface Desktop running? Is another client connected to it?"
						)
					);
					bceError("buttplug.io could not connect to server", ex);
					return;
				}
			}

			toySyncState.client = client;

			let lastSync = 0;
			// Sync vibrations from slots
			createTimer(() => {
				if (lastSync > Date.now() - 3000) {
					// Don't change vibes more than once per 3 seconds
					return;
				}

				// 0 is VibrateCmd
				for (const d of client.Devices.filter((dev) =>
					dev.AllowedMessages.includes(0)
				)) {
					const deviceSettings = toySyncState.deviceSettings?.get(d.Name);
					if (!deviceSettings) {
						continue;
					}

					const slot = deviceSettings.SlotName;
					const intensity = Player.Appearance.find(
						(a) => a.Asset.Group.Name === slot
					)?.Property?.Intensity;

					if (deviceSettings.LastIntensity === intensity) {
						continue;
					}
					deviceSettings.LastIntensity = intensity;

					lastSync = Date.now();
					if (typeof intensity !== "number" || intensity < 0) {
						d.vibrate(0);
					} else {
						switch (intensity) {
							case 0:
								d.vibrate(0.1);
								bceLog(d.Name, slot, "intensity 0.1");
								break;
							case 1:
								d.vibrate(0.4);
								bceLog(d.Name, slot, "intensity 0.4");
								break;
							case 2:
								d.vibrate(0.75);
								bceLog(d.Name, slot, "intensity 0.75");
								break;
							case 3:
								d.vibrate(1.0);
								bceLog(d.Name, slot, "intensity 1");
								break;
							default:
								bceWarn("Invalid intensity in ", slot, ":", intensity);
								break;
						}
					}
				}
			}, 0);

			Commands.push({
				Tag: "toybatteries",
				Description: displayText(
					"Shows the battery status of all connected buttplug.io toys"
				),
				Action: async () => {
					if (!client.Connected) {
						bceChatNotify("buttplug.io is not connected");
						return;
					}

					const batteryDevices = client.Devices.filter((dev) =>
						dev.AllowedMessages.includes(8)
					);
					if (batteryDevices.length === 0) {
						bceChatNotify("No battery devices connected");
						return;
					}

					const batteryStatus = await Promise.all(
						batteryDevices.map((dev) => dev.batteryLevel())
					);
					for (let i = 0; i < batteryDevices.length; i++) {
						const battery = batteryStatus[i] * 100;
						bceChatNotify(`${batteryDevices[i].Name}: ${battery}%`);
					}
				},
			});

			Commands.push({
				Tag: "toyscan",
				Description: displayText("Scans for connected buttplug.io toys"),
				Action: () => {
					if (!client.Connected) {
						bceChatNotify(displayText("buttplug.io is not connected"));
						return;
					}

					if (client.isScanning) {
						bceChatNotify(displayText("Already scanning"));
						return;
					}

					client.startScanning();
					bceChatNotify(displayText("Scanning for toys"));
				},
			});

			await client.startScanning();
		};

		window.onmessage = (
			/** @type {MessageEvent<unknown>} */
			e
		) => {
			if (e.data === "buttplug-loaded") {
				onload();
			}
		};

		notifierScript.textContent = `
		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}

		(async function () {
			while (typeof Buttplug !== "object") {
				await sleep(10);
			}

			await Buttplug.buttplugInit();

			window.top.postMessage("buttplug-loaded", "${window.location.origin}");
		})();
		`;

		script.src =
			"https://cdn.jsdelivr.net/npm/buttplug@1.0.17/dist/web/buttplug.min.js";
		document.body.appendChild(frame);
	}

	async function pastProfiles() {
		if (!bceSettings.pastProfiles) {
			return;
		}

		const scriptEl = document.createElement("script");
		scriptEl.src = "https://unpkg.com/dexie@3.2.1/dist/dexie.js";
		document.body.appendChild(scriptEl);

		await waitFor(
			() => typeof Dexie !== "undefined" && ServerSocket && ServerIsConnected
		);

		const db = new Dexie("bce-past-profiles");
		db.version(2).stores({
			profiles: "memberNumber, name, lastNick, seen, characterBundle",
			notes: "memberNumber, note",
		});

		ElementCreateTextArea("bceNoteInput");
		/** @type {HTMLTextAreaElement} */
		// @ts-ignore
		const noteInput = document.getElementById("bceNoteInput");
		noteInput.maxLength = 10000;
		noteInput.classList.add("bce-hidden");

		const profiles = db.table("profiles");
		const notes = db.table("notes");

		/** @type {(characterBundle: Character) => Promise<void>} */
		async function saveProfile(characterBundle) {
			let name = characterBundle.Name;
			let nick = null;
			const C = Character.find(
				(c) => c.MemberNumber === characterBundle.MemberNumber
			);
			if (C?.BCEOriginalName) {
				nick = C.Name;
				name = C.BCEOriginalName;
			}
			try {
				await profiles.put({
					memberNumber: characterBundle.MemberNumber,
					name,
					lastNick: nick,
					seen: Date.now(),
					characterBundle: JSON.stringify(characterBundle),
				});
			} catch (e) {
				bceError("saving profile", e);
			}
		}

		registerSocketListener(
			"ChatRoomSync",
			(
				/** @type {ChatRoomSyncEvent} */
				data
			) => {
				if (!data?.Character?.length) {
					return;
				}
				for (const char of data.Character) {
					saveProfile(char);
				}
			}
		);

		registerSocketListener(
			"ChatRoomSyncSingle",
			(
				/** @type {ChatRoomSyncSingleEvent} */
				data
			) => {
				if (!data?.Character?.MemberNumber) {
					return;
				}
				saveProfile(data.Character);
			}
		);

		SDK.hookFunction(
			"InformationSheetRun",
			HOOK_PRIORITIES.AddBehaviour,
			/** @type {(args: unknown[], next: (args: unknown[]) => unknown) => unknown} */
			(args, next) => {
				if (InformationSheetSelection.BCESeen) {
					w.MainCanvas.getContext("2d").textAlign = "left";
					DrawText(
						displayText("Last seen: ") +
							new Date(InformationSheetSelection.BCESeen).toLocaleString(),
						1200,
						75,
						"grey",
						"black"
					);
					w.MainCanvas.getContext("2d").textAlign = "center";
				}
				// eslint-disable-next-line consistent-return
				return next(args);
			}
		);

		/** @type {(memberNumber: number) => Promise<void>} */
		async function openCharacter(memberNumber) {
			try {
				/** @type {SavedProfile} */
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const profile = await profiles.get(memberNumber);
				const C = CharacterLoadOnline(
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					JSON.parse(profile.characterBundle),
					memberNumber
				);
				C.BCESeen = profile.seen;
				if (profile.lastNick) {
					C.Name = profile.lastNick;
					C.BCEOriginalName = profile.name;
				}
				if (CurrentScreen === "ChatRoom") {
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					ChatRoomChatHidden = true;
					ChatRoomBackground = ChatRoomData.Background;
				}
				InformationSheetLoadCharacter(C);
			} catch (e) {
				bceChatNotify(displayText("No profile found"));
				bceError("reading profile", e);
			}
		}

		Commands.push({
			Tag: "profiles",
			Description: displayText(
				"<filter> - List seen profiles, optionally searching by member number or name"
			),
			Action: async (args) => {
				/** @type {SavedProfile[]} */
				let list = await profiles.toArray();
				list = list.filter(
					(p) =>
						!args ||
						p.name.toLowerCase().includes(args) ||
						p.memberNumber.toString().includes(args) ||
						p.lastNick?.toLowerCase().includes(args)
				);
				list.sort(
					(a, b) => -(b.lastNick ?? b.name).localeCompare(a.lastNick ?? a.name)
				);
				const lines = list.map((p) => {
					const div = document.createElement("div");
					div.textContent = displayText(
						`$nickAndName ($memberNumber) - Seen: $seen`,
						{
							$nickAndName: p.lastNick ? `${p.lastNick} / ${p.name}` : p.name,
							$memberNumber: p.memberNumber.toString(),
							$seen: new Date(p.seen).toLocaleDateString(),
						}
					);
					const link = document.createElement("a");
					link.textContent = displayText("Open");
					link.href = `#`;
					link.classList.add("bce-profile-open");
					link.addEventListener("click", (e) => {
						e.preventDefault();
						e.stopPropagation();
						openCharacter(p.memberNumber);
					});
					div.prepend(link);
					return div;
				});
				const header = document.createElement("h3");
				header.textContent = displayText("Saved Profiles");
				header.style.marginTop = "0";
				const footer = document.createElement("div");
				footer.textContent = displayText(
					"$num total profiles matching search",
					{
						$num: list.length.toLocaleString(),
					}
				);
				bceChatNotify([header, ...lines, footer]);
			},
		});

		SDK.hookFunction(
			"OnlineProfileExit",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				noteInput.classList.add("bce-hidden");
				return next(args);
			}
		);

		SDK.hookFunction(
			"OnlineProfileLoad",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				next(args);
				noteInput.classList.remove("bce-hidden");
				noteInput.value = "Loading...";
				notes
					.get(InformationSheetSelection.MemberNumber)
					.then((note) => {
						// eslint-disable-next-line
						noteInput.value = note?.note || "";
					})
					.catch((reason) => {
						noteInput.value = "";
						bceError("getting note", reason);
					});
			}
		);

		SDK.hookFunction(
			"OnlineProfileRun",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				ElementPositionFix("DescriptionInput", 36, 100, 160, 1790, 400);
				DrawText(
					displayText("Personal notes (only you can read these):"),
					910,
					160 + 455,
					"Black",
					"Gray"
				);
				ElementPositionFix("bceNoteInput", 36, 100, 160 + 500, 1790, 250);
				// Always draw the accept button; normal method shows it when is player
				if (!InformationSheetSelection.IsPlayer()) {
					DrawButton(
						1720,
						60,
						90,
						90,
						"",
						"White",
						"Icons/Accept.png",
						TextGet("LeaveSave")
					);
				}
				return ret;
			}
		);

		patchFunction(
			"OnlineProfileRun",
			{
				ElementPositionFix: "// ElementPositionFix",
			},
			"Scrolling in profile descriptions"
		);

		SDK.hookFunction(
			"OnlineProfileClick",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				if (MouseIn(1720, 60, 90, 90)) {
					// Save note
					notes.put({
						memberNumber: InformationSheetSelection.MemberNumber,
						note: noteInput.value,
					});
					if (InformationSheetSelection.IsPlayer()) {
						OnlineProfileExit(true);
					} else {
						OnlineProfileExit(false);
					}
					return;
				}
				next(args);
			}
		);

		if (
			navigator.storage?.persisted &&
			!(await navigator.storage.persisted())
		) {
			if (!(await navigator.storage.persist())) {
				bceWarn("Profile storage may not be persistent.");
			}
		}
	}

	(function () {
		const sendHeartbeat = () => {
			if (w.BCX_Loaded && bcxType === "none") {
				bcxType = "external";
			}
			SDK.callOriginal("ServerSend", [
				"AccountBeep",
				{
					BeepType: "Leash",
					// BCE statbot, which only collects anonymous aggregate version and usage data to justify supporting or dropping support for features
					MemberNumber: 61197,
					Message: JSON.stringify({
						Version: BCE_VERSION,
						GameVersion,
						BCX: bcxType,
						// !! to avoid passing room name to statbot, only presence inside a room or not
						InRoom: !!Player.LastChatRoom,
						InPrivate: !!Player.LastChatRoomPrivate,
						// @ts-ignore
						// eslint-disable-next-line camelcase
						InTampermonkey: typeof GM_info !== "undefined",
					}),
					// IsSecret: true to avoid passing room name to statbot
					IsSecret: true,
				},
			]);
		};
		sendHeartbeat();
		// 5 minutes
		createTimer(sendHeartbeat, 1000 * 60 * 5);
	})();

	/** @type {(s: string) => string} */
	function removeNonPrintables(s) {
		if (!s) {
			return "";
		}
		return s
			.replace(/[^\p{L}\p{Z}'-]/gu, "")
			.replace(/[\n\r\p{Z}]/gu, " ")
			.trim();
	}

	/** @type {(cb: () => void, intval: number) => void} */
	function createTimer(cb, intval) {
		let lastTime = Date.now();
		SDK.hookFunction("MainRun", HOOK_PRIORITIES.Top, (args, next) => {
			if (Date.now() - lastTime > intval) {
				lastTime = Date.now();
				cb();
			}
			return next(args);
		});
	}

	/** @type {(ms: number) => Promise<void>} */
	function sleep(ms) {
		// eslint-disable-next-line no-promise-executor-return
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/** @type {(s: unknown) => s is string} */
	function isString(s) {
		return typeof s === "string";
	}

	/** @type {(o: unknown) => o is Object} */
	function isNonNullObject(o) {
		return o && typeof o === "object" && !Array.isArray(o);
	}

	/** @type {(m: unknown) => m is ChatMessage} */
	function isChatMessage(m) {
		return (
			isNonNullObject(m) &&
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			typeof m.Type === "string" &&
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			typeof m.Content === "string"
		);
	}

	/** @type {(c: unknown) => c is Character} */
	function isCharacter(c) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		return isNonNullObject(c) && typeof c.IsPlayer === "function";
	}

	/** @type {(c: unknown) => c is (string | string[])} */
	function isStringOrStringArray(c) {
		return isString(c) || (Array.isArray(c) && c.every(isString));
	}

	/** @type {(o: unknown) => o is ItemBundle[][]} */
	function isWardrobe(o) {
		return (
			Array.isArray(o) && o.every((b) => isItemBundleArray(b) || b === null)
		);
	}

	/** @type {(o: unknown) => o is ItemBundle[]} */
	function isItemBundleArray(o) {
		return Array.isArray(o) && o.every(isItemBundle);
	}

	/** @type {(o: unknown) => o is ItemBundle} */
	function isItemBundle(o) {
		return (
			isNonNullObject(o) &&
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			typeof o.Name === "string" &&
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			typeof o.Group === "string"
		);
	}

	// Confirm leaving the page to prevent accidental back button, refresh, or other navigation-related disruptions
	w.addEventListener(
		"beforeunload",
		(e) => {
			if (toySyncState.client?.Connected) {
				// Stop vibrating toys
				for (const device of toySyncState.client.Devices.filter((d) =>
					d.AllowedMessages.includes(0)
				)) {
					device.vibrate(0);
				}
			}
			if (bceSettings.confirmLeave) {
				e.preventDefault();
				// The connection is closed, this call gets you relogin immediately
				ServerSocket.io.disconnect();
				CommonSetScreen("Character", "Relog");
				ServerSocket.io.connect();
				return (e.returnValue = "Are you sure you want to leave the club?");
			}
			return null;
		},
		{
			capture: true,
		}
	);
}

BondageClubEnhancements();
