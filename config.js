// ====================================================================
// HSC Business Studies Quiz — Configuration
// Edit this file, save, and refresh the page. See SETUP.md for help.
// ====================================================================

// 1. YOUR CLASS LIST — one name per line, inside the quotes.
//    Students pick their name and set their own PIN on first login.
const CLASS_LIST = [
  "Demo Student",
  "Oscar",
  "Toby",
  "Eamon",
  "Lucy",
  "Matty",
  "Matt",
  "Ben",
  "Lachlan",
  "Elyse",
  "Ruby",
  "Hayden",
  "Flynn",
  "Henry",
  "Luka",
  "Billy",
];

// 2. FIREBASE — paste your config here (see SETUP.md, ~10 minutes).
//    Leave apiKey empty ("") to run in device-only practice mode.
const firebaseConfig = {
  apiKey: "AIzaSyAU4ffpmDoJ4MotXq3EmLsP_q00qDoXRwc",
  authDomain: "bst-quiz-2026.firebaseapp.com",
  projectId: "bst-quiz-2026",
  storageBucket: "bst-quiz-2026.firebasestorage.app",
  messagingSenderId: "343448489572",
  appId: "1:343448489572:web:0a59b46b878c7121581971",
  measurementId: "G-305NYZQMT9"
};

// 3. Options
const QUIZ_OPTIONS = {
  secondsPerQuestion: 90,   // timer pace when the timer is switched on
  xpPerCorrect: 10,         // base XP per correct answer
};
