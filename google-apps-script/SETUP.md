# Google Sheets setup (RSVP + Wishes)

Spreadsheet: https://docs.google.com/spreadsheets/d/1BpuBO2D7z7poa7VnrP6XrHWirM5bkYamGvIvxtMGPl8/edit

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete everything in `Code.gs` and paste the contents of `google-apps-script/code.gs`.
3. Save. (Optional) select `setupSheets` in the toolbar and click **Run** to create the
   `RSVP` and `Wishes` tabs immediately. Otherwise they are created, with headers,
   on the first submission.
4. **Deploy → New deployment** → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize, then copy the **Web app URL** (ends in `/exec`).
6. In the project root create `.env`:

   ```
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
   ```

   On Vercel/Netlify, add the same variable in the project's Environment Variables and redeploy.
7. Restart `npm run dev`.

Sheet columns:

| Tab | Columns |
| --- | --- |
| RSVP | Timestamp, Full Name, Phone, Attendance, Guests, Message / Notes, Invited As |
| Wishes | Timestamp, Name, Wish / Message, Invited As |

If you edit `code.gs` later: **Deploy → Manage deployments → Edit → Version: New version → Deploy**
(the URL stays the same).
