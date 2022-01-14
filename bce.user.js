// ==UserScript==
// @name Bondage Club Enhancements
// @namespace https://www.bondageprojects.com/
// @version 1.8.3
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
/* eslint-disable @typescript-eslint/no-floating-promises */

const BCE_VERSION = "1.8.3";

(async function BondageClubEnhancements() {
  "use strict";

  /**
   * @type {ExtendedWindow}
   */
  // @ts-ignore
  const w = window;

  if (w.BCE_VERSION) {
    console.warn("BCE already loaded. Skipping load.");
    return;
  }

  w.BCE_VERSION = BCE_VERSION;

  const DISCORD_INVITE_URL = "https://discord.gg/aCCWVzXBUj",
    SUPPORTED_GAME_VERSIONS = ["R75"];

  const BCX_DEVEL_SOURCE =
      "https://jomshir98.github.io/bondage-club-extended/devel/bcx.js",
    BCX_SOURCE =
      "https://raw.githubusercontent.com/Jomshir98/bondage-club-extended/85c3ba46dac4af8feff4cb2e0b28255a99cf926f/bcx.js";

  const BCE_MAX_AROUSAL = 99.6,
    BCE_MSG = "BCEMsg",
    BEEP_CLICK_ACTIONS = Object.freeze({
      /** @type {"FriendList"} */
      FriendList: "FriendList",
    }),
    GAGBYPASSINDICATOR = "\uf123",
    GLASSES_BLIND_CLASS = "bce-blind",
    GLASSES_BLUR_TARGET = w.MainCanvas,
    HIDDEN = "Hidden",
    MESSAGE_TYPES = Object.freeze({
      ArousalSync: "ArousalSync",
      Hello: "Hello",
    }),
    TIMER_INPUT_ID = "bce_timerInput";

  if (typeof w.ChatRoomCharacter === "undefined") {
    console.warn("Bondage Club not detected. Skipping BCE initialization.");
    return;
  }

  const settingsVersion = 18;
  /**
   * @type {Settings}
   */
  let bceSettings = {};

  /**
   * @type {DefaultSettings}
   */
  const defaultSettings = Object.freeze({
    checkUpdates: {
      label: "Check for updates",
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
      value: true,
    },
    relogin: {
      label: "Automatic Relogin on Disconnect",
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
      value: true,
    },
    expressions: {
      label: "Automatic Arousal Expressions (Replaces Vanilla)",
      sideEffects: (newValue) => {
        if (newValue) {
          // Disable conflicting settings
          w.Player.ArousalSettings.AffectExpression = false;
        }
      },
      value: false,
    },
    activityExpressions: {
      label: "Activity Expressions",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          // Disable conflicting settings
          w.Player.ArousalSettings.AffectExpression = false;
        }
      },
    },
    privateWardrobe: {
      label: "Use full wardrobe in clothing menu",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    layeringMenu: {
      label: "Enable Layering Menus",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    automateCacheClear: {
      label: "Clear Drawing Cache Hourly",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    augmentChat: {
      label: "Chat Links and Embeds",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    gagspeak: {
      label: "(Cheat) Understand All Gagged and when Deafened",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    lockpick: {
      label: "(Cheat) Reveal Lockpicking Order Based on Skill",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    bcx: {
      label: "Load BCX by Jomshir98 (requires refresh)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bceSettings.bcxDevel = false;
        }
      },
    },
    bcxDevel: {
      label:
        "Load BCX beta by Jomshir98 (requires refresh - not pinned by BCE)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bceSettings.bcx = false;
        }
      },
    },
    antiAntiGarble: {
      label: "Anti-Anti-Garble - no cheating your gag (limited)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bceSettings.antiAntiGarbleStrong = false;
          bceSettings.antiAntiGarbleExtra = false;
        }
      },
    },
    antiAntiGarbleStrong: {
      label: "Anti-Anti-Garble - no cheating your gag (full)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bceSettings.antiAntiGarble = false;
          bceSettings.antiAntiGarbleExtra = false;
        }
      },
    },
    antiAntiGarbleExtra: {
      label: "Anti-Anti-Garble - no cheating your gag (extra)",
      value: false,
      sideEffects: (newValue) => {
        if (newValue) {
          bceSettings.antiAntiGarble = false;
          bceSettings.antiAntiGarbleStrong = false;
        }
      },
    },
    showQuickAntiGarble: {
      label: "Show Quick Anti-Anti-Garble in Chat",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    alternateArousal: {
      label:
        "Alternate Arousal (Replaces Vanilla, requires hybrid/locked arousal meter)",
      value: false,
      sideEffects: (newValue) => {
        sendHello();
        w.Player.BCEArousal = newValue;
        w.Player.BCEArousalProgress = Math.min(
          BCE_MAX_AROUSAL,
          w.Player.ArousalSettings.Progress
        );
      },
    },
    ghostNewUsers: {
      label: "Automatically ghost+blocklist unnaturally new users",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
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
        bceLog(newValue);
      },
    },
    friendOfflineNotifications: {
      label: "Show friends going offline too (requires friend presence)",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    stutters: {
      label: "Alternative speech stutter",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    activityLabels: {
      label: "Use clearer activity labels",
      value: true,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    accurateTimerLocks: {
      label: "Use accurate timer inputs",
      value: false,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    confirmLeave: {
      label: "Confirm leaving the game",
      value: true,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
    ctrlEnterOoc: {
      label: "Use Ctrl+Enter to OOC",
      value: true,
      sideEffects: (newValue) => {
        bceLog(newValue);
      },
    },
  });

  function settingsLoaded() {
    return Object.keys(bceSettings).length > 0;
  }

  const bceSettingKey = () => `bce.settings.${w.Player?.AccountName}`;

  /**
   * @type {() => Promise<Settings>}
   */
  const bceLoadSettings = async () => {
    await waitFor(() => !!w.Player?.AccountName);
    const key = bceSettingKey();
    bceLog("loading settings", key);
    if (!settingsLoaded()) {
      /** @type {Settings} */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let settings = JSON.parse(localStorage.getItem(key));

      /** @type {Settings} */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const onlineSettings = JSON.parse(
        w.LZString.decompressFromBase64(w.Player.OnlineSettings.BCE) || null
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
      settings.version = settingsVersion;
      bceSettings = settings;
      return settings;
    }
    return bceSettings;
  };

  const bceSaveSettings = () => {
    localStorage.setItem(bceSettingKey(), JSON.stringify(bceSettings));
    w.Player.OnlineSettings.BCE = w.LZString.compressToBase64(
      JSON.stringify(bceSettings)
    );
    w.ServerAccountUpdate.QueueData({
      OnlineSettings: w.Player.OnlineSettings,
    });
  };

  // ICONS
  const ICONS = Object.freeze({
    LAYERS:
      "data:image/png;base64,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",
    LOGO: "data:image/png;base64,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d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ZjI0Zjk4NjItYjMyMC00ZWZiLWIwOTEtZjIzYTQwYTYwNjAxIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhhMGY1NmRjLTljYmUtNDMzYS1iMzQ5LWEwOTJmNzczMjFmYiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQzZjM5ZWU5LWQxODEtNGE4NS04ZDg3LWFiNTcyYjYxNGMzNCIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2NDIxMjc4ODYyNDUzMTQiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4yMiIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIj4KICAgPGlwdGNFeHQ6TG9jYXRpb25DcmVhdGVkPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6TG9jYXRpb25DcmVhdGVkPgogICA8aXB0Y0V4dDpMb2NhdGlvblNob3duPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6TG9jYXRpb25TaG93bj4KICAgPGlwdGNFeHQ6QXJ0d29ya09yT2JqZWN0PgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6QXJ0d29ya09yT2JqZWN0PgogICA8aXB0Y0V4dDpSZWdpc3RyeUlkPgogICAgPHJkZjpCYWcvPgogICA8L2lwdGNFeHQ6UmVnaXN0cnlJZD4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2I4MGJiZmUtMDUzYi00OTU2LTk1ZjQtNzQxZjExNDY4OTJhIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTAxLTEzVDIxOjM4OjA2Ii8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICAgPHBsdXM6SW1hZ2VTdXBwbGllcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlU3VwcGxpZXI+CiAgIDxwbHVzOkltYWdlQ3JlYXRvcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkltYWdlQ3JlYXRvcj4KICAgPHBsdXM6Q29weXJpZ2h0T3duZXI+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpDb3B5cmlnaHRPd25lcj4KICAgPHBsdXM6TGljZW5zb3I+CiAgICA8cmRmOlNlcS8+CiAgIDwvcGx1czpMaWNlbnNvcj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pmcw/BEAAAACYktHRAD/h4/MvwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+YBDgImBvhP/sMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAV50lEQVRo3qXbeYxleXUf8M+977611u7qfZuZnl5mZxiWGQ/YDJjNHmJjTJxEcSQUOf8QW9ixUKLEUXAiWQrGiSI7kWJLJo4dgrETO8IQSARhWMaAGWDGs/dMd0/vXdW119vvkj/er16/qq7qGfAtlfSq7nbuued8z/d8f+dFRVEgR6GrL1UY07ZsUt2ylmkrZpRBgcirb7lUW1suVhbryURiZRV09RQiiUhJoSdRGp5bNWVFW0VFIlFSEomQFAqFTI5VbR2FvjUXHFa4YMGMVWPScKniNRkLibJrFvRFxuy0bEUuUlLVUFjTVUhM6MmNhbMiZVRdVBhXV1NVliCSDLzQk0osWtFVSHVcMqPunBWzalKZH3wr2WPSFa94Ra7qgKpZq8NrlZApNBQmNEAsFjkh8oqdJowbMyZSQpJLdbV0jFt02qRYrK8p13ZF2RX3yV+TccXI5yiETNkhey067aonZUpqGsq6WloolB2w4qJdquEKZUuOeNFlPV19hUJNSZLralq1pqJpFo0QDJGLFt3qkkMbzHg1M0f/s27wHrt0zLlsRduSjn54JFLfN6aNnRKFyJJlk3Z7XjJ8p2WxJNW2YtWqGbEVZWUtTSVdL4pdNmbyhzB28/5I3RGHZPrWLGrqSqUKibIdlj2LGdCxZK+7PG9RhFjJmJIk1bKkrSk1KbVoRk8TL7viiOe9dSRTfzhT1xGkEIuVNew2SOzBvkikL/es2DRSV+23yx2+rSaSqOqpDjy7qq+rY1pVS65nVddV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",
    TIGHTEN:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwEAYAAAAHkiXEAAACfklEQVR4Xu2bsU4CQRCGT7ERjbFQMTH4AhpjYeEbGC1MbKww4Q2sodAGW2PjA9jb2RkKjMHeBhsrIxRQKQnGgGDi3MRIwNvBndtdd2gW7ib/zHz/7t5xgSCQlxD4JnBwC+8nV4VKLARSKUhzeQljrwdjPh9Len+T7O9D7/X6T/BowMsLHJ+b85cRS+fLyyCLgBH4sPHsjKUMf0WvrgbP+GEGvL9D/NKjv8y0dH54SAOPhjxsaUnvr8j0NPTebNIMKO/5y0xr59SZL+C14g+CiwvazNec3gG5cd4a19d59UV9CIFEAk50OrICfp8kTCtgZQXSohFRM7XRiIr4r+eZDPj4oAGbmqLFS7QigddXN7YgfCal2JY7YeWy3QakF39eq66v4XM2C+PMjDusB1Z6fk4zYOIknoaT4RYZ9Szq7Q3qWXiOpy7tWTIZmgEIZGxHeylfgolNWj3VKk8dsatWKrTG0QhthRK3Qsx/dKStArNC29ujGaDLiKitpv98qWSWF1v209O/GUEFSY1vt6G+tTU2BHYI39/baUQuZwcf9irSaUhRLNphxPExe8t2J8CZh1sAdeugxt/dAY+NDbu5xF4d7r2lWc0rI7ytLRRib8nNhPhoAGd29+lvhrRatnJgehinvd3w7km7rnFBVwwwDoqrAFcMmOQCYFpXDDDsgCsGGMbEl94VA2QL4psDSspigBImviAxgI+t38pyDTDsvxggBhgmYDi9rAAxQIlAUinKwSBXVoCDaNVKdsUA+R6g5idblBjAhlZNWAxQ4yRRVAJyDaAS0xw/oVmPSW7sJhSeD8du34h/COk/vstUkC+ytRp02g3Bjjrij4Pt4/YJN03BbYn5mYwAAAAASUVORK5CYII=",
    USER: "data:image/png;base64,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",
  });

  const DEVS = [23476];

  /**
   * @type {OriginalFunctions}
   */
  const bcOriginalFunctions = {};

  /**
   * @type {(name: OriginalFunction, ...args: any[]) => any}
   */
  const callOriginal = (name, ...args) => {
    if (name in bcOriginalFunctions) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return bcOriginalFunctions[name].apply(null, args);
    } else if (name in w) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return w[name].apply(null, args);
    }
    // eslint-disable-next-line no-undefined
    return undefined;
  };

  /**
   * @type {(...args: any[]) => void}
   */
  const bceLog = (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log("BCE", `${w.BCE_VERSION}:`, ...args);
  };

  /**
   * @type {(...args: any[]) => void}
   */
  const bceWarn = (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.warn("BCE", `${w.BCE_VERSION}:`, ...args);
  };

  /**
   * @type {(...args: any[]) => void}
   */
  const bceError = (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.error("BCE", `${w.BCE_VERSION}:`, ...args);
  };

  /**
   * @type {(node: HTMLElement | string) => void}
   */
  const bceChatNotify = (node) => {
    const div = document.createElement("div");
    div.setAttribute("class", "ChatMessage bce-notification");
    div.setAttribute("data-time", w.ChatRoomCurrentTime());
    div.setAttribute("data-sender", w.Player.MemberNumber.toString());
    if (typeof node === "string") {
      div.appendChild(document.createTextNode(node));
    } else {
      div.appendChild(node);
    }

    const ShouldScrollDown = w.ElementIsScrolledToEnd("TextAreaChatLog");
    if (document.getElementById("TextAreaChatLog") !== null) {
      document.getElementById("TextAreaChatLog").appendChild(div);
      if (ShouldScrollDown) {
        w.ElementScrollToEnd("TextAreaChatLog");
      }
    }
  };

  /**
   * @type {(title: string, text: string) => void}
   */
  const bceBeepNotify = (title, text) => {
    callOriginal("ServerAccountBeep", {
      MemberNumber: w.Player.MemberNumber,
      MemberName: "BCE",
      ChatRoomName: title,
      Private: true,
      Message: text,
      ChatRoomSpace: "",
    });
  };

  /**
   * @type {(text: string, duration?: number, properties?: Partial<ServerBeep>) => Promise<void>}
   */
  const bceNotify = async (text, duration = 5000, properties = {}) => {
    await waitFor(
      () => !!w.Player && new Date(w.ServerBeep?.Timer || 0) < new Date()
    );

    w.ServerBeep = {
      Timer: Date.now() + duration,
      Message: text,
      ...properties,
    };
  };

  w.bceSendAction = (text) => {
    w.ServerSend("ChatRoomChat", {
      Content: "Beep",
      Type: "Action",
      Dictionary: [
        { Tag: "Beep", Text: "msg" },
        { Tag: "msg", Text: text },
      ],
    });
  };

  w.bceSettingValue = (key) =>
    key in bceSettings ? bceSettings[key] : defaultSettings[key].value;

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

  functionIntegrityCheck();
  bceStyles();
  automaticReconnect();
  hiddenMessageHandler();
  await bceLoadSettings();
  bceLog(bceSettings);
  preBCX();
  await loadBCX();
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

  // Post ready when in a chat room
  await bceNotify(`Bondage Club Enhancements v${w.BCE_VERSION} Loaded`);

  w.Player.BCE = w.BCE_VERSION;
  if (bceSettings.checkUpdates) {
    checkUpdate();
  }
  if (!SUPPORTED_GAME_VERSIONS.includes(w.GameVersion)) {
    bceBeepNotify(
      "Warning",
      `Unknown game version: ${w.GameVersion}. Things may break. Check for updates.`
    );
  }

  function functionIntegrityCheck() {
    /**
     * @type {Readonly<{ [key: string]: number }>}
     */
    const expectedHashes = Object.freeze({
      ActivityChatRoomArousalSync: 2971455460369990,
      ActivitySetArousal: 7357117347936900,
      // R76 verified: 1908330478975498
      ActivitySetArousalTimer: 8441451185503760,
      ActivityTimerProgress: 3132257411270963,
      AppearanceClick: 2577670695726505,
      AppearanceExit: 6043996746274230,
      AppearanceLoad: 318038610585259,
      AppearanceRun: 4447390256070365,
      CharacterAppearanceWardrobeLoad: 1024487924475385,
      CharacterGetCurrent: 2230431260459378,
      CharacterRefresh: 6855166438178254,
      CharacterSetActivePose: 5864479931338055,
      CharacterSetFacialExpression: 3628440184167461,
      ChatRoomCharacterItemUpdate: 3554937737739171,
      ChatRoomCharacterUpdate: 5847173315712178,
      ChatRoomClick: 1516540320485356,
      ChatRoomCreateElement: 7478347692525566,
      ChatRoomCurrentTime: 3364862637820289,
      ChatRoomDrawCharacterOverlay: 5369638654189394,
      ChatRoomKeyDown: 6879966488410200,
      ChatRoomListManipulation: 218675230270,
      ChatRoomResize: 5251276321558043,
      ChatRoomRun: 7692271367116918,
      CommandParse: 6084545049509320,
      CommonColorIsValid: 4855710632415704,
      DialogClick: 798751755690754,
      DialogDraw: 2868571887038145,
      DialogDrawActivityMenu: 3008968350523825,
      DialogDrawItemMenu: 4334269354539712,
      DrawBackNextButton: 5090331954030593,
      DrawButton: 7168900912842990,
      DrawCheckbox: 2662604878239790,
      DrawImageResize: 6394177784434117,
      DrawText: 1950095674535445,
      DrawTextFit: 3488730873625659,
      ElementCreateInput: 6525906267998974,
      ElementIsScrolledToEnd: 99667124835273,
      ElementPosition: 3742615981238775,
      ElementRemove: 4658399954293931,
      ElementScrollToEnd: 4878179843157650,
      ElementValue: 7486291396850287,
      FriendListShowBeep: 6702069602772700,
      GLDrawResetCanvas: 3663201061885078,
      InventoryGet: 6142134266866859,
      InventoryItemMiscLoversTimerPadlockClick: 8107057910877884,
      InventoryItemMiscLoversTimerPadlockDraw: 8057727141390318,
      InventoryItemMiscLoversTimerPadlockExit: 8323898828202853,
      InventoryItemMiscLoversTimerPadlockLoad: 5510659662853517,
      InventoryItemMiscMistressTimerPadlockClick: 5599362305459123,
      InventoryItemMiscMistressTimerPadlockDraw: 3812085209143196,
      InventoryItemMiscMistressTimerPadlockExit: 160093519056734,
      InventoryItemMiscMistressTimerPadlockLoad: 7342410949249994,
      InventoryItemMiscOwnerTimerPadlockClick: 1052668154354233,
      InventoryItemMiscOwnerTimerPadlockDraw: 5697779387273422,
      InventoryItemMiscOwnerTimerPadlockExit: 4844944911225709,
      InventoryItemMiscOwnerTimerPadlockLoad: 1456740187902217,
      InventoryItemMiscTimerPasswordPadlockClick: 3359312753176763,
      InventoryItemMiscTimerPasswordPadlockDraw: 5350489452603323,
      InventoryItemMiscTimerPasswordPadlockExit: 7104890308123556,
      InventoryItemMiscTimerPasswordPadlockLoad: 6516661389502762,
      LoginClick: 3972006254666793,
      LoginRun: 1357779450401958,
      LoginSetSubmitted: 5037803792528296,
      MouseIn: 2659797024552939,
      OnlineGameAllowChange: 2348135251117141,
      // R76 verified: 5229920216822273
      ServerAccountBeep: 7290601313677713,
      ServerAppearanceBundle: 5264433604010176,
      ServerAppearanceLoadFromBundle: 2356301037697152,
      // R76 verified: 4732162325239203
      ServerClickBeep: 1039225291022208,
      ServerConnect: 8341437351224791,
      ServerDisconnect: 7623652804225244,
      ServerOpenFriendList: 7598438006135932,
      ServerSend: 5586025187389532,
      SkillGetWithRatio: 6713266246379814,
      SpeechGarbleByGagLevel: 3778741626096362,
      SpeechGetTotalGagLevel: 1025002189598004,
      StruggleDrawLockpickProgress: 433247500965714,
      TextGet: 7879009445399078,
      TextLoad: 5026399427354377,
      // R76 verified: 2045761904827696
      TimerProcess: 4879482539091301,
      WardrobeClick: 8554869702812786,
      WardrobeExit: 3381167184862635,
      WardrobeFastLoad: 2809338805039123,
      WardrobeFastSave: 8247072197553189,
      WardrobeFixLength: 2779616285888834,
      WardrobeLoad: 2703505937355641,
      WardrobeRun: 2335336863253367,
    });

    for (const [func, hash] of Object.entries(expectedHashes)) {
      if (!w[func]) {
        bceWarn(`Expected function ${func} not found.`);
        continue;
      }
      if (typeof w[func] !== "function") {
        bceWarn(`Expected function ${func} is not a function.`);
        continue;
      }
      // eslint-disable-next-line
      const actualHash = cyrb53(w[func].toString());
      if (actualHash !== hash) {
        bceWarn(`Function ${func} has been modified before BCE: ${actualHash}`);
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
        if (latest !== w.BCE_VERSION) {
          // Create beep
          bceBeepNotify(
            "Update",
            `Your version of BCE is outdated and may not be supported. Please update the script.
            
            Your version: ${w.BCE_VERSION}
            Latest version: ${latest}
            
            Changelog available on GitLab (raw) and Discord:
            - https://gitlab.com/Sidiousious/bce/-/commits/main/
            - ${DISCORD_INVITE_URL}`
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

  function preBCX() {
    // Function patching that must occur before BCX
    if (w.BCX_Loaded) {
      bceBeepNotify(
        "ACTION REQUIRED",
        "BCE is only compatible with BCX, when BCX is loaded by BCE. You can enable this in the settings. Do not use BCX's tampermonkey script or their bookmark. Let BCE load BCX."
      );
      throw new Error(
        "BCX is loaded before BCE. Please disable BCX loader and enable BCX from BCE settings instead."
      );
    }
    eval(
      `CommandParse = ${w.CommandParse.toString()
        .replace(
          "// Regular chat",
          "// Regular chat\nmsg = bceMessageReplacements(msg);"
        )
        .replace(
          "// The whispers get sent to the server and shown on the client directly",
          "// The whispers get sent to the server and shown on the client directly\nmsg = bceMessageReplacements(msg);"
        )}`
    );

    w.InputChat?.removeAttribute("maxlength");
    eval(
      `ChatRoomCreateElement = ${w.ChatRoomCreateElement.toString().replace(
        `document.getElementById("InputChat").setAttribute("maxLength", 1000);`,
        "document.getElementById('InputChat').addEventListener('input', (e) => { if (e.target.value.length > 1000 && (!e.target.value.startsWith('/') || e.target.value.startsWith('/w '))) e.target.classList.add('bce-input-warn'); else e.target.classList.remove('bce-input-warn') }, true);"
      )}`
    );

    eval(
      `ChatRoomKeyDown = ${w.ChatRoomKeyDown.toString().replace(
        "ChatRoomSendChat()",
        'if ("bceSettingValue" in window && bceSettingValue("ctrlEnterOoc") && event.ctrlKey) ElementValue("InputChat", "(" + ElementValue("InputChat"));ChatRoomSendChat()'
      )}`
    );

    if (detectBcUtil()) {
      bceBeepNotify(
        "Compatibility Warning",
        "BcUtil is not compatible with BCE's beep enhancements. Beep enhancements will be unavailable until BcUtil has been disabled."
      );
    } else {
      eval(
        `ServerAccountBeep = ${w.ServerAccountBeep.toString().replace(
          // eslint-disable-next-line no-template-curly-in-string
          'ChatRoomSendLocal(`<a onclick="ServerOpenFriendList()">(${ServerBeep.Message})</a>`);',
          // eslint-disable-next-line no-template-curly-in-string
          '{ const beepId = FriendListBeepLog.length - 1; ChatRoomSendLocal(`<a class="bce-beep-link" onclick="ServerOpenFriendList();FriendListModeIndex = 1;FriendListShowBeep(${beepId})">(${ServerBeep.Message}${data.Message ? `: ${data.Message.length > 150 ? data.Message.substring(0, 150) + "..." : data.Message}` : ""})</a>`); }'
        )}`
      );
    }

    if (typeof w.ServerAccountBeep === "function") {
      bcOriginalFunctions.ServerAccountBeep = w.ServerAccountBeep;
    }
    if (typeof w.WardrobeFixLength === "function") {
      bcOriginalFunctions.WardrobeFixLength = w.WardrobeFixLength;
    }

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

    w.ActivityDictionary.push(...customActivityLabels);

    eval(
      `DialogDrawActivityMenu = ${w.DialogDrawActivityMenu.toString()
        .replace(
          'DrawTextFit(ActivityDictionaryText("Activity" + Act.Name)',
          `DrawTextFit(ActivityDictionaryText("bceSettingValue" in window && bceSettingValue("activityLabels") ? \`Act-\${(
          CharacterGetCurrent().IsPlayer() ? "ChatSelf" : "ChatOther")
        }-\${ActivityGetGroupOrMirror(CharacterGetCurrent()?.AssetFamily ?? Player.AssetFamily, Player.FocusGroup?.Name ?? CharacterGetCurrent()?.FocusGroup?.Name).Name}-\${Act.Name}\` : "Activity" + Act.Name)`
        )
        .replace("// Prepares", "\n// Prepares")}`
    );

    const timerInput = `ElementPosition("${TIMER_INPUT_ID}", 1400, 930, 250, 70);`;

    // Lover locks
    eval(
      `InventoryItemMiscLoversTimerPadlockDraw = ${w.InventoryItemMiscLoversTimerPadlockDraw.toString().replace(
        "// Draw buttons to add/remove time if available",
        `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && (C.IsLoverOfPlayer() || C.IsOwnedByPlayer())) {${timerInput}} else`
      )}`
    );
    eval(
      `InventoryItemMiscLoversTimerPadlockClick = ${w.InventoryItemMiscLoversTimerPadlockClick.toString().replace(
        "InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);",
        'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscLoversTimerPadlockAdd(LoverTimerChooseList[LoverTimerChooseIndex] * 3600);'
      )}`
    );

    // Mistress locks
    eval(
      `InventoryItemMiscMistressTimerPadlockDraw = ${w.InventoryItemMiscMistressTimerPadlockDraw.toString().replace(
        "// Draw buttons to add/remove time if available",
        `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && (LogQuery("ClubMistress", "Management") || (Player.MemberNumber == DialogFocusSourceItem.Property.LockMemberNumber))) {${timerInput}} else`
      )}`
    );
    eval(
      `InventoryItemMiscMistressTimerPadlockClick = ${w.InventoryItemMiscMistressTimerPadlockClick.toString().replace(
        "InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);",
        'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscMistressTimerPadlockAdd(MistressTimerChooseList[MistressTimerChooseIndex] * 60, false);'
      )}`
    );

    // Owner locks
    eval(
      `InventoryItemMiscOwnerTimerPadlockDraw = ${w.InventoryItemMiscOwnerTimerPadlockDraw.toString().replace(
        "// Draw buttons to add/remove time if available",
        `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && C.IsOwnedByPlayer()) {${timerInput}} else`
      )}`
    );
    eval(
      `InventoryItemMiscOwnerTimerPadlockClick = ${w.InventoryItemMiscOwnerTimerPadlockClick.toString().replace(
        "InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 3600);",
        'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscOwnerTimerPadlockAdd(OwnerTimerChooseList[OwnerTimerChooseIndex] * 3600);'
      )}`
    );

    // Password timer
    eval(
      `InventoryItemMiscTimerPasswordPadlockDraw = ${w.InventoryItemMiscTimerPasswordPadlockDraw.toString().replace(
        "// Draw buttons to add/remove time if available",
        `if (bceSettingValue("accurateTimerLocks") && Player.CanInteract() && Player.MemberNumber == Property.LockMemberNumber) {${timerInput}} else`
      )}`
    );
    eval(
      `InventoryItemMiscTimerPasswordPadlockClick = ${w.InventoryItemMiscTimerPasswordPadlockClick.toString().replace(
        "InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);",
        'if (!bceSettingValue("accurateTimerLocks")) InventoryItemMiscTimerPasswordPadlockAdd(PasswordTimerChooseList[PasswordTimerChooseIndex] * 60, false);'
      )}`
    );
  }

  function accurateTimerInputs() {
    const loadLockTimerInput = () => {
      let defaultValue = "0d0h5m0s";
      if (w.DialogFocusSourceItem?.Property?.RemoveTimer) {
        const parsedTime = timeUntilDate(
          new Date(w.DialogFocusSourceItem.Property.RemoveTimer)
        );
        defaultValue = `${parsedTime.days}d${parsedTime.hours}h${parsedTime.minutes}m${parsedTime.seconds}s`;
      }
      w.ElementCreateInput(TIMER_INPUT_ID, "text", defaultValue, "11");
      w.ElementPosition(TIMER_INPUT_ID, -100, -100, 0, 0);
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
        w.DialogFocusSourceItem.Property.RemoveTimer = addToTimestamp(
          Date.now(),
          additions.days,
          additions.hours,
          additions.minutes,
          additions.seconds
        );
        if (
          w.DialogFocusSourceItem.Property.RemoveTimer - Date.now() >
          (w.DialogFocusItem?.Asset?.MaxTimer || 604800) * 1000
        ) {
          w.DialogFocusSourceItem.Property.RemoveTimer =
            Date.now() + (w.DialogFocusItem?.Asset?.MaxTimer || 604800) * 1000;
        }
        if (w.CurrentScreen === "ChatRoom") {
          w.ChatRoomCharacterItemUpdate(
            w.CharacterGetCurrent(),
            w.DialogFocusSourceItem.Asset.Group.Name
          );
          const until = timeUntilDate(
            new Date(w.DialogFocusSourceItem.Property.RemoveTimer)
          );
          let timeMessage = "";
          if (w.DialogFocusSourceItem.Property.ShowTimer) {
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
          w.bceSendAction(
            `${w.Player.Name} changed the timer on the ${
              w.DialogFocusItem?.Asset?.Description?.toLowerCase() ||
              "timer lock"
            } on ${w.CharacterGetCurrent().Name}'s ${
              w.CharacterGetCurrent().FocusGroup?.Description?.toLowerCase() ||
              "body"
            }${timeMessage.replace(/[,\s]+$/u, "")}.`
          );
        }
      };
    };

    // Lover
    const bcInventoryItemMiscLoversTimerPadlockExit =
      w.InventoryItemMiscLoversTimerPadlockExit;
    w.InventoryItemMiscLoversTimerPadlockExit = function () {
      bcInventoryItemMiscLoversTimerPadlockExit.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        w.ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bcInventoryItemMiscLoversTimerPadlockLoad =
      w.InventoryItemMiscLoversTimerPadlockLoad;
    w.InventoryItemMiscLoversTimerPadlockLoad = function () {
      bcInventoryItemMiscLoversTimerPadlockLoad.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };

    // Mistress
    const bcInventoryItemMiscMistressTimerPadlockExit =
      w.InventoryItemMiscMistressTimerPadlockExit;
    w.InventoryItemMiscMistressTimerPadlockExit = function () {
      bcInventoryItemMiscMistressTimerPadlockExit.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        w.ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bcInventoryItemMiscMistressTimerPadlockLoad =
      w.InventoryItemMiscMistressTimerPadlockLoad;
    w.InventoryItemMiscMistressTimerPadlockLoad = function () {
      bcInventoryItemMiscMistressTimerPadlockLoad.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };

    // Owner
    const bcInventoryItemMiscOwnerTimerPadlockExit =
      w.InventoryItemMiscOwnerTimerPadlockExit;
    w.InventoryItemMiscOwnerTimerPadlockExit = function () {
      bcInventoryItemMiscOwnerTimerPadlockExit.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        w.ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bcInventoryItemMiscOwnerTimerPadlockLoad =
      w.InventoryItemMiscOwnerTimerPadlockLoad;
    w.InventoryItemMiscOwnerTimerPadlockLoad = function () {
      bcInventoryItemMiscOwnerTimerPadlockLoad.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };

    // Password
    const bcInventoryItemMiscTimerPasswordPadlockExit =
      w.InventoryItemMiscTimerPasswordPadlockExit;
    w.InventoryItemMiscTimerPasswordPadlockExit = function () {
      bcInventoryItemMiscTimerPasswordPadlockExit.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        w.ElementRemove(TIMER_INPUT_ID);
      }
    };

    const bcInventoryItemMiscTimerPasswordPadlockLoad =
      w.InventoryItemMiscTimerPasswordPadlockLoad;
    w.InventoryItemMiscTimerPasswordPadlockLoad = function () {
      bcInventoryItemMiscTimerPasswordPadlockLoad.apply(this, arguments);
      if (bceSettings.accurateTimerLocks) {
        loadLockTimerInput();
      }
    };
  }

  // Load BCX
  async function loadBCX() {
    await waitFor(settingsLoaded);

    /** @type {string} */
    let source = null;
    if (bceSettings.bcx) {
      source = BCX_SOURCE;
    } else if (bceSettings.bcxDevel) {
      source = BCX_DEVEL_SOURCE;
    } else {
      return;
    }
    bceLog("Loading BCX from", source);
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
    bceLog("Loaded BCX");
  }

  async function commands() {
    await waitFor(() => !!w.Commands);
    bceLog("registering additional commands");

    /** @type {Command[]} */
    const cmds = [
      {
        Tag: "exportlooks",
        Description:
          "[target member number] [includeBinds: true/false] [total: true/false]: Copy your or another player's appearance in a format that can be imported with BCX",
        Action: async (_, _command, args) => {
          const [target, includeBindsArg, total] = args;
          /** @type {Character} */
          let targetMember = null;
          if (!target) {
            targetMember = w.Player;
          } else {
            targetMember = w.Character.find(
              (c) => c.MemberNumber === parseInt(target)
            );
          }
          if (!targetMember) {
            bceLog("Could not find member", target);
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
            if (i.Property?.LockMemberNumber) {
              i.Property.LockMemberNumber = w.Player.MemberNumber;
            }
            return {
              Group: i.Asset.Group.Name,
              Name: i.Asset.Name,
              Color: i.Color,
              Difficulty: i.Difficulty,
              Property: i.Property,
            };
          });

          const targetName = targetMember.IsPlayer()
            ? "yourself"
            : targetMember.Name;

          bceBeepNotify(
            `Exported looks for ${targetName}`,
            JSON.stringify(looks)
          );
          await navigator.clipboard.writeText(JSON.stringify(looks));
          bceChatNotify(`Exported looks for ${targetName} copied to clipboard`);
        },
      },
      {
        Tag: "importlooks",
        Description:
          "[looks string]: Import looks from a string (BCX or BCE export)",
        Action: (_, command) => {
          if (!w.Player.CanChange() || !w.OnlineGameAllowChange()) {
            bceLog(
              "You cannot change your appearance while bound or during online games, such as LARP."
            );
            return;
          }

          const [, bundleString] = command.split(" ");
          if (!bundleString) {
            bceLog("No looks string provided");
            return;
          }
          try {
            /** @type {ItemBundle[]} */
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const bundle = bundleString.startsWith("[")
              ? JSON.parse(bundleString)
              : JSON.parse(w.LZString.decompressFromBase64(bundleString));

            if (
              !Array.isArray(bundle) ||
              bundle.length === 0 ||
              !bundle[0].Group
            ) {
              throw new Error("Invalid bundle");
            }
            w.ServerAppearanceLoadFromBundle(
              w.Player,
              "Female3DCG",
              bundle,
              w.Player.MemberNumber
            );
            w.ChatRoomCharacterUpdate(w.Player);
            bceChatNotify("Applied looks");
          } catch (e) {
            console.error(e);
            bceChatNotify("Could not parse looks");
          }
        },
      },
      {
        Tag: "beep",
        Description: "[membernumber] [message]: beep someone",
        Action: (_, command, args) => {
          const [target] = args,
            [, , ...message] = command.split(" "),
            msg = message?.join(" ");
          if (!target || !msg || !/^\d+$/u.test(target)) {
            bceChatNotify(`beep target or message not provided`);
            return;
          }
          const targetMemberNumber = parseInt(target);
          if (!w.Player.FriendList.includes(targetMemberNumber)) {
            bceChatNotify(`${target} is not in your friend list`);
            return;
          }
          w.ServerSend("AccountBeep", {
            BeepType: "",
            MemberNumber: targetMemberNumber,
            Message: msg,
            IsSecret: true,
          });
          w.FriendListBeepLog.push({
            MemberNumber: targetMemberNumber,
            MemberName: w.Player.FriendNames.get(targetMemberNumber),
            ChatRoomName: null,
            Sent: true,
            Private: false,
            Time: new Date(),
            Message: msg,
          });
          const beepId = w.FriendListBeepLog.length - 1;
          const link = document.createElement("a");
          link.href = `#beep-${beepId}`;
          link.onclick = (e) => {
            e.preventDefault();
            w.ServerOpenFriendList();
            w.FriendListModeIndex = 1;
            w.FriendListShowBeep(beepId);
          };
          link.textContent = `(Beep to ${w.Player.FriendNames.get(
            targetMemberNumber
          )} (${targetMemberNumber}): ${
            msg.length > 150 ? `${msg.substring(0, 150)}...` : msg
          })`;
          link.classList.add("bce-beep-link");
          bceChatNotify(link);
        },
      },
      {
        Tag: "w",
        Description:
          "[target name] [message]: whisper the target player. Use first name only. Finds the first person in the room with a matching name, left-to-right, top-to-bottom.",
        Action: (_, command, args) => {
          const [target] = args,
            [, , ...message] = command.split(" "),
            msg = message?.join(" "),
            targetMembers = w.ChatRoomCharacter.filter(
              (c) =>
                c.Name.split(" ")[0]?.toLowerCase() === target?.toLowerCase()
            );
          if (!target || targetMembers.length === 0) {
            bceChatNotify(`Whisper target not found: ${target}`);
          } else if (targetMembers.length > 1) {
            bceChatNotify(
              `Multiple whisper targets found: ${targetMembers
                .map((c) => `${c.Name} (${c.MemberNumber})`)
                .join(
                  ", "
                )}. You can still whisper the player by clicking their name.`
            );
          } else if (!msg) {
            bceChatNotify(`No message provided`);
          } else {
            const targetMemberNumber = targetMembers[0].MemberNumber;
            const originalTarget = w.ChatRoomTargetMemberNumber;
            w.ChatRoomTargetMemberNumber = targetMemberNumber;
            w.CommandParse(
              `${
                msg.length > 0 && [".", "/"].includes(msg[0]) ? "\u200b" : ""
              }${msg}`
            );
            w.ChatRoomTargetMemberNumber = originalTarget;
          }
        },
      },
      {
        Tag: "versions",
        Description:
          "show versions of the club, BCE, and BCX in use by players",
        Action: () => {
          bceChatNotify(
            w.ChatRoomCharacter.map(
              (a) =>
                `${a.Name} (${a.MemberNumber}) club ${
                  a.OnlineSharedSettings?.GameVersion
                }${
                  w.bcx?.getCharacterVersion(a.MemberNumber)
                    ? ` BCX ${w.bcx.getCharacterVersion(a.MemberNumber)}`
                    : ""
                }${
                  a.BCE
                    ? `\nBCE v${a.BCE} Alt Arousal: ${a.BCEArousal?.toString()}`
                    : ""
                }`
            )
              .filter((a) => a)
              .join("\n\n")
          );
        },
      },
    ];

    for (const c of cmds) {
      if (w.Commands.some((a) => a.Tag === c.Tag)) {
        bceLog("already registered", c);
        continue;
      }
      w.Commands.push(c);
    }
  }

  // Create settings page
  async function settingsPage() {
    await waitFor(() => !!w.PreferenceSubscreenList);

    bceLog("initializing");

    const settingsPerPage = 9,
      settingsYIncrement = 70,
      settingsYStart = 225;

    const settingsPageCount = Math.ceil(
      Object.keys(defaultSettings).length / settingsPerPage
    );

    const discordInvitePosition = [1650, 810, 250, 90];
    let currentPageNumber = 0;

    w.PreferenceSubscreenBCESettingsLoad = function () {
      currentPageNumber = 0;
    };
    w.PreferenceSubscreenBCESettingsExit = function () {
      w.PreferenceSubscreen = "";
      w.PreferenceMessage = "";
    };
    w.PreferenceSubscreenBCESettingsRun = function () {
      w.MainCanvas.getContext("2d").textAlign = "left";
      w.DrawText(
        "Bondage Club Enhancements Settings",
        300,
        125,
        "Black",
        "Gray"
      );
      w.DrawButton.apply(null, [...discordInvitePosition, "", "White", ""]);
      w.DrawText(
        "Join Discord",
        discordInvitePosition[0] + 20,
        discordInvitePosition[1] + discordInvitePosition[3] / 2,
        "Black",
        ""
      );
      let y = settingsYStart;
      for (const setting of Object.keys(defaultSettings).slice(
        currentPageNumber * settingsPerPage,
        currentPageNumber * settingsPerPage + settingsPerPage
      )) {
        w.DrawCheckbox(
          300,
          y,
          64,
          64,
          defaultSettings[setting].label,
          bceSettings[setting]
        );
        y += settingsYIncrement;
      }
      w.DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
      w.DrawText(
        `${currentPageNumber + 1} / ${settingsPageCount}`,
        1700,
        230,
        "Black",
        "Gray"
      );
      w.DrawButton(1815, 180, 90, 90, "", "White", "Icons/Next.png");
    };
    w.PreferenceSubscreenBCESettingsClick = function () {
      let y = settingsYStart;
      if (w.MouseIn(1815, 75, 90, 90)) {
        w.PreferenceSubscreenBCESettingsExit();
      } else if (w.MouseIn(1815, 180, 90, 90)) {
        currentPageNumber += 1;
        currentPageNumber %= settingsPageCount;
      } else if (w.MouseIn.apply(null, discordInvitePosition)) {
        w.open(DISCORD_INVITE_URL, "_blank");
      } else {
        for (const setting of Object.keys(defaultSettings).slice(
          currentPageNumber * settingsPerPage,
          currentPageNumber * settingsPerPage + settingsPerPage
        )) {
          if (w.MouseIn(300, y, 64, 64)) {
            bceSettings[setting] = !bceSettings[setting];
            defaultSettings[setting].sideEffects(bceSettings[setting]);
          }
          y += settingsYIncrement;
        }
      }

      bceSaveSettings();
    };

    const bcDrawButton = w.DrawButton;
    w.DrawButton = function (
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
      // Avoid image load errors
      if (/\bBCE/u.test(Image)) {
        Image = null;
      }
      bcDrawButton(
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

    const bcTextGet = w.TextGet;
    w.TextGet = function (id) {
      switch (id) {
        case "HomepageBCESettings":
          return "BCE Settings";
        default:
          return bcTextGet(id);
      }
    };
    w.PreferenceSubscreenList.push("BCESettings");
  }

  async function lockpickHelp() {
    await waitFor(() => !!w.StruggleDrawLockpickProgress);

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

    const bcStruggleDrawLockpickProgress = w.StruggleDrawLockpickProgress;
    w.StruggleDrawLockpickProgress = (C) => {
      if (bceSettings.lockpick) {
        const seed = parseInt(w.StruggleLockPickOrder.join(""));
        const rand = newRand(seed);
        const threshold = w.SkillGetWithRatio("LockPicking") / 20;
        const hints = w.StruggleLockPickOrder.map((a) => {
          const r = rand();
          return r < threshold ? a : false;
        });
        for (let p = 0; p < hints.length; p++) {
          // Replicates pin rendering in the game Struggle.js
          const xx =
            x - pinWidth / 2 + (0.5 - hints.length / 2 + p) * pinSpacing;
          if (hints[p]) {
            w.DrawText(
              `${w.StruggleLockPickOrder.indexOf(p) + 1}`,
              xx,
              y,
              "blue"
            );
          }
        }
      }
      bcStruggleDrawLockpickProgress(C);
    };
  }

  function automaticReconnect() {
    const localStoragePasswordsKey = "bce.passwords";
    w.bceUpdatePasswordForReconnect = () => {
      let name = "";
      if (w.CurrentScreen === "Login") {
        name = w.ElementValue("InputName").toUpperCase();
      } else if (w.CurrentScreen === "Relog") {
        name = w.Player.AccountName;
      }
      /** @type {Passwords} */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let passwords = JSON.parse(
        localStorage.getItem(localStoragePasswordsKey)
      );
      if (!passwords) {
        passwords = {};
      }
      passwords[name] = w.ElementValue("InputPassword");
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

    let lastClick = Date.now(),
      loginCheckDone = false;

    function resetLoginCheck() {
      loginCheckDone = false;
    }

    function loginCheck() {
      if (w.CurrentScreen === "Login" && !loginCheckDone) {
        loginCheckDone = true;
        /** @type {Passwords} */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let passwords = JSON.parse(
          localStorage.getItem(localStoragePasswordsKey)
        );
        if (!passwords) {
          passwords = {};
        }
        /** @type {{[key: string]: string}} */
        const posMaps = {};
        const bcLoginRun = w.LoginRun;
        w.LoginRun = function () {
          bcLoginRun();
          if (Object.keys(passwords).length > 0) {
            w.DrawText("Saved Logins (BCE)", 170, 35, "White", "Black");
          }
          w.DrawButton(1250, 385, 180, 60, "Save (BCE)", "White");

          let y = 60;
          for (const user in passwords) {
            if (!Object.prototype.hasOwnProperty.call(passwords, user)) {
              continue;
            }
            posMaps[y] = user;
            w.DrawButton(10, y, 350, 60, user, "White");
            w.DrawButton(355, y, 60, 60, "X", "White");
            y += 70;
          }
        };
        const bcLoginClick = w.LoginClick;
        w.LoginClick = function () {
          bcLoginClick();
          if (w.MouseIn(1250, 385, 180, 60)) {
            w.bceUpdatePasswordForReconnect();
            resetLoginCheck();
          }
          const now = Date.now();
          if (now - lastClick < 150) {
            return;
          }
          lastClick = now;
          for (const pos in posMaps) {
            if (!Object.prototype.hasOwnProperty.call(posMaps, pos)) {
              continue;
            }
            const idx = parseInt(pos);
            if (w.MouseIn(10, idx, 350, 60)) {
              w.ElementValue("InputName", posMaps[idx]);
              w.ElementValue("InputPassword", passwords[posMaps[idx]]);
            } else if (w.MouseIn(355, idx, 60, 60)) {
              w.bceClearPassword(posMaps[idx]);
              resetLoginCheck();
            }
          }
        };
        w.CurrentScreenFunctions.Run = w.LoginRun;
        w.CurrentScreenFunctions.Click = w.LoginClick;
      }
    }
    setInterval(loginCheck, 100);

    let breakCircuit = false;
    /** @type {number} */
    let relogCheck = null;

    async function relog() {
      if (breakCircuit || !bceSettings.relogin) {
        return;
      }
      if (w.Player.AccountName && w.ServerIsConnected && !w.LoginSubmitted) {
        if (relogCheck) {
          clearInterval(relogCheck);
        }
        /** @type {Passwords} */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let passwords = JSON.parse(
          localStorage.getItem(localStoragePasswordsKey)
        );
        bceLog("Attempting to log in again as", w.Player.AccountName);
        if (!passwords) {
          passwords = {};
        }
        if (!passwords[w.Player.AccountName]) {
          // eslint-disable-next-line no-alert
          alert("Automatic reconnect failed!");
          breakCircuit = true;
          return;
        }
        w.LoginSetSubmitted();
        w.ServerSend("AccountLogin", {
          AccountName: w.Player.AccountName,
          Password: passwords[w.Player.AccountName],
        });
        await waitFor(() => w.CurrentScreen !== "Relog");
        await sleep(500);
        callOriginal("ServerAccountBeep", {
          MemberNumber: w.Player.MemberNumber,
          MemberName: "VOID",
          ChatRoomName: "VOID",
          Private: true,
          Message: "Reconnected!",
          ChatRoomSpace: "",
        });
      }
    }

    const bcServerConnect = w.ServerConnect;
    w.ServerConnect = () => {
      bcServerConnect();
      relog();
    };

    const bcServerDisconnect = w.ServerDisconnect;

    w.ServerDisconnect = (data, close = false) => {
      if (!breakCircuit && bceSettings.relogin) {
        if (data === "ErrorDuplicatedLogin") {
          callOriginal("ServerAccountBeep", {
            MemberNumber: w.Player.MemberNumber,
            MemberName: w.Player.Name,
            ChatRoomName: "ERROR",
            Private: true,
            Message:
              "Signed in from a different location! Refresh the page to re-enable relogin in this tab.",
            ChatRoomSpace: "",
          });
          breakCircuit = true;
        } else {
          relogCheck = setInterval(relog, 100);
        }
      }
      bcServerDisconnect(data, close);
    };
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
    .bce-input-warn {
      background-color: yellow;
    }
    #TextAreaChatLog a {
      color: #003f91;
      cursor: pointer;
    }
    #TextAreaChatLog a:visited {
      color: #380091;
    }
    #TextAreaChatLog[data-colortheme="dark"] div.ChatMessageWhisper,
    #TextAreaChatLog[data-colortheme="dark2"] div.ChatMessageWhisper {
      color: #ffa4a4;
    }
    #TextAreaChatLog[data-colortheme="dark"] a,
    #TextAreaChatLog[data-colortheme="dark2"] a {
      color: #a9ceff;
    }
    #TextAreaChatLog[data-colortheme="dark"] a:visited,
    #TextAreaChatLog[data-colortheme="dark2"] a:visited {
      color: #3d91ff;
    }
    .bce-blind {
      filter: blur(0.24vw);
    }
    `,
      head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style");
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
        ...w.Player.Appearance.filter((a) => a.Property?.Intensity > -1).map(
          (a) => a.Property.Intensity
        )
      );

      const eggedBonus = maxIntensity * 5;
      const chanceToStutter =
        (Math.max(0, w.Player.ArousalSettings.Progress - 10 + eggedBonus) *
          0.5) /
        100;

      const chanceToMakeSound =
        (Math.max(
          0,
          w.Player.ArousalSettings.Progress / 2 - 20 + eggedBonus * 2
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
          words.splice(i + 1, 0, words[i].substr(oocIdx, 1));
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

    const EMBED_TYPE = Object.freeze({
      /** @type {"img"} */
      Image: "img",
      /** @type {""} */
      None: "",
    });

    /** @type {(url: URL) => "img" | ""} */
    function bceAllowedToEmbed(url) {
      if (
        [
          "cdn.discordapp.com",
          "media.discordapp.com",
          "i.imgur.com",
          "c.tenor.com",
          "i.redd.it",
        ].includes(url.host) &&
        /\/[^/]+\.(png|jpe?g|gif)$/u.test(url.pathname)
      ) {
        return EMBED_TYPE.Image;
      }
      return EMBED_TYPE.None;
    }

    function bceChatAugments() {
      if (w.CurrentScreen !== "ChatRoom" || !bceSettings.augmentChat) {
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
          const newChildren = [],
            scrolledToEnd = w.ElementIsScrolledToEnd(chatLogContainerId);
          for (const node of chatMessageElement.childNodes) {
            if (node.nodeType !== Node.TEXT_NODE) {
              newChildren.push(node);
              /** @type {HTMLElement} */
              // @ts-ignore
              const el = node;
              if (el.classList.contains("ChatMessageName")) {
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
                switch (bceAllowedToEmbed(url)) {
                  case EMBED_TYPE.Image:
                    {
                      const imgNode = document.createElement("img");
                      imgNode.src = url.href;
                      imgNode.alt = url.href;
                      imgNode.onload = () => {
                        if (scrolledToEnd) {
                          w.ElementScrollToEnd(chatLogContainerId);
                        }
                      };
                      imgNode.classList.add("bce-img");
                      domNode = imgNode;
                    }
                    break;
                  default:
                    domNode = document.createTextNode(url.href);
                    break;
                }
                const linkNode = document.createElement("a");
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
          if (scrolledToEnd) {
            w.ElementScrollToEnd(chatLogContainerId);
          }
        }
      }
    }
    setInterval(bceChatAugments, 500);
  }

  async function automaticExpressions() {
    await waitFor(() => w.CurrentScreen === "ChatRoom");

    bceLog("Started arousal faces");

    if (!w.bce_ArousalExpressionStages) {
      // eslint-disable-next-line camelcase
      w.bce_ArousalExpressionStages = {
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
            (
              /** @type {string | PoseEx} */
              v
            ) => {
              /** @type {string} */
              // @ts-ignore
              const poseName = v;
              return {
                Pose: poseName,
                Category: w.PoseFemale3DCG.find((a) => a.Name === v)?.Category,
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

    w.ServerSocket.on(
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
                  data.Sender !== w.Player.MemberNumber
                ) {
                  continue;
                } else if (
                  matcher.Criteria.TargetIsPlayer &&
                  data.Dictionary?.find((t) =>
                    /^(Target|Destination)Character(Name)?$/u.test(t.Tag)
                  )?.MemberNumber !== w.Player.MemberNumber
                ) {
                  continue;
                } else if (
                  matcher.Criteria.DictionaryMatchers &&
                  !matcher.Criteria.DictionaryMatchers.some((m) =>
                    data.Dictionary?.find((t) =>
                      Object.keys(m).every((k) => m[k] === t[k])
                    )
                  )
                ) {
                  continue;
                }
                // Criteria met
                pushEvent(w.bce_EventExpressions[trigger.Event]);
              } else if (
                data.Sender === w.Player.MemberNumber ||
                data.Dictionary?.some(
                  (t) =>
                    /^(Target|Destination)Character(Name)?$/u.test(t.Tag) &&
                    t.MemberNumber === w.Player.MemberNumber
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
      const properties = w.Player.Appearance.filter(
        (a) => a.Asset.Group.Name === t
      )[0].Property;
      return [properties?.Expression || null, !properties?.RemoveTimer];
    }

    /** @type {(faceComponent: string, newExpression: string, color: string) => void} */
    function setExpression(t, n, color) {
      if (!n) {
        n = null;
      }
      for (let i = 0; i < w.Player.Appearance.length; i++) {
        if (w.Player.Appearance[i].Asset.Group.Name === t) {
          if (!w.Player.Appearance[i].Property) {
            w.Player.Appearance[i].Property = {};
          }
          w.Player.Appearance[i].Property.Expression = n;
          if (color) {
            w.Player.Appearance[i].Color = color;
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

    // Reset
    w.Player.ArousalSettings.Progress = 0;
    let PreviousArousal = w.Player.ArousalSettings;

    const ArousalMeterDirection = {
      None: 0,
      Down: 1,
      Up: 2,
    };
    let PreviousDirection = ArousalMeterDirection.Up;

    w.Commands.push({
      Tag: "r",
      Description:
        "[part of face or 'all']: resets expression overrides on part of or all of face",
      Action: (args) => {
        if (args.length === 0 || args === "all") {
          bceExpressionsQueue.push(
            ...bceExpressionsQueue
              .splice(0, bceExpressionsQueue.length)
              .filter((e) => e.Type === MANUAL_OVERRIDE_EVENT_TYPE && e.Poses)
          );
          bceChatNotify("Reset all expressions");
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
          bceChatNotify(`Reset expression on ${component}`);
        }
      },
    });

    w.Commands.push({
      Tag: "pose",
      Description: "['list' or list of poses]: set your pose",
      Action: (_1, _2, poses) => {
        if (poses[0] === "list") {
          const categories = [
            ...new Set(w.PoseFemale3DCG.map((a) => a.Category)),
          ];
          for (const category of categories) {
            const list = w.PoseFemale3DCG.filter(
              (a) => a.Category === category
            )?.map((a) => a.Name);
            list.sort();
            bceChatNotify(`=> ${category}:\n${list.join("\n")}\n\n`);
          }
          return;
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
        w.CharacterSetActivePose(
          w.Player,
          w.PoseFemale3DCG.filter((p) =>
            poses.includes(p.Name.toLowerCase())
          ).map((p) => p.Name),
          false
        );
      },
    });

    const bcCharacterSetFacialExpression = w.CharacterSetFacialExpression;
    w.CharacterSetFacialExpression = function (
      C,
      AssetGroup,
      Expression,
      Timer,
      Color
    ) {
      if (
        C.IsPlayer() &&
        (bceSettings.expressions || bceSettings.activityExpressions)
      ) {
        const duration = Timer ? Timer * 1000 : -1,
          e = {},
          types = [AssetGroup];
        if (AssetGroup === "Eyes") {
          types.push("Eyes2");
        } else if (AssetGroup === "Eyes1") {
          types[0] = "Eyes";
        }
        if (!Color || !w.CommonColorIsValid(Color)) {
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
      } else {
        bcCharacterSetFacialExpression(C, AssetGroup, Expression, Timer, Color);
      }
    };

    const bcCharacterSetActivePose = w.CharacterSetActivePose;
    w.CharacterSetActivePose = function (C, Pose, ForceChange) {
      if (
        C.IsPlayer() &&
        (bceSettings.expressions || bceSettings.activityExpressions)
      ) {
        if (!Pose || (Array.isArray(Pose) && Pose.every((p) => !p))) {
          Pose = ["BaseUpper", "BaseLower"];
        }
        const p = {};
        p.Pose = Array.isArray(Pose) ? Pose : [Pose];
        p.Duration = -1;
        bceLog("ManualPose", p);
        const evt = {
          Type: MANUAL_OVERRIDE_EVENT_TYPE,
          Duration: -1,
          Poses: [p],
        };
        pushEvent(evt);
        CustomArousalExpression();
      } else {
        bcCharacterSetActivePose(C, Pose, ForceChange);
      }
    };

    w.ServerSocket.on(
      "ChatRoomSyncPose",
      (
        /** @type {{ MemberNumber: number; Character?: Character; Pose: string | string[]; }} */
        data
      ) => {
        if (data === null || typeof data !== "object") {
          return;
        }
        if (!(bceSettings.expressions || bceSettings.activityExpressions)) {
          return;
        }
        if (data.MemberNumber === w.Player.MemberNumber) {
          w.CharacterSetActivePose(w.Player, data.Pose, true);
        }
      }
    );

    w.ServerSocket.on(
      "ChatRoomSyncSingle",
      (
        /** @type {ChatRoomSyncSingleEvent} */
        data
      ) => {
        if (data === null || typeof data !== "object") {
          return;
        }
        if (!(bceSettings.expressions || bceSettings.activityExpressions)) {
          return;
        }
        if (data.Character?.MemberNumber === w.Player.MemberNumber) {
          w.CharacterSetActivePose(w.Player, data.Character.ActivePose, true);
        }
      }
    );

    let lastOrgasm = 0,
      orgasmCount = 0,
      wasDefault = false;

    // This is called once per interval to check for expression changes
    // eslint-disable-next-line complexity
    const CustomArousalExpression = () => {
      if (
        !(bceSettings.expressions || bceSettings.activityExpressions) ||
        !w.Player?.AppearanceLayers
      ) {
        return;
      }
      w.Player.ArousalSettings.AffectExpression = false;

      if (orgasmCount < w.Player.ArousalSettings.OrgasmCount) {
        orgasmCount = w.Player.ArousalSettings.OrgasmCount;
      } else if (orgasmCount > w.Player.ArousalSettings.OrgasmCount) {
        w.Player.ArousalSettings.OrgasmCount = orgasmCount;
        w.ActivityChatRoomArousalSync(w.Player);
      }

      // Reset everything when face is fully default
      let isDefault = true;
      for (const t of Object.keys(w.bce_ArousalExpressionStages)) {
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
      const arousal = w.Player.ArousalSettings.Progress;
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
          orgasms = w.Player.ArousalSettings.OrgasmCount || 0;
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
        w.Player.ArousalSettings.OrgasmStage === OrgasmRecoveryStage &&
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
      if (w.Player.ActivePose) {
        for (let i = 0; i < w.Player.ActivePose.length; i++) {
          const pose = w.Player.ActivePose[i];
          const p = w.PoseFemale3DCG.find((pp) => pp.Name === pose);
          if (
            !p?.Category &&
            Object.values(desiredPose).every((v) => v.Pose !== pose)
          ) {
            w.Player.ActivePose.splice(i, 1);
            i--;
            needsPoseUpdate = true;
            needsRefresh = true;
          }
        }
      }

      // Handle arousal-based expressions
      outer: for (const t of Object.keys(w.bce_ArousalExpressionStages)) {
        const [exp] = expression(t);
        let chosenExpression = null;
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

      for (const t of Object.keys(nextExpression)) {
        const [exp] = expression(t),
          nextExp = nextExpression[t];
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
          w.ServerSend("ChatRoomCharacterExpressionUpdate", {
            Name: desiredExpression[t].Expression,
            Group: t,
            Appearance: w.ServerAppearanceBundle(w.Player.Appearance),
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
      let newPose = Object.values(desiredPose).map((p) => p.Pose);
      if (
        !w.Player.ActivePose ||
        !newPose.every(
          (p) => basePoseMatcher.test(p) || w.Player.ActivePose.includes(p)
        ) ||
        !w.Player.ActivePose.every((p) => newPose.includes(p))
      ) {
        if (newPose.every((p) => basePoseMatcher.test(p))) {
          newPose = null;
        }
        bcCharacterSetActivePose(w.Player, newPose, true);
        needsPoseUpdate = true;
        needsRefresh = true;
      }

      if (needsPoseUpdate) {
        w.ServerSend("ChatRoomCharacterPoseUpdate", {
          Pose: w.Player.ActivePose,
        });
      }

      if (needsRefresh) {
        w.CharacterRefresh(w.Player, false, false);
      }

      PreviousArousal = { ...w.Player.ArousalSettings };
    };

    if (typeof w.bceCustomArousalTimer !== "undefined") {
      clearInterval(w.bceCustomArousalTimer);
    }
    w.bceCustomArousalTimer = setInterval(CustomArousalExpression, 250);
  }

  async function layeringMenu() {
    await waitFor(() => !!w.Player?.AppearanceLayers);

    let lastItem = null;
    const layerPriority = "bce_LayerPriority";

    /** @type {(item: Item) => void} */
    function updateItemPriorityFromLayerPriorityInput(item) {
      if (item) {
        const priority = parseInt(w.ElementValue(layerPriority));
        if (!item.Property) {
          item.Property = { OverridePriority: priority };
        } else {
          item.Property.OverridePriority = priority;
        }
      }
    }

    const bcAppearanceExit = w.AppearanceExit;
    w.AppearanceExit = function () {
      if (w.CharacterAppearanceMode === "") {
        w.ElementRemove(layerPriority);
      }
      bcAppearanceExit();
    };
    const bcAppearanceLoad = w.AppearanceLoad;
    w.AppearanceLoad = function () {
      bcAppearanceLoad();
      w.ElementCreateInput(layerPriority, "number", "", "20");
      w.ElementPosition(layerPriority, -1000, -1000, 0);
    };
    const bcAppearanceRun = w.AppearanceRun;
    w.AppearanceRun = function () {
      bcAppearanceRun();
      if (bceSettings.layeringMenu) {
        const C = w.CharacterAppearanceSelection;
        if (w.CharacterAppearanceMode === "Cloth") {
          w.DrawText("Priority", 70, 35, "White", "Black");
          w.ElementPosition(layerPriority, 60, 105, 100);
          w.DrawButton(
            110,
            70,
            90,
            90,
            "",
            "White",
            "Icons/Accept.png",
            "Set Priority"
          );
          const item = C.Appearance.find((a) => a.Asset.Group === C.FocusGroup);
          if (!lastItem || lastItem !== item) {
            if (!item) {
              w.ElementValue(layerPriority, "");
            } else {
              w.ElementValue(
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
          w.ElementPosition(layerPriority, -1000, -1000, 0);
        }
      }
    };
    const bcAppearanceClick = w.AppearanceClick;
    w.AppearanceClick = function () {
      if (bceSettings.layeringMenu) {
        const C = w.CharacterAppearanceSelection;
        if (
          w.MouseIn(110, 70, 90, 90) &&
          w.CharacterAppearanceMode === "Cloth"
        ) {
          const item = C.Appearance.find(
            (a) => a.Asset.Group?.Name === C.FocusGroup?.Name
          );
          updateItemPriorityFromLayerPriorityInput(item);
        }
      }
      bcAppearanceClick();
    };

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
      w.DialogFocusItem = FocusItem;
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
      w.ElementCreateInput(
        layerPriority,
        "number",
        initialValue.toString(),
        "20"
      );
    }
    function prioritySubscreenExit() {
      prioritySubscreen = false;
      w.ElementRemove(layerPriority);
      w.DialogFocusItem = null;
    }
    const bcDialogDrawItemMenu = w.DialogDrawItemMenu;
    w.DialogDrawItemMenu = function (C) {
      if (bceSettings.layeringMenu) {
        const focusItem = w.InventoryGet(C, C.FocusGroup?.Name);
        if (assetWorn(C, focusItem)) {
          w.DrawButton(
            10,
            890,
            52,
            52,
            "",
            "White",
            ICONS.TIGHTEN,
            "Loosen or tighten (Cheat)"
          );
        }
        if (assetVisible(C, focusItem)) {
          w.DrawButton(
            10,
            948,
            52,
            52,
            "",
            "White",
            ICONS.LAYERS,
            "Modify layering priority"
          );
        }
      }
      bcDialogDrawItemMenu(C);
    };

    const bcDialogDraw = w.DialogDraw;
    w.DialogDraw = function () {
      if (bceSettings.layeringMenu && prioritySubscreen) {
        w.DrawText(`Set item ${priorityField}`, 950, 150, "White", "Black");
        w.DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
        w.ElementPosition(layerPriority, 950, 210, 100);
        w.DrawButton(
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
        bcDialogDraw();
      }
    };
    const bcDialogClick = w.DialogClick;
    w.DialogClick = function () {
      if (!bceSettings.layeringMenu) {
        bcDialogClick();
        return;
      }
      const C = w.CharacterGetCurrent(),
        focusItem = w.InventoryGet(C, C.FocusGroup?.Name);
      if (prioritySubscreen) {
        if (w.MouseIn(1815, 75, 90, 90)) {
          prioritySubscreenExit();
        } else if (w.MouseIn(900, 280, 90, 90)) {
          switch (priorityField) {
            case FIELDS.Priority:
              updateItemPriorityFromLayerPriorityInput(focusItem);
              break;
            case FIELDS.Difficulty:
              {
                const newDifficulty = parseInt(w.ElementValue(layerPriority));
                let action = null;
                if (focusItem.Difficulty > newDifficulty) {
                  action = "loosens";
                } else if (focusItem.Difficulty < newDifficulty) {
                  action = "tightens";
                }
                focusItem.Difficulty = newDifficulty;
                if (action !== null) {
                  w.bceSendAction(
                    `${w.Player.Name} ${action} ${C.Name}'s ${focusItem.Asset.Description}.`
                  );
                }
              }
              break;
            default:
              break;
          }
          bceLog("updated item", focusItem);
          w.CharacterRefresh(C, false, false);
          w.ChatRoomCharacterItemUpdate(C, C.FocusGroup?.Name);
          prioritySubscreenExit();
        }
      } else {
        if (assetWorn(C, focusItem) && w.MouseIn(10, 890, 52, 52)) {
          prioritySubscreenEnter(C, focusItem, FIELDS.Difficulty);
          return;
        } else if (assetVisible(C, focusItem) && w.MouseIn(10, 948, 52, 52)) {
          prioritySubscreenEnter(C, focusItem, FIELDS.Priority);
          return;
        }
        bcDialogClick();
      }
    };
  }

  function cacheClearer() {
    /** @type {number} */
    let automatedCacheClearer = null;
    const cacheClearInterval = 1 * 60 * 60 * 1000;

    w.bceClearCaches = async function () {
      const start = Date.now();
      if (
        !(await waitFor(
          // Only clear when in chat room and not inspecting a character
          () => w.CurrentScreen === "ChatRoom" && !w.CurrentCharacter,
          () => Date.now() - start > cacheClearInterval
        ))
      ) {
        return;
      }
      if (!bceSettings.automateCacheClear) {
        bceLog("Cache clearing disabled");
        clearInterval(automatedCacheClearer);
        return;
      }

      bceLog("Clearing caches");
      if (w.GLDrawCanvas.GL.textureCache) {
        w.GLDrawCanvas.GL.textureCache.clear();
      }
      w.GLDrawResetCanvas();
    };

    if (!automatedCacheClearer && bceSettings.automateCacheClear) {
      automatedCacheClearer = setInterval(w.bceClearCaches, cacheClearInterval);
    }
  }

  function chatRoomOverlay() {
    const bcChatRoomDrawCharacterOverlay = w.ChatRoomDrawCharacterOverlay;
    w.ChatRoomDrawCharacterOverlay = function (C, CharX, CharY, Zoom, Pos) {
      bcChatRoomDrawCharacterOverlay(C, CharX, CharY, Zoom, Pos);
      if (C.BCE && w.ChatRoomHideIconState === 0) {
        w.DrawImageResize(
          ICONS.USER,
          CharX + 275 * Zoom,
          CharY,
          50 * Zoom,
          50 * Zoom
        );
        w.DrawTextFit(
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

  /** @type {(target: number, requestReply?: boolean) => void} */
  function sendHello(target = null, requestReply = false) {
    /** @type {BCEChatMessage} */
    const message = {
      Type: HIDDEN,
      Content: BCE_MSG,
      Sender: w.Player.MemberNumber,
      Dictionary: {
        message: {
          type: MESSAGE_TYPES.Hello,
          version: w.BCE_VERSION,
          alternateArousal: bceSettings.alternateArousal,
          replyRequested: requestReply,
        },
      },
    };
    if (target) {
      message.Target = target;
    }
    w.ServerSend("ChatRoomChat", message);
  }
  if (w.ServerIsConnected) {
    sendHello(null, true);
  }

  async function hiddenMessageHandler() {
    await waitFor(() => w.ServerSocket && w.ServerIsConnected);

    w.ServerSocket.on(
      "ChatRoomMessage",
      (
        /** @type {BCEChatMessage} */
        data
      ) => {
        if (data.Type !== HIDDEN) {
          return;
        }
        if (data.Content === "BCEMsg") {
          const sender = w.Character.find(
            (a) => a.MemberNumber === data.Sender
          );
          if (!sender) {
            return;
          }
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
            default:
              break;
          }
        }
      }
    );

    w.ServerSocket.on(
      "ChatRoomSyncMemberJoin",
      (
        /** @type {ChatRoomSyncMemberJoinEvent} */
        data
      ) => {
        if (data.MemberNumber !== w.Player.MemberNumber) {
          sendHello(data.MemberNumber);
        }
      }
    );

    w.ServerSocket.on("ChatRoomSync", () => {
      sendHello();
    });
  }

  async function privateWardrobe() {
    await waitFor(() => !!w.Player);

    let inCustomWardrobe = false,
      /** @type {Character} */
      targetCharacter = null;
    const bcCharacterAppearanceWardrobeLoad = w.CharacterAppearanceWardrobeLoad;
    w.CharacterAppearanceWardrobeLoad = function (C) {
      if (bceSettings.privateWardrobe && w.CurrentScreen === "Appearance") {
        w.WardrobeBackground = w.ChatRoomData.Background;
        inCustomWardrobe = true;
        targetCharacter = C;
        w.TextLoad("Wardrobe");
        w.WardrobeLoad();
        // Ensure all previews load by refreshing their rendering
        w.WardrobeCharacter.forEach((a) => w.CharacterRefresh(a, false, false));
      } else {
        bcCharacterAppearanceWardrobeLoad(C);
      }
    };

    const bcAppearanceRun = w.AppearanceRun;
    w.AppearanceRun = function () {
      if (inCustomWardrobe) {
        const player = w.Player;
        // Replace Player with target character in rendering
        w.Player = targetCharacter;
        w.WardrobeRun();
        w.Player = player;
      } else {
        bcAppearanceRun();
      }
    };

    const bcAppearanceClick = w.AppearanceClick;
    w.AppearanceClick = function () {
      if (inCustomWardrobe) {
        w.WardrobeClick();
      } else {
        bcAppearanceClick();
      }
    };

    const bcWardrobeExit = w.WardrobeExit;
    w.WardrobeExit = function () {
      if (!inCustomWardrobe) {
        bcWardrobeExit();
      } else {
        inCustomWardrobe = false;
        w.WardrobeBackground = "Private";
        w.TextLoad();
      }
    };

    const bcWardrobeFastLoad = w.WardrobeFastLoad;
    w.WardrobeFastLoad = function (C, W, Update) {
      if (inCustomWardrobe && C.IsPlayer()) {
        bcWardrobeFastLoad(targetCharacter, W, false);
      } else {
        bcWardrobeFastLoad(C, W, Update);
      }
    };

    const bcWardrobeFastSave = w.WardrobeFastSave;
    w.WardrobeFastSave = function (C, W, Push) {
      if (inCustomWardrobe && C.IsPlayer()) {
        bcWardrobeFastSave(targetCharacter, W, Push);
      } else {
        bcWardrobeFastSave(C, W, Push);
      }
    };
  }

  async function antiGarbling() {
    await waitFor(() => !!w.SpeechGarbleByGagLevel);

    const bcSpeechGarbleByGagLevel = w.SpeechGarbleByGagLevel;
    w.SpeechGarbleByGagLevel = function (GagEffect, CD, IgnoreOOC) {
      const garbled = bcSpeechGarbleByGagLevel(
        GagEffect,
        CD,
        IgnoreOOC
      ).replace(GAGBYPASSINDICATOR, "");
      if (CD?.trim().endsWith(GAGBYPASSINDICATOR)) {
        return CD.replace(/[\uE000-\uF8FF]/gu, "");
      } else if (bceSettings.gagspeak) {
        return garbled.toLowerCase() === CD?.toLowerCase()
          ? garbled
          : `${garbled} (${CD})`;
      }
      return garbled;
    };

    const bcServerSend = w.ServerSend;
    w.ServerSend = function (
      message,
      /** @type {ChatMessage} */
      data
    ) {
      if (message === "ChatRoomChat" && data.Type === "Chat") {
        const gagLevel = w.SpeechGetTotalGagLevel(w.Player);
        if (gagLevel > 0) {
          if (bceSettings.antiAntiGarble) {
            data.Content =
              bcSpeechGarbleByGagLevel(1, data.Content) + GAGBYPASSINDICATOR;
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
              bcSpeechGarbleByGagLevel(gagLevel, data.Content) +
              GAGBYPASSINDICATOR;
          }
        }
      }
      bcServerSend(message, data);
    };

    const bcChatRoomResize = w.ChatRoomResize;
    w.ChatRoomResize = function (load) {
      bcChatRoomResize(load);
      if (
        bceSettings.showQuickAntiGarble &&
        w.CharacterGetCurrent() === null &&
        w.CurrentScreen === "ChatRoom" &&
        document.getElementById("InputChat")
      ) {
        w.ElementPosition("InputChat", 1356, 950, 700, 82);
      }
    };

    // X, Y, width, height. X and Y centered.
    const gagAntiCheatMenuPosition = [1700, 908, 200, 45],
      gagCheatMenuPosition = [1700, 908 + 45, 200, 45],
      tooltipPosition = { X: 1000, Y: 910, Width: 200, Height: 90 };

    const bcChatRoomRun = w.ChatRoomRun;
    w.ChatRoomRun = function () {
      bcChatRoomRun();
      if (!bceSettings.showQuickAntiGarble) {
        return;
      }
      const shorttip = "Gagging: ",
        tooltip = "Antigarble anti-cheat strength: ";

      let color = "white",
        label = "None";

      const disableBoth = () => `${tooltip}None`,
        enableLimited = () => `${tooltip}Limited`,
        enableStrong = () => `${tooltip}Full`,
        // eslint-disable-next-line sort-vars
        enableExtra = () => `${tooltip}Extra`;

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
      w.DrawBackNextButton.apply(null, [
        ...gagAntiCheatMenuPosition,
        shorttip + label,
        color,
        "",
        previous,
        next,
        // eslint-disable-next-line no-undefined
        undefined,
        // eslint-disable-next-line no-undefined
        undefined,
        tooltipPosition,
      ]);

      const gagCheatMenuParams = bceSettings.gagspeak
        ? [
            "Understand: Yes",
            "green",
            "",
            () => "Understand gagspeak: No",
            () => "Understand gagspeak: No",
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
            () => "Understand gagspeak: Yes",
            () => "Understand gagspeak: Yes",
            // eslint-disable-next-line no-undefined
            undefined,
            // eslint-disable-next-line no-undefined
            undefined,
            tooltipPosition,
          ];
      w.DrawBackNextButton.apply(null, [
        ...gagCheatMenuPosition,
        ...gagCheatMenuParams,
      ]);
    };

    const bcChatRoomClick = w.ChatRoomClick;
    w.ChatRoomClick = function () {
      if (bceSettings.showQuickAntiGarble) {
        if (w.MouseIn.apply(null, [...gagAntiCheatMenuPosition])) {
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
            w.MouseX <
            gagAntiCheatMenuPosition[0] + gagAntiCheatMenuPosition[2] / 2
          ) {
            previous();
            bceSaveSettings();
          } else {
            next();
            bceSaveSettings();
          }
        } else if (w.MouseIn.apply(null, [...gagCheatMenuPosition])) {
          bceSettings.gagspeak = !bceSettings.gagspeak;
          defaultSettings.gagspeak.sideEffects(bceSettings.gagspeak);
          bceSaveSettings();
        }
      }
      bcChatRoomClick();
    };

    eval(
      `DrawBackNextButton = ${w.DrawBackNextButton.toString()
        .replace(
          "Disabled, ArrowWidth",
          "Disabled, ArrowWidth, tooltipPosition"
        )
        .replace(
          "DrawButtonHover(Left, Top, Width, Height,",
          "DrawButtonHover(tooltipPosition?.X || Left, tooltipPosition?.Y || Top, tooltipPosition?.Width || Width, tooltipPosition?.Height || Height,"
        )}`
    );

    if (w.CurrentScreen === "ChatRoom") {
      w.CurrentScreenFunctions.Run = w.ChatRoomRun;
      w.CurrentScreenFunctions.Click = w.ChatRoomClick;
      w.CurrentScreenFunctions.Resize = w.ChatRoomResize;
      w.ChatRoomResize(false);
    }
  }

  async function alternateArousal() {
    await waitFor(() => !!w.ServerSocket && w.ServerIsConnected);
    w.Player.BCEArousalProgress = Math.min(
      BCE_MAX_AROUSAL,
      w.Player.ArousalSettings.Progress
    );
    w.Player.BCEEnjoyment = 1;
    let lastSync = 0;
    const enjoymentMultiplier = 0.2;

    w.ServerSocket.on(
      "ChatRoomSyncArousal",
      (
        /** @type {{ MemberNumber: number; Progress: number; }} */
        data
      ) => {
        if (data.MemberNumber === w.Player.MemberNumber) {
          // Skip player's own sync messages since we're tracking locally
          return;
        }
        const target = w.ChatRoomCharacter.find(
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

    eval(
      `ActivitySetArousalTimer = ${w.ActivitySetArousalTimer.toString()
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
        .replace(/\b25\b/gu, "20")}`
    );

    const bcActivityChatRoomArousalSync = w.ActivityChatRoomArousalSync;
    w.ActivityChatRoomArousalSync = function (C) {
      if (C.IsPlayer() && w.CurrentScreen === "ChatRoom") {
        const message = {
          Type: HIDDEN,
          Content: BCE_MSG,
          Dictionary: {
            message: {
              type: MESSAGE_TYPES.ArousalSync,
              version: w.BCE_VERSION,
              alternateArousal: bceSettings.alternateArousal,
              progress: C.BCEArousalProgress,
              enjoyment: C.BCEEnjoyment,
            },
          },
        };
        w.ServerSend("ChatRoomChat", message);
      }
      bcActivityChatRoomArousalSync(C);
    };

    const bcActivitySetArousal = w.ActivitySetArousal;
    w.ActivitySetArousal = function (C, Progress) {
      bcActivitySetArousal(C, Progress);
      if (Math.abs(C.BCEArousalProgress - Progress) > 3) {
        C.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, Progress);
      }
    };

    const bcActivitySetArousalTimer = w.ActivitySetArousalTimer;
    w.ActivitySetArousalTimer = function (C, A, Z, Factor) {
      C.BCEEnjoyment =
        1 + (Factor > 1 ? Math.round(1.5 * Math.log(Factor)) : 0);
      bcActivitySetArousalTimer(C, A, Z, Factor);
    };

    const bcActivityTimerProgress = w.ActivityTimerProgress;
    w.ActivityTimerProgress = function (C, progress) {
      if (!C.BCEArousalProgress) {
        C.BCEArousalProgress = 0;
      }
      C.BCEArousalProgress +=
        progress * (progress > 0 ? C.BCEEnjoyment * enjoymentMultiplier : 1);
      C.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, C.BCEArousalProgress);
      if (C.BCEArousal) {
        C.ArousalSettings.Progress = Math.round(C.BCEArousalProgress);
        bcActivityTimerProgress(C, 0);
        if (C.IsPlayer() && Date.now() - lastSync > 2100) {
          lastSync = Date.now();
          w.ActivityChatRoomArousalSync(C);
        }
      } else {
        bcActivityTimerProgress(C, progress);
      }
    };

    eval(
      `TimerProcess = ${w.TimerProcess.toString()
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
          /if\s*\(\(Factor\s*==\s*-1\)\)\s*\{\s*ActivityVibratorLevel\(Character\[C\],\s*0\);\s*\}\s*\}/u,
          `if (Factor == -1) {
        ActivityVibratorLevel(Character[C], 0);
      }
    }
  } else {
    ActivityVibratorLevel(Character[C], 0);
  }`
        )
        .replace(
          /if\s*\(Factor\s*<\s*0\)\s*ActivityTimerProgress\(Character\[C\],\s*-1\);/u,
          `
            Character[C].BCEEnjoyment = 1;
            if (Factor < 0) ActivityTimerProgress(Character[C], -1);
            `
        )}`
    );
  }

  async function autoGhostBroadcast() {
    await waitFor(() => !!w.ServerSocket && w.ServerIsConnected);
    w.ServerSocket.on(
      "ChatRoomSyncMemberJoin",
      (
        /** @type {ChatRoomSyncMemberJoinEvent} */
        data
      ) => {
        if (
          bceSettings.ghostNewUsers &&
          Date.now() - data.Character.Creation < 30000
        ) {
          w.ChatRoomListManipulation(
            w.Player.BlackList,
            true,
            data.Character.MemberNumber
          );
          w.ChatRoomListManipulation(
            w.Player.GhostList,
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
    await waitFor(() => !!w.Player && !!w.Player.Appearance);

    setInterval(() => {
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
        hasGlasses = !!w.Player.Appearance.find((a) =>
          glasses.includes(a.Asset.Name)
        );
      if (
        hasGlasses &&
        GLASSES_BLUR_TARGET.classList.contains(GLASSES_BLIND_CLASS)
      ) {
        GLASSES_BLUR_TARGET.classList.remove(GLASSES_BLIND_CLASS);
        bceChatNotify("Having recovered your glasses you can see again!");
      } else if (
        !hasGlasses &&
        !GLASSES_BLUR_TARGET.classList.contains(GLASSES_BLIND_CLASS)
      ) {
        GLASSES_BLUR_TARGET.classList.add(GLASSES_BLIND_CLASS);
        bceChatNotify("Having lost your glasses your eyesight is impaired!");
      }
    }, 1000);
  }

  async function friendPresenceNotifications() {
    await waitFor(() => !!w.Player && w.ServerSocket && w.ServerIsConnected);

    function checkFriends() {
      if (!bceSettings.friendPresenceNotifications) {
        return;
      }
      w.ServerSend("AccountQuery", { Query: "OnlineFriends" });
    }
    setInterval(checkFriends, 20000);

    /** @type {Friend[]} */
    let lastFriends = [];
    w.ServerSocket.on(
      "AccountQueryResult",
      (
        /** @type {{ Query: string; Result: Friend[] }} */
        data
      ) => {
        if (
          w.CurrentScreen === "FriendList" ||
          w.CurrentScreen === "Relog" ||
          w.CurrentScreen === "Login"
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
          bceNotify(
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
        if (bceSettings.friendOfflineNotifications && offlineFriends.length) {
          bceNotify(
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
      }
    );

    const bcServerClickBeep = w.ServerClickBeep;
    w.ServerClickBeep = function () {
      if (
        w.ServerBeep.Timer > Date.now() &&
        w.MouseIn(w.CurrentScreen === "ChatRoom" ? 0 : 500, 0, 1000, 50) &&
        w.CurrentScreen !== "FriendList"
      ) {
        switch (w.ServerBeep.ClickAction) {
          case BEEP_CLICK_ACTIONS.FriendList:
            w.ServerOpenFriendList();
            return;
          default:
            break;
        }
      }
      bcServerClickBeep();
    };
  }

  async function logCharacterUpdates() {
    await waitFor(() => w.ServerSocket && w.ServerIsConnected);

    w.ServerSocket.on(
      "ChatRoomSyncSingle",
      (
        /** @type {ChatRoomSyncSingleEvent} */
        data
      ) => {
        if (data?.Character?.MemberNumber !== w.Player.MemberNumber) {
          return;
        }
        bceLog("Player appearance updated by", data.SourceMemberNumber);
      }
    );

    w.ServerSocket.on(
      "ChatRoomSyncItem",
      (
        /** @type {ChatRoomSyncItemEvent} */
        data
      ) => {
        if (data?.Item?.Target !== w.Player.MemberNumber) {
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

  /** @type {() => boolean} */
  function detectBcUtil() {
    return typeof w.StartBcUtil === "function";
  }

  /** @type {(ms: number) => Promise<void>} */
  function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * @type {(s: string) => number}
   */
  // eslint-disable-next-line
  // prettier-ignore
  function cyrb53(str, seed = 0) {
    // Bryc https://stackoverflow.com/a/52171480/1780502
    // eslint-disable-next-line
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed; str = str.replace(/\r/gu, '');
    // eslint-disable-next-line
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
    // eslint-disable-next-line
        h1 = Math.imul(h1 ^ ch, 2654435761);
    // eslint-disable-next-line
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    // eslint-disable-next-line
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    // eslint-disable-next-line
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    // eslint-disable-next-line
    return 4294967296 * (2097151 & h2) + (h1>>>0);
  }

  // Confirm leaving the page to prevent accidental back button, refresh, or other navigation-related disruptions
  w.addEventListener(
    "beforeunload",
    (e) => {
      if (bceSettings.confirmLeave) {
        e.preventDefault();
        // The connection is closed, this call gets you relogin immediately
        w.ServerSocket.io.disconnect();
        w.ServerSocket.io.connect();
        return (e.returnValue = "Are you sure you want to leave the club?");
      }
      return null;
    },
    {
      capture: true,
    }
  );
})();

// JSDOC

/**
 * Original settings
 * @typedef {"ServerAccountBeep" | "WardrobeFixLength"} OriginalFunction
 */

/**
 * @typedef {Object} OriginalFunctions
 * @property {(data: Object) => void} [ServerAccountBeep]
 * @property {() => void} [WardrobeFixLength]
 */

/**
 * @typedef {{ [key: string]: string }} Passwords
 */

/**
 * @typedef {{ [key: string]: boolean } & { version?: number }} Settings
 */

/**
 * @typedef {Object} DefaultSetting
 * @property {string} label
 * @property {boolean} value
 * @property {(newValue: boolean) => void} sideEffects
 */

/**
 * @name SideEffect
 * @param {boolean} newValue
 * @returns {void}
 */

/**
 * @typedef {Readonly<{ [ key: string ]: DefaultSetting }>} DefaultSettings
 */

/**
 * @typedef {Object} Duration
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 */

/**
 * @typedef {Object} ArousalSettings
 * @property {number} Progress
 * @property {number} OrgasmCount
 * @property {number} OrgasmStage
 * @property {boolean} AffectExpression
 */

/**
 * @typedef {Object} OnlineSettings
 * @property {string} BCE
 */

/**
 * @typedef {Object} OnlineSharedSettings
 * @property {string} GameVersion
 */

/**
 * @typedef {Object} Character
 * @property {ArousalSettings} ArousalSettings
 * @property {OnlineSettings} OnlineSettings
 * @property {OnlineSharedSettings} [OnlineSharedSettings]
 * @property {number} MemberNumber
 * @property {string} Name
 * @property {string} AccountName
 * @property {number} Creation
 * @property {Item[]} Appearance
 * @property {ItemLayer[]} AppearanceLayers
 * @property {AssetGroup} [FocusGroup]
 * @property {string[] | null} ActivePose
 * @property {string} BCE
 * @property {boolean} BCEArousal
 * @property {number} BCEArousalProgress
 * @property {number} BCEEnjoyment
 * @property {() => boolean} IsPlayer
 * @property {() => boolean} CanChange
 * @property {number[]} BlackList
 * @property {number[]} GhostList
 * @property {number[]} FriendList
 * @property {Map<number, string>} FriendNames
 */

/**
 * @typedef {Object} Beep
 * @property {string} [Message]
 * @property {boolean} [Private]
 * @property {Date} [Time]
 * @property {boolean} [IsSecret]
 * @property {string} [BeepType]
 * @property {number} MemberNumber
 * @property {string} [MemberName]
 * @property {string} [ChatRoomName]
 * @property {boolean} [Sent]
 */

/**
 * @typedef {Object} AccountUpdater
 * @property {(data: Partial<Character>, force?: boolean) => void} QueueData
 */

/**
 * @typedef {Object} LZString
 * @property {(data: string) => string} compressToBase64
 * @property {(data: string) => string} decompressFromBase64
 */

/**
 * @typedef {Object} ServerBeep
 * @property {number} Timer
 * @property {number} [MemberNumber]
 * @property {string} Message
 * @property {string} [ChatRoomName]
 * @property {boolean} [IsMail]
 * @property {"FriendList"} [ClickAction]
 */

/**
 * @typedef {Object} ItemProperty
 * @property {number} [RemoveTimer]
 * @property {boolean} [ShowTimer]
 * @property {number} [Intensity]
 * @property {string} [Expression]
 * @property {number} [OverridePriority]
 * @property {number} [LockMemberNumber]
 */

/**
 * @typedef {Object} AssetGroup
 * @property {string} Name
 * @property {string} Description
 * @property {"Appearance" | "Item"} Category
 * @property {boolean} AllowNone
 * @property {boolean} BodyCosplay
 * @property {boolean} Clothing
 */

/**
 * @typedef {Object} Asset
 * @property {string} Name
 * @property {AssetGroup} Group
 * @property {string} [Description]
 * @property {string} Color
 * @property {number} [MaxTimer]
 */

/**
 * @typedef {Item & { Priority?: number }} ItemLayer
 */

/**
 * @typedef {Object} Item
 * @property {Asset} Asset
 * @property {number} [Difficulty]
 * @property {string | string[]} [Color]
 * @property {ItemProperty} [Property]
 */

/**
 * @typedef {Object} ItemBundle
 * @property {string} Group
 * @property {string} Name
 * @property {number} [Difficulty]
 * @property {string | string[]} [Color]
 * @property {ItemProperty} [Property]
 */

/**
 * @typedef {Object} ScreenFunctions
 * @property {(time: number) => void} Run
 * @property {(event: MouseEvent | TouchEvent) => void} Click
 * @property {(load: boolean) => void} [Resize]
 */

/**
 * @typedef {Object} ArousalExpressionStage
 * @property {string | null} Expression
 * @property {number} Limit
 */

/**
 * @typedef {{[key: string]: ArousalExpressionStage[]}} ArousalExpressionStages
 */

/**
 * @typedef {Object} ClubPose
 * @property {string} Name
 * @property {string} [Category]
 * @property {boolean} [AllowMenu]
 */

/**
 * @typedef {Object} ExpressionStage
 * @property {number} [Id]
 * @property {string | null} [Expression]
 * @property {number} [ExpressionModifier]
 * @property {number} Duration
 * @property {number} [Priority]
 * @property {boolean} [Skip]
 * @property {string} [Color]
 * @property {boolean} [Applied]
 */

/**
 * @typedef {{[key: string]: ExpressionStage[]}} ExpressionStages
 */

/**
 * @typedef {Object} Pose
 * @property {number} [Id]
 * @property {string[] | PoseEx[]} Pose
 * @property {number} Duration
 * @property {number} [Priority]
 */

/**
 * @typedef {Object} PoseEx
 * @property {string} Pose
 * @property {string} [Category]
 */

/**
 * @typedef {Object} Expression
 * @property {string} Type
 * @property {number} Duration
 * @property {number} [Priority]
 * @property {ExpressionStages} [Expression]
 * @property {Pose[]} [Poses]
 */

/**
 * @typedef {Object} EventParams
 * @property {number} [At]
 * @property {number} [Until]
 * @property {number} [Id]
 *
 * @typedef {Expression & EventParams} ExpressionEvent
 */

/**
 * @typedef {Object} ActivityTriggerMatcher
 * @property {RegExp} Tester
 * @property {{ TargetIsPlayer?: boolean; SenderIsPlayer?: boolean; DictionaryMatchers?: { [key: string]: string }[] }} [Criteria]
 */

/**
 * @typedef {Object} ActivityTrigger
 * @property {string} Event
 * @property {string} Type
 * @property {ActivityTriggerMatcher[]} Matchers
 */

/**
 * @typedef {Object} ServerSocket
 * @property {(event: "connect" | "disconnect" | "ServerInfo" | "CreationResponse" | "LoginResponse" | "LoginQueue" | "ForceDisconnect" | "ChatRoomSearchResult" | "ChatRoomSearchResponse" | "ChatRoomCreateResponse" | "ChatRoomUpdateResponse" | "ChatRoomSync" | "ChatRoomSyncMemberJoin" | "ChatRoomSyncMemberLeave" | "ChatRoomSyncRoomProperties" | "ChatRoomSyncCharacter" | "ChatRoomSyncSwapPlayers" | "ChatRoomSyncMovePlayer" | "ChatRoomSyncReorderPlayers" | "ChatRoomSyncSingle" | "ChatRoomSyncExpression" | "ChatRoomSyncPose" | "ChatRoomSyncArousal" | "ChatRoomSyncItem" | "ChatRoomMessage" | "ChatRoomAllowItem" | "ChatRoomGameResponse" | "PasswordResetResponse" | "AccountQueryResult" | "AccountBeep" | "AccountOwnership" | "AccountLovership", data: any) => void} on
 * @property {{ connect: () => void; disconnect: () => void }} io
 */

/**
 * @typedef {Object} Command
 * @property {string} Tag
 * @property {string} [Description]
 * @property {string} [Reference]
 * @property {(args: string, msg: string, parsed: string[]) => void} [Action]
 * @property {() => boolean} [Prerequisite]
 * @property {(parsed: string[], low: string, msg: string) => void} [AutoComplete]
 * @property {false} [Clear]
 */

/**
 * @typedef {Object} Position
 * @property {number} X
 * @property {number} Y
 * @property {number} Width
 * @property {number} Height
 */

/**
 * @typedef {{ MemberName: string; MemberNumber: number }} Friend
 */

/**
 * @typedef {Object} BCEMessage
 * @property {string} type
 * @property {string} version
 * @property {boolean} [alternateArousal]
 * @property {boolean} [replyRequested]
 * @property {number} [progress]
 * @property {number} [enjoyment]
 *
 * @typedef {Object} ChatMessageDictionary
 * @property {string} [Tag]
 * @property {BCEMessage} [message]
 * @property {number} [MemberNumber]
 *
 * @typedef {Object} ChatMessageBase
 * @property {string} Type
 * @property {string} Content
 * @property {number} Sender
 * @property {number} [Target]
 *
 * @typedef {ChatMessageBase & { Dictionary?: ChatMessageDictionary[] }} ChatMessage
 * @typedef {ChatMessageBase & { Dictionary?: { message: BCEMessage } }} BCEChatMessage
 */

/**
 * @typedef {Object} ChatRoomSyncMemberJoinEvent
 * @property {number} MemberNumber
 * @property {Character} Character
 *
 * @typedef {Object} ChatRoomSyncSingleEvent
 * @property {Character} [Character]
 * @property {number} SourceMemberNumber
 *
 * @typedef {Object} ChatRoomSyncItemEvent
 * @property {{ Name: string; Target: number; Group: string; }} Item
 * @property {number} Source
 */

/**
 * @typedef {Object} WindowExtension
 * @property {string} BCE_VERSION
 * @property {(text: string) => void} bceSendAction
 * @property {(key: string) => boolean | number} bceSettingValue
 * @property {() => void} bce_initializeDefaultExpression
 * @property {() => void} bceUpdatePasswordForReconnect
 * @property {(msg: string) => string} bceMessageReplacements
 * @property {number} bceCustomArousalTimer
 * @property {{[key: string]: Expression}} bce_EventExpressions
 * @property {(name: string) => void} bceClearPassword
 * @property {() => Promise<void>} bceClearCaches
 * @property {ArousalExpressionStages} bce_ArousalExpressionStages
 * @property {ActivityTrigger[]} bce_ActivityTriggers
 * @property {string[][]} ActivityDictionary
 * @property {(C: Character) => void} DialogDrawActivityMenu
 * @property {(msg: string) => void} CommandParse
 * @property {Character} Player
 * @property {number} WardrobeSize
 * @property {AccountUpdater} ServerAccountUpdate
 * @property {() => string} ChatRoomCurrentTime
 * @property {LZString} LZString
 * @property {(element: string) => boolean} ElementIsScrolledToEnd
 * @property {(element: string) => void} ElementScrollToEnd
 * @property {ServerBeep} ServerBeep
 * @property {(event: string, data: Object) => void} ServerSend
 * @property {string} GameVersion
 * @property {() => void} InventoryItemMiscLoversTimerPadlockDraw
 * @property {() => void} InventoryItemMiscLoversTimerPadlockClick
 * @property {() => void} InventoryItemMiscLoversTimerPadlockExit
 * @property {() => void} InventoryItemMiscLoversTimerPadlockLoad
 * @property {() => void} InventoryItemMiscMistressTimerPadlockDraw
 * @property {() => void} InventoryItemMiscMistressTimerPadlockClick
 * @property {() => void} InventoryItemMiscMistressTimerPadlockExit
 * @property {() => void} InventoryItemMiscMistressTimerPadlockLoad
 * @property {() => void} InventoryItemMiscOwnerTimerPadlockDraw
 * @property {() => void} InventoryItemMiscOwnerTimerPadlockClick
 * @property {() => void} InventoryItemMiscOwnerTimerPadlockExit
 * @property {() => void} InventoryItemMiscOwnerTimerPadlockLoad
 * @property {() => void} InventoryItemMiscTimerPasswordPadlockDraw
 * @property {() => void} InventoryItemMiscTimerPasswordPadlockClick
 * @property {() => void} InventoryItemMiscTimerPasswordPadlockExit
 * @property {() => void} InventoryItemMiscTimerPasswordPadlockLoad
 * @property {Item | null} DialogFocusSourceItem
 * @property {Item | null} DialogFocusItem
 * @property {(id: string, type: string, value: string, maxlength: string) => HTMLInputElement} ElementCreateInput
 * @property {(id: string, x: number, y: number, w: number, h?: number) => void} ElementPosition
 * @property {(id: string) => void} ElementRemove
 * @property {(id: string, newValue?: string) => string} ElementValue
 * @property {string} CurrentScreen
 * @property {(C: Character, group: string) => void} ChatRoomCharacterItemUpdate
 * @property {(C: Character) => void} ChatRoomCharacterUpdate
 * @property {() => void} ChatRoomCreateElement
 * @property {() => Character} CharacterGetCurrent
 * @property {Character[]} ChatRoomCharacter
 * @property {Character[]} Character
 * @property {number} ChatRoomTargetMemberNumber
 * @property {{ getCharacterVersion: (memberNumber: number) => string }} [bcx]
 * @property {string[]} PreferenceSubscreenList
 * @property {string} PreferenceSubscreen
 * @property {string} PreferenceMessage
 * @property {HTMLCanvasElement} MainCanvas
 * @property {(text: string, x: number, y: number, color: string, backColor?: string) => void} DrawText
 * @property {(text: string, x: number, y: number, w: number, color: string, backColor?: string) => void} DrawTextFit
 * @property {(x: number, y: number, w: number, h: number, label: string, color: string, image?: string, hoveringText?: string, disabled?: boolean) => void} DrawButton
 * @property {(x: number, y: number, w: number, h: number, text: string, isChecked: boolean, disabled?: boolean, textColor?: string, checkImage?: string) => void} DrawCheckbox
 * @property {(image: string, x: number, y: number, w: number, h: number) => boolean} DrawImageResize
 * @property {(x: number, y: number, w: number, h: number) => boolean} MouseIn
 * @property {(id?: string) => void} TextLoad
 * @property {(id: string) => string} TextGet
 * @property {(C: Character) => void} StruggleDrawLockpickProgress
 * @property {number[]} StruggleLockPickOrder
 * @property {(skillType: string) => number} SkillGetWithRatio
 * @property {() => void} LoginRun
 * @property {() => void} LoginClick
 * @property {ScreenFunctions} CurrentScreenFunctions
 * @property {boolean} ServerIsConnected
 * @property {boolean} LoginSubmitted
 * @property {() => void} LoginSetSubmitted
 * @property {() => void} ServerConnect
 * @property {(data: Object, close?: boolean) => void} ServerDisconnect
 * @property {ClubPose[]} PoseFemale3DCG
 * @property {ServerSocket} ServerSocket
 * @property {Command[]} Commands
 * @property {(C: Character, newPose: string | string[], force: boolean) => void} CharacterSetActivePose
 * @property {(C: Character, assetGroup: string, expression: string, timer?: number, color?: string | string[]) => void} CharacterSetFacialExpression
 * @property {(color: string | string[]) => boolean} CommonColorIsValid
 * @property {(C: Character) => void} ActivityChatRoomArousalSync
 * @property {(appearance: Item[]) => ItemBundle[]} ServerAppearanceBundle
 * @property {(C: Character, assetFamily: string, bundle: ItemBundle[], sourceMemberNumber?: number, appearanceFull?: boolean) => boolean} ServerAppearanceLoadFromBundle
 * @property {(C: Character, push?: boolean, refreshDialog?: boolean) => void} CharacterRefresh
 * @property {() => void} AppearanceExit
 * @property {() => void} AppearanceLoad
 * @property {() => void} AppearanceRun
 * @property {() => void} AppearanceClick
 * @property {string} CharacterAppearanceMode
 * @property {Character} CharacterAppearanceSelection
 * @property {(C: Character) => void} DialogDrawItemMenu
 * @property {(C: Character, groupName: string) => Item | null} InventoryGet
 * @property {() => void} DialogDraw
 * @property {() => void} DialogClick
 * @property {Character} CurrentCharacter
 * @property {HTMLCanvasElement & { GL: { textureCache: Map } }} GLDrawCanvas
 * @property {() => void} GLDrawResetCanvas
 * @property {() => void} WardrobeFixLength
 * @property {(C: Character, charX: number, charY: number, zoom: number, pos: number) => void} ChatRoomDrawCharacterOverlay
 * @property {number} ChatRoomHideIconState
 * @property {(C: Character) => void} CharacterAppearanceWardrobeLoad
 * @property {() => void} AppearanceRun
 * @property {{ Background: string }} ChatRoomData
 * @property {string} WardrobeBackground
 * @property {() => void} WardrobeLoad
 * @property {() => void} WardrobeRun
 * @property {() => void} WardrobeClick
 * @property {() => void} WardrobeExit
 * @property {() => void} AppearanceClick
 * @property {Character[]} WardrobeCharacter
 * @property {(C: Character, position: number, update?: boolean) => void} WardrobeFastLoad
 * @property {(C: Character, position: number, update?: boolean) => void} WardrobeFastSave
 * @property {(level: number, dialogText: string, ignoreOOC?: boolean) => string} SpeechGarbleByGagLevel
 * @property {(C: Character) => number} SpeechGetTotalGagLevel
 * @property {(load: boolean) => void} ChatRoomResize
 * @property {() => void} ChatRoomRun
 * @property {() => void} ChatRoomClick
 * @property {(x: number, y: number, w: number, h: number, label: string, color: string, image?: string, labelPrevious?: () => string, labelNext?: () => string, disabled?: boolean, arrowWidth?: number, tooltipPosition?: Position) => void} DrawBackNextButton
 * @property {number} MouseX
 * @property {number} MouseY
 * @property {(C: Character) => void} ActivityChatRoomArousalSync
 * @property {(C: Character, progress: number) => void} ActivitySetArousal
 * @property {(C: Character, activity: Object, zone: string, progress: number) => void} ActivitySetArousalTimer
 * @property {(C: Character, progress: number) => void} ActivityTimerProgress
 * @property {(timestamp: number) => void} TimerProcess
 * @property {(list: number[] | null, adding: boolean, memberNumber: string | number) => void} ChatRoomListManipulation
 * @property {() => void} ServerOpenFriendList
 * @property {(data: Object) => void} ServerAccountBeep
 * @property {() => void} ServerClickBeep
 * @property {boolean} BCX_Loaded
 * @property {string} BCX_SOURCE
 * @property {() => void} [StartBcUtil]
 * @property {() => void} PreferenceSubscreenBCESettingsLoad
 * @property {() => void} PreferenceSubscreenBCESettingsExit
 * @property {() => void} PreferenceSubscreenBCESettingsRun
 * @property {() => void} PreferenceSubscreenBCESettingsClick
 * @property {() => boolean} OnlineGameAllowChange
 * @property {HTMLTextAreaElement} [InputChat]
 * @property {(event: KeyboardEvent) => void} ChatRoomKeyDown
 * @property {Beep[]} FriendListBeepLog
 * @property {number} FriendListModeIndex
 * @property {(id: number) => void} FriendListShowBeep
 *
 * @typedef {Window & WindowExtension} ExtendedWindow
 */
