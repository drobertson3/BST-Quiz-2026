# Deployment checklist — new version

Your live site is currently running an old build (no Short Answer, no classes, no new
modes). This replaces it. Work top to bottom.

---

## 1. Before you upload — two things to fix

### a) Change the dashboard password

`quiz-teacher/config.js` still says:

```js
const TEACHER_PASSWORD = "change-me";
```

Change it to something only you know. Anyone who finds the dashboard URL can currently
open it, see every student's work, and change marks.

### b) Decide how students get on the class list

`quiz-game/config.js` still only has `"Demo Student"`. Two options — either is fine:

- **Type them into config.js now** — names appear the moment the site goes live.
- **Add them from the dashboard later** (Class list tab → paste names, one per line).
  Saved to Firebase, no re-upload needed. This is easier and lets you set each student's
  class (DRO / DJK) at the same time.

If you go with the dashboard, leave `CLASS_LIST` as-is.

---

## 2. Upload the student game

Repo: **`BST-Quiz-2026`** → live at https://drobertson3.github.io/BST-Quiz-2026/

Upload these files, **overwriting** what's there:

| File | Changed? |
|---|---|
| `index.html` | ✅ heavily — all new modes |
| `store.js` | ✅ heavily — classes, duels, responses, peer marking |
| `config.js` | ✅ — added `CLASSES`, removed the AI key block |
| `data.js` | unchanged — only re-upload if it's missing |
| `data-sa.js` | ⚠️ **may be missing entirely** — the old build had no Short Answer |
| `syllabus-content.js` | 🆕 **NEW FILE** — the NESA dot points behind Syllabus Drills |
| `glossary.js` | 🆕 **NEW FILE** — 307 terms behind Matching, Flashcards & Definition Quiz |
| `chains.js` | 🆕 **NEW FILE** — 53 cause-and-effect chains behind Chain Builder |
| `diagrams.js` | 🆕 **NEW FILE** — the 10 diagrams behind Diagram Labelling |
| `syllabus-games.js` | 🆕 **NEW FILE** — the four Syllabus Drills games |
| `.nojekyll` | unchanged — must exist |
| all `.png` files | unchanged if already there |

**Do NOT upload:** `_build-files/` (old archived copies), `.DS_Store`, `marker.js`
(no longer used by the student game).

**How:** open the repo → **Add file → Upload files** → drag the files in → Commit.
GitHub overwrites files with the same name automatically.

> If `data-sa.js` isn't already in the repo, Short Answer mode will silently fail —
> check the repo file list for it before you finish. Same goes for the two
> `syllabus-*.js` files and for `glossary.js`, `chains.js` and `diagrams.js` —
> miss any one and the tile that depends on it will do nothing when tapped.

---

## 3. Upload the teacher dashboard

Your second repo (the unguessable-name one). Upload:

| File | Changed? |
|---|---|
| `index.html` | ✅ heavily — Marking tab, Class battle, badges |
| `store.js` | ✅ heavily — same file as the game's copy (badge logic must match) |
| `config.js` | ✅ — added `CLASSES`, `AI_CONFIG`, your new password |
| `data-sa.js` | 🆕 **NEW FILE** — needed to show questions and criteria while marking |
| `marker.js` | 🆕 **NEW FILE** — only used if you add an AI key; harmless without one |
| `syllabus.js` | unchanged |

`data-sa.js` and `marker.js` are new to this folder. Miss `data-sa.js` and the marking
queue won't show the NESA criteria or the question image.

---

## 4. Check it worked

Give it ~2 minutes after committing, then **hard refresh** (Ctrl+F5 / Cmd+Shift+R) —
browsers cache aggressively and you'll otherwise see the old version.

**Student site:**

- [ ] Home menu shows: Multiple Choice Quiz, Short Answer Quiz, Peer Marking,
      My Answers, Content Mapper, Matching, Flashcards, Definition Quiz,
      Chain Builder, Diagram Labelling, Syllabus Drills, My Mistakes,
      Daily Challenge, Survival, Exam Simulation, Duels, Leaderboard, My Progress
- [ ] Tap **Content Mapper** — a question appears and the syllabus-area dropdown
      stays greyed out until a topic is chosen
- [ ] Tap **Matching** — a round deals 6 terms against 6 definitions
- [ ] Tap **Diagram Labelling** — 10 diagrams listed, and one opens with 5 chips
- [ ] **No yellow banner** at the top (a banner means Firebase isn't connecting)
- [ ] Leaderboard shows a **Questions** column, not Quizzes
- [ ] Play 2 questions — XP goes up

**Dashboard:**

- [ ] Your new password works
- [ ] Tabs: Overview, Students, Topic analysis, Marking, Class battle, Class list
- [ ] Class list tab shows a class dropdown next to each name

**End-to-end (5 min, do this before the students do):**

- [ ] Log in as a student → Short Answer Quiz → type anything → hand in
- [ ] Dashboard → Marking tab → the answer is there with a red count
- [ ] Click **📋 Copy for marking** → paste into Cowork → it returns a mark
- [ ] Enter that mark → **Approve & release mark**
- [ ] Back as the student → My Answers → the mark and feedback are showing

---

## 5. First lesson setup

1. Dashboard → **Class list** → add all students, set each to DRO or DJK.
2. Students log in and set a 4-digit PIN (first login only).
3. Peer Marking stays greyed out until you've marked a few answers — that's expected,
   not a bug.

---

## Existing student data

Everyone's XP, badges, streaks and mistakes carry over untouched. The new fields
(classes, duel records, peer marking stats) default in safely for students who already
have accounts — no reset needed.

## Rolling back

GitHub keeps every version. Repo → **History** → pick the previous commit → **Revert**.
Student data in Firebase is unaffected either way.
