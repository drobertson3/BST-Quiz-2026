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

## Classes and the class battle

Two classes ship by default: **DRO** and **DJK**. To rename them or add a third, edit `CLASSES` in **both** `quiz-game/config.js` and `quiz-teacher/config.js` — the two lists must match:

```js
const CLASSES = ["DRO", "DJK"];
```

Assigning students is done entirely in the dashboard — students never pick their own class:

1. Open the dashboard → **Class list** tab.
2. Choose a class from the dropdown next to each name. It saves immediately.
3. Adding a batch of names? Pick the class in the "Add to class" dropdown first and they'll all be assigned on the way in.

Once at least one student is assigned, the **Class battle** tab appears with three scoreboards — total XP, average accuracy, and average XP per active player — plus participation rates and per-class topic accuracy. Students see a condensed version at the top of their Leaderboard screen, and can filter the individual rankings by class.

Unassigned students still appear in individual rankings but are excluded from the class battle.

---

## Game modes

Every mode feeds the same XP, accuracy, topic and badge totals, so nothing is a side game.

| Mode | What it is | Notes |
|---|---|---|
| 🚀 **Multiple Choice Quiz** | Pick topics, years and length | The original mode |
| ✍️ **Short Answer Quiz** | Type a Section II answer and hand it in | You mark it — see below |
| ⚖️ **Peer Marking** | Mark a classmate's marked answer | XP for how close they get to your mark |
| 📮 **My Answers** | Their marks and your feedback | Flags newly marked work |
| 🔁 **My Mistakes** | Retry what they got wrong | Clears as they get them right |
| 📆 **Daily Challenge** | 5 questions, same for the whole cohort, one attempt a day | Ranked by score then time. Perfect run +50 XP; streak days +5 XP each (capped +50) |
| 💀 **Survival** | Sudden death — one wrong answer ends the run | XP climbs from 10 to 50 per answer as the run deepens. Personal bests on a leaderboard |
| 📄 **Exam Simulation** | 20 multiple choice in 20 minutes | Pausable, no feedback until submit, then mark + indicative band + full worked review. +40 XP for sitting the paper |
| 🥊 **Duels** | Challenge anyone to the same 10 questions | Asynchronous — play whenever. Settles when both finish; ties broken by time |
| 🗺️ **Content Mapper** | A real HSC question, un-answered — place it in the syllabus via Topic › syllabus area dropdowns | 394 tagged questions (MC and short answer). Questions spanning two areas accept either; the feedback shows the rest |
| 🧠 **Syllabus Drills** | Four games on the NESA "students learn about" dot points | Where Does It Belong?, Fill the Subtopic, Odd One Out, Fill the Gap |
| 🔗 **Matching** | Pair terms with definitions against the clock | Each round is drawn from one subtopic, so the definitions are genuinely hard to tell apart |
| 🎴 **Flashcards** | Spaced repetition over the 307-term glossary | Light SM-2: cards rated *Easy* return in weeks, *Again* returns the same session |
| 📖 **Definition Quiz** | Auto-generated multiple choice on terminology | Distractors come from the same subtopic. Can run in reverse (given the definition, name the term) |
| ⛓️ **Chain Builder** | Rebuild a cause-and-effect chain in the right order | 53 chains. Counts as correct only if built with no wrong taps |
| 📐 **Diagram Labelling** | Tap a label, then tap where it belongs | 10 diagrams: operations process, product life cycle, break-even, Gantt, critical path, distribution channels, HR cycle, SWOT, balance sheet, working capital cycle |

**Concept modes vs exam questions.** Content Mapper, Matching, Flashcards, Definition Quiz, Chain Builder, Diagram Labelling and Syllabus Drills all earn XP and feed the topic analysis, but they're deliberately excluded from the badges that describe sitting exam questions (Sharpshooter, Perfectionist, the topic-mastery badges). Pairing a term is an easier win than an HSC multiple choice, and the mastery badges should still mean something. They also never write to **My Mistakes**, which stays a bank of past HSC questions only.

**Daily Challenge questions** are chosen by a date seed, so every student in every class gets the identical five each day and nobody can reroll. **Duel questions** work the same way off the duel ID, so both players face the same paper.

Duels are stored in a `duels` collection in Firestore, and short answers in a `responses` collection. In device-only mode both stay in that browser's localStorage — so duels, teacher marking and peer marking all need Firebase set up.

---

## Short answer marking

Students **type** their Section II answers and hand them in. Nothing is self-marked and nothing is scored until you mark it.

**The flow**

1. Student writes an answer in ✍️ Short Answer and hands it in. They earn **15 XP** just for submitting — the mark-based XP comes later.
2. It lands in the dashboard's **Marking** tab. The tab shows a red count of what's waiting, oldest first.
3. You see their answer, the NESA criteria, the sample answer and the question image. Pick a mark, optionally type feedback, and hit **Approve & release mark**.
4. Approving credits the student: XP (10 per mark, +5 for full marks on 2+ mark questions), their short-answer totals, topic and subtopic breakdowns, and any badges. They see it in 📮 **My Answers**.

**Changing your mind.** Hit **Re-mark** on any marked answer. It goes back in the queue, and approving a new mark adjusts the student's totals by the difference — nothing is double-counted.

### Marking with Cowork (no API key needed)

Every answer in the queue has a **📋 Copy for marking** button. It copies a ready-made block to your clipboard:

- a prompt telling Claude to mark critically against the NESA guidelines and give short feedback if it's not full marks
- the question — year, number, part, marks available, topic
- the **official NESA marking guidelines** and sample answer for that exact question, pulled from the app
- the student's answer

Paste that into Cowork and it comes back with a mark and feedback. Type them into the marking box and hit **Approve & release mark**.

The student's name is deliberately left out of the copied block, so you're marking the work rather than the person.

**Copy all in this filter** does the whole queue in one go — respects whichever class filter is active, so you can do DRO in one paste and DJK in another. Each answer comes back labelled with the student's name so you can match them up.

### AI marking assistant (optional, costs money)

If you'd rather not copy and paste, an Anthropic API key in `AI_CONFIG` in **`quiz-teacher/config.js`** adds a **🤖 Get AI suggestion** button that marks in place. It's the same job as the Cowork route, just automated — skip it unless the copy-paste flow becomes a chore. Setup is further down this guide.

Either way, nothing reaches a student until you approve it.

### Peer marking

Once you've marked some answers, ⚖️ **Peer Marking** opens up for students. They're shown an **anonymous** classmate's answer alongside the official criteria and asked what mark they'd give.

| How close to your mark | XP |
|---|---|
| 🎯 Exactly right | 30 |
| 👏 One mark out | 15 |
| 🤏 Two marks out | 5 |
| Three or more | 0 |

Students never get their own work, and can only mark each answer once. Several students can mark the same answer — the dashboard's **Already marked** section shows the spread of peer marks next to yours, and flags any that were two or more marks off. A wide spread is a good signal that the criteria are worth going through in class.

Peer marking earns XP but deliberately does **not** count toward answering accuracy or the "complete N quizzes" badges — it's marking practice, not question practice.

The dashboard shows every mode in Recent activity and in each student's detail popup, alongside their earned badges.

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

   These rules cover every collection the game uses — `students`, `meta`, `duels`
   and `responses` — so nothing extra is needed when you start using short answer
   marking or duels. If you've tightened the rules to name collections individually,
   remember to add `duels` and `responses`.

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
   `quiz-game` folder (index.html, config.js, data.js, data-sa.js, store.js,
   syllabus-content.js, syllabus-games.js, glossary.js, chains.js, diagrams.js,
   SETUP.md and the `assets` folder — you can skip `_build-files`). Commit.
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

## AI marking assistant — setup (optional, costs money)

**You don't need this.** The **📋 Copy for marking** button in the Marking tab does the
same job through Cowork at no cost. Only set this up if you'd rather the dashboard mark
in place without copying and pasting.

To turn it on (~10 min):

1. Go to https://console.anthropic.com and create an account.
2. **Billing → Add credit.** The API is prepaid — put in US$5 to start. Then set a
   **monthly spend limit** (Limits → e.g. US$10) so it can never surprise you.
   Marking one answer costs well under a cent on Haiku, so $5 goes a very long way.
3. **API Keys → Create key**, name it `hsc-quiz`, copy it (starts with `sk-ant-`).
   You only get to see it once — copy it straight away.
4. Paste it into **`quiz-teacher/config.js`** (the dashboard, not the student game):

```js
const AI_CONFIG = {
  apiKey: "sk-ant-...your key...",
  model: "claude-haiku-4-5-20251001",   // cheapest, plenty good for marking
  // model: "claude-sonnet-5",          // ~2x the cost, a bit more precise on 5–6 mark answers
};
```

5. Save / re-upload config.js. Each answer in the Marking tab now has a
   **🤖 Get AI suggestion** button.

**Security note:** the key sits in the dashboard, which is password-protected and
deployed separately from the student site, so students never receive it. It is still
visible to anyone who can open your dashboard's source, which is why the spend limit in
step 2 matters — it caps the worst case. Use a key created just for this, and if it's
ever misused, delete it in the console and make a new one.

**The AI never marks a student directly.** Its suggestion only becomes a mark when you
press Approve.

---

## Everyday use

- **Students:** open the link → tap their name → PIN → play. Everything else is automatic
  (XP, levels, badges, streaks, leaderboard, My Mistakes).
- **You:** open your dashboard link → password → see class stats, per-student detail
  (click any row), topic heatmap, weakest syllabus areas, and manage the class list.
- **Question bank:** 280 Section I multiple-choice questions plus 160 Section II
  short-answer questions, 2012–2025 HSC papers, shown as the original exam scans —
  MC with explanations, short answers with official NESA criteria and sample answers.
- Multi-answer questions (where NESA accepted two answers, e.g. 2017 Q4) accept either letter.

## Troubleshooting

- **"No students yet" at login** — add names to `CLASS_LIST` in config.js and refresh.
- **Yellow banner won't go away** — check the `firebaseConfig` block is filled in (in
  that site's own config.js) and you created the Firestore database (step 5).
- **Charts not showing** — the progress chart needs internet (it loads a chart library);
  everything else works offline.
- **Student forgot PIN** — dashboard → Students tab → click their row → Reset PIN.
