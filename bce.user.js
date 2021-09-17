// ==UserScript==
// @name Bondage Club Enhancements
// @namespace https://www.bondageprojects.com/
// @version 0.28
// @description enhancements for the bondage club
// @author Sidious
// @match https://www.bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.com/*
// @match https://bondage-europe.com/*
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

  function initSettings() {
    if (!PreferenceSubscreenList) {
      setTimeout(initSettings, 1000);
      return;
    }

    bce_settingskey = () => `bce.settings.${Player?.AccountName}`;
    bce_loadSettings = function () {
      const defaultSettings = {
        relogin: true,
        gagspeak: false,
        expressions: false,
      };
      let settings = JSON.parse(localStorage.getItem(bce_settingskey()));
      if (!settings) {
        settings = defaultSettings;
      } else {
        for (const setting in defaultSettings) {
          if (!defaultSettings.hasOwnProperty(setting)) continue;
          if (!(setting in settings)) {
            settings[setting] = defaultSettings[setting];
          }
        }
      }
      return settings;
    };
    bce_saveSettings = function (settings) {
      localStorage.setItem(bce_settingskey(), JSON.stringify(settings));
    };

    PreferenceSubscreenBCESettingsLoad = function () {};
    PreferenceSubscreenBCESettingsExit = function () {
      PreferenceSubscreen = "";
      PreferenceMessage = "";
    };
    PreferenceSubscreenBCESettingsRun = function () {
      const settings = bce_loadSettings();
      MainCanvas.textAlign = "left";
      DrawText("Bondage Club Enhancements Settings", 500, 125, "Black", "Gray");
      DrawCheckbox(
        500,
        225,
        64,
        64,
        "Automatic Relogin on Disconnect",
        settings.relogin
      );
      DrawCheckbox(500, 295, 64, 64, "Understand gagspeak", settings.gagspeak);
      DrawCheckbox(
        500,
        365,
        64,
        64,
        "Affect facial expressions automatically",
        settings.expressions
      );
      DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    };
    PreferenceSubscreenBCESettingsClick = function () {
      const settings = bce_loadSettings();
      if (MouseIn(1815, 75, 90, 90)) {
        PreferenceSubscreenBCESettingsExit();
      } else if (MouseIn(500, 225, 64, 64)) {
        settings.relogin = !settings.relogin;
      } else if (MouseIn(500, 295, 64, 64)) {
        settings.gagspeak = !settings.gagspeak;
      } else if (MouseIn(500, 365, 64, 64)) {
        settings.expressions = !settings.expressions;
        if (settings.expressions) {
          // disable conflicting settings
          Player.OnlineSharedSettings.ItemsAffectExpressions = false;
          Player.ArousalSettings.AffectExpression = false;
        }
      }

      bce_saveSettings(settings);
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
    function reconCheck() {
      const settings = bce_loadSettings();
      if (_breakCircuit || !settings.relogin) return;
      if (CurrentScreen === "Relog" && ServerIsConnected && !LoginSubmitted) {
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
        ElementValue("InputPassword", passwords[Player.AccountName]);
        RelogSend();
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
    setInterval(reconCheck, 100);
  }

  function automaticExpressions() {
    if (CurrentScreen !== "ChatRoom") {
      setTimeout(automaticExpressions, 100);
      return;
    }

    const settings = bce_loadSettings();
    if (!settings.expressions) {
      return;
    } else {
      Player.OnlineSharedSettings.ItemsAffectExpressions = false;
      Player.ArousalSettings.AffectExpression = false;
    }

    console.log("Started arousal ArousalExpressionStages");

    bce_CustomLastExpression = {
      Blush: null,
      Eyebrows: null,
      Fluids: null,
      Eyes: null,
      Eyes2: null,
      Mouth: null,
    };

    bce_ManualLastExpression = {};

    bce_ExpressionModifierMap = {
      Blush: [null, "Low", "Medium", "High", "VeryHigh", "Extreme"],
    };

    bce_ExpressionsQueue = [];
    function pushEvent(evt) {
      console.log("Event detected", evt.Type);
      const t = Date.now();
      let event = JSON.parse(JSON.stringify(evt)); // deep copy
      event.At = t;
      event.Until = t + event.Duration;
      // flush lower priority events
      while (
        bce_ExpressionsQueue.length > 0 &&
        (bce_ExpressionsQueue[0].Priority || 0) < event.Priority
      ) {
        console.log(
          "Evicting lower priority event",
          bce_ExpressionsQueue[0].Priority,
          event.Priority
        );
        bce_ExpressionsQueue.shift();
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
            { ExpressionModifier: -1, Duration: 5000 },
            { ExpressionModifier: -1, Duration: 5000 },
          ],
          Eyes: [
            { Expression: "Closed", Duration: 8500 },
            { Expression: "Heart", Duration: 7500 },
            { Expression: "Sad", Duration: 4000 },
          ],
          Eyes2: [
            { Expression: "Closed", Duration: 8000 },
            { Expression: "Heart", Duration: 8000 },
            { Expression: "Sad", Duration: 4000 },
          ],
          Mouth: [
            { Expression: "Ahegao", Duration: 5000 },
            { Expression: "Moan", Duration: 5000 },
            { Expression: "HalfOpen", Duration: 10000 },
          ],
          Fluids: [
            { Expression: "DroolMessy", Duration: 5000 },
            { Expression: "DroolSides", Duration: 9000 },
            { Expression: "DroolLow", Duration: 6000 },
          ],
          Eyebrows: [
            { Expression: "Soft", Duration: 10000 },
            { Expression: "Lowered", Duration: 5000 },
            { Expression: null, Duration: 5000 },
          ],
        },
      },
      Pout: {
        Type: "Pout",
        Duration: 8000,
        Expression: {
          Mouth: [{ Expression: "Pout", Duration: 8000 }],
          Eyes: [{ Expression: "Dazed", Duration: 8000 }],
          Eyes2: [{ Expression: "Dazed", Duration: 8000 }],
          Eyebrows: [{ Expression: "Harsh", Duration: 8000 }],
        },
      },
      Confused: {
        Type: "Confused",
        Duration: 8000,
        Expression: {
          Eyebrows: [{ Expression: "OneRaised", Duration: 8000 }],
        },
      },
      Smirk: {
        Type: "Smirk",
        Duration: 8000,
        Expression: {
          Mouth: [{ Expression: "Smirk", Duration: 8000 }],
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
          Mouth: [{ Expression: "Laughing", Duration: 8000 }],
        },
      },
      Smile: {
        Type: "Smile",
        Duration: 8000,
        Expression: {
          Mouth: [{ Expression: "Grin", Duration: 8000 }],
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
      Cuddle: {
        Type: "Cuddle",
        Duration: 10000,
        Priority: 200,
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
          Blush: [
            { ExpressionModifier: 1, Duration: 10000 },
            { ExpressionModifier: 1, Duration: 10000 },
          ],
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
      LipBite: {
        Type: "LipBite",
        Duration: 8000,
        Priority: 200,
        Expression: {
          Mouth: [{ Expression: "LipBite", Duration: 8000 }],
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
    };

    bce_ChatTriggers = [
      {
        Trigger: new RegExp(
          `(${Player.Name} blushes|^\\(.*?gives a friendly kiss on ${Player.Name}'s cheek')`
        ),
        Event: "Blush",
      },
      {
        Trigger: new RegExp(`${Player.Name} (smiles|chuckles)`),
        Event: "Smile",
      },
      {
        Trigger: new RegExp(`${Player.Name} (laughs|giggles)`),
        Event: "Laugh",
      },
      {
        Trigger: new RegExp(`${Player.Name} smirks`),
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
        Trigger: new RegExp(
          `${Player.Name} (seems confused|looks curious|looks suspicious)`
        ),
        Event: "Confused",
      },
      {
        Trigger: new RegExp(
          `^\\((${Player.Name}'s.*?(gives? her.*?shock|shocks her(self)?\\b)|.*?(shocks ${Player.Name}('s)?.*? with a ))`
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
        Trigger: new RegExp(`^\\(${Player.Name}.*?loses her balance`),
        Event: "Disoriented",
      },
      {
        Trigger: new RegExp(`^\\(.*?(masturbates|penetrates) ${Player.Name}'s`),
        Event: "StimulatedLong",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} bites her lips`),
        Event: "LipBite",
      },
      {
        Trigger: new RegExp(`^.${Player.Name} licks `),
        Event: "Lick",
      },
      {
        Trigger: new RegExp(`\\(${Player.Name}'s gag (in|de)flates'`),
        Event: "GagInflate",
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

    // this is called once per interval to check for expression changes
    _CustomArousalExpression = () => {
      // Reset everything when face is fully default
      let isDefault = true;
      for (const t of Object.keys(ArousalExpressionStages)) {
        if (expression(t)[0]) {
          isDefault = false;
        }
      }
      if (isDefault) {
        bce_ManualLastExpression = {};
        bce_CustomLastExpression = {
          Blush: null,
          Eyebrows: null,
          Fluids: null,
          Eyes: null,
          Eyes2: null,
          Mouth: null,
        };
        _PreviousArousal.Progress = 0;
      }

      // detect arousal movement
      let arousal = Player.ArousalSettings.Progress;
      let direction = ArousalMeterDirection.None;
      if (arousal < _PreviousArousal.Progress) {
        direction = ArousalMeterDirection.Down;
      } else if (arousal > _PreviousArousal.Progress) {
        direction = ArousalMeterDirection.Up;
      }

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

      if (bce_ExpressionsQueue.length > 0) {
        // handle event-based expressions
        let next = bce_ExpressionsQueue[0];
        if (next.Until > Date.now()) {
          let nextExpression = {};
          for (const t of Object.keys(next.Expression)) {
            let durationNow = Date.now() - next.At;
            for (let i = 0; i < next.Expression[t].length; i++) {
              const exp = next.Expression[t][i];
              durationNow -= exp.Duration;
              if (durationNow < 0) {
                eventHandled.push(t);
                if (!exp.Skip) {
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
                      nextExpression[t] = bce_ExpressionModifierMap[t][idx];
                      bce_ExpressionsQueue[0].Expression[t][i].Applied = true;
                    }
                  } else {
                    nextExpression[t] = exp.Expression;
                  }
                }
                break;
              }
            }
          }

          for (const t of Object.keys(nextExpression)) {
            const [exp, permanent] = expression(t);
            const nextExp = nextExpression[t];
            if (nextExp !== exp) {
              desired[t] = { Expression: nextExp, Automatic: true };
            }
            if (exp !== bce_CustomLastExpression[t] && permanent) {
              if (!exp) {
                delete bce_ManualLastExpression[t];
              } else {
                bce_ManualLastExpression[t] = exp;
              }
            }
          }
        } else {
          let prev = bce_ExpressionsQueue.shift();
          eventEnded = true;
          if (bce_ExpressionsQueue.length === 0) {
            for (const t of Object.keys(prev.Expression)) {
              if (bce_ManualLastExpression[t]) {
                desired[t] = {
                  Expression: bce_ManualLastExpression[t],
                  Automatic: false,
                };
              }
            }
          }
        }
      }
      if (direction !== ArousalMeterDirection.None || eventEnded) {
        // handle arousal-based expressions
        outer: for (const t of Object.keys(ArousalExpressionStages)) {
          if ((!eventEnded && eventHandled.includes(t)) || t in desired) {
            continue;
          }
          const [exp, permanent] = expression(t);
          // only proceed if matches without overriding manual expressions
          if (exp === bce_CustomLastExpression[t]) {
            if (exp !== bce_ManualLastExpression[t]) {
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
            }
          } else if (permanent) {
            if (!exp) {
              delete bce_ManualLastExpression[t];
            } else {
              bce_ManualLastExpression[t] = exp;
            }
          }
        }
      }

      if (Object.keys(desired).length > 0) {
        for (const t of Object.keys(desired)) {
          setExpression(t, desired[t].Expression, desired[t].Automatic);
        }

        CharacterRefresh(Player, true, false);
        console.log(arousal, "Changed", desired);
      }

      _PreviousArousal = { ...Player.ArousalSettings };
    };

    if (typeof bce_CustomArousalTimer !== "undefined") {
      clearInterval(bce_CustomArousalTimer);
    }
    bce_CustomArousalTimer = setInterval(_CustomArousalExpression, 250);
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
