// ==UserScript==
// @name		 Bondage Club Enhancements
// @namespace	https://www.bondageprojects.com/
// @version	  0.9
// @description  try to take over the world!
// @author	   You
// @match		https://www.bondageprojects.elementfx.com/*
// @match		https://www.bondageprojects.com/*
// @icon		 data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant		none
// ==/UserScript==

(function () {
  "use strict";

  inject(automaticReconnect);
  inject(automaticExpressions);

  function automaticReconnect() {
    const _localStoragePasswordsKey = 'bce.passwords';
    _updatePasswordForReconnect = (pass) => {
      let passwords = JSON.parse(localStorage.getItem(_localStoragePasswordsKey));
      if (!passwords) passwords = {};
      passwords[Player.AccountName] = pass;
      localStorage.setItem(_localStoragePasswordsKey, JSON.stringify(passwords));
    }

    let _breakCircuit = false;
    function reconCheck() {
      if (_breakCircuit) return;
      if (CurrentScreen === "Relog" && ServerIsConnected && !LoginSubmitted) {
        const passwords = JSON.parse(localStorage.getItem(_localStoragePasswordsKey));
        console.log("Attempting to log in again as", Player.AccountName);
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
      setTimeout(automaticExpressions, 1000);
      return;
    }

    console.log("Started arousal faces");

    _CustomLastExpression = {
      Blush: null,
      Eyebrows: null,
      Fluids: null,
      Eyes: null,
      Eyes2: null,
      Mouth: null,
    };

    _ManualLastExpression = {};

    _ExpressionModifierMap = {
      Blush: [null, "Low", "Medium", "High", "VeryHigh", "Extreme"],
    };

    _ExpressionsQueue = [];
    function pushEvent(evt) {
      console.log("Event detected", evt.Type);
      const t = Date.now();
      let event = JSON.parse(JSON.stringify(evt)); // deep copy
      event.At = t;
      event.Until = t + event.Duration;
      // flush lower priority events
      while (
        _ExpressionsQueue.length > 0 &&
        (_ExpressionsQueue[0].Priority || 0) < event.Priority
      ) {
        console.log(
          "Evicting lower priority event",
          _ExpressionsQueue[0].Priority,
          event.Priority
        );
        _ExpressionsQueue.shift();
      }
      _ExpressionsQueue.push(event);
    }

    _EventExpressions = {
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
        Duration: 5000,
        Expression: {
          Mouth: [{ Expression: "Pout", Duration: 5000 }],
          Eyes: [{ Expression: "Dazed", Duration: 5000 }],
          Eyes2: [{ Expression: "Dazed", Duration: 5000 }],
          Eyebrows: [{ Expression: "Harsh", Duration: 5000 }],
        },
      },
      Confused: {
        Type: "Confused",
        Duration: 5000,
        Expression: {
          Eyebrows: [{ Expression: "OneRaised", Duration: 5000 }],
        },
      },
      Smirk: {
        Type: "Smirk",
        Duration: 5000,
        Expression: {
          Mouth: [{ Expression: "Smirk", Duration: 5000 }],
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
        Duration: 5000,
        Expression: {
          Mouth: [{ Expression: "Laughing", Duration: 5000 }],
        },
      },
      Smile: {
        Type: "Smile",
        Duration: 5000,
        Expression: {
          Mouth: [{ Expression: "Grin", Duration: 5000 }],
        },
      },
      Blink: {
        Type: "Blink",
        Duration: 200,
        Expression: {
          Eyes:  [{ Expression: "Closed", Duration: 200 }],
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
        Duration: 5000,
        Expression: {
          Blush: [{ ExpressionModifier: 2, Duration: 5000 }],
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
      Shock: {
        Type: "Shock",
        Duration: 10000,
        Priority: 1000,
        Expression: {
          Blush: [{ ExpressionModifier: 5, Duration: 10000 }],
          Eyes: [
            { Expression: "Dizzy", Duration: 1000 },
            { Expression: "Scared", Duration: 5000 },
            { Expression: "Surprised", Duration: 4000 },
          ],
          Eyes2: [
            { Expression: "Dizzy", Duration: 1000 },
            { Expression: "Scared", Duration: 5000 },
            { Expression: "Surprised", Duration: 4000 },
          ],
          Eyebrows: [{ Expression: "Soft", Duration: 10000 }],
          Mouth: [{ Expression: "Pained", Duration: 10000 }],
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
    };

    _ChatTriggers = [
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
          if (overrideLastCustom) _CustomLastExpression[t] = n;
          break;
        }
      }
    }

    // Reset
    Player.ArousalSettings.Progress = 0;
    _PreviousArousal = Player.ArousalSettings;
    for (const t of Object.keys(_CustomLastExpression)) {
      setExpression(t, _CustomLastExpression[t]);
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
        { Expression: "High", Limit: 60 },
        { Expression: "Medium", Limit: 40 },
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
        { Expression: "DroolMedium", Limit: 80 },
        { Expression: "DroolSides", Limit: 50 },
        { Expression: "DroolLow", Limit: 30 },
        { Expression: null, Limit: 0 },
      ],
      Eyes: [
        { Expression: "VeryLewd", Limit: 100 },
        { Expression: "Lewd", Limit: 95 },
        { Expression: "Horny", Limit: 70 },
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
        _ManualLastExpression = {};
        _CustomLastExpression = {
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
        _ExpressionsQueue.filter((a) => a.Type === "PostOrgasm").length === 0
      ) {
        pushEvent(_EventExpressions.PostOrgasm);
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
          for (const trigger of _ChatTriggers) {
            if (trigger.Trigger.test(contents)) {
              pushEvent(_EventExpressions[trigger.Event]);
            }
          }
        }
      }

      // keep track of desired changes
      let desired = {};
      let expiredEvent = false;
      let isEvent = false;

      if (_ExpressionsQueue.length > 0) {
        isEvent = true;
        // handle event-based expressions
        let next = _ExpressionsQueue[0];
        if (next.Until > Date.now()) {
          let nextExpression = {};
          for (const t of Object.keys(next.Expression)) {
            let durationNow = Date.now() - next.At;
            for (let i = 0; i < next.Expression[t].length; i++) {
              const exp = next.Expression[t][i];
              durationNow -= exp.Duration;
              if (durationNow < 0) {
                if (!exp.Skip) {
                  if (exp.ExpressionModifier && t in _ExpressionModifierMap) {
                    if (!exp.Applied) {
                      const [current] = expression(t);
                      let idx =
                        _ExpressionModifierMap[t].indexOf(current) +
                        exp.ExpressionModifier;
                      if (idx >= _ExpressionModifierMap[t].length) {
                        idx = _ExpressionModifierMap[t].length - 1;
                      } else if (idx < 0) {
                        idx = 0;
                      }
                      nextExpression[t] = _ExpressionModifierMap[t][idx];
                      _ExpressionsQueue[0].Expression[t][i].Applied = true;
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
              desired[t] = nextExp;
            }
            if (exp !== _CustomLastExpression[t] && permanent) {
              if (!exp) {
                delete _ManualLastExpression[t];
              } else {
                _ManualLastExpression[t] = exp;
              }
            }
          }
        } else {
          _ExpressionsQueue.shift();
          if (_ExpressionsQueue.length === 0) {
            expiredEvent = true;
            for (const t of Object.keys(next.Expression)) {
              if (_ManualLastExpression[t]) {
                setExpression(t, _ManualLastExpression[t], false);
              }
            }
          }
        }
      }
      if ((direction !== ArousalMeterDirection.None && !isEvent) || expiredEvent) {
        // handle arousal-based expressions
        outer: for (const t of Object.keys(faces)) {
          const [exp, permanent] = expression(t);
          // only proceed if matches without overriding manual expressions
          if (exp === _CustomLastExpression[t]) {
            if (exp !== _ManualLastExpression[t]) {
              for (const face of faces[t]) {
                let limit = face.Limit - (direction === ArousalMeterDirection.Up ? 0 : 3);
                if (arousal >= limit) {
                  if (face.Expression !== exp) {
                    desired[t] = face.Expression;
                    break;
                  } else {
                    continue outer;
                  }
                }
              }
            }
          } else if (permanent) {
            if (!exp) {
              delete _ManualLastExpression[t];
            } else {
              _ManualLastExpression[t] = exp;
            }
          }
        }
      }

      if (Object.keys(desired).length > 0) {
        for (const t of Object.keys(desired)) {
          setExpression(t, desired[t]);
        }

        CharacterRefresh(Player, true);
        console.log(arousal, "Changed", desired);
      }

      _PreviousArousal = { ...Player.ArousalSettings };
    };

    if (typeof _CustomArousalTimer !== "undefined") {
      clearInterval(_CustomArousalTimer);
    }
    _CustomArousalTimer = setInterval(_CustomArousalExpression, 250);
  }

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