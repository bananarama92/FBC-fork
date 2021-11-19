// ==UserScript==
// @name Bondage Club Enhancements
// @namespace https://www.bondageprojects.com/
// @version 0.110
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

window.BCE_VERSION = "0.110";

(async function () {
  "use strict";

  const BCX_SOURCE =
    "https://raw.githubusercontent.com/Jomshir98/bondage-club-extended/2b1306d130822de4b918ce2bf0169b291f7ba79c/bcx.js";
  const BCX_DEVEL_SOURCE =
    "https://jomshir98.github.io/bondage-club-extended/devel/bcx.js";

  const GAGBYPASSINDICATOR = "\uf123";
  const HIDDEN = "Hidden";
  const BCE_MSG = "BCEMsg";
  const MESSAGE_TYPES = {
    Hello: "Hello",
  };
  const BCE_MAX_AROUSAL = 99.75;

  if (typeof ChatRoomCharacter === "undefined") {
    console.warn("Bondage Club not detected. Skipping BCE initialization.");
    return;
  }

  /// SETTINGS LOADING
  let bce_settings = {};
  const settingsVersion = 7;
  const defaultSettings = {
    relogin: {
      label: "Automatic Relogin on Disconnect",
      value: true,
      sideEffects: (newValue) => {
        bce_log(newValue);
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

  // Expressions init method for custom expressions
  window.bce_initializeDefaultExpression = () => {
    /* here to not break customizer script */
  };

  /// Init calls
  bceStyles();
  automaticReconnect();
  hiddenMessageHandler();
  await bce_loadSettings();
  bce_log(bce_settings);
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

  // Post ready when in a chat room
  await waitFor(
    () => !!Player && new Date(ServerBeep?.Timer || 0) < new Date()
  );
  Player.BCE = BCE_VERSION;
  ServerBeep = {
    Timer: Date.now() + 5000,
    Message: `Bondage Club Enhancements v${BCE_VERSION} Loaded`,
  };

  async function waitFor(func, cancelFunc = () => false) {
    while (!func()) {
      if (cancelFunc()) return false;
      await sleep(10);
    }
    return true;
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
    await fetch(source)
      .then((resp) => resp.text())
      .then((resp) => {
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

    function relog() {
      bce_log(
        bce_settings,
        _breakCircuit,
        CurrentScreen,
        ServerIsConnected,
        LoginSubmitted
      );
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
    `;
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  function chatAugments() {
    const bc_ServerSend = ServerSend;
    ServerSend = function (message, data) {
      if (
        (message === "ChatRoomChat" && data.Type === "Chat") ||
        data.Type === "Whisper"
      ) {
        const words = [data.Content];
        let inOOC = false;
        const newWords = [];
        for (let i = 0; i < words.length; i++) {
          // handle other whitespace
          let whitespaceIdx = words[i].search(/[\s\r\n]/);
          if (whitespaceIdx >= 1) {
            words.splice(i + 1, 0, words[i].substring(whitespaceIdx));
            words[i] = words[i].substring(0, whitespaceIdx);
          } else if (whitespaceIdx === 0) {
            words.splice(i + 1, 0, words[i].substring(1));
            words[i] = words[i][0];
            newWords.push(words[i]);
            continue;
          }

          for (const c of words[i]) {
            if (c === "(") inOOC = true;
            else if (c === ")") inOOC = false;
          }

          if (bce_parseUrl(words[i]) && !inOOC) {
            newWords.push("( ");
            newWords.push(words[i]);
            newWords.push(" )");
          } else {
            newWords.push(words[i]);
          }
        }
        data.Content = newWords.join("");
      }
      bc_ServerSend(message, data);
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

    const bce_ExpressionsQueue = [];
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
      if (typeof event.Priority !== "number") event.Priority = 1;
      for (const t of Object.values(event.Expression)) {
        for (const exp of t) {
          exp.Id = newUniqueId();
          if (typeof exp.Priority !== "number") exp.Priority = 1;
        }
      }
      bce_ExpressionsQueue.push(event);
    }

    const AUTOMATED_AROUSAL_EVENT_TYPE = "AutomatedByArousal";

    if (!window.bce_EventExpressions) {
      window.bce_EventExpressions = {
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
    }

    if (!window.bce_ChatTriggers) {
      window.bce_ChatTriggers = [
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
          Trigger: new RegExp(
            `^\\(.*?(masturbates|penetrates) ${Player.Name}'s`
          ),
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
          Trigger: new RegExp(
            `^.${Player.Name} (looks|seems|is|gets) surprised`
          ),
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
    }

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
      if (C.IsPlayer()) {
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
          Type: "ManualOverride",
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
      if (!bce_settings.expressions || !Player?.AppearanceLayers) {
        return;
      } else {
        Player.OnlineSharedSettings.ItemsAffectExpressions = false;
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
        bce_ExpressionsQueue.filter((a) => a.Type === "PostOrgasm").length === 0
      ) {
        pushEvent(bce_EventExpressions.PostOrgasm);
        lastOrgasm = Date.now();
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
          bce_ExpressionsQueue.splice(j, 1);
          j--;
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
        DrawText(
          "ᵇᶜᵉ",
          CharX + 400 * Zoom,
          CharY + 50 * Zoom,
          "Purple",
          "Black"
        );
      }
    };
  }

  function sendHello(target) {
    const message = {
      Type: HIDDEN,
      Content: BCE_MSG,
      Dictionary: {
        message: {
          type: MESSAGE_TYPES.Hello,
          version: BCE_VERSION,
          alternateArousal: bce_settings.alternateArousal,
        },
      },
    };
    if (target) {
      message.Target = target;
    }
    ServerSend("ChatRoomChat", message);
  }

  async function hiddenMessageHandler() {
    await waitFor(() => ServerSocket && ServerIsConnected);

    ServerSocket.on("ChatRoomMessage", (data) => {
      if (data.Type !== HIDDEN) return;
      if (data.Content === "BCEMsg") {
        const sender = Character.find((a) => a.MemberNumber == data.Sender);
        const { message } = data.Dictionary;
        switch (message.type) {
          case MESSAGE_TYPES.Hello:
            if (sender) {
              bce_log(`${sender.Name} uses version ${message.version}.`);
              sender.BCE = message.version;
              sender.BCEArousal = message.alternateArousal || false;
            }
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
      if (CD.trim().endsWith(GAGBYPASSINDICATOR)) {
        return CD.replace(/[\uE000-\uF8FF]/g, "");
      } else if (bce_settings.gagspeak) {
        return garbled.toLowerCase() === CD.toLowerCase()
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
              bc_SpeechGarbleByGagLevel(gagLevel, data.Content, true) +
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
    const gagAntiCheatMenuPosition = [1700, 908, 200, 90];

    const bc_ChatRoomRun = ChatRoomRun;
    ChatRoomRun = function () {
      bc_ChatRoomRun();
      if (!bce_settings.showQuickAntiGarble) return;
      const tooltip = "Gagging: ";
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
        tooltip + label,
        color,
        "",
        next,
        previous
      );
    };

    const bc_ChatRoomClick = ChatRoomClick;
    ChatRoomClick = function () {
      if (
        bce_settings.showQuickAntiGarble &&
        MouseIn(...gagAntiCheatMenuPosition)
      ) {
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
        } else {
          next();
        }
      }
      bc_ChatRoomClick();
    };
  }

  async function alternateArousal() {
    await waitFor(() => !!ServerSocket && ServerIsConnected);
    Player.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, Player.ArousalSettings.Progress);
    Player.BCEEnjoyment = 1;
    let lastSync = 0;
    const enjoymentMultiplier = 0.25;

    ServerSocket.on("ChatRoomSyncArousal", (data) => {
      if (data.MemberNumber === Player.MemberNumber) return; // skip player's own sync messages since we're tracking locally
      let target = ChatRoomCharacter.find(
        (c) => c.MemberNumber === data.MemberNumber
      );
      if (!target) return;
      target.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, data.Progress || 0);
    });

    eval(
      "ActivitySetArousalTimer = " +
        ActivitySetArousalTimer.toString().replace(
          "if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;",
          `
      if (Max === 100) Max = 101;
      const fromMax = Max - (C.BCEArousal ? C.BCEArousalProgress : C.ArousalSettings.Progress);
      if (Progress > 0 && fromMax < Progress) {
        if (fromMax <= 0) {
          Progress = 0;
        } else if (C.BCEArousal) {
          console.log("capped", fromMax, C.BCEEnjoyment);
          Progress = Math.floor(fromMax / ${enjoymentMultiplier} / C.BCEEnjoyment);
        } else {
          Progress = fromMax;
        }
      }
      `
        )
    );

    const bc_ActivitySetArousal = ActivitySetArousal;
    ActivitySetArousal = function (C, Progress) {
      bc_ActivitySetArousal(C, Progress);
      if (Math.abs(C.BCEArousalProgress - Progress) > 3) {
        C.BCEArousalProgress = Math.min(BCE_MAX_AROUSAL, Progress);
      }
    };

    const bc_ActivitySetArousalTimer = ActivitySetArousalTimer;
    ActivitySetArousalTimer = function (C, A, Z, Factor) {
      C.BCEEnjoyment = 1 + (Factor > 1 ? 2 * Math.round(Math.log(Factor)) : 0);
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
          maxProgress = 101;
        }
        let maxIncrease = maxProgress - Character[C].ArousalSettings.Progress;
        if (TimerLastArousalProgressCount % stepInterval === 0 && maxIncrease > 0) {
          if (stepInterval === 1) {
            Character[C].BCEEnjoyment = 1 + (Factor > 1 ? 2*Math.round(Math.log(Factor)) : 0);
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
        Date.now() - data.Character.Creation < 120000
      ) {
        let secondArg = "ChatRoomListUpdate" in window ? true : null;
        ChatRoomListManipulation(
          Player.BlackList,
          secondArg,
          data.Character.MemberNumber
        );
        ChatRoomListManipulation(
          Player.GhostList,
          secondArg,
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

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
