/* =====================================================================
   content/default-content.js  -  THE BUILT-IN QUESTIONS (a safety net)
   ---------------------------------------------------------------------
   Normally the website reads its questions and wording from the "Questions"
   and "Settings" tabs of your Google Sheet, so you edit them there.
   This file is only used when the Sheet cannot be reached (for example,
   before you finish the setup), so the page is never empty.
   It matches the starter content that setup() puts in your Sheet.
   ===================================================================== */

const DEFAULT_CONTENT = {
  "questions": [
    {
      "show": true,
      "section": "You",
      "column": "Name",
      "label": "Your name",
      "type": "text",
      "options": [],
      "required": true,
      "hint": "",
      "help": "",
      "placeholder": "First and last name",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Favourite colours",
      "label": "Favourite colours",
      "type": "colours",
      "options": [],
      "required": false,
      "hint": "Pick up to two.",
      "help": "",
      "placeholder": "",
      "other": "Another colour?",
      "max": 2
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Favourite flowers",
      "label": "Favourite flowers",
      "type": "multi",
      "options": [
        "Peonies",
        "Ranunculus",
        "Tulips",
        "Roses",
        "Lilies",
        "Sunflowers",
        "Daisies",
        "Hydrangeas",
        "Orchids",
        "Wildflowers"
      ],
      "required": false,
      "hint": "Pick as many as you like.",
      "help": "",
      "placeholder": "",
      "other": "Another flower?",
      "max": 0
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Favourite snack",
      "label": "Favourite snack",
      "type": "text",
      "options": [],
      "required": false,
      "hint": "",
      "help": "",
      "placeholder": "Salty, sweet, crunchy...",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Favourite sweet treat",
      "label": "Favourite sweet treat",
      "type": "text",
      "options": [],
      "required": false,
      "hint": "",
      "help": "",
      "placeholder": "Candy, chocolate, a pastry...",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Tims order",
      "label": "Your usual Tim's order?",
      "type": "text",
      "options": [],
      "required": false,
      "hint": "Skip if you do not have one.",
      "help": "",
      "placeholder": "e.g. medium double-double, iced cap",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Comfort item",
      "label": "What is your go-to comfort item?",
      "type": "multi",
      "options": [
        "Candles",
        "Cozy socks",
        "Skincare",
        "Bath stuff",
        "Blanket",
        "Tea",
        "Snacks",
        "Hand cream"
      ],
      "required": false,
      "hint": "Pick as many as you like.",
      "help": "",
      "placeholder": "",
      "other": "Something else?",
      "max": 0
    },
    {
      "show": true,
      "section": "Favourites",
      "column": "Playlist song",
      "label": "A song for our playlist",
      "type": "text",
      "options": [],
      "required": false,
      "hint": "",
      "help": "",
      "placeholder": "",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Sizes",
      "column": "Bangle size",
      "label": "Bangle size",
      "type": "choice",
      "options": [
        "2.2",
        "2.4",
        "2.6",
        "2.8",
        "2.10",
        "Not sure"
      ],
      "required": false,
      "hint": "Pick the closest.",
      "help": "Bangle size is the inside width across the bangle.\nIf you have a bangle that fits well, lay it flat and measure straight across the inside, edge to edge.\nIf not, close your hand with your thumb and little finger together and measure across the widest part of your hand.\nSizes: 2.2 is about 54 mm, 2.4 is 57 mm, 2.6 is 60 mm, 2.8 is 63 mm and 2.10 is 65 mm (sellers vary slightly).\nNot sure? Pick \"Not sure\" and I will sort it out.",
      "placeholder": "",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Food",
      "column": "Allergies",
      "label": "Allergies or sensitivities",
      "type": "paragraph",
      "options": [],
      "required": true,
      "hint": "Food, scents, pets... or write \"none\".",
      "help": "",
      "placeholder": "",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Food",
      "column": "Food preferences",
      "label": "Food preferences",
      "type": "multi",
      "options": [
        "No beef",
        "Pescatarian",
        "Vegetarian",
        "No seafood",
        "No green veggies",
        "High protein",
        "No spicy food",
        "Gluten-free",
        "Dairy-free",
        "Avoiding raw, deli or soft-cheese foods"
      ],
      "required": false,
      "hint": "",
      "help": "",
      "placeholder": "",
      "other": "Anything else?",
      "max": 0
    },
    {
      "show": true,
      "section": "Food",
      "column": "Main",
      "label": "Which main would you pick?",
      "type": "choice",
      "options": [
        "Braised short rib",
        "Soy-honey-Dijon salmon",
        "Either is great"
      ],
      "required": false,
      "hint": "",
      "help": "",
      "placeholder": "",
      "other": "",
      "max": 0
    },
    {
      "show": true,
      "section": "Food",
      "column": "Alcohol",
      "label": "Alcohol?",
      "type": "choice",
      "options": [
        "Yes please",
        "Just a little",
        "No thanks (mocktail please)"
      ],
      "required": false,
      "hint": "",
      "help": "",
      "placeholder": "",
      "other": "",
      "max": 0
    }
  ],
  "settings": {
    "pageTitle": "A little something",
    "hostName": "Kiru",
    "intro": "A little something is coming. Help me get the details right.",
    "submitButton": "Send",
    "thanksTitle": "Thank you!",
    "thanksMessage": "Got it. I cannot wait for you to see what I have been planning.",
    "notifyEmail": ""
  }
};
