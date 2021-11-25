// ==UserScript==
// @name Bondage Club Enhancements Expressions
// @namespace https://www.bondageprojects.com/
// @version 0.1
// @description Customize the expressions used by BCE
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

(async function () {
  "use strict";

  if (typeof ChatRoomCharacter === "undefined") {
    console.warn(
      "Bondage Club not detected. Skipping BCE customizer initialization."
    );
    return;
  }

  await waitFor(() => !!Player?.Name && window.bce_initializeDefaultExpression);

  // NOTICE: You may delete blocks that you do not wish to customize in order to use the default ones.

  /**
   * These are all the different stages your face goes through as your arousal increases. The map should always contain Blush, Eyebrows, Fluids, Eyes, Eyes2 and Mouth.
   * The order of the expressions within each facial component is important to keep in a descending order.
   *
   * Each expression comes with Expression (refer to the expressions cheatsheet at https://gitlab.com/Sidiousious/bce/-/blob/main/README.md for valid values), and Limit, which has to be between 0 and 100 inclusively.
   * null means the default expression will be used (e.g. no blush, no fluid, etc.)
   *
   * Limit dictates above which the expression will be used.
   */
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

  /**
   * These are the various expressions that BCE can trigger. Most of these are mapped to chat messages using bce_ChatTriggers below.
   * Special events that are not triggered from chat:
   * - PostOrgasm: this is triggered when the player begins recovering from orgasm.
   *
   * Data model:
   * - Type: name for the event, should match the key in the object
   * - Duration: how long the expression lasts, in milliseconds, or -1 for indefinite
   * - Priority: how important the expression is, higher is more important. Expressions with the same or lower priority are cut short when another expression is triggered.
   * - Expression: a map of face component (Blush, Eyes, Eyes2, Mouth, Fluids, Eyebrows) to the expression timeline.
   *
   * The expression timeline is a list of expressions, which are objects with the following properties:
   * - Expression: the expression type, e.g. "DroolSides". Refer to the expressions cheatsheet at https://gitlab.com/Sidiousious/bce/-/blob/main/README.md
   * - Duration: how long the expression lasts, in milliseconds, or -1 for indefinite
   * - Priority: how important the expression is, higher is more important. Expressions with the same or lower priority are cut short when another expression is triggered.
   * - ExpressionModifier: a number from -4 to +4 that modifies the intensity of the expression. This is only valid for Blush. Use only Expression or ExpressionModifier, not both.
   * - Skip: if true, the expression will be skipped for the duration.
   */
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

  /**
   * This list maps incoming messages to expressions.
   *
   * - Event: The event to trigger.
   * - Type: The type of the message (Activity, Action, Emote, etc.)
   * - Matchers: a list of matchers, one of which must match for the expression to be triggered.
   *
   * In matchers:
   * - Tester: a regular expression that must match the Content of the message. For Emote this is the message sent by the user. For Activity/Action this is the label used by the game (e.g. "ChatOther-ItemArms-Pinch" or "ActionActivityShockItem")
   * - Criteria: a list of additional criteria that must be met for the expression to be triggered.
   *
   * In criteria:
   * - TargetIsPlayer: if present and true, the expression will only be triggered if the target is the player.
   * - SenderIsPlayer: if present and true, the expression will only be triggered if the sender is the player.
   */
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
          Tester: /^(starts to cry|sheds .* tears?|eyes( start( to)?)? leak)/,
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
  ];

  async function waitFor(func) {
    while (!func()) {
      await sleep(100);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
