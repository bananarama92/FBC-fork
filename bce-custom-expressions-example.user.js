// ==UserScript==
// @name Bondage Club Enhancements Expressions
// @namespace https://www.bondageprojects.com/
// @version 0.1
// @description Customize the expressions used by BCE
// @author Sidious
// @match https://www.bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match http://localhost:*/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @run-at document-end
// ==/UserScript==

(async function () {
  "use strict";

  await waitFor(() => !!Player?.Name && window.bce_initializeDefaultExpression);

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
   * These are the regular expressions that are used to match the various expressions in chat and map to Events in the bce_EventExpressions object above.
   */
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
      Trigger: new RegExp(`^.${Player.Name} (looks|seems|is|gets) distressed`),
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
      Trigger: new RegExp(`^\\(.*? rubs ${Player.Name}'s .*? with a ice cube`),
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

  bce_initializeDefaultExpression();

  async function waitFor(func) {
    while (!func()) {
      await sleep(100);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
