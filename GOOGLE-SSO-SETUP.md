# Login setup (PIN + password — Google sign-in is off)

*(This file keeps its old name — GOOGLE-SSO-SETUP.md — so nothing that links
to it breaks. Google sign-in itself is no longer used.)*

Google SSO didn't work reliably on the school's managed devices, so both
sites are back to the simpler pre-SSO login:

- **Students** sign in with their **name + a PIN** they choose themselves the
  first time they play, directly in the game.
- **The teacher dashboard** is behind a **single shared password**, checked
  in the browser.

## The teacher dashboard password

Open `quiz-teacher/config.js` and find:

```js
const TEACHER_PASSWORD = "SCAS-bst-2026";
```

**Change this before you deploy** — anyone with the password (and the
dashboard's URL) can see every student's results and use the Admin tools
below. There's no account system behind it: it's checked once in the
browser, and the dashboard stays unlocked for that browser tab
(`sessionStorage`) until you click **Lock** or close the tab.

This is not a strong security boundary — see the header comment in
`FIRESTORE-RULES.txt` for exactly what is and isn't protected once someone
has this password or the raw Firebase project config.

## Resetting a student's PIN

If a student forgets their PIN:

1. Open the teacher dashboard and sign in with the password above.
2. Go to the **Admin** tab.
3. Find the student in the **Student tools** list and click **Reset PIN**.
4. Confirm. Their PIN is cleared — next time they sign in with their name,
   the game will ask them to choose a new PIN, and their existing XP,
   badges and history are untouched.

The Admin tab also has **Adjust XP** (set an exact value or a `+`/`-`
change), **Reset progress** (zero everything but keep the student's name
and class on the roster), and **Remove entirely** (off the roster and their
record deleted — this cannot be undone).

## Announcements

Also on the Admin tab: write a short message and optionally give it an
expiry date, and it appears on every student's home screen until you delete
it or it expires. Plain text only.

## If you want Google sign-in back

The Google SSO implementation this dashboard used before this revert —
domain-restricted sign-in, a `TEACHER_EMAILS` allow-list, and Firestore rules
that checked a verified Google identity — still exists in the `.bak` files
in `quiz-teacher/` (`config.js.bak`, `store.js.bak`, `index.html.bak`) and in
the commit/version history if this project is under version control. If SSO
is ever worth another attempt, those are the starting point rather than
building it from scratch again.
