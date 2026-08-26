// ====================================================================
// WHAT TO STUDY — the forward-looking half of the analytics.
//
// My Progress records what a student has done. This screen decides what
// they should do next, by pooling every signal the app already collects
// into one score per syllabus area:
//
//   accuracy    multiple choice + syllabus drills + glossary terms, and
//               short answer by marks earned
//   coverage    areas with little or no evidence either way — usually more
//               urgent than a known weakness, and invisible on an accuracy chart
//   staleness   answered well, but not seen for weeks
//   weighting   how heavily the area actually appears in the 440-question
//               HSC bank, so effort follows the real exam
//
// Nothing here writes to the student record — it is a pure read over data
// the other modes have already saved.
// ====================================================================
"use strict";

const STUDY_MIN_EVIDENCE = 6;    // below this an area counts as untested rather than weak
const STUDY_STALE_DAYS   = 45;   // full staleness penalty at this age

// ---------- evidence gathering ----------
function studyRows(){
  const rows = {};
  for (const [topic, subs] of Object.entries(SYLLABUS))
    for (const sub of subs)
      rows[topic + '|' + sub] = { key: topic + '|' + sub, topic, sub,
        mcC:0, mcN:0, saM:0, saMT:0, sylC:0, sylN:0, termN:0, termMiss:0, bank:0, last:0 };

  // exam weighting — how often this area is actually examined
  const bank = [...QUESTIONS, ...(typeof SA_QUESTIONS !== 'undefined' ? SA_QUESTIONS : [])];
  for (const q of bank)
    for (const s of (q.subs || [])) { const r = rows[q.topic + '|' + s]; if (r) r.bank++; }

  // multiple choice, exam sim, duels, daily, survival, matching, definition quiz,
  // chains, diagrams and content mapper all land in totals.perSub
  for (const [k, v] of Object.entries((me.totals && me.totals.perSub) || {}))
    if (rows[k]) { rows[k].mcC += v[0]; rows[k].mcN += v[1]; }

  // short answer, counted in marks earned rather than questions
  if (me.sa && me.sa.perSub)
    for (const [k, v] of Object.entries(me.sa.perSub))
      if (rows[k]) { rows[k].saM += v[0]; rows[k].saMT += v[1]; }

  // syllabus drills keep their own record: [correct, total, lastSeen]
  if (me.syl && me.syl.perSub)
    for (const [k, v] of Object.entries(me.syl.perSub))
      if (rows[k]) { rows[k].sylC += v[0]; rows[k].sylN += v[1]; if (v[2] > rows[k].last) rows[k].last = v[2]; }

  // glossary terms carry both a hit rate and a timestamp
  for (const g of GLOSSARY) {
    const r = rows[g.topic + '|' + g.sub];
    if (!r) continue;
    const t = (me.terms || {})[g.id];
    if (t && t.seen) { r.termN += t.seen; r.termMiss += t.miss || 0; if ((t.last || 0) > r.last) r.last = t.last; }
  }

  // recency from every attempt that recorded which areas it touched
  for (const a of (me.attempts || []))
    for (const k of Object.keys(a.subs || {}))
      if (rows[k] && a.d > rows[k].last) rows[k].last = a.d;

  const list = Object.values(rows);
  const meanBank = list.reduce((s, r) => s + r.bank, 0) / (list.length || 1) || 1;
  for (const r of list) {
    r.n   = r.mcN + r.sylN + r.saMT + r.termN;
    r.c   = r.mcC + r.sylC + r.saM + (r.termN - r.termMiss);
    r.acc = r.n ? r.c / r.n : 0;
    r.days = r.last ? (Date.now() - r.last) / 86400000 : null;
    // clamp so a rarely-examined area is de-prioritised but never ignored
    r.weight = Math.max(0.6, Math.min(1.5, r.bank / meanBank));

    if (!r.n)                            { r.base = 95; r.why = 'never practised'; }
    else if (r.n < STUDY_MIN_EVIDENCE)   { r.base = 80; r.why = 'barely tested'; }
    else                                 { r.base = (1 - r.acc) * 100; r.why = 'accuracy'; }

    r.stale = r.days == null ? 0 : Math.min(r.days / STUDY_STALE_DAYS, 1) * 18;
    r.score = (r.base + r.stale) * r.weight;
    r.band  = r.score >= 60 ? 'focus' : r.score >= 35 ? 'watch' : 'solid';
  }
  list.sort((a, b) => b.score - a.score);
  return list;
}

function studyPlural(n, word){ return n + ' ' + word + (n === 1 ? '' : 's'); }
function studyAgo(days){
  if (days == null) return 'not yet attempted';
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 14) return Math.round(days) + ' days ago';
  if (days < 60) return Math.round(days / 7) + ' weeks ago';
  return Math.round(days / 30) + ' months ago';
}

// ---------- the screen ----------
function showStudy(){
  const rows = studyRows();
  const done = rows.filter(r => r.n >= STUDY_MIN_EVIDENCE).length;
  const totalN = rows.reduce((s, r) => s + r.n, 0);
  const totalC = rows.reduce((s, r) => s + r.c, 0);
  const acc = totalN ? Math.round(totalC / totalN * 100) : 0;

  // ---- headline ----
  if (!totalN) {
    $('studyHead').innerHTML =
      `<p class="muted">Nothing to go on yet. Play a quiz, a syllabus drill or a matching round and this page
       will start telling you exactly where your time is best spent.</p>
       <div class="center" style="margin-top:14px"><button class="btn primary" onclick="showSetup('quiz')">Start a quiz 🚀</button></div>`;
    $('studyList').innerHTML = '';
    $('studyQuick').innerHTML = '';
    $('studyCoverage').innerHTML = '';
    go('study');
    return;
  }
  const top = rows[0];
  $('studyHead').innerHTML =
    `<div class="statgrid" style="margin-bottom:14px">
       ${stat(done + '/' + rows.length, 'Areas practised')}
       ${stat(acc + '%', 'Overall accuracy')}
       ${stat(rows.filter(r => r.band === 'focus').length, 'Need work')}
       ${stat(rows.filter(r => r.band === 'solid').length, 'Solid')}
     </div>
     <div class="studytop">
       <div class="lbl">Start here</div>
       <div class="nm"><span style="color:${TOPIC_COLORS[top.topic]}">${esc(top.topic)}</span> › ${esc(top.sub)}</div>
       <div class="muted" style="margin-top:4px">${studyReason(top)}</div>
     </div>`;

  // ---- priority list ----
  $('studyList').innerHTML = rows.slice(0, 6).map((r, i) => studyCard(r, i)).join('');

  // ---- quick wins ----
  const quick = [];
  if ((me.wrong || []).length)
    quick.push(studyQuick('🔁', me.wrong.length + ' question' + (me.wrong.length === 1 ? '' : 's') + ' you got wrong',
      'Still sitting in My Mistakes', 'Retry them', 'startMistakes()'));
  const shaky = GLOSSARY.filter(g => { const t = (me.terms || {})[g.id]; return t && t.seen && (t.miss / t.seen) >= 0.34; });
  if (shaky.length >= 4)
    quick.push(studyQuick('🔗', shaky.length + ' terms you keep missing',
      'Across ' + studyPlural(new Set(shaky.map(g => g.topic)).size, 'topic'), 'Match them', 'studyShakyTerms()'));
  const due = (typeof dueTerms === 'function') ? dueTerms().due.length : 0;
  if (due) quick.push(studyQuick('🎴', due + ' flashcard' + (due === 1 ? '' : 's') + ' due',
    'Spaced repetition is asking for these now', 'Review', 'showFlash()'));
  const dgLeft = DIAGRAMS.filter(d => !(me.diagrams || {})[d.id]).length;
  if (dgLeft) quick.push(studyQuick('📐', dgLeft + ' diagram' + (dgLeft === 1 ? '' : 's') + ' never attempted',
    'Quick marks if they come up', 'Label them', 'showDiagramPick()'));
  if (me.weakspots && me.weakspots.runs)
    quick.push(studyQuick('🎯', me.weakspots.runs + ' Weak Spots quiz' + (me.weakspots.runs === 1 ? '' : 'zes') + ' run',
      'Last one ' + studyAgo(me.weakspots.lastDate ? (Date.now() - me.weakspots.lastDate) / 86400000 : null),
      'Run another', 'showWeakSetup()'));
  $('studyQuick').innerHTML = quick.length
    ? '<h2>Quick wins</h2>' + quick.join('')
    : '<h2>Quick wins</h2><p class="muted">Nothing outstanding — mistakes cleared, terms holding up, diagrams attempted. 🎯</p>';

  // ---- full coverage ----
  const byTopic = {};
  for (const r of rows) (byTopic[r.topic] = byTopic[r.topic] || []).push(r);
  let cov = '';
  for (const topic of Object.keys(SYLLABUS)) {
    cov += `<div class="studytopic"><span style="color:${TOPIC_COLORS[topic]}">●</span> ${esc(topic)}</div>`;
    for (const r of (byTopic[topic] || []).slice().sort((a, b) => b.score - a.score)) {
      const pct = r.n ? Math.round(r.acc * 100) : 0;
      cov += `<div class="topicrow">
        <span class="tl" style="width:250px">${esc(r.sub)}</span>
        <div class="tbar"><div style="width:${r.n ? pct : 0}%; background:${r.band === 'focus' ? 'var(--bad)' : r.band === 'watch' ? 'var(--gold)' : 'var(--good)'}"></div></div>
        <span class="muted" style="width:118px; text-align:right">${r.n ? pct + '% of ' + r.n : 'no data'}</span>
      </div>`;
    }
  }
  $('studyCoverage').innerHTML = '<h2>Every syllabus area</h2>' +
    '<p class="muted" style="margin-bottom:10px">Bar length is accuracy; colour is priority. “No data” means nothing has tested it yet.</p>' + cov;

  go('study');
}

function studyReason(r){
  const pct = Math.round(r.acc * 100);
  if (!r.n) return 'You have never been tested on this. It is ' + studyBankNote(r) + '.';
  if (r.n < STUDY_MIN_EVIDENCE) return 'Only ' + r.n + ' data point' + (r.n === 1 ? '' : 's') + ' so far — too thin to trust. It is ' + studyBankNote(r) + '.';
  const acc = pct + '% across ' + r.n + ' attempts, last seen ' + studyAgo(r.days);
  if (r.band === 'solid') return 'Holding up: ' + acc + '.';
  if (r.stale > 10) return acc + ' — solid once, but going stale.';
  return acc + '.';
}
function studyBankNote(r){
  return r.bank >= 30 ? 'one of the most heavily examined areas in the bank (' + r.bank + ' past questions)'
       : r.bank >= 12 ? 'examined regularly (' + r.bank + ' past questions)'
       : 'examined less often (' + r.bank + ' past questions)';
}

// "Start here" is reserved for the single top-ranked area — if every card claims
// it the label stops meaning anything.
function studyCard(r, i){
  const label = i === 0 ? 'Start here'
              : r.band === 'focus' ? 'Needs work'
              : r.band === 'watch' ? 'Worth a look' : 'Solid';
  const nQ = QUESTIONS.filter(q => q.topic === r.topic && q.subs.includes(r.sub)).length +
             ((typeof SA_QUESTIONS !== 'undefined' ? SA_QUESTIONS : []).filter(q => q.topic === r.topic && q.subs.includes(r.sub)).length);
  const nT = GLOSSARY.filter(g => g.topic === r.topic && g.sub === r.sub).length;
  const a = JSON.stringify(r.topic).replace(/"/g, '&quot;');
  const b = JSON.stringify(r.sub).replace(/"/g, '&quot;');
  return `<div class="studycard ${r.band}">
    <div class="pri">${label}</div>
    <div class="nm"><span style="color:${TOPIC_COLORS[r.topic]}">${esc(r.topic)}</span> <span class="muted">›</span> ${esc(r.sub)}</div>
    <div class="why muted" style="margin-top:5px; line-height:1.5">${studyReason(r)}</div>
    <div class="row" style="margin-top:11px">
      ${nQ >= 3 ? `<button class="btn small" onclick="studyPractise(${a},${b})">🚀 ${Math.min(10, nQ)} questions</button>` : ''}
      <button class="btn small" onclick="studyDrill(${a})">🧠 Dot points</button>
      ${nT >= 4 ? `<button class="btn small" onclick="studyTerms(${a},${b})">🔗 ${nT} terms</button>` : ''}
      <button class="btn small" onclick="studyMap(${a})">🗺️ Map questions</button>
    </div>
  </div>`;
}
function studyQuick(emoji, title, sub, cta, fn){
  return `<div class="studyquick">
    <span class="e">${emoji}</span>
    <span class="t"><b>${esc(title)}</b><br><span class="muted">${esc(sub)}</span></span>
    <button class="btn small primary" onclick="${fn}">${esc(cta)}</button>
  </div>`;
}

// ---------- one-tap launchers ----------
function studyPractise(topic, sub){
  const pool = QUESTIONS.filter(q => q.topic === topic && q.subs.includes(sub));
  if (pool.length < 3) { alert('Not enough multiple choice questions tagged to that area yet — try the dot points instead.'); return; }
  sel = { n: Math.min(10, pool.length), topics: new Set([topic]), subs: new Set([topic + '|' + sub]), mode: 'quiz' };
  launchQuiz(smartPick(pool, Math.min(10, pool.length)), 'quiz', false);
}
function studyTerms(topic, sub){
  const pool = GLOSSARY.filter(g => g.topic === topic && g.sub === sub);
  if (pool.length < 4) { alert('Not enough terms in that area to build a matching round.'); return; }
  msel = { pairs: Math.min(6, pool.length), rounds: Math.max(1, Math.min(3, Math.floor(pool.length / 6))),
           topics: new Set([topic]), subs: new Set([topic + '|' + sub]) };
  startMatching();
}
function studyShakyTerms(){
  // Matching, weighted towards the terms this student keeps getting wrong
  const shaky = GLOSSARY.filter(g => { const t = (me.terms || {})[g.id]; return t && t.seen && (t.miss / t.seen) >= 0.34; });
  if (shaky.length < 4) { alert('Not enough missed terms yet.'); return; }
  const topics = new Set(shaky.map(g => g.topic));
  const subs = new Set(shaky.map(g => g.topic + '|' + g.sub));
  msel = { pairs: 6, rounds: 3, topics, subs };
  if ($('matchWeak')) $('matchWeak').checked = true;
  startMatching();
}
function studyDrill(topic){
  sylSel = { game: 'match', n: 10, topics: new Set([topic]) };
  startSyl();
}
function studyMap(topic){
  psel = { n: 10, src: 'both', topics: new Set([topic]) };
  startMapper();
}

// one-line prompt for the home screen tile
function studyHomeLine(){
  try {
    const rows = studyRows();
    if (!rows.reduce((s, r) => s + r.n, 0)) return 'Find out where to spend your time';
    const top = rows[0];
    return (top.n ? '⚠️ ' : '🕳️ ') + top.sub + ' (' + top.topic + ')';
  } catch(e){ return 'Find out where to spend your time'; }
}

// ====================================================================
// WEAK SPOTS — a quiz mode built on top of the same per-area rows above.
// What To Study tells a student where they're weak; Weak Spots is the
// "just build me a quiz out of that" button. It deliberately targets
// AREAS (including ones never seen), not the exact questions sitting in
// My Mistakes — that overlap would make the two modes redundant.
//
// Nothing here touches the DOM or the student record; index.html reads
// these functions to render the setup/result screens and to build the
// question pool, so the weighting logic exists in exactly one place and
// is trivial to exercise from plain Node (see the test harness in the
// delivery report).
// ====================================================================
const WEAK_MID_SHARE   = 0.20;  // fraction of the quiz drawn from solid areas so it doesn't feel punishing
const WEAK_WRONG_BOOST = 12;    // small nudge for a question that's an exact, current My Mistakes entry
const WEAK_MIN_WEIGHT  = 1;     // no candidate should ever hit zero probability

// True once every area has zero evidence — a genuinely fresh account, where
// ranking "weakest" areas would just be ranking noise.
function weakSpotFreshAccount(rows){
  return rows.every(r => r.n === 0);
}
// True while too few areas have crossed studyRows' own evidence bar to trust
// the ranking — most of what looks "weak" is really just "untested".
function weakSpotThinHistory(rows){
  return rows.filter(r => r.n >= STUDY_MIN_EVIDENCE).length < 3;
}

// The 3–5 areas the setup screen shows as "where this quiz is aimed". Prefers
// focus/watch areas; if a student is somehow solid everywhere, falls back to
// the weakest of the solid areas rather than showing nothing.
function weakSpotAreas(rows, count){
  count = count || 5;
  const notSolid = rows.filter(r => r.band !== 'solid');
  return (notSolid.length ? notSolid : rows).slice(0, count);
}

// Weight one MC question by how weak its syllabus areas are (studyRows' own
// score — low accuracy and never-seen areas already score high there), plus a
// small boost if this exact question is currently sitting in My Mistakes.
function weakSpotQuestionWeight(q, rowsByKey, wrongSet){
  const keys = (q.subs || []).map(s => q.topic + '|' + s);
  const scores = keys.map(k => (rowsByKey[k] ? rowsByKey[k].score : 40));
  const areaScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 40;
  const boost = (wrongSet && wrongSet.has(q.id)) ? WEAK_WRONG_BOOST : 0;
  return Math.max(WEAK_MIN_WEIGHT, areaScore + boost);
}

// Efraimidis-Spirakis weighted sampling without replacement: give every
// candidate a key of random()^(1/weight) and take the top n by key — a single
// sort that samples proportional to weight, no repeated-draw loop needed.
function weightedSampleNoReplace(items, weightFn, n){
  const keyed = items.map(it => ({it, key: Math.pow(Math.random(), 1 / Math.max(1e-6, weightFn(it)))}));
  keyed.sort((a, b) => b.key - a.key);
  return keyed.slice(0, Math.max(0, Math.min(n, keyed.length))).map(x => x.it);
}

// Fresh-account fallback: an even spread across every syllabus area that has
// questions at all, round-robin, rather than a plain uniform sample over
// questions (which would quietly over-represent areas with a bigger bank).
function weakSpotEvenSample(questions, rows, n){
  const byArea = {};
  for (const r of rows) byArea[r.key] = [];
  for (const q of questions)
    for (const s of (q.subs || [])) { const k = q.topic + '|' + s; if (byArea[k]) byArea[k].push(q); }
  const areas = Object.keys(byArea).filter(k => byArea[k].length);
  for (const k of areas) byArea[k].sort(() => Math.random() - .5);
  const picked = [], pickedIds = new Set();
  let idx = 0, spins = 0;
  while (picked.length < n && areas.some(k => byArea[k].length) && spins < areas.length * questions.length + 10) {
    spins++;
    const k = areas[idx % areas.length]; idx++;
    while (byArea[k].length) {
      const q = byArea[k].shift();
      if (!pickedIds.has(q.id)) { picked.push(q); pickedIds.add(q.id); break; }
    }
  }
  return picked;
}

// Build the Weak Spots quiz pool: weighted toward weak areas (including areas
// never seen), with ~20% mixed in from solid areas, sampled without repeats.
// `wrong` is me.wrong — the current My Mistakes id list.
function weakSpotPool(questions, rows, n, wrong){
  if (weakSpotFreshAccount(rows)) return weakSpotEvenSample(questions, rows, n);

  const rowsByKey = {};
  for (const r of rows) rowsByKey[r.key] = r;
  const wrongSet = new Set(wrong || []);
  const weightOf = q => weakSpotQuestionWeight(q, rowsByKey, wrongSet);

  const midKeys = new Set(rows.filter(r => r.band === 'solid').map(r => r.key));
  const isMid = q => (q.subs || []).some(s => midKeys.has(q.topic + '|' + s));

  const midShare = Math.round(n * WEAK_MID_SHARE);
  const midPool = questions.filter(isMid);
  const midPicks = midPool.length ? weightedSampleNoReplace(midPool, weightOf, midShare) : [];
  const pickedIds = new Set(midPicks.map(q => q.id));

  const restPool = questions.filter(q => !pickedIds.has(q.id));
  const weakPicks = weightedSampleNoReplace(restPool, weightOf, n - midPicks.length);

  const all = [...midPicks, ...weakPicks];
  // backfill if a narrow filter or small bank left either pool short
  if (all.length < n) {
    const have = new Set(all.map(q => q.id));
    for (const q of questions) {
      if (all.length >= n) break;
      if (!have.has(q.id)) { all.push(q); have.add(q.id); }
    }
  }
  return all;
}
