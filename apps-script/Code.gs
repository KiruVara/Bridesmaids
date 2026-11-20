/* =====================================================================
   Code.gs  -  THE GOOGLE SCRIPT THAT CONNECTS THE WEBSITE TO YOUR SHEET
   ---------------------------------------------------------------------
   You paste this into Extensions > Apps Script inside your Google Sheet
   (SETUP.md has the steps). It does three jobs:

   1. setup()    Run ONCE. Creates three tabs in your Sheet with starter content:
                   Questions : what your friends are asked (you edit this)
                   Settings  : the wording on the page (you edit this)
                   Answers   : every submission lands here, one row each
   2. doGet()    The website asks "what are the questions?" and this answers
                 with whatever is in your Questions and Settings tabs.
   3. doPost()   When a friend taps Send, this adds a row to Answers
                 (and emails you, if you put your email in Settings).

   Nothing here is secret, and your answers never leave your Google account.
   ===================================================================== */

var SHEET_QUESTIONS = 'Questions';
var SHEET_SETTINGS = 'Settings';
var SHEET_ANSWERS = 'Answers';
var MAX_CELL_LENGTH = 3000;   // one answer can be at most this long
var MAX_FIELDS = 60;          // a submission can have at most this many answers

/* The columns of the Questions tab, in order. */
var QUESTION_HEADERS = ["Show", "Section", "Column title", "Question", "Type", "Options", "Required", "Hint", "Help", "Placeholder", "Other box", "Max colours"];

/* The starter questions. Each row follows QUESTION_HEADERS. */
var STARTER_QUESTIONS = [
  [
    true,
    "You",
    "Name",
    "Your name",
    "text",
    "",
    true,
    "",
    "",
    "First and last name",
    "",
    ""
  ],
  [
    true,
    "Favourites",
    "Favourite colours",
    "Favourite colours",
    "colours",
    "",
    false,
    "Pick up to two.",
    "",
    "",
    "Another colour?",
    2
  ],
  [
    true,
    "Favourites",
    "Favourite flowers",
    "Favourite flowers",
    "multi",
    "Peonies|Ranunculus|Tulips|Roses|Lilies|Sunflowers|Daisies|Hydrangeas|Orchids|Wildflowers",
    false,
    "Pick as many as you like.",
    "",
    "",
    "Another flower?",
    ""
  ],
  [
    true,
    "Favourites",
    "Favourite snack",
    "Favourite snack",
    "text",
    "",
    false,
    "",
    "",
    "Salty, sweet, crunchy...",
    "",
    ""
  ],
  [
    true,
    "Favourites",
    "Favourite sweet treat",
    "Favourite sweet treat",
    "text",
    "",
    false,
    "",
    "",
    "Candy, chocolate, a pastry...",
    "",
    ""
  ],
  [
    true,
    "Favourites",
    "Tims order",
    "Your usual Tim's order?",
    "text",
    "",
    false,
    "Skip if you do not have one.",
    "",
    "e.g. medium double-double, iced cap",
    "",
    ""
  ],
  [
    true,
    "Favourites",
    "Comfort item",
    "What is your go-to comfort item?",
    "multi",
    "Candles|Cozy socks|Skincare|Bath stuff|Blanket|Tea|Snacks|Hand cream",
    false,
    "Pick as many as you like.",
    "",
    "",
    "Something else?",
    ""
  ],
  [
    true,
    "Favourites",
    "Playlist song",
    "A song for our playlist",
    "text",
    "",
    false,
    "",
    "",
    "",
    "",
    ""
  ],
  [
    true,
    "Sizes",
    "Bangle size",
    "Bangle size",
    "choice",
    "2.2|2.4|2.6|2.8|2.10|Not sure",
    false,
    "Pick the closest.",
    "Bangle size is the inside width across the bangle.\nIf you have a bangle that fits well, lay it flat and measure straight across the inside, edge to edge.\nIf not, close your hand with your thumb and little finger together and measure across the widest part of your hand.\nSizes: 2.2 is about 54 mm, 2.4 is 57 mm, 2.6 is 60 mm, 2.8 is 63 mm and 2.10 is 65 mm (sellers vary slightly).\nNot sure? Pick \"Not sure\" and I will sort it out.",
    "",
    "",
    ""
  ],
  [
    true,
    "Food",
    "Allergies",
    "Allergies or sensitivities",
    "paragraph",
    "",
    true,
    "Food, scents, pets... or write \"none\".",
    "",
    "",
    "",
    ""
  ],
  [
    true,
    "Food",
    "Food preferences",
    "Food preferences",
    "multi",
    "No beef|Pescatarian|Vegetarian|No seafood|No green veggies|High protein|No spicy food|Gluten-free|Dairy-free|Avoiding raw, deli or soft-cheese foods",
    false,
    "",
    "",
    "",
    "Anything else?",
    ""
  ],
  [
    true,
    "Food",
    "Main",
    "Which main would you pick?",
    "choice",
    "Braised short rib|Soy-honey-Dijon salmon|Either is great",
    false,
    "",
    "",
    "",
    "",
    ""
  ],
  [
    true,
    "Food",
    "Alcohol",
    "Alcohol?",
    "choice",
    "Yes please|Just a little|No thanks (mocktail please)",
    false,
    "",
    "",
    "",
    "",
    ""
  ]
];

/* The starter wording: [setting, value, what it does]. */
var STARTER_SETTINGS = [
  [
    "pageTitle",
    "A little something",
    "The big heading on the page."
  ],
  [
    "hostName",
    "Kiru",
    "Your name, shown as \"from ...\" on the place card."
  ],
  [
    "intro",
    "A little something is coming. Help me get the details right.",
    "The line under the heading. Change it to whatever you like."
  ],
  [
    "submitButton",
    "Send",
    "The text on the send button."
  ],
  [
    "thanksTitle",
    "Thank you!",
    "The heading after someone sends her answers."
  ],
  [
    "thanksMessage",
    "Got it. I cannot wait for you to see what I have been planning.",
    "The message after someone sends her answers."
  ],
  [
    "notifyEmail",
    "",
    "Optional. Put your email here to get an email for every submission."
  ]
];


/* ---------------------------------------------------------------------
   1. SETUP  (run this one time)
   --------------------------------------------------------------------- */
function setup() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // ----- Questions tab -----
  var questionsSheet = getOrCreateSheet(spreadsheet, SHEET_QUESTIONS);
  if (questionsSheet.getLastRow() === 0) {
    questionsSheet.getRange(1, 1, 1, QUESTION_HEADERS.length).setValues([QUESTION_HEADERS]);
    questionsSheet.getRange(2, 1, STARTER_QUESTIONS.length, QUESTION_HEADERS.length).setValues(STARTER_QUESTIONS);
    questionsSheet.getRange(1, 1, 1, QUESTION_HEADERS.length).setFontWeight('bold');
    questionsSheet.setFrozenRows(1);
    questionsSheet.getRange(2, 1, STARTER_QUESTIONS.length, 1).insertCheckboxes();   // the Show column
    questionsSheet.getRange(2, 7, STARTER_QUESTIONS.length, 1).insertCheckboxes();   // the Required column
    questionsSheet.getRange(1, 5).setNote('text, paragraph, choice (pick one), multi (pick many) or colours');
    questionsSheet.getRange(1, 6).setNote('Separate the choices with the | symbol, for example:  Red|Blue|Green');
    questionsSheet.getRange(1, 3).setNote('This becomes the column title in your Answers tab. Keep it short.');
  }

  // ----- Settings tab -----
  var settingsSheet = getOrCreateSheet(spreadsheet, SHEET_SETTINGS);
  if (settingsSheet.getLastRow() === 0) {
    settingsSheet.getRange(1, 1, 1, 3).setValues([['Setting', 'Value', 'What it does']]);
    settingsSheet.getRange(2, 1, STARTER_SETTINGS.length, 3).setValues(STARTER_SETTINGS);
    settingsSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    settingsSheet.setColumnWidth(2, 360);
  }

  // ----- Answers tab (the headings follow your questions) -----
  var answersSheet = getOrCreateSheet(spreadsheet, SHEET_ANSWERS);
  if (answersSheet.getLastRow() === 0) {
    var headings = ['Timestamp'];
    for (var i = 0; i < STARTER_QUESTIONS.length; i++) { headings.push(STARTER_QUESTIONS[i][2]); }
    answersSheet.getRange(1, 1, 1, headings.length).setValues([headings]);
    answersSheet.getRange(1, 1, 1, headings.length).setFontWeight('bold');
    answersSheet.setFrozenRows(1);
  }

  // Asking for the email quota makes Google show the "allow email" permission screen now,
  // so emails work later when a friend submits.
  MailApp.getRemainingDailyQuota();
}

/* Finds a tab by name, or creates it. */
function getOrCreateSheet(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  return sheet ? sheet : spreadsheet.insertSheet(name);
}


/* ---------------------------------------------------------------------
   2. READING  (the website asks for the questions and wording)
   --------------------------------------------------------------------- */
function doGet() {
  return jsonOutput({ ok: true, questions: readQuestions(), settings: publicSettings(readSettings()) });
}

/* Turns anything a person might type in a checkbox/yes-no cell into true or false. */
function toBoolean(value, defaultValue) {
  if (value === true || value === false) { return value; }
  var text = String(value).trim().toLowerCase();
  if (text === '') { return defaultValue; }
  return text === 'true' || text === 'yes' || text === 'y' || text === '1';
}

/* Reads the Questions tab into a list of question objects. */
function readQuestions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
  var questions = [];
  if (!sheet || sheet.getLastRow() < 2) { return questions; }

  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  function column(title) { return headers.indexOf(title); }

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    function cell(title) { var c = column(title); return c === -1 ? '' : row[c]; }

    var label = String(cell('Question')).trim();
    if (!label) { continue; }                                   // skip empty rows
    if (!toBoolean(cell('Show'), true)) { continue; }           // skip rows switched off

    var options = [];
    var rawOptions = String(cell('Options')).split('|');
    for (var o = 0; o < rawOptions.length; o++) {
      if (rawOptions[o].trim()) { options.push(rawOptions[o].trim()); }
    }
    questions.push({
      section: String(cell('Section')).trim(),
      column: String(cell('Column title')).trim() || label,
      label: label,
      type: String(cell('Type')).trim().toLowerCase() || 'text',
      options: options,
      required: toBoolean(cell('Required'), false),
      hint: String(cell('Hint')),
      help: String(cell('Help')),
      placeholder: String(cell('Placeholder')),
      other: String(cell('Other box')).trim(),
      max: parseInt(cell('Max colours'), 10) || 0
    });
  }
  return questions;
}

/* Reads the Settings tab (setting name in column A, value in column B). */
function readSettings() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SETTINGS);
  var settings = {};
  if (!sheet || sheet.getLastRow() < 2) { return settings; }
  var values = sheet.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    var key = String(values[r][0]).trim();
    if (key) { settings[key] = String(values[r][1]); }
  }
  return settings;
}

/* The website only needs the public parts of the settings (never your email address). */
function publicSettings(settings) {
  var copy = {};
  for (var key in settings) { if (key !== 'notifyEmail') { copy[key] = settings[key]; } }
  return copy;
}


/* ---------------------------------------------------------------------
   3. SAVING  (a friend taps Send)
   --------------------------------------------------------------------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);                                       // one submission at a time, so rows never mix
    var body = (e && e.postData && e.postData.contents) || '{}';
    if (body.length > 60000) { return jsonOutput({ ok: false, error: 'too big' }); }
    var payload = JSON.parse(body);

    if (payload.hp) { return jsonOutput({ ok: true }); }        // a hidden field only robots fill in: ignore them
    var answers = cleanAnswers(payload.answers);
    if (Object.keys(answers).length === 0) { return jsonOutput({ ok: false, error: 'no answers' }); }

    saveAnswers(answers);
    sendEmailNotification(answers);
    return jsonOutput({ ok: true });
  } catch (error) {
    return jsonOutput({ ok: false, error: String(error) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) { }
  }
}

/* Keeps only text answers of a sensible size. A value starting with = + - or @ gets a ' in front,
   so nobody can sneak a spreadsheet formula into your Sheet. */
function cleanAnswers(raw) {
  var clean = {};
  if (!raw || typeof raw !== 'object') { return clean; }
  var count = 0;
  for (var key in raw) {
    if (!raw.hasOwnProperty(key) || count >= MAX_FIELDS) { continue; }
    var heading = neutralise(String(key).trim().substring(0, 100));
    if (!heading) { continue; }
    clean[heading] = neutralise(String(raw[key]).substring(0, MAX_CELL_LENGTH));
    count++;
  }
  return clean;
}

function neutralise(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/* Adds one row to the Answers tab. New questions automatically get a new column. */
function saveAnswers(answers) {
  var sheet = getOrCreateSheet(SpreadsheetApp.getActiveSpreadsheet(), SHEET_ANSWERS);
  var lastColumn = sheet.getLastColumn();
  var headings = lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  if (headings.length === 0) { headings = ['Timestamp']; }

  var headingsChanged = (lastColumn === 0);
  for (var key in answers) {
    if (headings.indexOf(key) === -1) { headings.push(key); headingsChanged = true; }   // a new question
  }
  if (headingsChanged) {
    sheet.getRange(1, 1, 1, headings.length).setValues([headings]);
    sheet.getRange(1, 1, 1, headings.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var row = [];
  for (var i = 0; i < headings.length; i++) {
    if (i === 0) { row.push(new Date()); }
    else { row.push(answers.hasOwnProperty(headings[i]) ? answers[headings[i]] : ''); }
  }
  sheet.appendRow(row);
}

/* Emails you a copy if you put your email in the Settings tab. */
function sendEmailNotification(answers) {
  try {
    var email = String(readSettings().notifyEmail || '').trim();
    if (!email) { return; }
    var lines = [];
    for (var key in answers) { lines.push(key + ': ' + answers[key]); }
    var who = answers['Name'] || 'a bridesmaid';
    MailApp.sendEmail(email, 'New answers from ' + who, lines.join('\n'));
  } catch (error) {
    // An email problem should never stop the answers being saved.
  }
}

function jsonOutput(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}
