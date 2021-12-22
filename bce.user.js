// ==UserScript==
// @name Bondage Club Enhancements
// @namespace https://www.bondageprojects.com/
// @version 1.5.0
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

window.BCE_VERSION = "1.5.0";

(async function () {
  "use strict";

  const SUPPORTED_GAME_VERSIONS = ["R75"];
  const DISCORD_INVITE_URL = "https://discord.gg/aCCWVzXBUj";

  const BCX_SOURCE =
    "https://raw.githubusercontent.com/Jomshir98/bondage-club-extended/c32a8636a806475cb8a277df6b9671834d54639a/bcx.js";
  const BCX_DEVEL_SOURCE =
    "https://jomshir98.github.io/bondage-club-extended/devel/bcx.js";

  const GAGBYPASSINDICATOR = "\uf123";
  const HIDDEN = "Hidden";
  const BCE_MSG = "BCEMsg";
  const MESSAGE_TYPES = {
    Hello: "Hello",
    ArousalSync: "ArousalSync",
  };
  const BEEP_CLICK_ACTIONS = {
    FriendList: "FriendList",
  };
  const BCE_MAX_AROUSAL = 99.6;
  const GLASSES_BLUR_TARGET = document.getElementById("MainCanvas");
  const GLASSES_BLIND_CLASS = "bce-blind";
  const TIMER_INPUT_ID = "bce_timerInput";

  if (typeof ChatRoomCharacter === "undefined") {
    console.warn("Bondage Club not detected. Skipping BCE initialization.");
    return;
  }

  /// SETTINGS LOADING
  let bce_settings = {};
  const settingsVersion = 14;
  const defaultSettings = {
    checkUpdates: {
      label: "Check for updates",
      value: true,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    relogin: {
      label: "Automatic Relogin on Disconnect",
      value: true,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    expressions: {
      label: "Automatic Arousal Expressions (Replaces Vanilla)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          // disable conflicting settings
          Player.ArousalSettings.AffectExpression = false;
        }
      },
    },
    activityExpressions: {
      label: "Activity Expressions",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          // disable conflicting settings
          Player.ArousalSettings.AffectExpression = false;
        }
      },
    },
    privateWardrobe: {
      label: "Use full wardrobe in clothing menu",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    extendedWardrobe: {
      label: "Extend wardrobe slots (double)",
      value: false,
      sideEffects: (newValue) => {
        const defaultSize = 24;
        WardrobeSize = newValue ? defaultSize * 2 : defaultSize;
        bc_WardrobeFixLength();
      },
    },
    layeringMenu: {
      label: "Enable Layering Menus",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    automateCacheClear: {
      label: "Clear Drawing Cache Hourly",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    augmentChat: {
      label: "Chat Links and Embeds",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    gagspeak: {
      label: "(Cheat) Understand All Gagged and when Deafened",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    lockpick: {
      label: "(Cheat) Reveal Lockpicking Order Based on Skill",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    bcx: {
      label: "Load BCX by Jomshir98 (requires refresh)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bce_settings.bcxDevel = false;
        }
      },
    },
    bcxDevel: {
      label:
        "Load BCX beta by Jomshir98 (requires refresh - not pinned by BCE)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bce_settings.bcx = false;
        }
      },
    },
    antiAntiGarble: {
      label: "Anti-Anti-Garble - no cheating your gag (limited)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bce_settings.antiAntiGarbleStrong = false;
        }
      },
    },
    antiAntiGarbleStrong: {
      label: "Anti-Anti-Garble - no cheating your gag (full)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bce_settings.antiAntiGarble = false;
        }
      },
    },
    showQuickAntiGarble: {
      label: "Show Quick Anti-Anti-Garble in Chat",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    alternateArousal: {
      label:
        "Alternate Arousal (Replaces Vanilla, requires hybrid/locked arousal meter)",
      value: false,
      sideEffects: (newValue) => {
        sendHello();
        Player.BCEArousal = newValue;
        Player.BCEArousalProgress = Math.min(
          BCE_MAX_AROUSAL,
          Player.ArousalSettings.Progress
        );
      },
    },
    ghostNewUsers: {
      label: "Automatically ghost+blocklist unnaturally new users",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    blindWithoutGlasses: {
      label: "Require glasses to see",
      value: false,
      sideEffects: (newValue) => {
        if (!newValue) {
          GLASSES_BLUR_TARGET.classList.remove(GLASSES_BLIND_CLASS);
        }
      },
    },
    friendPresenceNotifications: {
      label: "Show friend presence notifications",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    friendOfflineNotifications: {
      label: "Show friends going offline too (requires friend presence)",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    stutters: {
      label: "Alternative speech stutter",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    activityLabels: {
      label: "Use clearer activity labels",
      value: true,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
    accurateTimerLocks: {
      label: "Use accurate timer inputs",
      value: false,
      sideEffects: (newValue) => {
        bce_log(newValue);
      },
    },
  };

  function settingsLoaded() {
    return Object.keys(bce_settings).length > 0;
  }

  const bce_settingskey = () => `bce.settings.${Player?.AccountName}`;
  const bce_loadSettings = async function () {
    await waitFor(() => !!Player?.AccountName);
    const key = bce_settingskey();
    bce_log("loading settings", key);
    if (!settingsLoaded()) {
      let settings = JSON.parse(localStorage.getItem(key));
      let onlineSettings = JSON.parse(
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
        bce_log("no settings", key);
        settings = {};
      }

      for (const setting in defaultSettings) {
        if (!defaultSettings.hasOwnProperty(setting)) continue;
        if (!(setting in settings)) {
          if (setting === "activityExpressions" && "expressions" in settings) {
            settings[setting] = settings.expressions;
            continue;
          }
          settings[setting] = defaultSettings[setting].value;
        }
      }
      settings.version = settingsVersion;
      bce_settings = settings;
      return settings;
    }
    return bce_settings;
  };
  const bce_saveSettings = function () {
    localStorage.setItem(bce_settingskey(), JSON.stringify(bce_settings));
    Player.OnlineSettings.BCE = LZString.compressToBase64(
      JSON.stringify(bce_settings)
    );
    ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
  };

  // ICONS
  const DEVS = [23476];
  const ICONS = {
    USER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyEAYAAABOr1TyAAABb2lDQ1BpY2MAACiRdZE7SwNBFIU/o+IrkkIFEYstVCwUooJYSgRt1CJG8NXsrnkI2c2yu0HEVrCxECxEG1+F/0BbwVZBEBRBxMY/4KuRsN4xgQTRWWbvx5k5l5kzEJrMmpZXEwXL9t34REybm1/Q6l4I00AbA/TqpudMzYwn+Hd83lGl6m2/6vX/vj9H03LSM6GqXnjYdFxfeFR4ctV3FG8Jt5oZfVn4ULjPlQMKXyndKPKz4nSR3xW7ifgYhFRPLV3BRgWbGdcS7hXusrJ5s3QedZNw0p6dkdohsxOPOBPE0DDIs0IWn36ptmT2ty/645smJx5T/g5ruOJIkxFvn6h56ZqUmhI9KV+WNZX77zy91NBgsXs4BrVPQfDWDXU7UNgOgq+jICgcQ/UjXNhlf05yGvkQfbusdR1AZAPOLsuasQvnm9D+4Oiu/iNVywylUvB6Cs3z0HIDjYvFrErrnNxDYl2e6Br29qFH9keWvgFCv2gp6TqA8wAAAAlwSFlzAAAuIwAALiMBeKU/dgAABMZJREFUeF7tWk9IFFEY1zIM7bBIgoKoHRQMl7A0skCkix02YU9qrFiCIdGhLoF4kKKICILyzx48ZUTsIU1EaPXoYgRBKMGWe1kjEimCNrOlNU399RE7O2/em53dYVe+uXzM+/7/vve+efNmcnL4YgQYAUYgaxDIlUW6tXv190Ouqgq0sxN03z7Qx4/17ayvY/z9e9DJydzda3lZ5lfERzxnzoDf0wPa0ABaVAS6tga6uAj69CnoxAT8b20Z2z99GvzLl0Hb20Hz80GnpkC/fRPZMR6/cgVxED4mrACAQADU6rWxAQv374Pu3y8LBXI7EO5cDx5Yi2B6GvoFBcYF8Xis+ZFpOxyyvIV8mE5VQbSB3rkjCwwa167JUjTHHxvL1IIotqxAAAlQq9Cm8/x5/EjuP7uVlRg/flwfgN+/MV5aiiX8vwUA4MJC8D99AhXNrNlZ8OfnQaurQdvaQKm1aqNwOuH33TviwK/Hg/snT7QauH/9GpTi0pcSj3Z1we/Pn2Y1c4xXyMuXMoPQv3XLeAa3tmrtQN7tNtYbHASfJsB/Kxi/eNFY/+ZNfb+yllVWJss7Wf6/h3Ky6qp6o6PGkqWl+vy6OmO9u3eNH9LUmlZX9e0cO6aagV1yNhXk1y/jhBJnOOSLi/X1IhEU4vNnkV3wNzfB//BBX05k3y74E/3YVJBkExQVKhYzZ1EkL9/lmfNjXTrPugkVCyJgVXRTIXP+PKxoC0ArKBU+UmPDpoIcPmwcbrIvWHIQ0LpkLVNuxy4Jm1pWd7d+QjRD5+bsSjjT/VhcIS0t2Fbevh2fKLWo2lqMJ25rMe71YgavrGQ6UHbFZ7EgFCaddcnCpofr8DAkb9yQaWQmPxzGRDT7YtjcjAkYDovySlFBVGF7+xaSr16BbmyoamaWHG0OKirMxZUnxVsqoOaQjhJImlrWkSMYof3+yZO49/lAGxtBr19X87P3pSwWxO/HEjx3TgsVlvSBAxh/9Ai0tzdejg4Nx8dhJ1se7vfuIQ+zLevrV9mUslgQsXkAHIuhMLQC6LuC9pCwowOWsqUgQ0PIz2xBZOXYPgaVi1iTQODRKKwsLOhbo9NZa772gnbaCxIPEhVGC538YbcXwFbJIW0tS8W5HTJomQMD8OV0xvsMhbCC+/rsiEXFR5YWxOzZWFMTwDh7Nh4U7e5QBbL0ytjcssyeroq+qDkcmPkHD6rBU1KiL/fjh5q+fVJpLwiAO3QIKYk+CEUi+ikvLemP0ydZt1sEFfzW1IB/9Ki+XChkH9Rqniy2LDrLcrni3VFLoRdCev8QfRB680Y/3JkZ4zRGRgA8rTw6AaDflR4+NNb3+9Vg0kq5XMkdnZAden8z+11nWx+O0/XXSTQK++XlxjPd54Ncqq5gEJYSd3cYl31TtxqH+DegtLcsfaDpDOvSJexyPn40nqlXr4IvamGq8/z7d0heuAC/mXeWluaCUMIEOP10cOIEAHn2TAYl5L58gdypU6BeL6jsz78/fyD34gVofT3s0SGnzLv9fOl/WfaHpOYRTYN2WfTwpl9JaXcWDKIAtDLUbLMUI8AIMAKMACPACDACjAAjwAgwAowAI8AIMAKMACPACDACjAAjwAgwAowAI8AIMAKMACOwjcBfFLlPT+Rm5VcAAAAASUVORK5CYII=",
  };

  /// ORIGINAL FUNCTIONS
  const bc_originalFunctions = {};
  const callOriginal = (name, ...args) => {
    if (name in bc_originalFunctions) {
      return bc_originalFunctions[name](...args);
    } else if (name in window) {
      return window[name](...args);
    }
  };

  /// CONVENIENCE METHODS
  const bce_log = (...args) => {
    console.log("BCE", `${BCE_VERSION}:`, ...args);
  };

  const bce_chatNotify = (node) => {
    const div = document.createElement("div");
    div.setAttribute("class", "ChatMessage bce-notification");
    div.setAttribute("data-time", ChatRoomCurrentTime());
    div.setAttribute("data-sender", Player.MemberNumber.toString());
    if (typeof node === "string") {
      div.appendChild(document.createTextNode(node));
    } else {
      div.appendChild(node);
    }

    const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
    if (document.getElementById("TextAreaChatLog") != null) {
      document.getElementById("TextAreaChatLog").appendChild(div);
      if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
    }
  };

  const bce_beepNotify = (title, text) => {
    callOriginal("ServerAccountBeep", {
      MemberNumber: Player.MemberNumber,
      MemberName: "BCE",
      ChatRoomName: title,
      Private: true,
      Message: text,
      ChatRoomSpace: "",
    });
  };

  const bce_notify = async (text, duration = 5000, properties = {}) => {
    await waitFor(
      () => !!Player && new Date(ServerBeep?.Timer || 0) < new Date()
    );

    ServerBeep = {
      Timer: Date.now() + duration,
      Message: text,
      ...properties,
    };
  };

  window.bce_sendAction = (text) => {
    ServerSend("ChatRoomChat", {
      Content: "Beep",
      Type: "Action",
      Dictionary: [
        { Tag: "Beep", Text: "msg" },
        { Tag: "msg", Text: text },
      ],
    });
  };

  window.bce_setting_value = (key) => {
    return key in bce_settings ? bce_settings[key] : defaultSettings[key].value;
  };

  // Expressions init method for custom expressions
  window.bce_initializeDefaultExpression = () => {
    /* here to not break customizer script */
  };

  const durationToString = (duration) => {
    var seconds = Math.floor(duration / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  const timeUntilDate = (dateFuture) => {
    // https://stackoverflow.com/a/13904621/1780502 - jackcogdill
    var dateNow = new Date();
    return durationToString(dateFuture - dateNow);
  };

  const addToTimestamp = (timestamp, days, hours, minutes, seconds) => {
    if (!days) days = 0;
    if (!hours) hours = 0;
    if (!minutes) minutes = 0;
    if (!seconds) seconds = 0;
    const date = new Date(timestamp);
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    date.setSeconds(date.getSeconds() + seconds);
    return date.getTime();
  };

  /// Init calls
  bceStyles();
  automaticReconnect();
  hiddenMessageHandler();
  await bce_loadSettings();
  bce_log(bce_settings);
  await preBCX();
  await loadBCX();
  settingsPage();
  alternateArousal();
  chatAugments();
  automaticExpressions();
  extendedWardrobe();
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

  // Post ready when in a chat room
  await bce_notify(`Bondage Club Enhancements v${BCE_VERSION} Loaded`);

  Player.BCE = BCE_VERSION;
  if (bce_settings.checkUpdates) checkUpdate();
  if (!SUPPORTED_GAME_VERSIONS.includes(GameVersion)) {
    bce_beepNotify(
      "Warning",
      `Unknown game version: ${GameVersion}. Things may break. Check for updates.`
    );
  }

  async function checkUpdate() {
    await sleep(5000);
    // version check
    bce_log("checking for updates...");
    fetch(
      "https://sidiousious.gitlab.io/bce/bce.user.js?_=" +
        ((Date.now() / 1000 / 3600) | 0)
    )
      .then((r) => r.text())
      .then((r) => {
        const latest = /@version (.*)$/m.exec(r)[1];
        bce_log("latest version:", latest);
        if (latest !== BCE_VERSION) {
          // create beep
          bce_beepNotify(
            "Update",
            `Your version of BCE is outdated and may not be supported. Please update the script.
            
            Your version: ${BCE_VERSION}
            Latest version: ${latest}
            
            Changelog available on GitLab (raw) and Discord:
            - https://gitlab.com/Sidiousious/bce/-/commits/main/
            - ${DISCORD_INVITE_URL}`
          );
        }
      })
      .catch((e) => {
        console.error("BCE update checker error:", e);
      });
  }

  async function waitFor(func, cancelFunc = () => false) {
    while (!func()) {
      if (cancelFunc()) return false;
      await sleep(10);
    }
    return true;
  }

  async function preBCX() {
    // function patching that must occur before BCX
    if (window.BCX_Loaded) {
      bce_beepNotify(
        "ACTION REQUIRED",
        `BCE is only compatible with BCX, when BCX is loaded by BCE. You can enable this in the settings. Do not use BCX's tampermonkey script or their bookmark. Let BCE load BCX.`
      );
      throw new Error(
        "BCX is loaded before BCE. Please disable BCX loader and enable BCX from BCE settings instead."
      );
    }
    eval(
      `CommandParse = ${CommandParse.toString()
        .replace(
          `// Regular chat`,
          `// Regular chat\nmsg = bce_messageReplacements(msg);`
        )
        .replace(
          `// The whispers get sent to the server and shown on the client directly`,
          `// The whispers get sent to the server and shown on the client directly\nmsg = bce_messageReplacements(msg);`
        )}`
    );

    if (typeof ServerAccountBeep === "function")
      bc_originalFunctions.ServerAccountBeep = ServerAccountBeep;

    // Custom activity labels
    const customActivityLabels = [
      ["Act-ChatSelf-ItemBoots-Kiss", "Kiss Foot"],
      ["Act-ChatSelf-ItemBoots-PoliteKiss", "Polite Kiss on Foot"],
      ["Act-ChatSelf-ItemBoots-Lick", "Lick Feet"],
      ["Act-ChatSelf-ItemBoots-Suck", "Suck Big Toe"],
      ["Act-ChatSelf-ItemBoots-Nibble", "Nibble Feet"],
      ["Act-ChatSelf-ItemBoots-Tickle", "Tickle Feet"],
      ["Act-ChatSelf-ItemBoots-MassageHands", "Massage Feet"],
      ["Act-ChatSelf-ItemBoots-TakeCare", "Polish Toenails"],
      ["Act-ChatSelf-ItemBoots-Bite", "Bite Foot"],
      ["Act-ChatSelf-ItemBoots-Wiggle", "Wiggle Feet"],
      ["Act-ChatOther-ItemBoots-Bite", "Bite Foot"],
      ["Act-ChatOther-ItemBoots-Kiss", "Kiss Foot"],
      ["Act-ChatOther-ItemBoots-PoliteKiss", "Polite Kiss on Foot"],
      ["Act-ChatOther-ItemBoots-GaggedKiss", "Touch Foot with Gag"],
      ["Act-ChatOther-ItemBoots-Lick", "Lick Feet"],
      ["Act-ChatOther-ItemBoots-Suck", "Suck Big Toe"],
      ["Act-ChatOther-ItemBoots-Nibble", "Nibble Feet"],
      ["Act-ChatOther-ItemBoots-Tickle", "Tickle Sole"],
      ["Act-ChatOther-ItemBoots-Spank", "Spank Sole"],
      ["Act-ChatOther-ItemBoots-MassageHands", "Massage Feet"],
      ["Act-ChatOther-ItemBoots-MassageFeet", "Play with Feet"],
      ["Act-ChatOther-ItemBoots-TakeCare", "Polish Toenails"],
      ["Act-ChatSelf-ItemFeet-Tickle", "Tickle Feet"],
      ["Act-ChatSelf-ItemFeet-Spank", "Spank Leg"],
      ["Act-ChatSelf-ItemFeet-Caress", "Caress Legs"],
      ["Act-ChatSelf-ItemFeet-MassageHands", "Massage Legs"],
      ["Act-ChatSelf-ItemFeet-Bite", "Bite Leg"],
      ["Act-ChatSelf-ItemFeet-Wiggle", "Wiggle Legs"],
      ["Act-ChatOther-ItemFeet-Bite", "Bite Leg"],
      ["Act-ChatOther-ItemFeet-Kiss", "Kiss Leg"],
      ["Act-ChatOther-ItemFeet-GaggedKiss", "Touch Leg with Gag"],
      ["Act-ChatOther-ItemFeet-Lick", "Lick Leg"],
      ["Act-ChatOther-ItemFeet-Nibble", "Nibble Leg"],
      ["Act-ChatOther-ItemFeet-Tickle", "Tickle Leg"],
      ["Act-ChatOther-ItemFeet-Spank", "Spank Leg"],
      ["Act-ChatOther-ItemFeet-Caress", "Caress Leg"],
      ["Act-ChatOther-ItemFeet-MassageHands", "Massage Leg"],
      ["Act-ChatOther-ItemFeet-Grope", "Grope Leg"],
      ["Act-ChatSelf-ItemLegs-Tickle", "Tickle Thighs"],
      ["Act-ChatSelf-ItemLegs-Spank", "Spank Thigh"],
      ["Act-ChatSelf-ItemLegs-Caress", "Caress Thighs"],
      ["Act-ChatSelf-ItemLegs-MassageHands", "Massage Thighs"],
      ["Act-ChatSelf-ItemLegs-Bite", "Bite Thigh"],
      ["Act-ChatSelf-ItemLegs-Wiggle", "Rub Thighs Together"],
      ["Act-ChatSelf-ItemLegs-StruggleLegs", "Thrash in Bondage"],
      ["Act-ChatOther-ItemLegs-Bite", "Bite Thigh"],
      ["Act-ChatOther-ItemLegs-Kiss", "Kiss Thigh"],
      ["Act-ChatOther-ItemLegs-GaggedKiss", "Rub Gag on Thighs"],
      ["Act-ChatOther-ItemLegs-Lick", "Lick Thigh"],
      ["Act-ChatOther-ItemLegs-Nibble", "Nibble Thighs"],
      ["Act-ChatOther-ItemLegs-Tickle", "Tickle Thighs"],
      ["Act-ChatOther-ItemLegs-Spank", "Spank Thighs"],
      ["Act-ChatOther-ItemLegs-Caress", "Caress Thighs"],
      ["Act-ChatOther-ItemLegs-MassageHands", "Massage Thighs"],
      ["Act-ChatOther-ItemLegs-Grope", "Grope Thigh"],
      ["Act-ChatOther-ItemLegs-Sit", "Sit in Lap"],
      ["Act-ChatOther-ItemLegs-RestHead", "Rest Head in Lap"],
      ["Act-ChatSelf-ItemVulva-MasturbateHand", "Masturbate Pussy"],
      ["Act-ChatSelf-ItemVulva-Caress", "Caress Pussy"],
      ["Act-ChatOther-ItemVulva-MasturbateHand", "Finger Pussy"],
      ["Act-ChatOther-ItemVulva-MasturbateFist", "Fist Pussy"],
      ["Act-ChatOther-ItemVulva-MasturbateFoot", "Foot Masturbate Pussy"],
      ["Act-ChatOther-ItemVulva-MasturbateTongue", "Tongue Masturbate Pussy"],
      ["Act-ChatOther-ItemVulva-Caress", "Caress Pussy"],
      ["Act-ChatOther-ItemVulva-Slap", "Slap Pussy Lips"],
      ["Act-ChatOther-ItemVulva-Kiss", "Kiss Pussy Lips"],
      ["Act-ChatOther-ItemVulva-GaggedKiss", "Push Gag in Pussy"],
      ["Act-ChatOther-ItemVulva-Lick", "Lick Pussy Lips"],
      ["Act-ChatOther-ItemVulva-Nibble", "Nibble Pussy Lips"],
      ["Act-ChatOther-ItemVulva-MasturbateItem", "Device on Clit"],
      ["Act-ChatOther-ItemVulva-PenetrateSlow", "Slow Penetration"],
      ["Act-ChatOther-ItemVulva-PenetrateFast", "Fast Penetration"],
      ["Act-ChatSelf-ItemButt-MasturbateHand", "Finger Ass"],
      ["Act-ChatSelf-ItemButt-Spank", "Spank Butt"],
      ["Act-ChatSelf-ItemButt-Caress", "Caress Butt"],
      ["Act-ChatSelf-ItemButt-Grope", "Grope Butt"],
      ["Act-ChatSelf-ItemButt-Wiggle", "Wiggle Butt"],
      ["Act-ChatOther-ItemButt-Bite", "Bite Butt"],
      ["Act-ChatOther-ItemButt-Kiss", "Kiss Butt"],
      ["Act-ChatOther-ItemButt-GaggedKiss", "Rub Gag on Butt"],
      ["Act-ChatOther-ItemButt-MasturbateHand", "Finger Ass"],
      ["Act-ChatOther-ItemButt-MasturbateFist", "Fist Ass"],
      ["Act-ChatOther-ItemButt-MasturbateTongue", "Tongue Masturbate Ass"],
      ["Act-ChatOther-ItemButt-Spank", "Spank Butt"],
      ["Act-ChatOther-ItemButt-Caress", "Caress Butt"],
      ["Act-ChatOther-ItemButt-Grope", "Grope Butt"],
      ["Act-ChatOther-ItemButt-PenetrateSlow", "Slow Penetration"],
      ["Act-ChatOther-ItemButt-PenetrateFast", "Fast Penetration"],
      ["Act-ChatOther-ItemButt-Step", "Press Foot in Ass"],
      ["Act-ChatSelf-ItemPelvis-Tickle", "Tickle Tummy"],
      ["Act-ChatSelf-ItemPelvis-Spank", "Spank Tummy"],
      ["Act-ChatSelf-ItemPelvis-Caress", "Caress Tummy"],
      ["Act-ChatSelf-ItemPelvis-Pinch", "Pinch Tummy"],
      ["Act-ChatSelf-ItemPelvis-MassageHands", "Massage Tummy"],
      ["Act-ChatSelf-ItemPelvis-Wiggle", "Wiggle Hips"],
      ["Act-ChatOther-ItemPelvis-Kiss", "Kiss Tummy"],
      ["Act-ChatOther-ItemPelvis-GaggedKiss", "Gag Kiss Tummy"],
      ["Act-ChatOther-ItemPelvis-Lick", "Lick Tummy"],
      ["Act-ChatOther-ItemPelvis-Nibble", "Nibble Tummy"],
      ["Act-ChatOther-ItemPelvis-Tickle", "Tickle Tummy"],
      ["Act-ChatOther-ItemPelvis-Spank", "Spank Tummy"],
      ["Act-ChatOther-ItemPelvis-Caress", "Caress Tummy"],
      ["Act-ChatOther-ItemPelvis-Pinch", "Pinch Tummy"],
      ["Act-ChatOther-ItemPelvis-MassageHands", "Massage Tummy"],
      ["Act-ChatOther-ItemPelvis-Grope", "Grope Tummy"],
      ["Act-ChatSelf-ItemTorso-Tickle", "Tickle Ribs"],
      ["Act-ChatSelf-ItemTorso-Spank", "Spank Ribs"],
      ["Act-ChatSelf-ItemTorso-Caress", "Caress Ribs"],
      ["Act-ChatSelf-ItemTorso-MassageHands", "Massage Back"],
      ["Act-ChatSelf-ItemTorso-Wiggle", "Wiggle Body"],
      ["Act-ChatOther-ItemTorso-Bite", "Bite Back"],
      ["Act-ChatOther-ItemTorso-Kiss", "Kiss Back"],
      ["Act-ChatOther-ItemTorso-GaggedKiss", "Gag Kiss Back"],
      ["Act-ChatOther-ItemTorso-Lick", "Lick Back"],
      ["Act-ChatOther-ItemTorso-Nibble", "Nibble Ribs"],
      ["Act-ChatOther-ItemTorso-Tickle", "Tickle Ribs"],
      ["Act-ChatOther-ItemTorso-Spank", "Spank Back"],
      ["Act-ChatOther-ItemTorso-Caress", "Caress Back"],
      ["Act-ChatOther-ItemTorso-MassageHands", "Massage Back"],
      ["Act-ChatOther-ItemTorso-MassageFeet", "Foot Massage Back"],
      ["Act-ChatOther-ItemTorso-Rub", "Rub Bodies"],
      ["Act-ChatSelf-ItemNipples-Kiss", "Kiss Nipple"],
      ["Act-ChatSelf-ItemNipples-Lick", "Lick Nipple"],
      ["Act-ChatSelf-ItemNipples-Suck", "Suck Nipple"],
      ["Act-ChatSelf-ItemNipples-Nibble", "Nibble Nipple"],
      ["Act-ChatSelf-ItemNipples-Pinch", "Pinch Nipple"],
      ["Act-ChatSelf-ItemNipples-Caress", "Caress Nipple"],
      ["Act-ChatSelf-ItemNipples-Pull", "Pull Nipples"],
      ["Act-ChatOther-ItemNipples-Bite", "Bite Nipple"],
      ["Act-ChatOther-ItemNipples-Pull", "Pull Nipples"],
      ["Act-ChatOther-ItemNipples-Kiss", "Kiss Nipple"],
      ["Act-ChatOther-ItemNipples-GaggedKiss", "Press Gag on Nipple"],
      ["Act-ChatOther-ItemNipples-Lick", "Lick Nipple"],
      ["Act-ChatOther-ItemNipples-Suck", "Suck Nipple"],
      ["Act-ChatOther-ItemNipples-Nibble", "Nibble Nipple"],
      ["Act-ChatOther-ItemNipples-Pinch", "Pinch Nipple"],
      ["Act-ChatOther-ItemNipples-Caress", "Caress Nipples"],
      ["Act-ChatSelf-ItemBreast-Kiss", "Kiss Breast"],
      ["Act-ChatSelf-ItemBreast-Lick", "Lick Breast"],
      ["Act-ChatSelf-ItemBreast-Tickle", "Tickle Breast"],
      ["Act-ChatSelf-ItemBreast-Slap", "Slap Breast"],
      ["Act-ChatSelf-ItemBreast-Caress", "Caress Breast"],
      ["Act-ChatSelf-ItemBreast-MasturbateHand", "Masturbate Breast"],
      ["Act-ChatSelf-ItemBreast-Grope", "Grope Breast"],
      ["Act-ChatSelf-ItemBreast-Wiggle", "Shake Breasts"],
      ["Act-ChatOther-ItemBreast-Bite", "Bite Breast"],
      ["Act-ChatOther-ItemBreast-Kiss", "Kiss Breast"],
      ["Act-ChatOther-ItemBreast-GaggedKiss", "Press Gag on Breast"],
      ["Act-ChatOther-ItemBreast-Lick", "Lick Breast"],
      ["Act-ChatOther-ItemBreast-Tickle", "Tickle Breast"],
      ["Act-ChatOther-ItemBreast-Slap", "Slap Breast"],
      ["Act-ChatOther-ItemBreast-Caress", "Caress Breast"],
      ["Act-ChatOther-ItemBreast-MasturbateHand", "Masturbate Breast"],
      ["Act-ChatOther-ItemBreast-Grope", "Grope Breast"],
      ["Act-ChatOther-ItemBreast-Step", "Step on Breast"],
      ["Act-ChatOther-ItemBreast-RestHead", "Rest Head on Breast"],
      ["Act-ChatSelf-ItemArms-Kiss", "Kiss Arm"],
      ["Act-ChatSelf-ItemArms-Lick", "Lick Arm"],
      ["Act-ChatSelf-ItemArms-Nibble", "Nibble Arm"],
      ["Act-ChatSelf-ItemArms-Tickle", "Tickle Arm"],
      ["Act-ChatSelf-ItemArms-Spank", "Spank Arm"],
      ["Act-ChatSelf-ItemArms-Pinch", "Pinch Upper Arm"],
      ["Act-ChatSelf-ItemArms-Caress", "Caress Arms"],
      ["Act-ChatSelf-ItemArms-MassageHands", "Massage Arms"],
      ["Act-ChatSelf-ItemArms-Bite", "Bite Arm"],
      ["Act-ChatSelf-ItemArms-Wiggle", "Wiggle Shoulders"],
      ["Act-ChatSelf-ItemArms-StruggleArms", "Struggle against Binds"],
      ["Act-ChatOther-ItemArms-Bite", "Bite Arm"],
      ["Act-ChatOther-ItemArms-Kiss", "Kiss Arm"],
      ["Act-ChatOther-ItemArms-GaggedKiss", "Rub Gag on Arm"],
      ["Act-ChatOther-ItemArms-Lick", "Lick Arm"],
      ["Act-ChatOther-ItemArms-Nibble", "Nibble Arm"],
      ["Act-ChatOther-ItemArms-Tickle", "Tickle Arms"],
      ["Act-ChatOther-ItemArms-Spank", "Spank Arm"],
      ["Act-ChatOther-ItemArms-Pinch", "Pinch Upper Arm"],
      ["Act-ChatOther-ItemArms-Caress", "Caress Arms"],
      ["Act-ChatOther-ItemArms-MassageHands", "Massage Arms"],
      ["Act-ChatOther-ItemArms-Grope", "Grab Arm"],
      ["Act-ChatOther-ItemArms-Cuddle", "Cuddle"],
      ["Act-ChatSelf-ItemHands-Kiss", "Kiss Hand"],
      ["Act-ChatSelf-ItemHands-PoliteKiss", "Small Kiss on Hand"],
      ["Act-ChatSelf-ItemHands-Lick", "Lick Back of Hand"],
      ["Act-ChatSelf-ItemHands-Suck", "Suck Fingers"],
      ["Act-ChatSelf-ItemHands-Nibble", "Nibble Hand"],
      ["Act-ChatSelf-ItemHands-Spank", "Spank Hand with the Other"],
      ["Act-ChatSelf-ItemHands-Caress", "Rub Hands Together"],
      ["Act-ChatSelf-ItemHands-TakeCare", "Polish Nails"],
      ["Act-ChatSelf-ItemHands-Bite", "Bite Hand"],
      ["Act-ChatSelf-ItemHands-Wiggle", "Wiggle Fingers"],
      ["Act-ChatOther-ItemHands-Bite", "Bite Hand"],
      ["Act-ChatOther-ItemHands-Kiss", "Kiss Hand"],
      ["Act-ChatOther-ItemHands-GaggedKiss", "Touch Hand with Gag"],
      ["Act-ChatOther-ItemHands-PoliteKiss", "Polite Kiss on Hand"],
      ["Act-ChatOther-ItemHands-Lick", "Lick Hand"],
      ["Act-ChatOther-ItemHands-Suck", "Suck Fingers"],
      ["Act-ChatOther-ItemHands-Nibble", "Nibble Hand"],
      ["Act-ChatOther-ItemHands-Spank", "Spank Hand"],
      ["Act-ChatOther-ItemHands-Caress", "Caress Hand"],
      ["Act-ChatOther-ItemHands-TakeCare", "Polish Nails"],
      ["Act-ChatSelf-ItemNeck-Caress", "Caress Neck"],
      ["Act-ChatSelf-ItemNeck-MassageHands", "Massage Neck"],
      ["Act-ChatSelf-ItemNeck-Choke", "Choke Self"],
      ["Act-ChatOther-ItemNeck-Bite", "Bite Neck"],
      ["Act-ChatOther-ItemNeck-Kiss", "Kiss Neck"],
      ["Act-ChatOther-ItemNeck-GaggedKiss", "Touch Neck with Gag"],
      ["Act-ChatOther-ItemNeck-Lick", "Lick Neck"],
      ["Act-ChatOther-ItemNeck-Nibble", "Nibble Neck"],
      ["Act-ChatOther-ItemNeck-Caress", "Caress Neck"],
      ["Act-ChatOther-ItemNeck-MassageHands", "Massage Neck"],
      ["Act-ChatOther-ItemNeck-Choke", "Choke Neck"],
      ["Act-ChatOther-ItemNeck-Step", "Gently Foot on Neck"],
      ["Act-ChatOther-ItemNeck-Tickle", "Tickle Neck"],
      ["Act-ChatSelf-ItemMouth-Lick", "Lick Lips"],
      ["Act-ChatSelf-ItemMouth-Nibble", "Nibble Lips"],
      ["Act-ChatSelf-ItemMouth-Caress", "Clean Mouth"],
      ["Act-ChatSelf-ItemMouth-Bite", "Bite Lips"],
      ["Act-ChatSelf-ItemMouth-HandGag", "Clamp Hand over Mouth"],
      ["Act-ChatSelf-ItemMouth-MoanGag", "Moan"],
      ["Act-ChatSelf-ItemMouth-MoanGagWhimper", "Whimper Pleadingly"],
      ["Act-ChatSelf-ItemMouth-MoanGagAngry", "Scream Furiously"],
      ["Act-ChatSelf-ItemMouth-MoanGagGroan", "Groan Desperately"],
      ["Act-ChatSelf-ItemMouth-MoanGagGiggle", "Giggle"],
      ["Act-ChatSelf-ItemMouth-MoanGagTalk", "Mumble Incoherently"],
      ["Act-ChatOther-ItemMouth-GagKiss", "Kiss on Gag"],
      ["Act-ChatOther-ItemMouth-Bite", "Bite Lips"],
      ["Act-ChatOther-ItemMouth-Kiss", "Kiss Lips"],
      ["Act-ChatOther-ItemMouth-FrenchKiss", "French Kiss"],
      ["Act-ChatOther-ItemMouth-PoliteKiss", "Kiss on Cheek"],
      ["Act-ChatOther-ItemMouth-GaggedKiss", "Gag Kiss on Cheek"],
      ["Act-ChatOther-ItemMouth-Lick", "Lick Lips"],
      ["Act-ChatOther-ItemMouth-Nibble", "Nibble Lips"],
      ["Act-ChatOther-ItemMouth-Caress", "Clean Mouth"],
      ["Act-ChatOther-ItemMouth-HandGag", "Clamp Hand over Mouth"],
      ["Act-ChatOther-ItemMouth-PenetrateSlow", "Slow Penetration"],
      ["Act-ChatOther-ItemMouth-PenetrateFast", "Fast Penetration"],
      ["Act-ChatSelf-ItemHead-Slap", "Slap Face"],
      ["Act-ChatSelf-ItemHead-Caress", "Caress Face"],
      ["Act-ChatSelf-ItemHead-TakeCare", "Brush Hair"],
      ["Act-ChatSelf-ItemHead-Pull", "Pull Hair"],
      ["Act-ChatSelf-ItemHead-Pet", "Pet Head"],
      ["Act-ChatSelf-ItemHead-Wiggle", "Shake Head"],
      ["Act-ChatSelf-ItemHead-Nod", "Nod"],
      ["Act-ChatOther-ItemHead-Kiss", "Kiss Forehead"],
      ["Act-ChatOther-ItemHead-GaggedKiss", "Gag Kiss Forehead"],
      ["Act-ChatOther-ItemHead-Slap", "Slap Face"],
      ["Act-ChatOther-ItemHead-Caress", "Caress Face"],
      ["Act-ChatOther-ItemHead-TakeCare", "Brush Hair"],
      ["Act-ChatOther-ItemHead-Pull", "Pull Hair"],
      ["Act-ChatOther-ItemHead-Pet", "Pet Head"],
      ["Act-ChatOther-ItemHead-Rub", "Rub Breast on Face"],
      ["Act-ChatOther-ItemHead-Bite", "Bite Hair"],
      ["Act-ChatOther-ItemHead-Step", "Rub Foot on Face"],
      ["Act-ChatOther-ItemNose-Cuddle", "Nose-nuzzle"],
      ["Act-ChatOther-ItemNose-Pet", "Boop Nose"],
      ["Act-ChatOther-ItemNose-Kiss", "Kiss Nose"],
      ["Act-ChatOther-ItemNose-GaggedKiss", "Bump Gag on Nose"],
      ["Act-ChatOther-ItemNose-Pinch", "Pinch Nose"],
      ["Act-ChatOther-ItemNose-Caress", "Caress Nose"],
      ["Act-ChatOther-ItemNose-Pull", "Pull Nose"],
      ["Act-ChatOther-ItemNose-Rub", "Rub Nose"],
      ["Act-ChatOther-ItemNose-Nibble", "Nibble Nose"],
      ["Act-ChatOther-ItemNose-Choke", "Pinch Nostrils Shut"],
      ["Act-ChatOther-ItemNose-Lick", "Lick Nose"],
      ["Act-ChatOther-ItemNose-Bite", "Bite Nose"],
      ["Act-ChatOther-ItemNose-Step", "Force to Smell Feet"],
      ["Act-ChatSelf-ItemNose-Pinch", "Pinch Nose"],
      ["Act-ChatSelf-ItemNose-Caress", "Caress Nose"],
      ["Act-ChatSelf-ItemNose-Pet", "Boop Nose"],
      ["Act-ChatSelf-ItemNose-Pull", "Pull Nose"],
      ["Act-ChatSelf-ItemNose-Rub", "Rub Nose"],
      ["Act-ChatSelf-ItemNose-Choke", "Pinch Nostrils Shut"],
      ["Act-ChatSelf-ItemNose-Wiggle", "Wiggle Nose"],
      ["Act-ChatSelf-ItemEars-Pinch", "Pinch Ear"],
      ["Act-ChatSelf-ItemEars-Caress", "Caress Ear"],
      ["Act-ChatSelf-ItemEars-Wiggle", "Wiggle Ears"],
      ["Act-ChatOther-ItemEars-Bite", "Bite Ear"],
      ["Act-ChatOther-ItemEars-Kiss", "Kiss Ear"],
      ["Act-ChatOther-ItemEars-GaggedKiss", "Gag Kiss on Ear"],
      ["Act-ChatOther-ItemEars-Lick", "Lick Ear"],
      ["Act-ChatOther-ItemEars-Nibble", "Nibble Ear"],
      ["Act-ChatOther-ItemEars-Pinch", "Pinch Ear"],
      ["Act-ChatOther-ItemEars-Caress", "Caress Ear"],
      ["Act-ChatOther-ItemEars-Whisper", "Whisper in Ear"],
      ["Act-ChatOther-ItemPelvis-Step", "Press Foot on Chest"],
      ["Act-ChatOther-ItemTorso-Step", "Rest Feet on Back"],
    ];

    window.ActivityDictionary.push(...customActivityLabels);

    eval(
      `DialogDrawActivityMenu = ${DialogDrawActivityMenu.toString()
        .replace(
          `DrawTextFit(ActivityDictionaryText("Activity" + Act.Name)`,
          `DrawTextFit(ActivityDictionaryText("bce_setting_value" in window && bce_setting_value("activityLabels") ? \`Act-\${(
          CharacterGetCurrent().IsPlayer() ? "ChatSelf" : "ChatOther")
        }-\${ActivityGetGroupOrMirror(CharacterGetCurrent()?.AssetFamily ?? Player.AssetFamily, Player.FocusGroup?.Name ?? CharacterGetCurrent()?.FocusGroup?.Name).Name}-\${Act.Name}\` : "Activity" + Act.Name)`
        )
        .replace(`// Prepares`, `\n// Prepares`)}`
    );

    const timerInput = `ElementPosition("${TIMER_INPUT_ID}", 1400, 930, 250, 70);`;

    // Lover locks
    InventoryItemMiscLoversTimerPadlockDraw = eval(
      `InventoryItemMiscLoversTimerPadlockDraw = ${InventoryItemMiscLoversTimerPadlockDraw.toString().replace(
        `// Draw buttons to add/remove time if available`,
        `if (bce_setting_value("accurateTimerLocks") && Player.CanInteract() && (C.IsLoverOfPlayer() || C.IsOwnedByPlayer())) {${timerInput}} else`
      )}`
    );
    InventoryItemMiscLoversTimerPadlockClick = eval(
      `InventoryItemMiscLoversTimerPadlockClick = ${InventoryItemMiscLoversTimerPadlockClick.toString().replace(
        `InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);`,
        `if (!bce_setting_value("accurateTimerLocks")) InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);`
      )}`
    );

    // Mistress locks
    InventoryItemMiscMistressTimerPadlockDraw = eval(
      `InventoryItemMiscMistressTimerPadlockDraw = ${InventoryItemMiscMistressTimerPadlockDraw.toString().replace(
        `// Draw buttons to add/remove time if available`,
        `if (bce_setting_value("accurateTimerLocks") && Player.CanInteract() && (LogQuery("ClubMistress", "Management") || (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber))) {${timerInput}} else`
      )}`
    );
    InventoryItemMiscMistressTimerPadlockClick = eval(
      `InventoryItemMiscMistressTimerPadlockClick = ${InventoryItemMiscMistressTimerPadlockClick.toString().replace(
        `InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);`,
        `if (!bce_setting_value("accurateTimerLocks")) InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);`
      )}`
    );

    // Owner locks
    InventoryItemMiscOwnerTimerPadlockDraw = eval(
      `InventoryItemMiscOwnerTimerPadlockDraw = ${InventoryItemMiscOwnerTimerPadlockDraw.toString().replace(
        `// Draw buttons to add/remove time if available`,
        `if (bce_setting_value("accurateTimerLocks") && Player.CanInteract() && C.IsOwnedByPlayer()) {${timerInput}} else`
      )}`
    );
    InventoryItemMiscOwnerTimerPadlockClick = eval(
      `InventoryItemMiscOwnerTimerPadlockClick = ${InventoryItemMiscOwnerTimerPadlockClick.toString().replace(
        `InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 3600);`,
        `if (!bce_setting_value("accurateTimerLocks")) InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 3600);`
      )}`
    );

    // Password timer
    InventoryItemMiscTimerPasswordPadlockDraw = eval(
      `InventoryItemMiscTimerPasswordPadlockDraw = ${InventoryItemMiscTimerPasswordPadlockDraw.toString().replace(
        `// Draw buttons to add/remove time if available`,
        `if (bce_setting_value("accurateTimerLocks") && Player.CanInteract() && Player.MemberNumber == Property.LockMemberNumber) {${timerInput}} else`
      )}`
    );
    InventoryItemMiscTimerPasswordPadlockClick = eval(
      `InventoryItemMiscTimerPasswordPadlockClick = ${InventoryItemMiscTimerPasswordPadlockClick.toString().replace(
        `InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);`,
        `if (!bce_setting_value("accurateTimerLocks")) InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);`
      )}`
    );
  }

  async function accurateTimerInputs() {
    const loadLockTimerInput = function () {
      let defaultValue = "0d0h5m0s";
      if (DialogFocusSourceItem?.Property?.RemoveTimer) {
        const parsedTime = timeUntilDate(
          new Date(DialogFocusSourceItem.Property.RemoveTimer)
        );
        defaultValue = `${parsedTime.days}d${parsedTime.hours}h${parsedTime.minutes}m${parsedTime.seconds}s`;
      }
      ElementCreateInput(TIMER_INPUT_ID, "text", defaultValue, 11);
      document.getElementById(TIMER_INPUT_ID).onchange = function () {
        const value = this.value;

        // validate input
        if (!/^[0-9]*d?[0-9]*h?[0-9]*m?[0-9]*s?$/.test(value)) return;

        const additions = {};
        value.replace(/([0-9]+)[dhms]/g, function (match, number) {
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
          }
        });
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
            timeMessage += " to ";
            if (until.days > 0) {
              timeMessage += `${until.days} days, `;
            }
            if (until.hours > 0) {
              timeMessage += `${until.hours} hours, `;
            }
            if (until.minutes > 0) {
              timeMessage += `${until.minutes} minutes, `;
            }
            if (until.seconds > 0) {
              timeMessage += `${until.seconds} seconds`;
            }
          }
          bce_sendAction(
            `${Player.Name} changed the timer on the ${
              DialogFocusItem?.Asset?.Description?.toLowerCase() || "timer lock"
            } on ${CharacterGetCurrent().Name}'s ${
              CharacterGetCurrent().FocusGroup?.Description?.toLowerCase() ||
              "body"
            }${timeMessage.replace(/[,\s]+$/, "")}.`
          );
        }
      };
    };

    // Lover
    const bc_InventoryItemMiscLoversTimerPadlockExit =
      InventoryItemMiscLoversTimerPadlockExit;
    InventoryItemMiscLoversTimerPadlockExit = function () {
      bc_InventoryItemMiscLoversTimerPadlockExit.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bc_InventoryItemMiscLoversTimerPadlockLoad =
      InventoryItemMiscLoversTimerPadlockLoad;
    InventoryItemMiscLoversTimerPadlockLoad = function () {
      bc_InventoryItemMiscLoversTimerPadlockLoad.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };

    // Mistress
    const bc_InventoryItemMiscMistressTimerPadlockExit =
      InventoryItemMiscMistressTimerPadlockExit;
    InventoryItemMiscMistressTimerPadlockExit = function () {
      bc_InventoryItemMiscMistressTimerPadlockExit.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bc_InventoryItemMiscMistressTimerPadlockLoad =
      InventoryItemMiscMistressTimerPadlockLoad;
    InventoryItemMiscMistressTimerPadlockLoad = function () {
      bc_InventoryItemMiscMistressTimerPadlockLoad.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };

    // Owner
    const bc_InventoryItemMiscOwnerTimerPadlockExit =
      InventoryItemMiscOwnerTimerPadlockExit;
    InventoryItemMiscOwnerTimerPadlockExit = function () {
      bc_InventoryItemMiscOwnerTimerPadlockExit.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bc_InventoryItemMiscOwnerTimerPadlockLoad =
      InventoryItemMiscOwnerTimerPadlockLoad;
    InventoryItemMiscOwnerTimerPadlockLoad = function () {
      bc_InventoryItemMiscOwnerTimerPadlockLoad.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };

    // Password
    const bc_InventoryItemMiscTimerPasswordPadlockExit =
      InventoryItemMiscTimerPasswordPadlockExit;
    InventoryItemMiscTimerPasswordPadlockExit = function () {
      bc_InventoryItemMiscTimerPasswordPadlockExit.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bc_InventoryItemMiscTimerPasswordPadlockLoad =
      InventoryItemMiscTimerPasswordPadlockLoad;
    InventoryItemMiscTimerPasswordPadlockLoad = function () {
      bc_InventoryItemMiscTimerPasswordPadlockLoad.apply(this, arguments);
      if (bce_settings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };
  }

  // Load BCX
  async function loadBCX() {
    await waitFor(settingsLoaded);

    let source = null;
    if (bce_settings.bcx) {
      source = BCX_SOURCE;
    } else if (bce_settings.bcxDevel) {
      source = BCX_DEVEL_SOURCE;
    } else {
      return;
    }
    bce_log("Loading BCX from", source);
    window.BCX_SOURCE = source; // allow BCX to read where it was loaded from
    await fetch(source)
      .then((resp) => resp.text())
      .then((resp) => {
        resp = resp.replace(
          `sourceMappingURL=bcx.js.map`,
          `sourceMappingURL=${source}.map`
        );
        bce_log(resp);
        eval(resp);
      });
    bce_log("Loaded BCX");
  }

  async function commands() {
    await waitFor(() => !!window.Commands);
    bce_log("registering additional commands");

    const commands = [
      {
        Tag: "w",
        Description:
          "[target name] [message]: whisper the target player. Use first name only. Finds the first person in the room with a matching name, left-to-right, top-to-bottom.",
        Action: (_, command, args) => {
          const target = args[0];
          const [, , ...message] = command.split(" ");
          const msg = message.join(" ");
          bce_log(target, msg);
          const targetMembers = ChatRoomCharacter.filter(
            (c) => c.Name.split(" ")[0].toLowerCase() === target.toLowerCase()
          );
          if (targetMembers.length === 0) {
            bce_chatNotify("Whisper target not found: " + target);
          } else if (targetMembers.length > 1) {
            bce_chatNotify(
              "Multiple whisper targets found: " +
                targetMembers
                  .map((c) => `${c.Name} (${c.MemberNumber})`)
                  .join(", ") +
                ". You can still whisper the player by clicking their name."
            );
          } else {
            const targetMemberNumber = targetMembers[0].MemberNumber;
            const originalTarget = ChatRoomTargetMemberNumber;
            ChatRoomTargetMemberNumber = targetMemberNumber;
            CommandParse(
              `${
                msg.length > 0 && [".", "/"].includes(msg[0]) ? "\u200b" : ""
              }${msg}`
            );
            ChatRoomTargetMemberNumber = originalTarget;
          }
        },
      },
      {
        Tag: "versions",
        Description:
          "show versions of the club, BCE, and BCX in use by players",
        Action: () => {
          bce_chatNotify(
            ChatRoomCharacter.map((a) => {
              return `${a.Name} (${a.MemberNumber}) club ${
                a.OnlineSharedSettings?.GameVersion
              }${
                window.bcx?.getCharacterVersion(a.MemberNumber)
                  ? ` BCX ${window.bcx.getCharacterVersion(a.MemberNumber)}`
                  : ``
              }${a.BCE ? `\nBCE v${a.BCE} Alt Arousal: ${a.BCEArousal}` : ``}`;
            })
              .filter((a) => a)
              .join("\n\n")
          );
        },
      },
    ];

    for (const c of commands) {
      if (window.Commands.some((a) => a.Tag === c.Tag)) {
        bce_log("already registered", c);
        continue;
      }
      window.Commands.push(c);
    }
  }

  // Create settings page
  async function settingsPage() {
    await waitFor(() => !!PreferenceSubscreenList);

    bce_log("initializing");

    const settingsYStart = 225;
    const settingsYIncrement = 70;
    const settingsPerPage = 9;
    const settingsPageCount = Math.ceil(
      Object.keys(defaultSettings).length / settingsPerPage
    );
    const discordInvitePosition = [1600, 810, 250, 90];
    let settingsPage = 0;

    window.PreferenceSubscreenBCESettingsLoad = function () {
      settingsPage = 0;
    };
    window.PreferenceSubscreenBCESettingsExit = function () {
      PreferenceSubscreen = "";
      PreferenceMessage = "";
    };
    window.PreferenceSubscreenBCESettingsRun = function () {
      MainCanvas.textAlign = "left";
      DrawText("Bondage Club Enhancements Settings", 500, 125, "Black", "Gray");
      DrawButton(...discordInvitePosition, "", "White", "");
      DrawText(
        `Join Discord`,
        discordInvitePosition[0] + 20,
        discordInvitePosition[1] + discordInvitePosition[3] / 2,
        "Black",
        ""
      );
      let y = settingsYStart;
      for (const setting of Object.keys(defaultSettings).slice(
        settingsPage * settingsPerPage,
        settingsPage * settingsPerPage + settingsPerPage
      )) {
        DrawCheckbox(
          500,
          y,
          64,
          64,
          defaultSettings[setting].label,
          bce_settings[setting]
        );
        y += settingsYIncrement;
      }
      DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
      DrawText(
        `${settingsPage + 1} / ${settingsPageCount}`,
        1700,
        230,
        "Black",
        "Gray"
      );
      DrawButton(1815, 180, 90, 90, "", "White", "Icons/Next.png");
    };
    window.PreferenceSubscreenBCESettingsClick = function () {
      let y = settingsYStart;
      if (MouseIn(1815, 75, 90, 90)) {
        PreferenceSubscreenBCESettingsExit();
      } else if (MouseIn(1815, 180, 90, 90)) {
        settingsPage++;
        settingsPage %= settingsPageCount;
      } else if (MouseIn(...discordInvitePosition)) {
        window.open(DISCORD_INVITE_URL, "_blank");
      } else {
        for (const setting of Object.keys(defaultSettings).slice(
          settingsPage * settingsPerPage,
          settingsPage * settingsPerPage + settingsPerPage
        )) {
          if (MouseIn(500, y, 64, 64)) {
            bce_settings[setting] = !bce_settings[setting];
            defaultSettings[setting].sideEffects(bce_settings[setting]);
          }
          y += settingsYIncrement;
        }
      }

      bce_saveSettings();
    };

    const bc_DrawButton = DrawButton;
    DrawButton = function (
      Left,
      Top,
      Width,
      Height,
      Label,
      Color,
      Image,
      HoveringText,
      Disabled
    ) {
      // avoid image load errors
      if (/\bBCE/.test(Image)) {
        Image = null;
      }
      bc_DrawButton(
        Left,
        Top,
        Width,
        Height,
        Label,
        Color,
        Image,
        HoveringText,
        Disabled
      );
    };

    const bc_TextGet = TextGet;
    TextGet = function (id) {
      switch (id) {
        case "HomepageBCESettings":
          return "BCE Settings";
        default:
          return bc_TextGet(id);
      }
    };
    PreferenceSubscreenList.push("BCESettings");
  }

  async function lockpickHelp() {
    await waitFor(() => !!StruggleDrawLockpickProgress);

    const newRand = (s) => {
      return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
      };
    };

    const x = 1575;
    const y = 300;
    const pinSpacing = 100;
    const pinWidth = 200;
    const bc_StruggleDrawLockpickProgress = StruggleDrawLockpickProgress;
    StruggleDrawLockpickProgress = (C) => {
      if (bce_settings.lockpick) {
        const seed = parseInt(StruggleLockPickOrder.join(""));
        const rand = newRand(seed);
        const threshold = SkillGetWithRatio("LockPicking") / 20;
        const hints = StruggleLockPickOrder.map((a) => {
          const r = rand();
          return r < threshold ? a : false;
        });
        for (let p = 0; p < hints.length; p++) {
          // replicates pin rendering in the game Struggle.js
          let xx = x - pinWidth / 2 + (0.5 - hints.length / 2 + p) * pinSpacing;
          if (hints[p]) {
            DrawText(StruggleLockPickOrder.indexOf(p) + 1, xx, y, "blue");
          }
        }
      }
      bc_StruggleDrawLockpickProgress(C);
    };
  }

  function automaticReconnect() {
    const _localStoragePasswordsKey = "bce.passwords";
    window.bce_updatePasswordForReconnect = () => {
      let name = "";
      if (CurrentScreen === "Login") {
        name = ElementValue("InputName").toUpperCase();
      } else if (CurrentScreen === "Relog") {
        name = Player.AccountName;
      }
      let passwords = JSON.parse(
        localStorage.getItem(_localStoragePasswordsKey)
      );
      if (!passwords) passwords = {};
      passwords[name] = ElementValue("InputPassword");
      localStorage.setItem(
        _localStoragePasswordsKey,
        JSON.stringify(passwords)
      );
    };

    window.bce_clearPassword = (accountname) => {
      let passwords = JSON.parse(
        localStorage.getItem(_localStoragePasswordsKey)
      );
      if (!passwords || !passwords.hasOwnProperty(accountname)) return;
      delete passwords[accountname];
      localStorage.setItem(
        _localStoragePasswordsKey,
        JSON.stringify(passwords)
      );
    };

    let loginCheckDone = false;
    let lastClick = Date.now();
    function resetLoginCheck() {
      loginCheckDone = false;
    }
    function loginCheck() {
      if (CurrentScreen === "Login" && !loginCheckDone) {
        loginCheckDone = true;
        let passwords = JSON.parse(
          localStorage.getItem(_localStoragePasswordsKey)
        );
        if (!passwords) {
          passwords = {};
        }
        const posMaps = {};
        const bc_LoginRun = LoginRun;
        LoginRun = function () {
          bc_LoginRun();
          if (Object.keys(passwords).length > 0) {
            DrawText("Saved Logins (BCE)", 170, 35, "White", "Black");
          }
          DrawButton(1250, 385, 180, 60, "Save (BCE)", "White");

          let y = 60;
          for (const user in passwords) {
            if (!passwords.hasOwnProperty(user)) continue;
            posMaps[y] = user;
            DrawButton(10, y, 350, 60, user, "White");
            DrawButton(355, y, 60, 60, "X", "White");
            y += 70;
          }
        };
        const bc_LoginClick = LoginClick;
        LoginClick = function () {
          bc_LoginClick();
          if (MouseIn(1250, 385, 180, 60)) {
            bce_updatePasswordForReconnect();
            resetLoginCheck();
          }
          const now = Date.now();
          if (now - lastClick < 150) {
            return;
          }
          lastClick = now;
          for (let pos in posMaps) {
            if (!posMaps.hasOwnProperty(pos)) continue;
            pos = parseInt(pos);
            if (MouseIn(10, pos, 350, 60)) {
              ElementValue("InputName", posMaps[pos]);
              ElementValue("InputPassword", passwords[posMaps[pos]]);
            } else if (MouseIn(355, pos, 60, 60)) {
              bce_clearPassword(posMaps[pos]);
              resetLoginCheck();
            }
          }
        };
        CurrentScreenFunctions.Run = LoginRun;
        CurrentScreenFunctions.Click = LoginClick;
      }
    }
    setInterval(loginCheck, 100);

    let _breakCircuit = false;
    let relogCheck;

    async function relog() {
      if (_breakCircuit || !bce_settings.relogin) return;
      if (Player.AccountName && ServerIsConnected && !LoginSubmitted) {
        if (relogCheck) {
          clearInterval(relogCheck);
        }
        let passwords = JSON.parse(
          localStorage.getItem(_localStoragePasswordsKey)
        );
        bce_log("Attempting to log in again as", Player.AccountName);
        if (!passwords) passwords = {};
        if (!passwords[Player.AccountName]) {
          alert("Automatic reconnect failed!");
          _breakCircuit = true;
          return;
        }
        LoginSetSubmitted();
        ServerSend("AccountLogin", {
          AccountName: Player.AccountName,
          Password: passwords[Player.AccountName],
        });
        await waitFor(() => CurrentScreen !== "Relog");
        await sleep(500);
        ServerAccountBeep({
          MemberNumber: Player.MemberNumber,
          MemberName: "VOID",
          ChatRoomName: "VOID",
          Private: true,
          Message: "Reconnected!",
          ChatRoomSpace: "",
        });
      }
    }

    const bc_ServerConnect = ServerConnect;
    ServerConnect = () => {
      bc_ServerConnect();
      relog();
    };

    const bc_ServerDisconnect = ServerDisconnect;

    ServerDisconnect = (data, close = false) => {
      if (!_breakCircuit && bce_settings.relogin) {
        if (data === "ErrorDuplicatedLogin") {
          ServerAccountBeep({
            MemberNumber: Player.MemberNumber,
            MemberName: Player.Name,
            ChatRoomName: "ERROR",
            Private: true,
            Message:
              "Signed in from a different location! Refresh the page to re-enable relogin in this tab.",
            ChatRoomSpace: "",
          });
          _breakCircuit = true;
        } else {
          relogCheck = setInterval(relog, 100);
        }
      }
      bc_ServerDisconnect(data, close);
    };
  }

  function bceStyles() {
    const css = `
    .bce-notification {
      background-color: #481D64;
      color: white;
    }
    .bce-img {
      max-height:25rem;
      max-width:90%;
      display:block;
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
    #TextAreaChatLog a {
      color: #003f91;
    }
    #TextAreaChatLog a:visited {
      color: #380091;
    }
    #TextAreaChatLog[data-colortheme="dark"] a,
    #TextAreaChatLog[data-colortheme="dark2"] a {
      color: #3d91ff;
    }
    #TextAreaChatLog[data-colortheme="dark"] a:visited,
    #TextAreaChatLog[data-colortheme="dark2"] a:visited {
      color: #6a3dff;
    }
    .bce-blind {
      filter: blur(0.24vw);
    }
    `;
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  function chatAugments() {
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
    // stutterWord will add s-stutters to the beginning of words and return 1-2 words, the original word with its stutters and a sound, based on arousal
    function stutterWord(word, forceStutter) {
      if (!word?.length) return [word];

      const addStutter = (w) =>
        /^\p{L}/u.test(w)
          ? `${w.substr(0, /\uD800-\uDFFF/.test(w[0]) ? 2 : 1)}-${w}`
          : w;

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
        results.push(" ", `${startSound}${sound}${endSound}`);
      }
      return results;
    }

    window.bce_messageReplacements = (msg) => {
      const words = [msg];
      let inOOC = false;
      let firstStutter = true;
      const newWords = [];
      for (let i = 0; i < words.length; i++) {
        // handle other whitespace
        let whitespaceIdx = words[i].search(/[\s\r\n]/);
        if (whitespaceIdx >= 1) {
          words.splice(i + 1, 0, words[i].substring(whitespaceIdx)); // insert remainder into list of words
          words[i] = words[i].substring(0, whitespaceIdx); // truncate current word to whitespace
        } else if (whitespaceIdx === 0) {
          words.splice(i + 1, 0, words[i].substring(1)); // insert remainder into list of words
          words[i] = words[i][0]; // keep space in the message
          newWords.push(words[i]);
          continue;
        }
        // handle OOC
        let oocIdx = words[i].search(/[\(\)]/);
        if (oocIdx > 0) {
          words.splice(i + 1, 0, words[i].substring(oocIdx + 1)); // insert remainder into list of words
          words.splice(i + 1, 0, words[i].substr(oocIdx, 1)); // insert OOC marker into list of words, before remainder
          words[i] = words[i].substring(0, oocIdx); // truncate current word to OOC
        } else if (oocIdx === 0 && words[i].length > 1) {
          words.splice(i + 1, 0, words[i].substring(1)); // insert remainder into list of words
          words[i] = words[i][0]; // keep OOC marker in the message
        }

        if (words[i] === "(") {
          inOOC = true;
        }

        if (bce_parseUrl(words[i]) && !inOOC) {
          newWords.push("( ");
          newWords.push(words[i]);
          newWords.push(" )");
        } else if (bce_settings.stutters && !inOOC) {
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

    function bce_parseUrl(word) {
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

    const EMBED_TYPE = Object.freeze({
      Image: "img",
      None: "",
    });

    function bce_allowedToEmbed(url) {
      if (
        [
          "cdn.discordapp.com",
          "media.discordapp.com",
          "i.imgur.com",
          "c.tenor.com",
          "i.redd.it",
        ].includes(url.host) &&
        /\/[^\/]+\.(png|jpe?g|gif)$/.test(url.pathname)
      ) {
        return EMBED_TYPE.Image;
      }
      return EMBED_TYPE.None;
    }

    function bce_chatAugments() {
      if (CurrentScreen !== "ChatRoom" || !bce_settings.augmentChat) {
        return;
      }
      const chatLogContainerId = "TextAreaChatLog";
      // handle chat events
      const handledAttributeName = "data-bce-handled";
      const unhandledChat = document.querySelectorAll(
        `.ChatMessage:not([${handledAttributeName}=true])`
      );
      for (const chatMessageElement of unhandledChat) {
        chatMessageElement.setAttribute(handledAttributeName, "true");
        if (
          chatMessageElement.classList.contains("ChatMessageChat") ||
          chatMessageElement.classList.contains("ChatMessageWhisper")
        ) {
          const newChildren = [];
          for (const node of chatMessageElement.childNodes) {
            if (node.nodeType !== Node.TEXT_NODE) {
              newChildren.push(node);
              if (node.classList.contains("ChatMessageName")) {
                newChildren.push(document.createTextNode(" "));
              }
              continue;
            }
            const contents = node.textContent.trim();
            const words = [contents];
            for (let i = 0; i < words.length; i++) {
              // handle other whitespace
              let whitespaceIdx = words[i].search(/[\s\r\n]/);
              if (whitespaceIdx >= 1) {
                words.splice(i + 1, 0, words[i].substring(whitespaceIdx));
                words[i] = words[i].substring(0, whitespaceIdx);
              } else if (whitespaceIdx === 0) {
                words.splice(i + 1, 0, words[i].substring(1));
                words[i] = words[i][0];
                newChildren.push(document.createTextNode(words[i]));
                continue;
              }

              // handle url linking
              const url = bce_parseUrl(words[i].replace(/(^\(+|\)+$)/g, ""));
              if (url) {
                // embed or link
                let node;
                switch (bce_allowedToEmbed(url)) {
                  case EMBED_TYPE.Image:
                    const imgNode = document.createElement("img");
                    imgNode.src = url.href;
                    imgNode.alt = url.href;
                    imgNode.classList.add("bce-img");
                    node = imgNode;
                    break;
                  default:
                    node = document.createTextNode(url.href);
                    break;
                }
                const linkNode = document.createElement("a");
                linkNode.href = url.href;
                linkNode.title = url.href;
                linkNode.target = "_blank";
                linkNode.appendChild(node);
                newChildren.push(linkNode);
              } else if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(words[i])) {
                let color = document.createElement("span");
                color.classList.add("bce-color");
                color.style.background = words[i];
                newChildren.push(color);
                newChildren.push(document.createTextNode(words[i]));
              } else {
                newChildren.push(document.createTextNode(words[i]));
              }
            }
          }
          const scrolledToEnd = ElementIsScrolledToEnd(chatLogContainerId);
          while (chatMessageElement.firstChild)
            chatMessageElement.removeChild(chatMessageElement.firstChild);
          for (const child of newChildren) {
            chatMessageElement.appendChild(child);
          }
          if (scrolledToEnd) {
            ElementScrollToEnd(chatLogContainerId);
          }
        }
      }
    }
    setInterval(bce_chatAugments, 500);
  }

  async function automaticExpressions() {
    await waitFor(() => CurrentScreen === "ChatRoom");

    bce_log("Started arousal faces");

    if (!window.bce_ArousalExpressionStages) {
      window.bce_ArousalExpressionStages = {
        Blush: [
          { Expression: "Extreme", Limit: 100 },
          { Expression: "VeryHigh", Limit: 90 },
          { Expression: "High", Limit: 70 },
          { Expression: "Medium", Limit: 50 },
          { Expression: "Low", Limit: 20 },
          { Expression: null, Limit: 0 },
        ],
        Eyebrows: [
          { Expression: "Soft", Limit: 80 },
          { Expression: "Lowered", Limit: 50 },
          { Expression: "Raised", Limit: 20 },
          { Expression: null, Limit: 0 },
        ],
        Fluids: [
          { Expression: "DroolMessy", Limit: 99 },
          { Expression: "DroolMedium", Limit: 90 },
          { Expression: "DroolSides", Limit: 80 },
          { Expression: "DroolLow", Limit: 50 },
          { Expression: null, Limit: 0 },
        ],
        Eyes: [
          { Expression: "VeryLewd", Limit: 100 },
          { Expression: "Lewd", Limit: 95 },
          { Expression: "Horny", Limit: 70 },
          { Expression: "Sad", Limit: 20 },
          { Expression: null, Limit: 0 },
        ],
        Eyes2: [
          { Expression: "VeryLewd", Limit: 100 },
          { Expression: "Lewd", Limit: 95 },
          { Expression: "Horny", Limit: 70 },
          { Expression: "Sad", Limit: 20 },
          { Expression: null, Limit: 0 },
        ],
        Mouth: [
          { Expression: "Ahegao", Limit: 100 },
          { Expression: "Moan", Limit: 95 },
          { Expression: "HalfOpen", Limit: 90 },
          { Expression: "LipBite", Limit: 80 },
          { Expression: "HalfOpen", Limit: 40 },
          { Expression: null, Limit: 0 },
        ],
      };

      const ArousalExpressionOverrides =
        JSON.parse(
          localStorage.getItem(`bce.expression.overrides.${Player.AccountName}`)
        ) || {};
      for (const t of Object.keys(ArousalExpressionOverrides)) {
        bce_ArousalExpressionStages[t] = ArousalExpressionOverrides[t];
      }
    }

    bce_initializeDefaultExpression();

    const bce_ExpressionModifierMap = Object.freeze({
      Blush: [null, "Low", "Medium", "High", "VeryHigh", "Extreme"],
    });

    const AUTOMATED_AROUSAL_EVENT_TYPE = "AutomatedByArousal";
    const MANUAL_OVERRIDE_EVENT_TYPE = "ManualOverride";
    const POST_ORGASM_EVENT_TYPE = "PostOrgasm";

    const bce_ExpressionsQueue = [];
    let lastUniqueId = 0;
    function newUniqueId() {
      lastUniqueId = (lastUniqueId + 1) % (Number.MAX_SAFE_INTEGER - 1);
      return lastUniqueId;
    }
    function pushEvent(evt) {
      if (!evt) return;
      switch (evt.Type) {
        case AUTOMATED_AROUSAL_EVENT_TYPE:
        case POST_ORGASM_EVENT_TYPE:
          if (!bce_settings.expressions) {
            return;
          }
        case MANUAL_OVERRIDE_EVENT_TYPE:
          break;
        default:
          if (!bce_settings.activityExpressions) {
            return;
          }
      }
      const time = Date.now();
      let event = JSON.parse(JSON.stringify(evt)); // deep copy
      event.At = time;
      event.Until = time + event.Duration;
      event.Id = newUniqueId();
      if (typeof event.Priority !== "number") event.Priority = 1;
      for (const t of Object.values(event.Expression)) {
        for (const exp of t) {
          exp.Id = newUniqueId();
          if (typeof exp.Priority !== "number") exp.Priority = 1;
        }
      }
      bce_ExpressionsQueue.push(event);
    }

    if (!window.bce_EventExpressions) {
      window.bce_EventExpressions = {
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
            Drool: [{ Expression: "TearsMedium", Duration: -1 }],
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
      };
    }

    if (!window.bce_ActivityTriggers) {
      window.bce_ActivityTriggers = [
        {
          Event: "Blush",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatOther-ItemMouth-PoliteKiss$/,
            },
          ],
        },
        {
          Event: "Blush",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^blushes/,
            },
          ],
        },
        {
          Event: "Chuckle",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^chuckles/,
            },
          ],
        },
        {
          Event: "Laugh",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^laughs/,
            },
          ],
        },
        {
          Event: "Giggle",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^giggles/,
            },
          ],
        },
        {
          Event: "Smirk",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(smirk(s|ing)|.*with a smirk)/,
            },
          ],
        },
        {
          Event: "Wink",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^winks/,
            },
          ],
        },
        {
          Event: "Pout",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^pouts/,
            },
          ],
        },
        {
          Event: "Blink",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^blinks/,
            },
          ],
        },
        {
          Event: "Frown",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^frowns/,
            },
          ],
        },
        {
          Event: "Grin",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(grins|is grinning)/,
            },
          ],
        },
        {
          Event: "Confused",
          Type: "Emote",
          Matchers: [
            {
              Tester:
                /^((seems|looks) (confused|curious|suspicious)|raises an eyebrow)/,
            },
          ],
        },
        {
          Event: "CloseMouth",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^closes her mouth/,
            },
          ],
        },
        {
          Event: "OpenMouth",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^opens her mouth/,
            },
          ],
        },
        {
          Event: "Happy",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(looks|seems|is|gets|smiles) happ(il)?y/,
            },
          ],
        },
        {
          Event: "Smile",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^smiles/,
            },
          ],
        },
        {
          Event: "Distressed",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(looks|seems|is|gets) distressed/,
            },
          ],
        },
        {
          Event: "Sad",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(looks|seems|is|gets) sad/,
            },
          ],
        },
        {
          Event: "Worried",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(looks|seems|is|gets) (worried|surprised)/,
            },
          ],
        },
        {
          Event: "BareTeeth",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(bares her teeth|snarls)/,
            },
          ],
        },
        {
          Event: "Angry",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(looks angr(il)?y|(gets|is|seems) angry)/,
            },
          ],
        },
        {
          Event: "Glare",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^(glares|looks harshly|gives a (glare|harsh look))/,
            },
          ],
        },
        {
          Event: "OpenEyes",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^opens her eyes/,
            },
          ],
        },
        {
          Event: "NarrowEyes",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^((squints|narrows) her eyes|narrowly opens her eyes)/,
            },
          ],
        },
        {
          Event: "CloseEyes",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^closes her eyes/,
            },
          ],
        },
        {
          Event: "ResetBrows",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^lowers her eyebrows/,
            },
          ],
        },
        {
          Event: "RaiseBrows",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^raises her eyebrows/,
            },
          ],
        },
        {
          Event: "DroolSides",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^drools/,
            },
          ],
        },
        {
          Event: "Cry",
          Type: "Emote",
          Matchers: [
            {
              Tester:
                /^(starts to cry|sheds .* tears?|eyes( start( to)?)? leak)/,
            },
          ],
        },
        {
          Event: "Reset",
          Type: "Emote",
          Matchers: [
            {
              Tester: /^'s (expression|face) returns to normal/,
            },
          ],
        },
        {
          Event: "Shock",
          Type: "Action",
          Matchers: [
            {
              Tester:
                /^(ActionActivityShockItem|FuturisticVibratorShockTrigger|FuturisticChastityBeltShock\w+|(TriggerShock|(ShockCollar|Collar(Auto)?ShockUnit|(LoveChastityBelt|SciFiPleasurePanties)Shock)Trigger)(1|2))$/,
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
                /^(TriggerShock|(ShockCollar|Collar(Auto)?ShockUnit|(LoveChastityBelt|SciFiPleasurePanties)Shock)Trigger)0$/,
            },
          ],
        },
        {
          Event: "Hit",
          Type: "Action",
          Matchers: [
            {
              Tester: /^ActionActivitySpankItem$/,
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
              Tester: /^ChatOther-ItemButt-Spank$/,
              Criteria: {
                TargetIsPlayer: true,
              },
            },
            {
              Tester: /^ChatSelf-ItemButt-Spank$/,
            },
          ],
        },
        {
          Event: "Cuddle",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatOther-.*-Cuddle$/,
            },
            {
              Tester: /^ChatSelf-.*-Cuddle$/,
            },
          ],
        },
        {
          Event: "Stimulated",
          Type: "Action",
          Matchers: [
            {
              Tester: /^ActionActivityMasturbateItem$/,
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
              Tester: /^ChatOther-.*-(Masturbate|Penetrate).*$/,
              Criteria: {
                TargetIsPlayer: true,
              },
            },
            {
              Tester: /^ChatSelf-.*-(Masturbate|Penetrate).*$/,
            },
          ],
        },
        {
          Event: "KissOnLips",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatOther-ItemMouth-Kiss$/,
            },
          ],
        },
        {
          Event: "Kiss",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatOther-.*-Kiss$/,
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
              Tester: /^(KneelDown|StandUp)Fail$/,
            },
          ],
        },
        {
          Event: "LipBite",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatSelf-ItemMouth-Bite$/,
            },
          ],
        },
        {
          Event: "Lick",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatOther-.*-(Lick|MasturbateTongue)$/,
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
              Tester: /^ChatOther-ItemMouth-Caress$/,
              Criteria: {
                TargetIsPlayer: true,
              },
            },
            {
              Tester: /^ChatSelf-ItemMouth-Caress$/,
            },
          ],
        },
        {
          Event: "LongKiss",
          Type: "Activity",
          Matchers: [
            {
              Tester: /^ChatOther-ItemMouth-FrenchKiss$/,
            },
          ],
        },
      ];
    }

    ServerSocket.on("ChatRoomMessage", (data) => {
      activityTriggers: for (const trigger of window.bce_ActivityTriggers.filter(
        (t) => t.Type === data.Type
      )) {
        for (const matcher of trigger.Matchers) {
          if (matcher.Tester.test(data.Content)) {
            if (matcher.Criteria) {
              if (
                matcher.Criteria.SenderIsPlayer &&
                data.Sender != Player.MemberNumber
              ) {
                continue;
              } else if (
                matcher.Criteria.TargetIsPlayer &&
                data.Dictionary?.find((t) =>
                  /^(Target|Destination)Character(Name)?$/.test(t.Tag)
                )?.MemberNumber != Player.MemberNumber
              ) {
                continue;
              } else if (
                matcher.Criteria.DictionaryMatchers &&
                !matcher.Criteria.DictionaryMatchers.some((m) =>
                  data.Dictionary?.find(
                    (t) => !Object.keys(m).some((k) => m[k] != t[k])
                  )
                )
              ) {
                continue;
              }
              // criteria met
              pushEvent(bce_EventExpressions[trigger.Event]);
            } else if (
              data.Sender == Player.MemberNumber ||
              data.Dictionary?.some(
                (t) =>
                  /^(Target|Destination)Character(Name)?$/.test(t.Tag) &&
                  t.MemberNumber == Player.MemberNumber
              )
            ) {
              // lacking criteria, check for presence of player as source or target
              pushEvent(bce_EventExpressions[trigger.Event]);
              break activityTriggers;
            }
          }
        }
      }
    });

    function expression(t) {
      const properties = Player.Appearance.filter(
        (a) => a.Asset.Group.Name === t
      )[0].Property;
      return [properties?.Expression || null, !properties?.RemoveTimer];
    }

    function setExpression(t, n, color) {
      if (!n) n = null;
      for (let i = 0; i < Player.Appearance.length; i++) {
        if (Player.Appearance[i].Asset.Group.Name === t) {
          if (!Player.Appearance[i].Property)
            Player.Appearance[i].Property = {};
          Player.Appearance[i].Property.Expression = n;
          if (color) {
            Player.Appearance[i].Color = color;
          }
          break;
        }
      }
    }

    // Reset
    Player.ArousalSettings.Progress = 0;
    let _PreviousArousal = Player.ArousalSettings;

    const ArousalMeterDirection = {
      None: 0,
      Down: 1,
      Up: 2,
    };
    let _PreviousDirection = ArousalMeterDirection.Up;

    window.Commands.push({
      Tag: "r",
      Description:
        "[part of face or 'all']: resets expression overrides on part of or all of face",
      Action: (args) => {
        if (args.length === 0 || args === "all") {
          bce_ExpressionsQueue.splice(0, bce_ExpressionsQueue.length);
          bce_chatNotify("Reset all expressions");
        } else {
          const component = `${args[0].toUpperCase()}${args
            .substr(1)
            .toLowerCase()}`;
          for (const e of bce_ExpressionsQueue) {
            if (component === "Eyes" && "Eyes2" in e.Expression) {
              delete e.Expression.Eyes2;
            }
            if (component in e.Expression) {
              delete e.Expression[component];
            }
          }
          bce_chatNotify(`Reset expression on ${component}`);
        }
      },
    });

    const bc_CharacterSetFacialExpression = CharacterSetFacialExpression;
    CharacterSetFacialExpression = function (
      C,
      AssetGroup,
      Expression,
      Timer,
      Color
    ) {
      if (
        C.IsPlayer() &&
        (bce_settings.expressions || bce_settings.activityExpressions)
      ) {
        const duration = Timer ? Timer * 1000 : -1;
        const e = Object.create(null);
        const types = [AssetGroup];
        if (AssetGroup === "Eyes") types.push("Eyes2");
        else if (AssetGroup === "Eyes1") {
          types[0] = "Eyes";
        }
        for (const t of types) {
          e[t] = [{ Expression: Expression, Duration: duration }];
        }
        bce_log("ManualExpression", e);
        const evt = {
          Type: MANUAL_OVERRIDE_EVENT_TYPE,
          Duration: duration,
          Expression: e,
        };
        if (Color && CommonColorIsValid(Color)) evt.Color = Color;
        pushEvent(evt);
      } else {
        bc_CharacterSetFacialExpression(
          C,
          AssetGroup,
          Expression,
          Timer,
          Color
        );
      }
    };

    let lastOrgasm = 0;
    let orgasmCount = 0;
    let wasDefault = false;

    // this is called once per interval to check for expression changes
    const _CustomArousalExpression = () => {
      if (
        !(bce_settings.expressions || bce_settings.activityExpressions) ||
        !Player?.AppearanceLayers
      ) {
        return;
      } else {
        Player.ArousalSettings.AffectExpression = false;
      }

      if (orgasmCount < Player.ArousalSettings.OrgasmCount) {
        orgasmCount = Player.ArousalSettings.OrgasmCount;
      } else if (orgasmCount > Player.ArousalSettings.OrgasmCount) {
        Player.ArousalSettings.OrgasmCount = orgasmCount;
        ActivityChatRoomArousalSync(Player);
      }

      // Reset everything when face is fully default
      let isDefault = true;
      for (const t of Object.keys(bce_ArousalExpressionStages)) {
        if (expression(t)[0]) {
          isDefault = false;
        }
      }
      if (isDefault) {
        _PreviousArousal.Progress = 0;
        _PreviousDirection = ArousalMeterDirection.Up;
        bce_ExpressionsQueue.splice(
          0,
          bce_ExpressionsQueue.length,
          ...bce_ExpressionsQueue.filter(
            (e) => wasDefault || e.Type === AUTOMATED_AROUSAL_EVENT_TYPE
          )
        );
        wasDefault = true;
      } else {
        wasDefault = false;
      }

      // detect arousal movement
      let arousal = Player.ArousalSettings.Progress;
      let direction = _PreviousDirection;
      if (arousal < _PreviousArousal.Progress) {
        direction = ArousalMeterDirection.Down;
      } else if (arousal > _PreviousArousal.Progress) {
        direction = ArousalMeterDirection.Up;
      }
      _PreviousDirection = direction;

      const lastOrgasmAdjustment = () => {
        const lastOrgasmMaxBoost = 30;
        const lastOrgasmMaxArousal = 90; // only boost up to the expression at arousal 90
        const orgasms = Player.ArousalSettings.OrgasmCount || 0;
        const lastOrgasmBoostDuration = Math.min(300, 60 + orgasms * 5);
        const secondsSinceOrgasm = ((Date.now() - lastOrgasm) / 10000) | 0;
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

      // handle events
      const OrgasmRecoveryStage = 2;
      if (
        _PreviousArousal.OrgasmStage !== OrgasmRecoveryStage &&
        Player.ArousalSettings.OrgasmStage === OrgasmRecoveryStage &&
        bce_ExpressionsQueue.filter((a) => a.Type === POST_ORGASM_EVENT_TYPE)
          .length === 0
      ) {
        pushEvent(bce_EventExpressions.PostOrgasm);
        lastOrgasm = Date.now();
      }

      // keep track of desired changes
      let desired = {};

      let nextExpression = {};
      const trySetNextExpression = (e, exp, next, t) => {
        const priority = exp.Priority || next.Priority || 0;
        if (!nextExpression[t] || nextExpression[t].Priority <= priority) {
          nextExpression[t] = {
            Id: exp.Id,
            Expression: e,
            Duration: exp.Duration,
            Priority: priority,
            Automatic: true,
            Color: exp.Color,
          };
        }
      };

      // calculate next expression
      for (let j = 0; j < bce_ExpressionsQueue.length; j++) {
        let next = bce_ExpressionsQueue[j];
        let active = false;
        if (
          (next.Until > Date.now() || next.Until - next.At < 0) &&
          Object.keys(next.Expression).length > 0
        ) {
          for (const t of Object.keys(next.Expression)) {
            let durationNow = Date.now() - next.At;
            for (let i = 0; i < next.Expression[t].length; i++) {
              const exp = next.Expression[t][i];
              durationNow -= exp.Duration;
              if (durationNow < 0 || exp.Duration < 0) {
                active = true;
                if (!exp.Skip) {
                  if (
                    exp.ExpressionModifier &&
                    t in bce_ExpressionModifierMap
                  ) {
                    const [current] = expression(t);
                    if (!exp.Applied) {
                      let idx =
                        bce_ExpressionModifierMap[t].indexOf(current) +
                        exp.ExpressionModifier;
                      if (idx >= bce_ExpressionModifierMap[t].length) {
                        idx = bce_ExpressionModifierMap[t].length - 1;
                      } else if (idx < 0) {
                        idx = 0;
                      }
                      trySetNextExpression(
                        bce_ExpressionModifierMap[t][idx],
                        exp,
                        next,
                        t
                      );
                      bce_ExpressionsQueue[j].Expression[t][i].Applied = true;
                    } else {
                      // prevent being overridden by other expressions while also not applying a change
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
        if (!active) {
          let last = bce_ExpressionsQueue.splice(j, 1);
          j--;
          if (!bce_settings.expressions && last.length > 0) {
            for (const t of Object.keys(last[0].Expression)) {
              trySetNextExpression(null, { Duration: -1 }, { Priority: 0 }, t);
            }
          }
        }
      }

      // garbage collect unused expressions - this should occur before manual expressions are detected
      for (let j = 0; j < bce_ExpressionsQueue.length; j++) {
        for (const t of Object.keys(bce_ExpressionsQueue[j].Expression)) {
          if (!nextExpression[t] || nextExpression[t].Duration > 0) continue;
          const nextId = nextExpression[t].Id;
          const nextPriority = nextExpression[t].Priority;

          for (
            let i = 0;
            i < bce_ExpressionsQueue[j].Expression[t].length;
            i++
          ) {
            const exp = bce_ExpressionsQueue[j].Expression[t][i];
            if (
              exp.Duration < 0 &&
              (exp.Id < nextId || exp.Priority < nextPriority)
            ) {
              bce_ExpressionsQueue[j].Expression[t].splice(i, 1);
              i--;
            }
          }
          if (bce_ExpressionsQueue[j].Expression[t].length === 0) {
            delete bce_ExpressionsQueue[j].Expression[t];
          }
        }
        if (Object.keys(bce_ExpressionsQueue[j].Expression).length === 0) {
          bce_ExpressionsQueue.splice(j, 1);
          j--;
        }
      }

      // handle arousal-based expressions
      outer: for (const t of Object.keys(bce_ArousalExpressionStages)) {
        const [exp] = expression(t);
        let desiredExpression = undefined;
        for (const face of bce_ArousalExpressionStages[t]) {
          let limit =
            face.Limit - (direction === ArousalMeterDirection.Up ? 0 : 1);
          if (arousal + lastOrgasmAdjustment() >= limit) {
            if (face.Expression !== exp) {
              desiredExpression = face.Expression;
              break;
            } else {
              continue outer;
            }
          }
        }
        if (typeof desiredExpression !== "undefined") {
          const e = Object.create(null);
          e[t] = [{ Expression: desiredExpression, Duration: -1, Priority: 0 }];
          pushEvent({
            Type: AUTOMATED_AROUSAL_EVENT_TYPE,
            Duration: -1,
            Priority: 0,
            Expression: e,
          });
        }
      }

      for (const t of Object.keys(nextExpression)) {
        const [exp] = expression(t);
        const nextExp = nextExpression[t];
        if (
          nextExp.Expression !== exp &&
          typeof nextExp.Expression !== "undefined"
        ) {
          desired[t] = { ...nextExp };
        }
      }

      if (Object.keys(desired).length > 0) {
        for (const t of Object.keys(desired)) {
          setExpression(t, desired[t].Expression, desired[t].Color);
          ServerSend("ChatRoomCharacterExpressionUpdate", {
            Name: desired[t].Expression,
            Group: t,
            Appearance: ServerAppearanceBundle(Player.Appearance),
          });
        }

        CharacterRefresh(Player, false, false);
      }

      _PreviousArousal = { ...Player.ArousalSettings };
    };

    if (typeof window.bce_CustomArousalTimer !== "undefined") {
      clearInterval(bce_CustomArousalTimer);
    }
    window.bce_CustomArousalTimer = setInterval(_CustomArousalExpression, 250);
  }

  async function layeringMenu() {
    await waitFor(() => !!Player?.AppearanceLayers);

    let lastItem = null;
    const layerPriority = "bce_LayerPriority";

    function updateItemPriorityFromLayerPriorityInput(item) {
      if (item) {
        let priority = parseInt(ElementValue(layerPriority));
        if (!item.Property) {
          item.Property = { OverridePriority: priority };
        } else {
          item.Property.OverridePriority = priority;
        }
      }
    }

    const bc_AppearanceExit = AppearanceExit;
    AppearanceExit = function () {
      if (CharacterAppearanceMode == "") {
        ElementRemove(layerPriority);
      }
      bc_AppearanceExit();
    };
    const bc_AppearanceLoad = AppearanceLoad;
    AppearanceLoad = function () {
      bc_AppearanceLoad();
      ElementCreateInput(layerPriority, "number", "", "20");
      ElementPosition(layerPriority, -1000, -1000, 0);
    };
    const bc_AppearanceRun = AppearanceRun;
    AppearanceRun = function () {
      bc_AppearanceRun();
      if (bce_settings.layeringMenu) {
        const C = CharacterAppearanceSelection;
        if (CharacterAppearanceMode == "Cloth") {
          DrawText("Priority", 70, 35, "White", "Black");
          ElementPosition(layerPriority, 60, 105, 100);
          DrawButton(
            110,
            70,
            90,
            90,
            "",
            "White",
            "Icons/Accept.png",
            "Set Priority"
          );
          let item = C.Appearance.find((a) => a.Asset.Group == C.FocusGroup);
          if (!lastItem || lastItem != item) {
            if (!item) {
              ElementValue(layerPriority, "");
            } else {
              ElementValue(
                layerPriority,
                C.AppearanceLayers.find((a) => a.Asset == item.Asset)
                  ?.Priority || 0
              );
            }
          }
          lastItem = item;
        } else {
          ElementPosition(layerPriority, -1000, -1000, 0);
        }
      }
    };
    const bc_AppearanceClick = AppearanceClick;
    AppearanceClick = function () {
      if (bce_settings.layeringMenu) {
        const C = CharacterAppearanceSelection;
        if (MouseIn(110, 70, 90, 90) && CharacterAppearanceMode == "Cloth") {
          let item = C.Appearance.find((a) => a.Asset.Group == C.FocusGroup);
          updateItemPriorityFromLayerPriorityInput(item);
        }
      }
      bc_AppearanceClick();
    };

    function assetVisible(C, item) {
      return item && C.AppearanceLayers.find((a) => a.Asset == item.Asset);
    }

    function assetWorn(C, item) {
      return item && C.Appearance.find((a) => a.Asset == item.Asset);
    }

    let prioritySubscreen = false;
    let priorityField;
    const FIELDS = Object.freeze({
      Priority: "Priority",
      Difficulty: "Difficulty",
    });
    function prioritySubscreenEnter(C, FocusItem, field) {
      DialogFocusItem = FocusItem;
      prioritySubscreen = true;
      priorityField = field;
      let initialValue;
      switch (field) {
        case FIELDS.Priority:
          initialValue = C.AppearanceLayers.find(
            (a) => a.Asset == FocusItem.Asset
          ).Priority;
          break;
        case FIELDS.Difficulty:
          initialValue = C.Appearance.find(
            (a) => a.Asset == FocusItem.Asset
          ).Difficulty;
          break;
      }
      ElementCreateInput(layerPriority, "number", initialValue, 20);
    }
    function prioritySubscreenExit() {
      prioritySubscreen = false;
      ElementRemove(layerPriority);
      DialogFocusItem = null;
    }
    const bc_DialogDrawItemMenu = DialogDrawItemMenu;
    DialogDrawItemMenu = function (C) {
      if (bce_settings.layeringMenu) {
        const focusItem = InventoryGet(C, C.FocusGroup?.Name);
        if (assetWorn(C, focusItem)) {
          DrawButton(
            10,
            890,
            50,
            50,
            "",
            "White",
            "Icon/Empty.png",
            "Loosen or tighten (Cheat)"
          );
        }
        if (assetVisible(C, focusItem)) {
          DrawButton(
            10,
            950,
            50,
            50,
            "",
            "White",
            "Icon/Empty.png",
            "Modify layering priority"
          );
        }
      }
      bc_DialogDrawItemMenu(C);
    };

    const bc_DialogDraw = DialogDraw;
    DialogDraw = function () {
      if (bce_settings.layeringMenu && prioritySubscreen) {
        DrawText(`Set item ${priorityField}`, 950, 150, "White", "Black");
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
          `Set ${priorityField}`
        );
      } else {
        bc_DialogDraw();
      }
    };
    const bc_DialogClick = DialogClick;
    DialogClick = function () {
      if (!bce_settings.layeringMenu) {
        bc_DialogClick();
        return;
      }
      let C = CharacterGetCurrent();
      const focusItem = InventoryGet(C, C.FocusGroup?.Name);
      if (prioritySubscreen) {
        if (MouseIn(1815, 75, 90, 90)) {
          prioritySubscreenExit();
        } else if (MouseIn(900, 280, 90, 90)) {
          switch (priorityField) {
            case FIELDS.Priority:
              updateItemPriorityFromLayerPriorityInput(focusItem);
              break;
            case FIELDS.Difficulty:
              const newDifficulty = parseInt(ElementValue(layerPriority));
              let action = null;
              if (focusItem.Difficulty > newDifficulty) {
                action = "loosens";
              } else if (focusItem.Difficulty < newDifficulty) {
                action = "tightens";
              }
              focusItem.Difficulty = newDifficulty;
              if (action !== null) {
                bce_sendAction(
                  `${Player.Name} ${action} ${CurrentCharacter.Name}'s ${focusItem.Asset.Description}.`
                );
              }
              break;
          }
          bce_log("updated item", focusItem);
          CharacterRefresh(C, false, false);
          ChatRoomCharacterItemUpdate(C, C.FocusGroup?.Name);
          prioritySubscreenExit();
        }
      } else {
        if (assetWorn(C, focusItem) && MouseIn(10, 890, 50, 50)) {
          prioritySubscreenEnter(C, focusItem, FIELDS.Difficulty);
          return;
        } else if (assetVisible(C, focusItem) && MouseIn(10, 950, 50, 50)) {
          prioritySubscreenEnter(C, focusItem, FIELDS.Priority);
          return;
        }
        bc_DialogClick();
      }
    };
  }

  function cacheClearer() {
    let automatedCacheClearer = null;
    const cacheClearInterval = 1 * 60 * 60 * 1000;

    window.bce_clearCaches = async function () {
      const start = Date.now();
      if (
        !(await waitFor(
          () => CurrentScreen == "ChatRoom" && !CurrentCharacter, // only clear when in chat room and not inspecting a character
          () => Date.now() - start > cacheClearInterval
        ))
      ) {
        return;
      }
      if (!bce_settings.automateCacheClear) {
        bce_log("Cache clearing disabled");
        clearInterval(automatedCacheClearer);
        return;
      }

      bce_log("Clearing caches");
      if (GLDrawCanvas.GL.textureCache) {
        GLDrawCanvas.GL.textureCache.clear();
      }
      GLDrawResetCanvas();
    };

    if (!automatedCacheClearer && bce_settings.automateCacheClear) {
      automatedCacheClearer = setInterval(bce_clearCaches, cacheClearInterval);
    }
  }

  function extendedWardrobe() {
    const bc_WardrobeFixLength = WardrobeFixLength;
    WardrobeFixLength = () => {
      const defaultSize = 24;
      WardrobeSize = bce_settings.extendedWardrobe
        ? defaultSize * 2
        : defaultSize;
      bc_WardrobeFixLength();
    };
  }

  async function chatRoomOverlay() {
    const bc_ChatRoomDrawCharacterOverlay = ChatRoomDrawCharacterOverlay;
    ChatRoomDrawCharacterOverlay = function (C, CharX, CharY, Zoom, Pos) {
      bc_ChatRoomDrawCharacterOverlay(C, CharX, CharY, Zoom, Pos);
      if (C.BCE && ChatRoomHideIconState == 0) {
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
      }
    };
  }

  function sendHello(target, requestReply) {
    const message = {
      Type: HIDDEN,
      Content: BCE_MSG,
      Dictionary: {
        message: {
          type: MESSAGE_TYPES.Hello,
          version: BCE_VERSION,
          alternateArousal: bce_settings.alternateArousal,
          replyRequested: requestReply,
        },
      },
    };
    if (target) {
      message.Target = target;
    }
    ServerSend("ChatRoomChat", message);
  }
  if (window.ServerIsConnected) sendHello(undefined, true);

  async function hiddenMessageHandler() {
    await waitFor(() => ServerSocket && ServerIsConnected);

    ServerSocket.on("ChatRoomMessage", (data) => {
      if (data.Type !== HIDDEN) return;
      if (data.Content === "BCEMsg") {
        const sender = Character.find((a) => a.MemberNumber == data.Sender);
        if (!sender) return;
        const { message } = data.Dictionary;
        switch (message.type) {
          case MESSAGE_TYPES.Hello:
            sender.BCE = message.version;
            sender.BCEArousal = message.alternateArousal || false;
            if (message.replyRequested) {
              sendHello(sender.MemberNumber);
            }
            break;
          case MESSAGE_TYPES.ArousalSync:
            sender.BCEArousal = message.alternateArousal || false;
            sender.BCEArousalProgress = message.progress || 0;
            sender.BCEEnjoyment = message.enjoyment || 1;
            break;
        }
      }
    });

    const bc_ChatRoomSyncMemberJoin = ChatRoomSyncMemberJoin;
    ChatRoomSyncMemberJoin = (data) => {
      bc_ChatRoomSyncMemberJoin(data);
      if (data.MemberNumber !== Player.MemberNumber) {
        sendHello(data.MemberNumber);
      }
    };

    const bc_ChatRoomSync = ChatRoomSync;
    ChatRoomSync = (data) => {
      bc_ChatRoomSync(data);
      sendHello();
    };
  }

  async function privateWardrobe() {
    await waitFor(() => !!Player);

    let inCustomWardrobe = false;
    let targetCharacter;
    const bc_CharacterAppearanceWardrobeLoad = CharacterAppearanceWardrobeLoad;
    CharacterAppearanceWardrobeLoad = function (C) {
      if (bce_settings.privateWardrobe && CurrentScreen === "Appearance") {
        WardrobeBackground = ChatRoomData.Background;
        inCustomWardrobe = true;
        targetCharacter = C;
        TextLoad("Wardrobe");
        WardrobeLoad();
        // ensure all previews load by refreshing their rendering
        WardrobeCharacter.forEach((a) => CharacterRefresh(a, false, false));
      } else {
        bc_CharacterAppearanceWardrobeLoad(C);
      }
    };

    const bc_AppearanceRun = AppearanceRun;
    AppearanceRun = function () {
      if (inCustomWardrobe) {
        const player = Player;
        // Replace Player with target character in rendering
        Player = targetCharacter;
        WardrobeRun();
        Player = player;
      } else {
        bc_AppearanceRun();
      }
    };

    const bc_AppearanceClick = AppearanceClick;
    AppearanceClick = function () {
      if (inCustomWardrobe) {
        WardrobeClick();
      } else {
        bc_AppearanceClick();
      }
    };

    const bc_WardrobeExit = WardrobeExit;
    WardrobeExit = function () {
      if (!inCustomWardrobe) {
        bc_WardrobeExit();
      } else {
        inCustomWardrobe = false;
        WardrobeBackground = "Private";
        TextLoad();
      }
    };

    const bc_WardrobeFastLoad = WardrobeFastLoad;
    WardrobeFastLoad = function (C, W, Update) {
      if (inCustomWardrobe && C.ID === 0) {
        bc_WardrobeFastLoad(targetCharacter, W, false);
      } else {
        bc_WardrobeFastLoad(C, W, Update);
      }
    };

    const bc_WardrobeFastSave = WardrobeFastSave;
    WardrobeFastSave = function (C, W, Push) {
      if (inCustomWardrobe && C.ID === 0) {
        bc_WardrobeFastSave(targetCharacter, W, Push);
      } else {
        bc_WardrobeFastSave(C, W, Push);
      }
    };
  }

  async function antiGarbling() {
    await waitFor(() => !!SpeechGarbleByGagLevel);

    const bc_SpeechGarbleByGagLevel = SpeechGarbleByGagLevel;
    SpeechGarbleByGagLevel = function (GagEffect, CD, IgnoreOOC) {
      let garbled = bc_SpeechGarbleByGagLevel(GagEffect, CD, IgnoreOOC).replace(
        GAGBYPASSINDICATOR,
        ""
      );
      if (CD?.trim().endsWith(GAGBYPASSINDICATOR)) {
        return CD.replace(/[\uE000-\uF8FF]/g, "");
      } else if (bce_settings.gagspeak) {
        return garbled.toLowerCase() === CD?.toLowerCase()
          ? garbled
          : `${garbled} (${CD})`;
      }
      return garbled;
    };

    const bc_ServerSend = ServerSend;
    ServerSend = function (message, data) {
      if (message === "ChatRoomChat" && data.Type === "Chat") {
        const gagLevel = SpeechGetTotalGagLevel(Player);
        if (gagLevel > 0) {
          if (bce_settings.antiAntiGarble) {
            data.Content =
              bc_SpeechGarbleByGagLevel(1, data.Content) + GAGBYPASSINDICATOR;
          } else if (bce_settings.antiAntiGarbleStrong) {
            data.Content =
              bc_SpeechGarbleByGagLevel(gagLevel, data.Content) +
              GAGBYPASSINDICATOR;
          }
        }
      }
      bc_ServerSend(message, data);
    };

    const bc_ChatRoomResize = ChatRoomResize;
    ChatRoomResize = function (load) {
      bc_ChatRoomResize(load);
      if (
        bce_settings.showQuickAntiGarble &&
        CharacterGetCurrent() == null &&
        CurrentScreen == "ChatRoom" &&
        document.getElementById("InputChat")
      ) {
        ElementPosition("InputChat", 1356, 950, 700, 82);
      }
    };

    // X, Y, width, height. X and Y centered.
    const gagAntiCheatMenuPosition = [1700, 908, 200, 45];
    const gagCheatMenuPosition = [1700, 908 + 45, 200, 45];
    const tooltipPosition = { X: 1000, Y: 910, Width: 200, Height: 90 };

    const bc_ChatRoomRun = ChatRoomRun;
    ChatRoomRun = function () {
      bc_ChatRoomRun();
      if (!bce_settings.showQuickAntiGarble) return;
      const tooltip = "Antigarble anti-cheat strength: ";
      const shorttip = "Gagging: ";
      let color = "white";
      let label = "None";
      const disableBoth = () => {
        return tooltip + "None";
      };
      const enableLimited = () => {
        return tooltip + "Limited";
      };
      const enableStrong = () => {
        return tooltip + "Full";
      };
      let next = enableLimited;
      let previous = enableStrong;
      if (bce_settings.antiAntiGarble) {
        color = "yellow";
        label = "Limited";
        next = enableStrong;
        previous = disableBoth;
      } else if (bce_settings.antiAntiGarbleStrong) {
        color = "red";
        label = "Full";
        next = disableBoth;
        previous = enableLimited;
      }
      DrawBackNextButton(
        ...gagAntiCheatMenuPosition,
        shorttip + label,
        color,
        "",
        next,
        previous,
        undefined,
        undefined,
        tooltipPosition
      );

      const gagCheatMenuParams = bce_settings.gagspeak
        ? [
            "Understand: Yes",
            "green",
            "",
            () => "Understand gagspeak: No",
            () => "Understand gagspeak: No",
            undefined,
            undefined,
            tooltipPosition,
          ]
        : [
            "Understand: No",
            "white",
            "",
            () => "Understand gagspeak: Yes",
            () => "Understand gagspeak: Yes",
            undefined,
            undefined,
            tooltipPosition,
          ];
      DrawBackNextButton(...gagCheatMenuPosition, ...gagCheatMenuParams);
    };

    const bc_ChatRoomClick = ChatRoomClick;
    ChatRoomClick = function () {
      if (bce_settings.showQuickAntiGarble) {
        if (MouseIn(...gagAntiCheatMenuPosition)) {
          const disableBoth = () => {
            bce_settings.antiAntiGarble = false;
            bce_settings.antiAntiGarbleStrong = false;
            defaultSettings.antiAntiGarble.sideEffects(false);
            defaultSettings.antiAntiGarbleStrong.sideEffects(false);
          };
          const enableLimited = () => {
            bce_settings.antiAntiGarble = true;
            defaultSettings.antiAntiGarble.sideEffects(true);
          };
          const enableStrong = () => {
            bce_settings.antiAntiGarbleStrong = true;
            defaultSettings.antiAntiGarbleStrong.sideEffects(true);
          };
          let next = enableLimited;
          let previous = enableStrong;
          if (bce_settings.antiAntiGarble) {
            next = enableStrong;
            previous = disableBoth;
          } else if (bce_settings.antiAntiGarbleStrong) {
            next = disableBoth;
            previous = enableLimited;
          }
          if (
            MouseX <
            gagAntiCheatMenuPosition[0] + gagAntiCheatMenuPosition[2] / 2
          ) {
            previous();
            bce_saveSettings();
          } else {
            next();
            bce_saveSettings();
          }
        } else if (MouseIn(...gagCheatMenuPosition)) {
          bce_settings.gagspeak = !bce_settings.gagspeak;
          defaultSettings.gagspeak.sideEffects(bce_settings.gagspeak);
          bce_saveSettings();
        }
      }
      bc_ChatRoomClick();
    };

    eval(
      `DrawBackNextButton = ${DrawBackNextButton.toString()
        .replace(
          "Disabled, ArrowWidth",
          "Disabled, ArrowWidth, tooltipPosition"
        )
        .replace(
          "DrawButtonHover(Left, Top, Width, Height,",
          "DrawButtonHover(tooltipPosition?.X || Left, tooltipPosition?.Y || Top, tooltipPosition?.Width || Width, tooltipPosition?.Height || Height,"
        )}`
    );

    if (CurrentScreen === "ChatRoom") {
      CurrentScreenFunctions.Run = ChatRoomRun;
      CurrentScreenFunctions.Click = ChatRoomClick;
      CurrentScreenFunctions.Resize = ChatRoomResize;
      ChatRoomResize();
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

    ServerSocket.on("ChatRoomSyncArousal", (data) => {
      if (data.MemberNumber === Player.MemberNumber) return; // skip player's own sync messages since we're tracking locally
      let target = ChatRoomCharacter.find(
        (c) => c.MemberNumber === data.MemberNumber
      );
      if (!target) return;
      target.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, data.Progress || 0);
      target.ArousalSettings.Progress = Math.round(target.BCEArousalProgress);
    });

    eval(
      "ActivitySetArousalTimer = " +
        ActivitySetArousalTimer.toString()
          .replace(
            "if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;",
            `
      if (Max === 100) Max = 105;
      const fromMax = Max - (C.BCEArousal ? C.BCEArousalProgress : C.ArousalSettings.Progress);
      if (Progress > 0 && fromMax < Progress) {
        if (fromMax <= 0) {
          Progress = 0;
        } else if (C.BCEArousal) {
          console.log("capped", Max, "/", fromMax, C.BCEEnjoyment);
          Progress = Math.floor(fromMax / ${enjoymentMultiplier} / C.BCEEnjoyment);
        } else {
          Progress = fromMax;
        }
      }
      `
          )
          .replace(/\b25\b/g, 20)
    );

    const bc_ActivityChatRoomArousalSync = ActivityChatRoomArousalSync;
    ActivityChatRoomArousalSync = function (C) {
      if (C.ID == 0 && CurrentScreen == "ChatRoom") {
        const message = {
          Type: HIDDEN,
          Content: BCE_MSG,
          Dictionary: {
            message: {
              type: MESSAGE_TYPES.ArousalSync,
              version: BCE_VERSION,
              alternateArousal: bce_settings.alternateArousal,
              progress: C.BCEArousalProgress,
              enjoyment: C.BCEEnjoyment,
            },
          },
        };
        ServerSend("ChatRoomChat", message);
      }
      bc_ActivityChatRoomArousalSync(C);
    };

    const bc_ActivitySetArousal = ActivitySetArousal;
    ActivitySetArousal = function (C, Progress) {
      bc_ActivitySetArousal(C, Progress);
      if (Math.abs(C.BCEArousalProgress - Progress) > 3) {
        C.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, Progress);
      }
    };

    const bc_ActivitySetArousalTimer = ActivitySetArousalTimer;
    ActivitySetArousalTimer = function (C, A, Z, Factor) {
      C.BCEEnjoyment =
        1 + (Factor > 1 ? Math.round(1.5 * Math.log(Factor)) : 0);
      bc_ActivitySetArousalTimer(C, A, Z, Factor);
    };

    const bc_ActivityTimerProgress = ActivityTimerProgress;
    ActivityTimerProgress = function (C, progress) {
      if (!C.BCEArousalProgress) C.BCEArousalProgress = 0;
      C.BCEArousalProgress +=
        progress * (progress > 0 ? C.BCEEnjoyment * enjoymentMultiplier : 1);
      C.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, C.BCEArousalProgress);
      if (C.BCEArousal) {
        C.ArousalSettings.Progress = Math.round(C.BCEArousalProgress);
        bc_ActivityTimerProgress(C, 0);
        if (C.ID === 0 && Date.now() - lastSync > 2100) {
          lastSync = Date.now();
          ActivityChatRoomArousalSync(C);
        }
      } else {
        bc_ActivityTimerProgress(C, progress);
      }
    };

    eval(
      "TimerProcess = " +
        TimerProcess.toString()
          .replace(
            "let Factor = -1;",
            `
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
      let stepInterval = 1;
      if (Factor < 0) {
        ActivityVibratorLevel(Character[C], 0);
      } else {
        if (Factor < 1) {
          ActivityVibratorLevel(Character[C], 1);
          maxProgress = Math.min(maxProgress, 35);
          stepInterval = 6;
        } else if (Factor < 2) {
          ActivityVibratorLevel(Character[C], 1);
          maxProgress = Math.min(maxProgress, 65);
          stepInterval = 4;
        } else if (Factor < 3) {
          maxProgress = Math.min(maxProgress, 95);
          stepInterval = 2;
          ActivityVibratorLevel(Character[C], 2);
        } else {
          ActivityVibratorLevel(Character[C], Math.min(4, Math.floor(Factor)));
        }
        if (maxProgress === 100) {
          maxProgress = 105;
        }
        let maxIncrease = maxProgress - Character[C].ArousalSettings.Progress;
        if (TimerLastArousalProgressCount % stepInterval === 0 && maxIncrease > 0) {
          if (stepInterval === 1) {
            Character[C].BCEEnjoyment = 1 + (Factor > 1 ? Math.round(1.5*Math.log(Factor)) : 0);
          }
          ActivityTimerProgress(Character[C], 1);
        }
      }
    } else {
    `
          )
          .replace(
            /if\s*\(\(Factor\s*==\s*-1\)\)\s*{\s*ActivityVibratorLevel\(Character\[C\],\s*0\);\s*}\s*}/,
            `if (Factor == -1) {
        ActivityVibratorLevel(Character[C], 0);
      }
    }
  } else {
    ActivityVibratorLevel(Character[C], 0);
  }`
          )
          .replace(
            /if\s*\(Factor\s*<\s*0\)\s*ActivityTimerProgress\(Character\[C\],\s*-1\);/,
            `
            Character[C].BCEEnjoyment = 1;
            if (Factor < 0) ActivityTimerProgress(Character[C], -1);
            `
          )
    );
  }

  async function autoGhostBroadcast() {
    await waitFor(() => !!ServerSocket && ServerIsConnected);
    ServerSocket.on("ChatRoomSyncMemberJoin", (data) => {
      if (
        bce_settings.ghostNewUsers &&
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
        bce_log(
          "Blacklisted",
          data.Character.Name,
          data.Character.MemberNumber,
          "registered",
          (Date.now() - data.Character.Creation) / 1000,
          "seconds ago"
        );
      }
    });
  }

  async function blindWithoutGlasses() {
    await waitFor(() => !!Player && Player.Appearance);

    setInterval(() => {
      if (!bce_settings.blindWithoutGlasses) return;

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
      ];
      const hasGlasses = !!Player.Appearance.find((a) =>
        glasses.includes(a.Asset.Name)
      );
      if (
        hasGlasses &&
        GLASSES_BLUR_TARGET.classList.contains(GLASSES_BLIND_CLASS)
      ) {
        GLASSES_BLUR_TARGET.classList.remove(GLASSES_BLIND_CLASS);
        bce_chatNotify("Having recovered your glasses you can see again!");
      } else if (
        !hasGlasses &&
        !GLASSES_BLUR_TARGET.classList.contains(GLASSES_BLIND_CLASS)
      ) {
        GLASSES_BLUR_TARGET.classList.add(GLASSES_BLIND_CLASS);
        bce_chatNotify("Having lost your glasses your eyesight is impaired!");
      }
    }, 1000);
  }

  async function friendPresenceNotifications() {
    await waitFor(() => !!Player && ServerSocket && ServerIsConnected);

    function checkFriends() {
      if (!bce_settings.friendPresenceNotifications) return;
      ServerSend("AccountQuery", { Query: "OnlineFriends" });
    }
    setInterval(checkFriends, 20000);

    let lastFriends = [];
    ServerSocket.on("AccountQueryResult", (data) => {
      if (
        CurrentScreen === "FriendList" ||
        CurrentScreen === "Relog" ||
        CurrentScreen === "Login"
      )
        return;
      if (!bce_settings.friendPresenceNotifications) return;
      if (data.Query !== "OnlineFriends") return;
      const friendMemberNumbers = data.Result.map((f) => f.MemberNumber);
      const offlineFriends = lastFriends
        .map((f) => f.MemberNumber)
        .filter((f) => !friendMemberNumbers.includes(f));
      const onlineFriends = friendMemberNumbers.filter(
        (f) => !lastFriends.some((ff) => ff.MemberNumber === f)
      );
      if (onlineFriends.length) {
        bce_notify(
          `Now online: ${onlineFriends
            .map((f) => {
              const { MemberNumber, MemberName } = data.Result.find(
                (d) => d.MemberNumber === f
              );
              return `${MemberName} (${MemberNumber})`;
            })
            .join(", ")}`,
          5000,
          { ClickAction: BEEP_CLICK_ACTIONS.FriendList }
        );
      }
      if (bce_settings.friendOfflineNotifications && offlineFriends.length) {
        bce_notify(
          `Now offline: ${offlineFriends
            .map((f) => {
              const { MemberNumber, MemberName } = lastFriends.find(
                (d) => d.MemberNumber === f
              );
              return `${MemberName} (${MemberNumber})`;
            })
            .join(", ")}`,
          5000,
          { ClickAction: BEEP_CLICK_ACTIONS.FriendList }
        );
      }
      lastFriends = data.Result;
    });

    const bc_ServerClickBeep = ServerClickBeep;
    window.ServerClickBeep = function () {
      if (
        ServerBeep.Timer > Date.now() &&
        MouseIn(CurrentScreen == "ChatRoom" ? 0 : 500, 0, 1000, 50) &&
        CurrentScreen !== "FriendList"
      ) {
        switch (ServerBeep.ClickAction) {
          case BEEP_CLICK_ACTIONS.FriendList:
            ServerOpenFriendList();
            return;
        }
      }
      bc_ServerClickBeep();
    };
  }

  async function logCharacterUpdates() {
    await waitFor(() => ServerSocket && ServerIsConnected);

    ServerSocket.on("ChatRoomSyncSingle", (data) => {
      if (data?.Character?.MemberNumber !== Player.MemberNumber) return;
      bce_log(
        "Character",
        data.Character.Name,
        data.Character.MemberNumber,
        "updated by",
        data.SourceMemberNumber
      );
    });

    ServerSocket.on("ChatRoomSyncItem", (data) => {
      if (data?.Item?.Target !== Player.MemberNumber) return;
      bce_log(
        "Item",
        data.Item.Name,
        "in group",
        data.Item.Group,
        "updated by",
        data.Source,
        "to",
        data.Item
      );
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
