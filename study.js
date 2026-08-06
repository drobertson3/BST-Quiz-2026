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
