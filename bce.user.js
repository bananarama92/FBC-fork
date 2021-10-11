// ==UserScript==
// @name Bondage Club Enhancements
// @namespace https://www.bondageprojects.com/
// @version 0.55
// @description enhancements for the bondage club
// @author Sidious
// @match https://www.bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match http://localhost:3000/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// ==/UserScript==

(function () {
  "use strict";

  inject(initSettings);
  inject(gagspeak);
  inject(automaticReconnect);
  inject(automaticExpressions);
  inject(extendedWardrobe);
  inject(layeringMenu);
  inject(cacheClearer);

  function initSettings() {
    if (!PreferenceSubscreenList) {
      setTimeout(initSettings, 1000);
      return;
    }

    const defaultSettings = {
      relogin: {
        label: "Automatic Relogin on Disconnect",
        value: true,
        sideEffects: (newValue) => {
          console.log(newValue);
        },
      },
      expressions: {
        label: "Automatic Facial Expressions (Replaces Vanilla)",
        value: false,
        sideEffects: (newValue) => {
          if (newValue) {
            // disable conflicting settings
            Player.OnlineSharedSettings.ItemsAffectExpressions = false;
            Player.ArousalSettings.AffectExpression = false;
          }
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
          console.log(newValue);
        },
      },
      automateCacheClear: {
        label: "Clear Drawing Cache Hourly",
        value: false,
        sideEffects: (newValue) => {
          console.log(newValue);
        },
      },
      gagspeak: {
        label: "(Cheat) Understand All Gagged and when Deafened",
        value: false,
        sideEffects: (newValue) => {
          console.log(newValue);
        },
      },
    };

    bce_settingskey = () => `bce.settings.${Player?.AccountName}`;
    bce_loadSettings = function () {
      let settings = JSON.parse(localStorage.getItem(bce_settingskey()));
      if (!settings) {
        settings = defaultSettings;
      } else {
        for (const setting in defaultSettings) {
          if (!defaultSettings.hasOwnProperty(setting)) continue;
          if (!(setting in settings)) {
            settings[setting] = defaultSettings[setting].value;
          }
        }
      }
      return settings;
    };
    bce_saveSettings = function (settings) {
      localStorage.setItem(bce_settingskey(), JSON.stringify(settings));
    };

    const settingsYStart = 225;
    const settingsYIncrement = 70;

    PreferenceSubscreenBCESettingsLoad = function () {};
    PreferenceSubscreenBCESettingsExit = function () {
      PreferenceSubscreen = "";
      PreferenceMessage = "";
    };
    PreferenceSubscreenBCESettingsRun = function () {
      const settings = bce_loadSettings();
      MainCanvas.textAlign = "left";
      DrawText("Bondage Club Enhancements Settings", 500, 125, "Black", "Gray");
      let y = settingsYStart;
      for (const setting in defaultSettings) {
        DrawCheckbox(
          500,
          y,
          64,
          64,
          defaultSettings[setting].label,
          settings[setting]
        );
        y += settingsYIncrement;
      }
      DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    };
    PreferenceSubscreenBCESettingsClick = function () {
      const settings = bce_loadSettings();
      let y = settingsYStart;
      if (MouseIn(1815, 75, 90, 90)) {
        PreferenceSubscreenBCESettingsExit();
      } else {
        for (const setting in defaultSettings) {
          if (MouseIn(500, y, 64, 64)) {
            settings[setting] = !settings[setting];
            defaultSettings[setting].sideEffects(settings[setting]);
          }
          y += settingsYIncrement;
        }
      }

      bce_saveSettings(settings);
    };

    bc_DrawButton = DrawButton;
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

    bc_TextGet = TextGet;
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

  function gagspeak() {
    if (!SpeechGarbleByGagLevel) {
      setTimeout(gagspeak, 1000);
      return;
    }

    bc_SpeechGarbleByGagLevel = SpeechGarbleByGagLevel;
    SpeechGarbleByGagLevel = function (GagEffect, CD, IgnoreOOC) {
      const settings = bce_loadSettings();
      let garbled = bc_SpeechGarbleByGagLevel(GagEffect, CD, IgnoreOOC);
      return !settings.gagspeak || garbled === CD
        ? garbled
        : `${garbled} (${CD})`;
    };
  }

  function automaticReconnect() {
    const _localStoragePasswordsKey = "bce.passwords";
    bce_updatePasswordForReconnect = () => {
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

    bce_clearPassword = (accountname) => {
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
        if (typeof bc_LoginRun === "undefined") {
          bc_LoginRun = LoginRun;
        }
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
        if (typeof bc_LoginClick === "undefined") {
          bc_LoginClick = LoginClick;
        }
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

    function relog() {
      const settings = bce_loadSettings();
      console.log(
        settings,
        _breakCircuit,
        CurrentScreen,
        ServerIsConnected,
        LoginSubmitted
      );
      if (_breakCircuit || !settings.relogin) return;
      if (Player.AccountName && ServerIsConnected && !LoginSubmitted) {
        if (relogCheck) {
          clearInterval(relogCheck);
        }
        let passwords = JSON.parse(
          localStorage.getItem(_localStoragePasswordsKey)
        );
        console.log("Attempting to log in again as", Player.AccountName);
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
        ServerAccountBeep({
          MemberNumber: Player.MemberNumber,
          MemberName: Player.Name,
          ChatRoomName: "VOID",
          Private: true,
          Message: "Reconnected!",
          ChatRoomSpace: "",
        });
      }
    }

    if (typeof bc_ServerConnect === "undefined") {
      bc_ServerConnect = ServerConnect;
    }
    ServerConnect = () => {
      bc_ServerConnect();
      relog();
    };

    if (typeof bc_ServerDisconnect === "undefined") {
      bc_ServerDisconnect = ServerDisconnect;
    }

    ServerDisconnect = (data, close = false) => {
      const settings = bce_loadSettings();
      if (!_breakCircuit && settings.relogin) {
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

  function automaticExpressions() {
    if (CurrentScreen !== "ChatRoom") {
      setTimeout(automaticExpressions, 100);
      return;
    }

    console.log("Started arousal faces");

    const ArousalExpressionStages = {
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
      ArousalExpressionStages[t] = ArousalExpressionOverrides[t];
    }

    bce_DefaultExpression = {};
    for (const t of Object.keys(ArousalExpressionStages)) {
      bce_DefaultExpression[t] = ArousalExpressionStages[t].at(-1).Expression;
    }

    bce_CustomLastExpression = { ...bce_DefaultExpression };

    bce_ExpressionModifierMap = {
      Blush: [null, "Low", "Medium", "High", "VeryHigh", "Extreme"],
    };

    bce_ExpressionsQueue = [];
    let lastUniqueId = 0;
    function newUniqueId() {
      lastUniqueId = (lastUniqueId + 1) % (Number.MAX_SAFE_INTEGER - 1);
      return lastUniqueId;
    }
    function pushEvent(evt) {
      const time = Date.now();
      let event = JSON.parse(JSON.stringify(evt)); // deep copy
      event.At = time;
      event.Until = time + event.Duration;
      event.Id = newUniqueId();
      for (const t of Object.values(event.Expression)) {
        for (const exp of t) {
          exp.Id = newUniqueId();
        }
      }
      bce_ExpressionsQueue.push(event);
    }

    bce_EventExpressions = {
      PostOrgasm: {
        Type: "PostOrgasm",
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
          Blush: [{ ExpressionModifier: 2, Duration: 10000 }],
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
          Blush: [{ ExpressionModifier: 5, Duration: 15000 }],
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
          Mouth: [{ Expression: "Pained", Duration: 15000 }],
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

    bce_ChatTriggers = [
      {
        Trigger: new RegExp(
          `(${Player.Name} blushes|^\\(.*?gives a friendly kiss on ${Player.Name}'s cheek')`
        ),
        Event: "Blush",
      },
      {
        Trigger: new RegExp(`${Player.Name} chuckles`),
        Event: "Chuckle",
      },
      {
        Trigger: new RegExp(`${Player.Name} smiles`),
        Event: "Smile",
      },
      {
        Trigger: new RegExp(`${Player.Name} laughs`),
        Event: "Laugh",
      },
      {
        Trigger: new RegExp(`${Player.Name} giggles`),
        Event: "Giggle",
      },
      {
        Trigger: new RegExp(`${Player.Name} (smirk(s|ing)|.*with a smirk)`),
        Event: "Smirk",
      },
      {
        Trigger: new RegExp(`${Player.Name} winks`),
        Event: "Wink",
      },
      {
        Trigger: new RegExp(`${Player.Name} pouts`),
        Event: "Pout",
      },
      {
        Trigger: new RegExp(`${Player.Name} blinks`),
        Event: "Blink",
      },
      {
        Trigger: new RegExp(`(${Player.Name} (grins|is grinning))`),
        Event: "Grin",
      },
      {
        Trigger: new RegExp(
          `${Player.Name} ((seems|looks) (confused|curious|suspicious)|raises an eyebrow)`
        ),
        Event: "Confused",
      },
      {
        Trigger: new RegExp(
          `^\\((${Player.Name}'s.*?(lets out a sharp jolt|delivers an intense shock|gives her a light shock|gives? her.*?shock|shocks her(self)?\\b)|.*?(shocks ${Player.Name}('s)?.*? with a ))`
        ),
        Event: "Shock",
      },
      {
        Trigger: new RegExp(
          `^\\((${Player.Name} hits her(self)?\\b|.*?hits ${Player.Name}('s?)).*? with a`
        ),
        Event: "Hit",
      },
      {
        Trigger: new RegExp(
          `^\\((${Player.Name} spanks her(self)?\\b|.*?(spanks ${Player.Name}))`
        ),
        Event: "Spank",
      },
      {
        Trigger: new RegExp(
          `^\\((.*?cuddles with ${Player.Name}|${Player.Name} cuddles with)`
        ),
        Event: "Cuddle",
      },
      {
        Trigger: new RegExp(
          `^\\(.*?(holds a .*? against ${Player.Name}('s)? |crotch rope rubs against your|rope between your legs digs|dildo shift around inside( of)? you|large plug stuffed between your legs|dildo inside of you teases you|plug inside of you( shifts|r)|plug stimulates you|plugs (keep reminding|torment) you)`
        ),
        Event: "Stimulated",
      },
      {
        Trigger: new RegExp(
          `^\\(.*?(Your jaw aches from the gag shoved down your throat|It is difficult to breath with the gag pushing inside your throat|You choke momentarily on the gag inside your throat)`
        ),
        Event: "Choke",
      },
      {
        Trigger: new RegExp(
          `^\\((.*?kisses ${Player.Name}'s lips|${Player.Name} kisses .*?'s lips)`
        ),
        Event: "KissOnLips",
      },
      {
        Trigger: new RegExp(
          `^\\((.*?shares a long French kiss with ${Player.Name}|${Player.Name} shares a long French kiss with )`
        ),
        Event: "LongKiss",
      },
      {
        Trigger: new RegExp(`^\\((${Player.Name} kisses .*?'s .*?)`),
        Event: "Kiss",
      },
      {
        Trigger: new RegExp(`^\\(${Player.Name}.*?loses her balance`),
        Event: "Disoriented",
      },
      {
        Trigger: new RegExp(`^\\(.*?(masturbates|penetrates) ${Player.Name}'s`),
        Event: "StimulatedLong",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} bites her( lower)? lip`),
        Event: "LipBite",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} licks (?!her lips)`),
        Event: "Lick",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} frowns`),
        Event: "Frown",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} closes her mouth`),
        Event: "CloseMouth",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} opens her mouth`),
        Event: "OpenMouth",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} (looks|seems|is|gets) happy`),
        Event: "Happy",
      },
      {
        Trigger: new RegExp(
          `^.${Player.Name} (looks|seems|is|gets) distressed`
        ),
        Event: "Distressed",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} (looks|seems|is|gets) sad`),
        Event: "Sad",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} (looks|seems|is|gets) surprised`),
        Event: "Worried",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} (looks|seems|is|gets) worried`),
        Event: "Worried",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} (bares her teeth|snarls)`),
        Event: "BareTeeth",
      },
      {
        Trigger: new RegExp(
          `^.${Player.Name} (looks angr(il)?y|(gets|is|seems) angry)`
        ),
        Event: "Angry",
      },
      {
        Trigger: new RegExp(
          `^.${Player.Name} (glares|looks harshly|gives a (glare|harsh look))`
        ),
        Event: "Glare",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} opens her eyes`),
        Event: "OpenEyes",
      },
      {
        Trigger: new RegExp(
          `^.${Player.Name} ((squints|narrows) her eyes|narrowly opens her eyes)`
        ),
        Event: "NarrowEyes",
      },
      {
        Trigger: new RegExp(`^\\*${Player.Name} closes her eyes`),
        Event: "CloseEyes",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} lowers her eyebrows`),
        Event: "ResetBrows",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} raises her eyebrows`),
        Event: "RaiseBrows",
      },
      {
        Trigger: new RegExp(`^\\(${Player.Name}'s gag (in|de)flates`),
        Event: "GagInflate",
      },
      {
        Trigger: new RegExp(
          `^\\(.*? rubs ${Player.Name}'s .*? with a ice cube`
        ),
        Event: "Iced",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} drools`),
        Event: "DroolSides",
      },
      {
        Trigger: new RegExp(
          `((${Player.Name} rubs her|rubs ${Player.Name}'s) (head|nose|mouth) with a towel|cleans ${Player.Name}'s mouth|${Player.Name} (licks her lips|caresses and wipes her mouth clean))`
        ),
        Event: "DroolReset",
      },
      {
        Trigger: new RegExp(
          `^.${Player.Name} (starts to cry|sheds .* tears|eyes( start)? leak)`
        ),
        Event: "Cry",
      },
      {
        Trigger: new RegExp(
          `^.${Player.Name}'s (expression|face) returns to normal`
        ),
        Event: "Reset",
      },
    ];

    function expression(t) {
      const properties = Player.Appearance.filter(
        (a) => a.Asset.Group.Name === t
      )[0].Property;
      return [properties?.Expression, !properties?.RemoveTimer];
    }

    function setExpression(t, n, overrideLastCustom = true) {
      for (let i = 0; i < Player.Appearance.length; i++) {
        if (Player.Appearance[i].Asset.Group.Name === t) {
          if (!Player.Appearance[i].Property)
            Player.Appearance[i].Property = {};
          Player.Appearance[i].Property.Expression = n;
          if (overrideLastCustom) bce_CustomLastExpression[t] = n;
          break;
        }
      }
    }

    // Reset
    Player.ArousalSettings.Progress = 0;
    let _PreviousArousal = Player.ArousalSettings;
    for (const t of Object.keys(bce_CustomLastExpression)) {
      setExpression(t, bce_CustomLastExpression[t]);
    }

    const ArousalMeterDirection = {
      None: 0,
      Down: 1,
      Up: 2,
    };
    let _PreviousDirection = ArousalMeterDirection.Up;

    // this is called once per interval to check for expression changes
    _CustomArousalExpression = () => {
      const settings = bce_loadSettings();
      if (!settings.expressions) {
        return;
      } else {
        Player.OnlineSharedSettings.ItemsAffectExpressions = false;
        Player.ArousalSettings.AffectExpression = false;
      }

      // Reset everything when face is fully default
      let isDefault = true;
      for (const t of Object.keys(ArousalExpressionStages)) {
        if (expression(t)[0]) {
          isDefault = false;
        }
      }
      if (isDefault) {
        bce_CustomLastExpression = {
          Blush: null,
          Eyebrows: null,
          Fluids: null,
          Eyes: null,
          Eyes2: null,
          Mouth: null,
        };
        _PreviousArousal.Progress = 0;
        _PreviousDirection = ArousalMeterDirection.Up;
        bce_ExpressionsQueue.splice(0, bce_ExpressionsQueue.length); // clear ongoing expressions
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

      // handle events
      const OrgasmRecoveryStage = 2;
      if (
        _PreviousArousal.OrgasmStage !== OrgasmRecoveryStage &&
        Player.ArousalSettings.OrgasmStage === OrgasmRecoveryStage &&
        bce_ExpressionsQueue.filter((a) => a.Type === "PostOrgasm").length === 0
      ) {
        pushEvent(bce_EventExpressions.PostOrgasm);
      }

      // handle chat events
      const handledAttributeName = "data-expression-handled";
      const unhandledChat = document.querySelectorAll(
        `.ChatMessage:not([${handledAttributeName}=true])`
      );
      for (const chatMessageElement of unhandledChat) {
        chatMessageElement.setAttribute(handledAttributeName, "true");
        if (
          chatMessageElement.classList.contains("ChatMessageActivity") ||
          chatMessageElement.classList.contains("ChatMessageEmote") ||
          chatMessageElement.classList.contains("ChatMessageAction")
        ) {
          const contents = chatMessageElement.textContent.trim();
          for (const trigger of bce_ChatTriggers) {
            if (trigger.Trigger.test(contents)) {
              pushEvent(bce_EventExpressions[trigger.Event]);
            }
          }
        }
      }

      // keep track of desired changes
      let desired = {};
      let eventHandled = [];
      let eventEnded = false;

      let nextExpression = {};
      for (let j = 0; j < bce_ExpressionsQueue.length; j++) {
        // handle event-based expressions
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
                  eventHandled.push(t);

                  let trySetNextExpression = (e) => {
                    const priority = exp.Priority || next.Priority || 0;
                    if (
                      !nextExpression[t] ||
                      nextExpression[t].Priority <= priority
                    ) {
                      const nexp = {
                        ...(nextExpression[t] || { Duration: 1 }),
                      };
                      nextExpression[t] = {
                        Id: exp.Id,
                        Expression: e,
                        Duration: exp.Duration,
                        Priority: priority,
                        Automatic: true,
                      };
                      if (nexp?.Duration < 0 && exp.Duration < 0) {
                        for (let k = 0; k < j; k++) {
                          let delIdx = bce_ExpressionsQueue[k].Expression[
                            t
                          ]?.findIndex((a) => a.Id === nexp.Id);
                          if (Number.isInteger(delIdx) && delIdx >= 0) {
                            let old = bce_ExpressionsQueue[k].Expression[
                              t
                            ].splice(delIdx, 1);
                            if (
                              bce_ExpressionsQueue[k].Expression[t].length === 0
                            ) {
                              delete bce_ExpressionsQueue[k].Expression[t];
                            }
                            break;
                          }
                        }
                      }
                    }
                  };

                  if (
                    exp.ExpressionModifier &&
                    t in bce_ExpressionModifierMap
                  ) {
                    if (!exp.Applied) {
                      const [current] = expression(t);
                      let idx =
                        bce_ExpressionModifierMap[t].indexOf(current) +
                        exp.ExpressionModifier;
                      if (idx >= bce_ExpressionModifierMap[t].length) {
                        idx = bce_ExpressionModifierMap[t].length - 1;
                      } else if (idx < 0) {
                        idx = 0;
                      }
                      trySetNextExpression(bce_ExpressionModifierMap[t][idx]);
                      bce_ExpressionsQueue[j].Expression[t][i].Applied = true;
                    }
                  } else {
                    trySetNextExpression(exp.Expression);
                  }
                }
                break;
              }
            }
          }
        }
        if (!active) {
          bce_ExpressionsQueue.splice(j, 1);
          j--;
          if (bce_ExpressionsQueue.length === 0) {
            eventEnded = true;
          }
        }
      }

      for (const t of Object.keys(nextExpression)) {
        const [exp, permanent] = expression(t);
        const nextExp = nextExpression[t];
        if (nextExp.Expression !== exp) {
          desired[t] = { ...nextExp };
        }
        if (exp !== bce_CustomLastExpression[t] && permanent) {
          const e = Object.create(null);
          e[t] = [{ Expression: exp, Duration: -1 }];
          pushEvent({
            Type: "ManualOverride",
            Duration: -1,
            Expression: e,
          });
        }
      }

      // handle arousal-based expressions
      outer: for (const t of Object.keys(ArousalExpressionStages)) {
        if ((!eventEnded && eventHandled.includes(t)) || t in desired) {
          continue;
        }
        const [exp, permanent] = expression(t);
        // only proceed if matches without overriding manual expressions
        if (exp === bce_CustomLastExpression[t] || isDefault) {
          for (const face of ArousalExpressionStages[t]) {
            let limit =
              face.Limit - (direction === ArousalMeterDirection.Up ? 0 : 3);
            if (arousal >= limit) {
              if (face.Expression !== exp) {
                desired[t] = {
                  Expression: face.Expression,
                  Automatic: true,
                };
                break;
              } else {
                continue outer;
              }
            }
          }
        } else if (permanent) {
          const e = Object.create(null);
          e[t] = [{ Expression: exp, Duration: -1 }];
          pushEvent({
            Type: "ManualOverride",
            Duration: -1,
            Expression: e,
          });
        }
      }

      if (Object.keys(desired).length > 0) {
        for (const t of Object.keys(desired)) {
          setExpression(t, desired[t].Expression, desired[t].Automatic);
          ServerSend("ChatRoomCharacterExpressionUpdate", {
            Name: desired[t].Expression,
            Group: t,
            Appearance: ServerAppearanceBundle(Player.Appearance),
          });
        }

        CharacterRefresh(Player, false, false);
        console.log(arousal, "Changed", desired);
      }

      _PreviousArousal = { ...Player.ArousalSettings };
    };

    if (typeof bce_CustomArousalTimer !== "undefined") {
      clearInterval(bce_CustomArousalTimer);
    }
    bce_CustomArousalTimer = setInterval(_CustomArousalExpression, 250);
  }

  function layeringMenu() {
    if (!Player?.AppearanceLayers) {
      setTimeout(layeringMenu, 1000);
      return;
    }

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

    bc_AppearanceExit = AppearanceExit;
    AppearanceExit = function () {
      if (CharacterAppearanceMode == "") {
        ElementRemove(layerPriority);
      }
      bc_AppearanceExit();
    };
    bc_AppearanceLoad = AppearanceLoad;
    AppearanceLoad = function () {
      bc_AppearanceLoad();
      ElementCreateInput(layerPriority, "number", "", "20");
      ElementPosition(layerPriority, -1000, -1000, 0);
    };
    bc_AppearanceRun = AppearanceRun;
    AppearanceRun = function () {
      const settings = bce_loadSettings();
      bc_AppearanceRun();
      if (settings.layeringMenu) {
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
    bc_AppearanceClick = AppearanceClick;
    AppearanceClick = function () {
      const settings = bce_loadSettings();
      if (settings.layeringMenu) {
        const C = CharacterAppearanceSelection;
        if (MouseIn(110, 70, 90, 90) && CharacterAppearanceMode == "Cloth") {
          let item = C.Appearance.find((a) => a.Asset.Group == C.FocusGroup);
          updateItemPriorityFromLayerPriorityInput(item);
        }
      }
      bc_AppearanceClick();
    };

    let prioritySubscreen = false;
    function prioritySubscreenEnter(C, FocusItem) {
      prioritySubscreen = true;
      ElementCreateInput(
        layerPriority,
        "number",
        C.AppearanceLayers.find((a) => a.Asset == FocusItem.Asset).Priority,
        20
      );
    }
    function prioritySubscreenExit() {
      prioritySubscreen = false;
      ElementRemove(layerPriority);
    }
    bc_DialogDrawItemMenu = DialogDrawItemMenu;
    DialogDrawItemMenu = function (C) {
      const settings = bce_loadSettings();
      if (settings.layeringMenu) {
        const FocusItem = InventoryGet(C, C.FocusGroup?.Name);
        if (
          FocusItem &&
          C.AppearanceLayers.find((a) => a.Asset == FocusItem.Asset)
        ) {
          DrawButton(
            10,
            950,
            50,
            50,
            "",
            "White",
            "Icon/Empty.png",
            "Modify priority"
          );
        }
      }
      bc_DialogDrawItemMenu(C);
    };

    bc_DialogDraw = DialogDraw;
    DialogDraw = function () {
      const settings = bce_loadSettings();
      if (settings.layeringMenu && prioritySubscreen) {
        DrawText("Set priority", 950, 150, "White", "Black");
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
          "Set Priority"
        );
      } else {
        bc_DialogDraw();
      }
    };
    bc_DialogClick = DialogClick;
    DialogClick = function () {
      const settings = bce_loadSettings();
      if (!settings.layeringMenu) {
        bc_DialogClick();
        return;
      }
      let C = CharacterGetCurrent();
      const FocusItem = InventoryGet(C, C.FocusGroup?.Name);
      if (prioritySubscreen) {
        if (MouseIn(1815, 75, 90, 90)) {
          prioritySubscreenExit();
        } else if (MouseIn(900, 280, 90, 90)) {
          updateItemPriorityFromLayerPriorityInput(FocusItem);
          CharacterRefresh(C);
          ChatRoomCharacterUpdate(C);
          prioritySubscreenExit();
        }
      } else {
        if (FocusItem && MouseIn(10, 950, 50, 50)) {
          prioritySubscreenEnter(C, FocusItem);
          return;
        }
        bc_DialogClick();
      }
    };
  }

  function cacheClearer() {
    let automatedCacheClearer = null;
    const settings = bce_loadSettings();

    bce_clearCaches = function () {
      const settings = bce_loadSettings();
      if (!settings.automateCacheClear) {
        console.log("Cache clearing disabled");
        clearInterval(automatedCacheClearer);
        return;
      }

      console.log("Clearing caches");
      if (GLDrawCanvas.GL.textureCache) {
        GLDrawCanvas.GL.textureCache.clear();
      }
      GLDrawResetCanvas();
    };

    if (!automatedCacheClearer && settings.automateCacheClear) {
      automatedCacheClearer = setInterval(bce_clearCaches, 1 * 60 * 60 * 1000);
    }
  }

  function extendedWardrobe() {
    bc_WardrobeFixLength = WardrobeFixLength;
    WardrobeFixLength = () => {
      const settings = bce_loadSettings();
      const defaultSize = 24;
      WardrobeSize = settings.extendedWardrobe ? defaultSize * 2 : defaultSize;
      bc_WardrobeFixLength();
    };
  }

  // https://gist.github.com/nylen/6234717
  function inject(src, callback) {
    if (typeof callback != "function") callback = function () {};

    var el;

    if (typeof src != "function" && /\.css[^\.]*$/.test(src)) {
      el = document.createElement("link");
      el.type = "text/css";
      el.rel = "stylesheet";
      el.href = src;
    } else {
      el = document.createElement("script");
      el.type = "text/javascript";
    }

    el.class = "injected";

    if (typeof src == "function") {
      el.appendChild(document.createTextNode("(" + src + ")();"));
      callback();
    } else {
      el.src = src;
      el.async = false;
      el.onreadystatechange = el.onload = function () {
        var state = el.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
          callback.done = true;
          callback();
        }
      };
    }

    var head = document.head || document.getElementsByTagName("head")[0];
    head.insertBefore(el, head.lastChild);
  }
})();
