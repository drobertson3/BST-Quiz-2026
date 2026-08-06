// ====================================================================
// SYLLABUS DRILLS — four games that build recall of the NESA
// "students learn about" dot points.
//
//   1. Where Does It Belong?  a dot point -> pick its subtopic
//   2. Fill the Subtopic      a subtopic  -> tick every dot point in it
//   3. Odd One Out            5 dot points -> spot the impostor
//   4. Fill the Gap           a dot point with a key term blanked out
//
// Relies on globals from data.js / store.js / index.html:
//   SYL_CONTENT, SYL_ITEMS, SYL_SUBS, $, go, me, Store, renderHome,
//   TOPIC_COLORS, QUIZ_OPTIONS, evaluateBadges, QUESTIONS
// ====================================================================
"use strict";

const SYL_GAMES = {
  match: {emoji:'🧭', name:'Where Does It Belong?', desc:'Match a dot point to its subtopic', xp:10},
  fill:  {emoji:'🗂️', name:'Fill the Subtopic',    desc:'Tick every dot point in the subtopic', xp:25},
  odd:   {emoji:'🕵️', name:'Odd One Out',          desc:"Spot the dot point that doesn't belong", xp:12},
  cloze: {emoji:'✏️', name:'Fill the Gap',          desc:'Complete the syllabus wording', xp:10},
};
const SYL_LENGTHS = [5, 10, 15];

let sylSel = { game: 'match', n: 10, topics: new Set() };
let syl = null;   // active session

// ---------- small helpers ----------
function sylEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function sylShuffle(a){ const r = a.slice(); for (let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }
function sylPick(a, n){ return sylShuffle(a).slice(0, n); }
function sylOne(a){ return a[Math.floor(Math.random()*a.length)]; }

// Items in play, respecting the topic filter. `usable` drops the dot points
// that appear word-for-word under more than one subtopic.
function sylPool(usableOnly){
  const ts = sylSel.topics;
  return SYL_ITEMS.filter(i => (!ts.size || ts.has(i.topic)) && (!usableOnly || !i.x));
}
function sylSubPool(){
  const ts = sylSel.topics;
  return SYL_SUBS.filter(s => !ts.size || ts.has(s.topic));
}
function sylItemsIn(key, usableOnly){
  return SYL_ITEMS.filter(i => i.subKey === key && (!usableOnly || !i.x));
}
function sylSubLabel(s){
  return `<span style="color:${TOPIC_COLORS[s.topic]}">${sylEsc(s.topic)}</span> <span class="muted">›</span> ${sylEsc(s.sub)}`;
}

// ====================================================================
// HUB
// ====================================================================
function showSyl(){
  go('sylhub');
  renderSylHub();
}
function renderSylHub(){
  const st = me.syl || {rounds:0, correct:0, perSub:{}, bestStreak:0, plays:0};
  const acc = st.rounds ? Math.round(st.correct/st.rounds*100) : 0;
  $('sylStats').innerHTML =
    `<div class="stat"><div class="v">${st.plays||0}</div><div class="l">Drills</div></div>` +
    `<div class="stat"><div class="v">${st.rounds||0}</div><div class="l">Rounds</div></div>` +
    `<div class="stat"><div class="v">${acc}%</div><div class="l">Accuracy</div></div>` +
    `<div class="stat"><div class="v">${st.bestStreak||0}</div><div class="l">Best streak</div></div>` +
    `<div class="stat"><div class="v">${SYL_ITEMS.length}</div><div class="l">Dot points</div></div>`;

  $('sylGameBtns').innerHTML = Object.entries(SYL_GAMES).map(([id,g]) =>
    `<button class="menubtn sylgame ${sylSel.game===id?'sel':''}" data-g="${id}" onclick="sylChooseGame('${id}')">
       <div class="e">${g.emoji}</div><div class="t">${g.name}</div><div class="d">${g.desc}</div></button>`).join('');

  $('sylTopicBtns').innerHTML = Object.keys(SYL_CONTENT).map(t =>
    `<button class="btn topicbtn ${sylSel.topics.has(t)?'sel':''}" onclick="sylToggleTopic('${t}')">${t}</button>`).join('');
  $('sylTopicNote').textContent = sylSel.topics.size ? '' : 'No topics picked = all four.';

  $('sylLenBtns').innerHTML = SYL_LENGTHS.map(n =>
    `<button class="btn preset ${sylSel.n===n?'sel':''}" onclick="sylSetLen(${n})">${n}</button>`).join('');

  // weakest subtopics from syllabus drills only
  const weak = Object.entries(st.perSub || {}).filter(([,v]) => v[1] >= 3)
    .map(([k,v]) => ({k, acc:v[0]/v[1], v})).sort((a,b)=>a.acc-b.acc).slice(0,5);
  $('sylWeak').innerHTML = weak.length ? weak.map(w => {
    const [topic, sub] = w.k.split('|');
    const p = Math.round(w.acc*100);
    return `<div class="topicrow"><span class="tl" style="width:230px">${sylEsc(sub)} <span class="muted">(${sylEsc(topic)})</span></span>
      <div class="tbar"><div style="width:${p}%; background:${w.acc<.5?'var(--bad)':w.acc<.75?'var(--gold)':'var(--good)'}"></div></div>
      <span class="muted" style="width:52px; text-align:right">${w.v[0]}/${w.v[1]}</span></div>`;
  }).join('') : '<p class="muted">Play a few drills and your shakiest subtopics will show up here.</p>';
}
function sylChooseGame(id){ sylSel.game = id; renderSylHub(); }
function sylToggleTopic(t){ sylSel.topics.has(t) ? sylSel.topics.delete(t) : sylSel.topics.add(t); renderSylHub(); }
function sylSetLen(n){ sylSel.n = n; renderSylHub(); }

// ====================================================================
// ROUND BUILDERS — each returns a round object, or null if it can't
// build one from the current topic filter.
// ====================================================================

// 1. Where Does It Belong? — dot point -> subtopic
function sylBuildMatch(used){
  const pool = sylPool(true).filter(i => !used.has(i.id));
  if (!pool.length) return null;
  const item = sylOne(pool);
  const sameTopic = sylSubPool().filter(s => s.topic === item.topic && s.key !== item.subKey);
  const otherTopic = sylSubPool().filter(s => s.topic !== item.topic);
  const wrong = [...sylPick(sameTopic, 2), ...sylPick(otherTopic, 1)];
  // top up if the topic filter left us short
  const spare = sylSubPool().filter(s => s.key !== item.subKey && !wrong.some(w => w.key === s.key));
  while (wrong.length < 3 && spare.length) wrong.push(spare.splice(Math.floor(Math.random()*spare.length),1)[0]);
  if (wrong.length < 3) return null;
  const right = SYL_SUBS.find(s => s.key === item.subKey);
  return {
    kind: 'match', itemId: item.id, subKey: item.subKey,
    lead: 'Which subtopic does this dot point sit under?',
    prompt: `<div class="sylquote">${sylEsc(item.t)}</div>`,
    options: sylShuffle([right, ...wrong]).map(s => ({html: sylSubLabel(s), right: s.key === item.subKey})),
    note: `Syllabus: ${item.topic} › ${item.sub}`,
  };
}

// 2. Fill the Subtopic — subtopic -> tick every dot point that belongs
function sylBuildFill(used){
  const subs = sylSubPool().filter(s => sylItemsIn(s.key, true).length >= 3);
  if (!subs.length) return null;
  const fresh = subs.filter(s => !used.has(s.key));
  const target = sylOne(fresh.length ? fresh : subs);
  const mine = sylItemsIn(target.key, true);
  const correct = sylPick(mine, Math.min(5, mine.length));
  // decoys: prefer the same topic (harder), fall back to anywhere
  const near = SYL_ITEMS.filter(i => !i.x && i.topic === target.topic && i.subKey !== target.key);
  const far  = SYL_ITEMS.filter(i => !i.x && i.topic !== target.topic);
  const nDecoy = Math.max(4, 10 - correct.length);
  const decoys = [...sylPick(near, Math.min(nDecoy, near.length))];
  while (decoys.length < nDecoy && far.length) decoys.push(far.splice(Math.floor(Math.random()*far.length),1)[0]);
  if (decoys.length < 3) return null;
  return {
    kind: 'fill', subKey: target.key,
    lead: 'Tick <b>every</b> dot point that belongs to this subtopic.',
    prompt: `<div class="sylsub">${sylSubLabel(target)}</div>
             <p class="muted" style="margin-top:6px">${correct.length} of these ${correct.length + decoys.length} belong here.</p>`,
    options: sylShuffle([...correct.map(i => ({html: sylEsc(i.t), right: true,  id:i.id})),
                         ...decoys.map(i  => ({html: sylEsc(i.t), right: false, id:i.id, from: i.topic + ' › ' + i.sub}))]),
    multi: true,
    nRight: correct.length,
  };
}

// 3. Odd One Out — 4 from a subtopic + 1 impostor
function sylBuildOdd(used){
  const subs = sylSubPool().filter(s => sylItemsIn(s.key, true).length >= 4);
  if (!subs.length) return null;
  const fresh = subs.filter(s => !used.has(s.key));
  const target = sylOne(fresh.length ? fresh : subs);
  const keep = sylPick(sylItemsIn(target.key, true), 4);
  const near = SYL_ITEMS.filter(i => !i.x && i.topic === target.topic && i.subKey !== target.key);
  const far  = SYL_ITEMS.filter(i => !i.x && i.subKey !== target.key);
  const impostor = near.length ? sylOne(near) : (far.length ? sylOne(far) : null);
  if (!impostor) return null;
  return {
    kind: 'odd', subKey: target.key,
    lead: 'One of these is <b>not</b> in this subtopic. Which one?',
    prompt: `<div class="sylsub">${sylSubLabel(target)}</div>`,
    options: sylShuffle([...keep.map(i => ({html: sylEsc(i.t), right:false})),
                         {html: sylEsc(impostor.t), right:true, id:impostor.id}]),
    note: `The impostor belongs to ${impostor.topic} › ${impostor.sub}.`,
  };
}

// A term is only worth blanking if it appears exactly once (otherwise the
// answer stays visible elsewhere — "social responsibility" inside "Corporate
// social responsibility — ... and social responsibility") and if enough of the
// dot point is left standing to make the gap answerable. That rules out the
// one-phrase dot points such as "Globalisation" or "Acquisition".
function sylClozeTerm(item){
  const hay = item.t.toLowerCase();
  const ok = k => {
    let count = 0, at = hay.indexOf(k.toLowerCase());
    while (at !== -1) { count++; at = hay.indexOf(k.toLowerCase(), at + 1); }
    return count === 1 && (item.t.length - k.length) >= 12;
  };
  return sylShuffle(item.k).find(ok) || null;
}

// 4. Fill the Gap — key term blanked out of a dot point
function sylBuildCloze(used){
  const pool = sylPool(false).filter(i => !used.has(i.id) && sylClozeTerm(i));
  if (!pool.length) return null;
  const item = sylOne(pool);
  const term = sylClozeTerm(item);
  if (!term) return null;
  const idx = item.t.indexOf(term);
  if (idx < 0) return null;
  // fixed-width blank so the number of underscores never leaks the answer length
  const blank = '<span class="sylblank">______________</span>';
  const gapped = sylEsc(item.t.slice(0, idx)) + blank + sylEsc(item.t.slice(idx + term.length));
  // distractors: other key terms of a similar length, ideally from the same topic
  const lower = term.toLowerCase();
  let cand = SYL_ITEMS.filter(i => i.topic === item.topic && i.id !== item.id)
                      .flatMap(i => i.k)
                      .filter(k => k.toLowerCase() !== lower && !item.t.toLowerCase().includes(k.toLowerCase()));
  if (cand.length < 8) {
    cand = cand.concat(SYL_ITEMS.filter(i => i.id !== item.id).flatMap(i => i.k)
      .filter(k => k.toLowerCase() !== lower && !item.t.toLowerCase().includes(k.toLowerCase())));
  }
  cand = [...new Set(cand)].sort((a,b) => Math.abs(a.length-term.length) - Math.abs(b.length-term.length));
  const wrong = sylPick(cand.slice(0, 14), 3);
  if (wrong.length < 3) return null;
  return {
    kind: 'cloze', itemId: item.id, subKey: item.subKey,
    lead: 'Which words complete the syllabus dot point?',
    prompt: `<div class="sylquote">${gapped}</div>`,
    options: sylShuffle([{html: sylEsc(term), right:true}, ...wrong.map(w => ({html: sylEsc(w), right:false}))]),
    note: `Full dot point: “${item.t}” — ${item.topic} › ${item.sub}`,
  };
}

const SYL_BUILDERS = { match: sylBuildMatch, fill: sylBuildFill, odd: sylBuildOdd, cloze: sylBuildCloze };

// ====================================================================
// SESSION
// ====================================================================
function startSyl(){
  const build = SYL_BUILDERS[sylSel.game];
  const rounds = [], used = new Set();
  let guard = 0, misses = 0;
  while (rounds.length < sylSel.n && guard++ < sylSel.n * 40) {
    const r = build(used);
    // a single failure just means an awkward draw (e.g. a one-phrase dot point
    // that can't be gapped) — keep trying before giving up on the whole drill
    if (!r) { if (++misses > 40) break; continue; }
    misses = 0;
    used.add(r.itemId || r.subKey);
    rounds.push(r);
  }
  if (!rounds.length) { alert('Not enough syllabus content in that selection — try adding another topic.'); return; }
  syl = { game: sylSel.game, rounds, i: 0, correct: 0, streak: 0, bestStreak: 0,
          xp: 0, t0: Date.now(), picks: new Set(), answered: false, log: [] };
  go('syl');
  sylRender();
}

function sylRender(){
  const r = syl.rounds[syl.i];
  const g = SYL_GAMES[syl.game];
  syl.picks = new Set();
  syl.answered = false;
  $('sylTitle').textContent = g.emoji + ' ' + g.name;
  $('sylCounter').textContent = (syl.i + 1) + ' / ' + syl.rounds.length;
  $('sylProgress').style.width = (syl.i / syl.rounds.length * 100) + '%';
  $('sylStreak').style.display = syl.streak >= 3 ? 'inline-block' : 'none';
  $('sylStreak').textContent = '🔥 ' + syl.streak + ' streak!';
  $('sylLead').innerHTML = r.lead;
  $('sylPrompt').innerHTML = r.prompt;
  $('sylOpts').innerHTML = r.options.map((o,i) =>
    `<button class="sylopt" id="sylopt${i}" onclick="sylPickOpt(${i})">${o.html}</button>`).join('');
  $('sylCheckWrap').style.display = r.multi ? 'block' : 'none';
  $('sylCheckBtn').disabled = true;
  $('sylCheckBtn').textContent = 'Check my picks';
  $('sylFeedback').style.display = 'none';
  $('sylFeedback').className = 'feedback';
  $('sylFbHead').textContent = '';
  $('sylFbBody').innerHTML = '';
  window.scrollTo(0,0);
}

function sylPickOpt(i){
  if (syl.answered) return;
  const r = syl.rounds[syl.i];
  if (r.multi) {
    syl.picks.has(i) ? syl.picks.delete(i) : syl.picks.add(i);
    $('sylopt' + i).classList.toggle('sel', syl.picks.has(i));
    $('sylCheckBtn').disabled = syl.picks.size === 0;
    $('sylCheckBtn').textContent = 'Check my ' + syl.picks.size + ' pick' + (syl.picks.size === 1 ? '' : 's');
  } else {
    syl.picks = new Set([i]);
    sylCheck();
  }
}

function sylCheck(){
  if (syl.answered) return;
  syl.answered = true;
  const r = syl.rounds[syl.i];
  const g = SYL_GAMES[syl.game];

  let right, detail = '';
  if (r.multi) {
    const hit = r.options.filter((o,i) => o.right && syl.picks.has(i)).length;
    const over = r.options.filter((o,i) => !o.right && syl.picks.has(i)).length;
    const missed = r.nRight - hit;
    right = hit === r.nRight && over === 0;
    detail = right ? `All ${r.nRight} found, nothing extra ticked.`
      : `${hit}/${r.nRight} found` + (missed ? `, ${missed} missed` : '') + (over ? `, ${over} wrongly ticked` : '') + '.';
  } else {
    right = r.options.some((o,i) => o.right && syl.picks.has(i));
  }

  // paint the options
  r.options.forEach((o,i) => {
    const el = $('sylopt' + i);
    el.classList.add('done');
    if (o.right) el.classList.add(syl.picks.has(i) ? 'correct' : 'reveal');
    else if (syl.picks.has(i)) el.classList.add('wrong');
    if (!o.right && o.from) el.insertAdjacentHTML('beforeend', `<span class="sylfrom">${sylEsc(o.from)}</span>`);
  });

  // score
  let gained = 0;
  if (right) {
    syl.streak++;
    syl.bestStreak = Math.max(syl.bestStreak, syl.streak);
    gained = g.xp;
    if (syl.streak >= 10) gained += 15; else if (syl.streak >= 5) gained += 10; else if (syl.streak >= 3) gained += 5;
    syl.correct++; syl.xp += gained;
  } else syl.streak = 0;
  syl.log.push({subKey: r.subKey, right});

  $('sylStreak').style.display = syl.streak >= 3 ? 'inline-block' : 'none';
  $('sylStreak').textContent = '🔥 ' + syl.streak + ' streak!';

  const fb = $('sylFeedback');
  fb.classList.add(right ? 'good' : 'bad');
  $('sylFbHead').textContent = right ? '✅ Correct!' + (gained ? '  +' + gained + ' XP' : '') : '❌ Not quite.';
  $('sylFbBody').innerHTML = [detail, r.note ? sylEsc(r.note) : ''].filter(Boolean).join('<br>');
  $('sylNextBtn').textContent = syl.i === syl.rounds.length - 1 ? 'See results →' : 'Next →';
  $('sylCheckWrap').style.display = 'none';
  fb.style.display = 'block';
  fb.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function sylNext(){
  syl.i++;
  if (syl.i >= syl.rounds.length) sylFinish(); else sylRender();
}
function quitSyl(){
  if (confirm('Quit this drill? Progress on it will not be saved.')) { syl = null; renderHome(); go('home'); }
}

async function sylFinish(){
  const timeSec = Math.round((Date.now() - syl.t0)/1000);
  const n = syl.rounds.length, c = syl.correct;

  // syllabus stats live in their own block so they never skew MCQ accuracy
  const st = me.syl = me.syl || {rounds:0, correct:0, plays:0, bestStreak:0, perSub:{}, perGame:{}};
  st.perSub = st.perSub || {}; st.perGame = st.perGame || {};
  st.plays++; st.rounds += n; st.correct += c;
  st.bestStreak = Math.max(st.bestStreak || 0, syl.bestStreak);
  const pg = st.perGame[syl.game] = st.perGame[syl.game] || [0,0];
  pg[0] += c; pg[1] += n;
  for (const l of syl.log) {
    if (!l.subKey) continue;
    // [correct, total, lastSeen] — the timestamp lets What To Study spot areas going stale
    const p = st.perSub[l.subKey] = st.perSub[l.subKey] || [0,0,0];
    p[1]++; if (l.right) p[0]++; p[2] = Date.now();
  }

  me.xp += syl.xp;
  me.bestStreak = Math.max(me.bestStreak, syl.bestStreak);
  const attempt = { d: Date.now(), n, c, timeSec, timed: false,
                    mode: 'syllabus', game: syl.game, topics: {}, subs: {} };
  me.attempts.push(attempt);
  const newBadges = evaluateBadges(me, attempt, QUESTIONS.length);
  await Store.saveStudent(me.name, me);

  const pct = n ? Math.round(c/n*100) : 0;
  const g = SYL_GAMES[syl.game];
  $('sylResEmoji').textContent = pct === 100 ? '🧠🏆' : pct >= 80 ? '🧠🎉' : pct >= 60 ? '🧠💪' : pct >= 40 ? '📚' : '🌱';
  $('sylResScore').textContent = c + ' / ' + n;
  $('sylResSub').textContent = g.name + ' · ' + pct + '% · ' + (timeSec >= 60 ? Math.floor(timeSec/60)+'m '+(timeSec%60)+'s' : timeSec+'s') +
    (syl.bestStreak >= 3 ? ' · best streak ' + syl.bestStreak + ' 🔥' : '');
  $('sylResXp').textContent = syl.xp ? '+' + syl.xp + ' XP earned' : '';
  $('sylResBadges').innerHTML = newBadges.map(b =>
    `<div class="newbadge"><span style="font-size:1.6rem">${b.emoji}</span><div style="text-align:left"><b>Badge unlocked: ${b.name}</b><div class="muted">${b.desc}</div></div></div>`).join('');

  // per-subtopic breakdown for this drill
  const bySub = {};
  for (const l of syl.log) { if (!l.subKey) continue; const p = bySub[l.subKey] = bySub[l.subKey] || [0,0]; p[1]++; if (l.right) p[0]++; }
  const rows = Object.entries(bySub).sort((a,b) => (a[1][0]/a[1][1]) - (b[1][0]/b[1][1]));
  $('sylResSubs').innerHTML = rows.length
    ? '<h2>Subtopic breakdown</h2>' + rows.map(([k,v]) => {
        const [topic, sub] = k.split('|'); const p = v[0]/v[1]*100;
        return `<div class="topicrow"><span class="tl" style="width:210px">${sylEsc(sub)} <span class="muted">(${sylEsc(topic)})</span></span>
          <div class="tbar"><div style="width:${p}%; background:${TOPIC_COLORS[topic]}"></div></div>
          <span class="muted" style="width:44px; text-align:right">${v[0]}/${v[1]}</span></div>`;
      }).join('')
    : '';

  syl = null;
  go('sylresult');
}
