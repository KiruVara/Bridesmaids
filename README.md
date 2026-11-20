# Bridesmaid form (a prettier Google Form)

A themed page (white and green flowers, pink bows, candlelight) where your
bridesmaids answer a few questions. Each submission becomes a row in **your
Google Sheet**. The questions and wording are edited **in the Sheet**, not in
these files.

**Start with SETUP.md.**

## How it works
1. A friend opens the page. The page asks your Google script for the **Questions** and **Settings** tabs of your Sheet and draws the form from them. (If it can't reach the Sheet it uses the built-in copy in `content/default-content.js`.)
2. She answers. A draft is kept on her phone, so a refresh never loses it.
3. She taps **Send**. The page posts her answers to your Google script, which adds a row to the **Answers** tab (and emails you if you asked it to).
4. She sees a thank-you. She can go back and change answers; sending again adds a new row.

## Files
```
index.html                  The page the browser opens
config.js                   <-- the one thing you paste in: your Google script address
SETUP.md                    Step-by-step setup and how to edit your questions
README.md                   This file
apps-script/Code.gs         The Google script you paste into your Sheet
content/default-content.js  Built-in questions (a safety net, same as the starter)
css/                        The look (colours, layout, questions, effects)
js/
  utils.js                  Small helpers (copy, debounce)
  dom.js                    Tools for building the page
  drawings.js               Flowers, candle, glass
  content.js                Gets the questions from your Sheet
  form.js                   Draws the questions, checks them, sends the answers
  main.js                   Starts everything
assets/preview.png          The picture in link previews (kept vague on purpose)
```

## Previewing without the Sheet
Leave `SCRIPT_URL` empty in `config.js`. The page shows the built-in questions and **Send** just copies the answers. Add `?check` to the address to see where the questions came from.

## A few rules for editing the files
- Keep the quotes and commas in `config.js`.
- The order of the `<script>` lines in `index.html` matters. Do not reorder them.
