// Shared data layer: Firebase Firestore when configured, localStorage otherwise.
"use strict";

function slugify(name){ return name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

// Small non-crypto hash for PINs (class-level security only)
function pinHash(str){
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return (4294967296*(2097151 & h2) + (h1>>>0)).toString(36);
}

const Store = (() => {
  let db = null;
  let cloud = false;

  function init(){
    try {
      // accept either FIREBASE_CONFIG or Google's default name firebaseConfig
      const FB = (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG.apiKey) ? FIREBASE_CONFIG
               : (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey) ? firebaseConfig : null;
      if (FB && typeof firebase !== 'undefined') {
        firebase.initializeApp(FB);
        db = firebase.firestore();
        cloud = true;
      }
    } catch(e){ console.warn('Firebase init failed, using local mode:', e); cloud = false; }
    return cloud;
  }

  // ---- local fallback helpers ----
  function lsGet(key, fallback){
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch(e){ return fallback; }
  }
  function lsSet(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  // ---- roster ----
  async function getRoster(){
    let names;
    if (cloud) {
      const doc = await db.collection('meta').doc('roster').get();
      names = doc.exists ? (doc.data().names || []) : [];
    } else {
      names = lsGet('hscq_roster', []);
    }
    // merge config class list (never lose configured names)
    const merged = [...new Set([...(typeof CLASS_LIST!=='undefined'?CLASS_LIST:[]), ...names])]
      .map(n => n.trim()).filter(Boolean);
    merged.sort((a,b)=>a.localeCompare(b));
    // persist config-added names to the cloud so the (separate) dashboard sees them
    if (cloud && merged.length !== names.length) {
      try { await db.collection('meta').doc('roster').set({names: merged}, {merge:true}); } catch(e){}
    }
    return merged;
  }
  async function saveRoster(names){
    const clean = [...new Set(names.map(n=>n.trim()).filter(Boolean))];
    if (cloud) await db.collection('meta').doc('roster').set({names: clean});
    else lsSet('hscq_roster', clean);
    return clean;
  }
  async function removeFromRoster(name){
    const roster = await getRoster();
    const next = roster.filter(n => n !== name);
    // note: names in CLASS_LIST (config.js) will re-merge; store removals
    if (cloud) await db.collection('meta').doc('roster').set({names: next, removed: firebase.firestore.FieldValue.arrayUnion(name)}, {merge:true});
    else {
      lsSet('hscq_roster', next);
      const rem = lsGet('hscq_removed', []); rem.push(name); lsSet('hscq_removed', rem);
    }
  }
  async function getRemoved(){
    if (cloud) {
      const doc = await db.collection('meta').doc('roster').get();
      return doc.exists ? (doc.data().removed || []) : [];
    }
    return lsGet('hscq_removed', []);
  }

  // ---- students ----
  function blankStudent(name){
    return {
      name, pin: null, xp: 0, badges: [],
      seen: {},          // qid -> times seen
      lastSeen: {},      // qid -> timestamp
      wrong: [],         // qids currently answered wrong (cleared when later answered right)
      attempts: [],      // {d, n, c, timeSec, timed, mode, topics:{t:[c,tot]}, subs:{'T|S':[c,tot]}}
      totals: { answered: 0, correct: 0, perTopic: {}, perSub: {} },
      bestStreak: 0
    };
  }

  async function getStudent(name){
    const id = slugify(name);
    if (cloud) {
      const doc = await db.collection('students').doc(id).get();
      return doc.exists ? doc.data() : null;
    }
    const all = lsGet('hscq_students', {});
    return all[id] || null;
  }

  async function saveStudent(name, data){
    const id = slugify(name);
    if (cloud) { await db.collection('students').doc(id).set(data); return; }
    const all = lsGet('hscq_students', {});
    all[id] = data; lsSet('hscq_students', all);
  }

  async function deleteStudent(name){
    const id = slugify(name);
    if (cloud) { await db.collection('students').doc(id).delete(); return; }
    const all = lsGet('hscq_students', {});
    delete all[id]; lsSet('hscq_students', all);
  }

  async function getAllStudents(){
    if (cloud) {
      const snap = await db.collection('students').get();
      return snap.docs.map(d => d.data());
    }
    const all = lsGet('hscq_students', {});
    return Object.values(all);
  }

  return { init, isCloud: () => cloud, getRoster, saveRoster, removeFromRoster, getRemoved,
           blankStudent, getStudent, saveStudent, deleteStudent, getAllStudents };
})();

// ---- shared game maths ----
function levelFromXp(xp){ return Math.floor(xp / 300) + 1; }
function levelProgress(xp){ return xp % 300; }
function levelName(lv){
  const names = ["Rookie","Apprentice","Trader","Manager","Strategist","Executive","Director","Entrepreneur","Tycoon","Magnate"];
  return names[Math.min(lv-1, names.length-1)] + (lv > names.length ? " " + (lv - names.length + 1) : "");
}

const BADGES = [
  {id:'first_steps', emoji:'🎯', name:'First Steps',   desc:'Complete your first quiz'},
  {id:'full_section',emoji:'💪', name:'Full Section',  desc:'Complete a 20-question quiz'},
  {id:'sharpshooter',emoji:'🏹', name:'Sharpshooter',  desc:'Score 100% on a quiz of 10+ questions'},
  {id:'streak_5',    emoji:'🔥', name:'On Fire',       desc:'Answer 5 in a row correctly'},
  {id:'streak_10',   emoji:'⚡', name:'Unstoppable',   desc:'Answer 10 in a row correctly'},
  {id:'centurion',   emoji:'💯', name:'Centurion',     desc:'Answer 100 questions in total'},
  {id:'explorer',    emoji:'🗺️', name:'Explorer',      desc:'See every question in the bank'},
  {id:'ops_master',  emoji:'🏭', name:'Operations Master', desc:'85%+ accuracy over 25+ Operations questions'},
  {id:'mkt_master',  emoji:'📣', name:'Marketing Master',  desc:'85%+ accuracy over 25+ Marketing questions'},
  {id:'fin_master',  emoji:'💰', name:'Finance Master',    desc:'85%+ accuracy over 25+ Finance questions'},
  {id:'hr_master',   emoji:'👥', name:'HR Master',         desc:'85%+ accuracy over 25+ Human Resources questions'},
  {id:'comeback',    emoji:'🔁', name:'Comeback Kid',  desc:'Score 80%+ on a My Mistakes quiz'},
  {id:'pacer',       emoji:'⏱️', name:'Exam Pacer',    desc:'Finish a timed quiz averaging under 60s a question'},
  {id:'streak_15',   emoji:'🌟', name:'Legendary',     desc:'Answer 15 in a row correctly'},
  {id:'dedication',  emoji:'📅', name:'Dedicated',     desc:'Complete 10 quizzes'},
  {id:'veteran',     emoji:'🎖️', name:'Veteran',       desc:'Complete 25 quizzes'},
  {id:'double_cent', emoji:'🏏', name:'Double Century',desc:'Answer 200 questions in total'},
  {id:'all_rounder', emoji:'🧩', name:'All-Rounder',   desc:'Answer 10+ questions in every topic'},
  {id:'perfectionist',emoji:'👑', name:'Perfectionist', desc:'Score 100% on a 20-question quiz'},
  {id:'clean_slate', emoji:'🧼', name:'Clean Slate',   desc:'Clear every question from My Mistakes'},
  {id:'high_flyer',  emoji:'🚀', name:'High Flyer',    desc:'Reach Level 5'},
  {id:'early_bird',  emoji:'🐦', name:'Early Bird',    desc:'Finish a quiz before 8 am'},
  {id:'night_owl',   emoji:'🦉', name:'Night Owl',     desc:'Finish a quiz after 9 pm'},
];

function evaluateBadges(student, attempt, totalQuestions){
  const earned = [];
  const has = id => student.badges.includes(id);
  const t = student.totals;
  const topicAcc = (topic) => {
    const p = t.perTopic[topic]; return p && p[1] >= 25 ? p[0]/p[1] : 0;
  };
  const checks = {
    first_steps: () => student.attempts.length >= 1,
    full_section: () => attempt && attempt.n >= 20,
    sharpshooter: () => attempt && attempt.n >= 10 && attempt.c === attempt.n,
    streak_5:  () => student.bestStreak >= 5,
    streak_10: () => student.bestStreak >= 10,
    centurion: () => t.answered >= 100,
    explorer:  () => Object.keys(student.seen).length >= totalQuestions,
    ops_master:() => topicAcc('Operations') >= 0.85,
    mkt_master:() => topicAcc('Marketing') >= 0.85,
    fin_master:() => topicAcc('Finance') >= 0.85,
    hr_master: () => topicAcc('Human Resources') >= 0.85,
    comeback:  () => attempt && attempt.mode === 'mistakes' && attempt.n > 0 && attempt.c / attempt.n >= 0.8,
    pacer:     () => attempt && attempt.timed && attempt.n > 0 && (attempt.timeSec / attempt.n) < 60,
    streak_15: () => student.bestStreak >= 15,
    dedication:() => student.attempts.length >= 10,
    veteran:   () => student.attempts.length >= 25,
    double_cent:() => t.answered >= 200,
    all_rounder:() => ['Operations','Marketing','Finance','Human Resources']
                      .every(tp => t.perTopic[tp] && t.perTopic[tp][1] >= 10),
    perfectionist:() => attempt && attempt.n >= 20 && attempt.c === attempt.n,
    clean_slate:() => attempt && attempt.mode === 'mistakes' && student.wrong.length === 0,
    high_flyer:() => levelFromXp(student.xp) >= 5,
    early_bird:() => attempt && new Date(attempt.d).getHours() < 8,
    night_owl: () => attempt && new Date(attempt.d).getHours() >= 21,
  };
  for (const b of BADGES) {
    if (!has(b.id) && checks[b.id] && checks[b.id]()) { student.badges.push(b.id); earned.push(b); }
  }
  return earned;
}
