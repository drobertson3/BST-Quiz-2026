# HSC Business Studies Quiz Arena — Setup Guide

There are TWO folders, deployed separately so students can never see the dashboard or its password:

| Folder | What it is | Who gets the link |
|---|---|---|
| `quiz-game` | The student game | Students |
| `quiz-teacher` | Your dashboard (password + settings live here) | Only you |

The game works in three levels of setup. You can start at Level 1 right now and upgrade later.

| Level | What works | Effort |
|---|---|---|
| 1. Open the file | Full game on one computer, results saved in that browser only | 0 min |
| 2. + Firebase | Results from every student sync to your dashboard | ~10 min |
| 3. + GitHub Pages | Students play from any device via a link | ~10 min |

---

## Level 1 — Try it now (no setup)

1. Open `index.html` in the `quiz-game` folder (double-click it).
2. Log in as **Demo Student**, create any PIN, play a quiz.
3. Open `index.html` in the `quiz-teacher` folder, password `change-me`, to see the dashboard.

A yellow banner reminds you results are device-only until Firebase is set up.

## Add your class list

1. Open `quiz-game/config.js` in any text editor (Notepad / TextEdit works).
2. Replace the names in `CLASS_LIST`:

```js
const CLASS_LIST = [
  "Oscar",
  "Jane Citizen",
  "Sam Smith",
];
```

3. In `quiz-teacher/config.js`, change `TEACHER_PASSWORD` from `"change-me"` to your own password.
4. Save. Done. (You can also add/remove students later from the dashboard's Class list tab.)

Students pick their name and create their own 4-digit PIN the first time they log in. You can reset a PIN from the dashboard.

---

## Level 2 — Firebase (results sync to your dashboard)

Firebase is a free Google service. One-time setup:

1. Go to https://console.firebase.google.com and sign in with any Google account.
2. Click **Create a project** (call it e.g. `hsc-quiz`). Google Analytics: not needed — switch it off.
3. Once created, click the **web icon `</>`** ("Add app"), nickname it `quiz`, click **Register app**.
4. You'll be shown a code block containing `firebaseConfig = { apiKey: "...", ... }`.
   Paste it over the `firebaseConfig` block in BOTH `quiz-game/config.js` and
   `quiz-teacher/config.js` (both sites must point at the same Firebase project).
5. In the left menu: **Build → Firestore Database → Create database**.
   - Location: `australia-southeast1` (Sydney).
   - Start in **test mode** for now (fine for a class quiz).
6. Recommended: after creating the database, open the **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

   (Test mode expires after 30 days — this keeps it working. It's open access,
   which is acceptable for quiz scores; don't store anything sensitive.)

7. Save both config files, refresh the game. The yellow banner disappears — you're live.

Now every student's results appear in your dashboard regardless of which device they used.

---

## Level 3 — GitHub Pages (students play from anywhere)

You'll create TWO repositories — one per folder — so the dashboard has a completely
separate address that students never see.

**Student game:**

1. Create a free account at https://github.com if you don't have one.
2. Click **+ → New repository**. Name: `hsc-quiz`. Set it to **Public**. Create.
3. Click **uploading an existing file** and drag in the ENTIRE contents of the
   `quiz-game` folder (index.html, config.js, data.js, store.js, SETUP.md and the
   `assets` folder — you can skip `_build-files`). Commit.
   - If the assets folder is too big for one drag, upload it in a couple of batches —
     GitHub allows 100 files per drag.
4. Go to **Settings → Pages**. Under "Branch", choose `main` and `/ (root)`. Save.
5. After ~2 minutes the game is live at `https://YOUR-USERNAME.github.io/hsc-quiz/`.
   That's the link you give students.

**Teacher dashboard:**

6. Create a SECOND repository. Give it a name students would never guess —
   e.g. `dr-mgmt-7k2x` (avoid words like "teacher", "admin", "quiz", "dashboard").
   Public, Create.
7. Upload the contents of the `quiz-teacher` folder (index.html, config.js,
   syllabus.js, store.js). Commit.
8. Settings → Pages → branch `main`, `/ (root)`, Save.
9. Your dashboard is at `https://YOUR-USERNAME.github.io/dr-mgmt-7k2x/`.
   Bookmark it — and don't open it on the classroom projector with the URL bar showing.
10. Optional: put the student-site URL in `quiz-teacher/config.js`
    (`STUDENT_SITE_URL`) to get a handy link button inside the dashboard.

To update the class list later: use the dashboard's Class list tab (saved in Firebase,
no re-upload needed) or edit `config.js` on GitHub (pencil icon).

**Security notes:**
- The student site contains no dashboard link and no password — students would have
  to guess the second repo's URL to even find the login page.
- GitHub Pages sites are public, so the dashboard password is only a speed bump for
  someone who finds the URL; the unguessable repo name is the real protection.
- Results data lives in Firebase, not GitHub.

---

## Everyday use

- **Students:** open the link → tap their name → PIN → play. Everything else is automatic
  (XP, levels, badges, streaks, leaderboard, My Mistakes).
- **You:** open your dashboard link → password → see class stats, per-student detail
  (click any row), topic heatmap, weakest syllabus areas, and manage the class list.
- **Question bank:** 280 Section I multiple-choice questions, 2012–2025 HSC papers,
  shown as the original exam scans, each with an explanation.
- Multi-answer questions (where NESA accepted two answers, e.g. 2017 Q4) accept either letter.

## Troubleshooting

- **"No students yet" at login** — add names to `CLASS_LIST` in config.js and refresh.
- **Yellow banner won't go away** — check the `firebaseConfig` block is filled in (in
  that site's own config.js) and you created the Firestore database (step 5).
- **Charts not showing** — the progress chart needs internet (it loads a chart library);
  everything else works offline.
- **Student forgot PIN** — dashboard → Students tab → click their row → Reset PIN.
