https://problemset.in/ is a personal project to me. 

The motive behind was to build a website that contains Mathematics question which are the dearest to me and involve thinking outisde of
the general criteria of problem solving. 

This is currently only for under-grad level. I plan to expand this as I expand my own Mathematical skills.

Reach out to me on discord at my user ID: @madhup.bh

## Updating the site's CSS/JS

`assets/app.js` and `assets/styles.css` are cached by browsers and Cloudflare for up to 4 hours.
Every page links them with a version number, e.g. `assets/app.js?v=20261108`.
**Whenever you change either file, update that number in all 7 `index.html` files** (use today's date)
so visitors get the new version immediately instead of hours later.

## Where the questions come from

The site reads the questions spreadsheet (tab "Form responses 1") directly:

- **Live copy (used first):** `…/spreadsheets/d/1M8z8EGcB6uo_P_IzucqIjjoEPRByeSBhByEI98ckxpQ/export?format=csv&gid=1277823553`.
  Edits appear on the site within seconds. This needs the sheet's sharing to stay on
  **"Anyone with the link – Viewer"**.
- **Fallback:** the "Publish to web" CSV. Keep publishing turned on; if the live copy ever fails
  (or sharing is switched off), the site uses this one automatically, which Google refreshes about every 5 minutes.

Both URLs are set at the top of `assets/app.js` (and the live one in each page's `<head>`).
