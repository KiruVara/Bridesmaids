# Setup: connect the page to your Google Sheet (about 15 minutes, free)

You will end up with a pretty page for your bridesmaids. When one taps **Send**,
her answers appear as a new row in your Google Sheet straight away. The questions
live in that same Sheet, so you edit them there and never need to re-upload anything.

Google's menus change names now and then. Follow the closest match if a word differs.

---

## Step 1. Make the Sheet
1. Go to https://sheets.google.com and start a **Blank spreadsheet**.
2. Name it something like `Bridesmaid answers`.

## Step 2. Add the script
1. In the Sheet, open **Extensions > Apps Script**. A code editor opens in a new tab.
2. Delete everything in the editor.
3. Open `apps-script/Code.gs` from this project, copy **all** of it, and paste it into the editor.
4. Click the **Save** icon (a little disk).

## Step 3. Create the three tabs
1. At the top of the editor, find the drop-down next to **Run** and choose **setup**.
2. Click **Run**.
3. Google asks for permission. Click **Review permissions**, choose your account, then:
   - You may see "Google hasn't verified this app". That is normal because you wrote it yourself. Click **Advanced**, then **Go to ... (unsafe)**, then **Allow**.
   - It asks to use your spreadsheet (to add rows) and to send email (only used if you turn on email alerts below).
4. Go back to your Sheet. You now have three tabs:
   - **Questions**: what your friends are asked (you edit this)
   - **Settings**: the words on the page (you edit this)
   - **Answers**: every submission lands here, one row each

## Step 4. Publish the script so the page can talk to it
1. In the Apps Script editor, click **Deploy > New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

"Anyone" is needed so your friends' phones can reach it. It does **not** let anyone read your answers: the script only ever sends the *questions* out, never the answers.

## Step 5. Paste the address into the page
1. Open `config.js` in this project.
2. Paste the URL between the quotes:

```js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfy.../exec';
```

## Step 6. Upload to GitHub
1. Unzip the project. Upload everything inside it to your repo, at the top level, replacing what is there. (If your repo still has the old `backend`, `frontend` or `config` folders from the earlier version, delete them: open the folder on GitHub, click the three dots, then **Delete directory**.)
2. Wait a minute or two. Your page is at https://kiruvara.github.io/Bridesmaids/

## Step 7. Test it properly (please do all of these)
1. Open your page with `?check` on the end: `https://kiruvara.github.io/Bridesmaids/?check`. Near the bottom it should say **Questions come from: Your Google Sheet**. If it says "Built-in questions", the address in `config.js` is wrong or the deployment is not set to Anyone.
2. Fill it in as a test (use a fake name like `TEST`) and tap **Send**.
3. Open the **Answers** tab in your Sheet. A new row should appear within a few seconds.
4. Delete the test row.

The page can only tell that the request *left the phone*, not that Google wrote the row (this is how browsers treat Google scripts). So if friends see "Thank you" but no row appears, the setup in step 4 is the first thing to recheck. That is why step 7 matters.

---

## Editing your questions and wording (no re-uploading)
Change the **Questions** and **Settings** tabs, then refresh the page. That's it.

### The Questions tab, column by column
| Column | What to put |
|---|---|
| **Show** | Tick to show the question, untick to hide it without deleting it |
| **Section** | The group heading on the page (for example Favourites). Questions with the same section sit together |
| **Column title** | A short name. It becomes the column heading in your **Answers** tab |
| **Question** | The question your friends see |
| **Type** | `text` (one line), `paragraph` (bigger box), `choice` (pick one), `multi` (pick many), or `colours` (colour circles) |
| **Options** | For `choice` and `multi`: the choices, separated by the **\|** symbol, like `Red\|Blue\|Green` |
| **Required** | Tick to make it compulsory |
| **Hint** | A small italic line under the question |
| **Help** | Longer help. It opens under a "How do I know?" link (used for bangle size) |
| **Placeholder** | Grey example text inside a text box |
| **Other box** | For `choice`, `multi`, `colours`: add a "something else?" box. Type the grey hint, such as `Another flower?` |
| **Max colours** | For `colours`: the most circles a friend can pick |

- **Reorder** questions by moving rows. **Add** a question by filling a new row. **Remove** one by unticking Show.
- **Add a question later:** its answers get their own new column in the Answers tab automatically.
- If you **rename a Column title**, the Answers tab starts a new column for it and older rows keep the old column.

### The Settings tab
`pageTitle`, `hostName`, `intro`, `submitButton`, `thanksTitle`, `thanksMessage`.

### Email alerts (optional)
Type your email in the **notifyEmail** row of Settings. You then get an email for every submission, with all the answers in it. (Google limits free accounts to roughly 100 script emails a day, which is plenty here.)

### Changing the script itself
If you ever edit `Code.gs`, redeploy so the change takes effect: **Deploy > Manage deployments**, click the pencil, set **Version** to **New version**, then **Deploy**. The web address stays the same.

---

## Good to know
- **The link is public.** Anyone who has it can open the page and send answers, so keep it inside your bridesmaid group. There are no passwords by design.
- **Strangers cannot read your answers.** The script never sends answers (or your email address) to the page.
- **Sending twice:** if a friend sends again after changing something, you get a second row. Use the newest one (the Answers tab has a Timestamp).
- **Spreadsheet safety:** if someone types something that starts with `=`, `+`, `-` or `@`, the script puts a `'` in front so it can't run as a formula in your Sheet.
- **Before you finish setup**, the page still works with built-in questions, but **Send** only copies the answers instead of saving them.

## What was tested and what was not
The script's logic was tested against a pretend Google Sheet (20 checks) and the page against a pretend script (37 checks), including editing questions in the Sheet, required questions, failures and refreshes. It has **not** been tested against your real Google account, which is what step 7 is for.
