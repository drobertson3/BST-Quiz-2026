# Deployment checklist — PIN login + Tasks release

This build keeps the original **name + 4-digit PIN** student login and a single
**dashboard password** (Google SSO was abandoned — its code survives in the
`.bak` files if ever wanted again). New in this build: **Assigned Tasks**
(teacher-built tests), **Weak Spots**, **printing**, an **Admin tab**
(announcements, PIN resets, XP corrections), richer analytics, and a large
round of bug fixes and anti-cheating guards. Work top to bottom.

---

## 1. Before you upload — two things (~5 min)

### a) Change the dashboard password

`quiz-teacher/config.js` currently says:

```js
const TEACHER_PASSWORD = "SCAS-bst-2026";
```

Change it to something only you know.

### b) Publish the new Firestore rules

Firebase console → bst-quiz-2026 → **Firestore → Rules** → paste the FULL
contents of `FIRESTORE-RULES.txt` → **Publish**. No Firebase *Authentication*
setup is needed — these rules work without sign-in. They still block the worst
abuse shapes (giant XP jumps, students rewriting marks), but be aware: with no
sign-in identity, anyone with the project config can write within those limits.
That's the trade-off of PIN login; the rules file's header explains it.

---

## 2. Upload the student game

Repo: **`BST-Quiz-2026`** → live at https://drobertson3.github.io/BST-Quiz-2026/

| File | Changed? |
|---|---|
| `index.html` | ✅ heavily — PIN login, Assigned Tasks, Weak Spots, printing, announcements card, bug fixes, polish |
| `store.js` | ✅ heavily — task methods, XP clamps, announcements, 30 level titles |
| `study.js` | ✅ — Weak Spots weighting |
| `syllabus-games.js` | ✅ — XP clamp fix |
| `config.js` | ✅ — comments updated |
| `data.js`, `data-sa.js` | ✅ if your live copies predate the re-tagging |
| `glossary.js`, `chains.js`, `diagrams.js`, `syllabus-content.js` | unchanged this round |
| `.nojekyll` | must exist |
| all `.png` files | unchanged if already there |

**Do NOT upload:** `*.bak` files, `.DS_Store`, `marker.js`, `DEPLOY.md`,
`GOOGLE-SSO-SETUP.md`, `FIRESTORE-RULES.txt`, `SETUP.md`,
`Question-syllabus-mapping-review.csv`.

## 3. Upload the teacher dashboard

Your second repo (the unguessable-name one):

| File | Changed? |
|---|---|
| `index.html` | ✅ heavily — password gate, **Tasks tab**, **Admin tab**, analytics, polish |
| `store.js` | ✅ heavily — task CRUD, admin methods, announcements, XP clamps |
| `config.js` | ✅ — your NEW password |
| `data.js` | 🆕 **NEW FILE** — the MC bank for the task builder's picker |
| `data-sa.js` | ✅ — re-synced syllabus tags |
| `marker.js`, `syllabus.js` | unchanged |

Miss `data.js` and the Tasks tab's question picker will be empty.

---

## 4. Check it worked

Wait ~2 minutes, then **hard refresh** (Cmd+Shift+R).

**Student site:**

- [ ] Login shows "Who's playing?" with the class roster — no Google button
- [ ] Home shows the **Assigned tasks** section and the **🎯 Weak Spots** tile
- [ ] MC quiz setup has a **Print** button producing a blank A4 paper
- [ ] Play 2 questions — XP goes up; level shows one of the new titles

**Dashboard:**

- [ ] Your new password opens it
- [ ] Tabs: Overview, Students, Topic analysis, Marking, **Tasks**, Class
      battle, Class list, **Admin**
- [ ] Tasks → New task → picker lists ~280 MC + 160 SA with filters/previews
- [ ] Admin → post an announcement → it appears on the student home screen

**End-to-end (10 min, before students do it):**

- [ ] Class list → add a test student
- [ ] Log in as them on the game → set a PIN → the assigned task card appears
      (build a 2 MC + 1 SA task first) → complete and hand in → Print works
- [ ] Dashboard → Tasks → grid shows "Handed in" with the MC score; Marking
      has the SA answer → mark → release
- [ ] Back as the student → task shows "Marked" with mark and feedback
- [ ] Admin → Reset PIN on the test student → their next login asks for a new PIN

---

## 5. First lesson setup

1. Dashboard → **Class list** → add students (name + class DRO/DJK).
2. Students pick their name and set a 4-digit PIN on first login. Anyone whose
   PIN was cleared during the Google experiment simply sets a fresh one.
3. Forgotten PIN → Admin tab → Reset PIN.

## Existing student data

Records are keyed by name, unchanged — all XP, badges, streaks and history are
untouched by the login change.

## Rolling back

GitHub keeps every version: repo → History → previous commit → Revert. A local
pre-change snapshot of the code also exists from the 26 Aug 2026 session.
Firestore data is unaffected — but roll rules back together with code.
