// ====================================================================
// HSC Business Studies — syllabus "students learn about" content
// Verbatim dot points from the NESA Business Studies Stage 6 Syllabus
// (June 2010), section 10: HSC course. Used by the Syllabus Drills games.
//
//   t = the dot point, as close to NESA wording as readability allows
//   k = key terms inside t that can be blanked out for the cloze game
//       (each MUST appear verbatim in t)
//   x = true  -> never used as a "guess the subtopic" prompt or as a
//                decoy, because the same wording appears in more than
//                one subtopic (e.g. "interdependence with other key
//                business functions" sits under all four Role dot points)
// ====================================================================
"use strict";

const SYL_CONTENT = {
  "Operations": {
    "Role of operations management": [
      {t:"Strategic role of operations management — cost leadership, good/service differentiation", k:["cost leadership","good/service differentiation"]},
      {t:"Goods and/or services in different industries", k:["Goods and/or services","different industries"]},
      {t:"Interdependence with other key business functions", k:["Interdependence","key business functions"], x:true},
    ],
    "Influences": [
      {t:"Globalisation", k:["Globalisation"]},
      {t:"Technology", k:["Technology"], x:true},
      {t:"Quality expectations", k:["Quality expectations"]},
      {t:"Cost-based competition", k:["Cost-based competition"]},
      {t:"Government policies", k:["Government policies"]},
      {t:"Legal regulation", k:["Legal regulation"]},
      {t:"Environmental sustainability", k:["Environmental sustainability"], x:true},
      {t:"Corporate social responsibility — the difference between legal compliance and ethical responsibility", k:["legal compliance","ethical responsibility"]},
      {t:"Corporate social responsibility — environmental sustainability and social responsibility", k:["environmental sustainability","social responsibility"]},
    ],
    "Operations processes": [
      {t:"Inputs — transformed resources: materials, information, customers", k:["transformed resources","materials, information, customers"]},
      {t:"Inputs — transforming resources: human resources, facilities", k:["transforming resources","human resources, facilities"]},
      {t:"Transformation processes — the influence of volume, variety, variation in demand and visibility (customer contact)", k:["volume, variety, variation in demand and visibility","customer contact"]},
      {t:"Transformation processes — sequencing and scheduling: Gantt charts, critical path analysis", k:["sequencing and scheduling","Gantt charts","critical path analysis"]},
      {t:"Transformation processes — technology, task design and process layout", k:["task design","process layout"]},
      {t:"Transformation processes — monitoring, control and improvement", k:["monitoring, control and improvement"]},
      {t:"Outputs — customer service", k:["customer service"]},
      {t:"Outputs — warranties", k:["warranties"], x:true},
    ],
    "Operations strategies": [
      {t:"Performance objectives — quality, speed, dependability, flexibility, customisation, cost", k:["Performance objectives","dependability","customisation"]},
      {t:"New product or service design and development", k:["design and development"]},
      {t:"Supply chain management — logistics, e-commerce, global sourcing", k:["Supply chain management","logistics","global sourcing"]},
      {t:"Outsourcing — advantages and disadvantages", k:["Outsourcing"], x:true},
      {t:"Technology — leading edge, established", k:["leading edge","established"]},
      {t:"Inventory management — advantages and disadvantages of holding stock, LIFO (last-in-first-out), FIFO (first-in-first-out), JIT (just-in-time)", k:["Inventory management","LIFO","FIFO","JIT"]},
      {t:"Quality management — control, assurance, improvement", k:["Quality management","assurance"]},
      {t:"Overcoming resistance to change — financial costs, purchasing new equipment, redundancy payments, retraining, reorganising plant layout, inertia", k:["resistance to change","redundancy payments","inertia"]},
      {t:"Global factors — global sourcing, economies of scale, scanning and learning, research and development", k:["economies of scale","scanning and learning","research and development"]},
    ],
  },

  "Marketing": {
    "Role of marketing": [
      {t:"Strategic role of marketing goods and services", k:["Strategic role"]},
      {t:"Interdependence with other key business functions", k:["Interdependence"], x:true},
      {t:"Production, selling, marketing approaches", k:["Production, selling, marketing approaches"]},
      {t:"Types of markets — resource, industrial, intermediate, consumer, mass, niche", k:["resource","intermediate","niche"]},
    ],
    "Influences on marketing": [
      {t:"Factors influencing customer choice — psychological, sociocultural, economic, government", k:["psychological","sociocultural"]},
      {t:"Consumer laws — deceptive and misleading advertising", k:["deceptive and misleading advertising"]},
      {t:"Consumer laws — price discrimination", k:["price discrimination"]},
      {t:"Consumer laws — implied conditions", k:["implied conditions"]},
      {t:"Consumer laws — warranties", k:["warranties"]},
      {t:"Ethical — truth, accuracy and good taste in advertising, products that may damage health, engaging in fair competition, sugging", k:["good taste in advertising","fair competition","sugging"]},
    ],
    "Marketing process": [
      {t:"Situational analysis — SWOT, product life cycle", k:["SWOT","product life cycle"]},
      {t:"Market research", k:["Market research"]},
      {t:"Establishing market objectives", k:["market objectives"]},
      {t:"Identifying target markets", k:["target markets"]},
      {t:"Developing marketing strategies", k:["marketing strategies"]},
      {t:"Implementation, monitoring and controlling — developing a financial forecast; comparing actual and planned results; revising the marketing strategy", k:["financial forecast","actual and planned results","revising the marketing strategy"]},
    ],
    "Marketing strategies": [
      {t:"Market segmentation, product/service differentiation and positioning", k:["Market segmentation","positioning"]},
      {t:"Products — goods and/or services: branding, packaging", k:["branding","packaging"]},
      {t:"Price — pricing methods: cost, market, competition-based", k:["cost, market, competition-based"]},
      {t:"Price — pricing strategies: skimming, penetration, loss leaders, price points", k:["skimming","penetration","loss leaders","price points"]},
      {t:"Price — price and quality interaction", k:["price and quality interaction"]},
      {t:"Promotion — elements of the promotion mix: advertising, personal selling and relationship marketing, sales promotions, publicity and public relations", k:["promotion mix","personal selling and relationship marketing","publicity and public relations"]},
      {t:"Promotion — the communication process: opinion leaders, word of mouth", k:["opinion leaders","word of mouth"]},
      {t:"Place/distribution — distribution channels", k:["distribution channels"]},
      {t:"Place/distribution — channel choice: intensive, selective, exclusive", k:["intensive, selective, exclusive"]},
      {t:"Place/distribution — physical distribution issues: transport, warehousing, inventory", k:["transport, warehousing, inventory"]},
      {t:"People, processes and physical evidence", k:["physical evidence"]},
      {t:"E-marketing", k:["E-marketing"]},
      {t:"Global marketing — global branding, standardisation, customisation, global pricing, competitive positioning", k:["global branding","standardisation","competitive positioning"]},
    ],
  },

  "Finance": {
    "Role of financial management": [
      {t:"Strategic role of financial management", k:["Strategic role"]},
      {t:"Objectives of financial management — profitability, growth, efficiency, liquidity, solvency", k:["profitability","liquidity","solvency"]},
      {t:"Objectives of financial management — short-term and long-term", k:["short-term and long-term"]},
      {t:"Interdependence with other key business functions", k:["Interdependence"], x:true},
    ],
    "Influences on financial management": [
      {t:"Internal sources of finance — retained profits", k:["retained profits"]},
      {t:"External sources of finance — debt: short-term borrowing (overdraft, commercial bills, factoring)", k:["overdraft","commercial bills","factoring"]},
      {t:"External sources of finance — debt: long-term borrowing (mortgage, debentures, unsecured notes, leasing)", k:["mortgage","debentures","unsecured notes"]},
      {t:"External sources of finance — equity: ordinary shares (new issues, rights issues, placements, share purchase plans), private equity", k:["rights issues","placements","private equity"]},
      {t:"Financial institutions — banks, investment banks, finance companies, superannuation funds, life insurance companies, unit trusts and the Australian Securities Exchange", k:["superannuation funds","unit trusts","Australian Securities Exchange"]},
      {t:"Influence of government — Australian Securities and Investments Commission, company taxation", k:["Australian Securities and Investments Commission","company taxation"]},
      {t:"Global market influences — economic outlook, availability of funds, interest rates", k:["economic outlook","availability of funds"]},
    ],
    "Processes of financial management": [
      {t:"Planning and implementing — financial needs, budgets, record systems, financial risks, financial controls", k:["financial needs","record systems","financial risks","financial controls"]},
      {t:"Planning and implementing — debt and equity financing: advantages and disadvantages of each", k:["debt and equity financing"]},
      {t:"Planning and implementing — matching the terms and source of finance to business purpose", k:["matching the terms and source of finance"]},
      {t:"Monitoring and controlling — cash flow statement, income statement, balance sheet", k:["cash flow statement","income statement","balance sheet"]},
      {t:"Financial ratios — liquidity: current ratio (current assets ÷ current liabilities)", k:["current ratio","current assets ÷ current liabilities"]},
      {t:"Financial ratios — gearing: debt to equity ratio (total liabilities ÷ total equity)", k:["debt to equity ratio","total liabilities ÷ total equity"]},
      {t:"Financial ratios — profitability: gross profit ratio, net profit ratio, return on equity ratio", k:["gross profit ratio","return on equity ratio"]},
      {t:"Financial ratios — efficiency: expense ratio (total expenses ÷ sales), accounts receivable turnover ratio (sales ÷ accounts receivable)", k:["expense ratio","accounts receivable turnover ratio"]},
      {t:"Financial ratios — comparative ratio analysis: over different time periods, against standards, with similar businesses", k:["comparative ratio analysis","against standards"]},
      {t:"Limitations of financial reports — normalised earnings, capitalising expenses, valuing assets, timing issues, debt repayments, notes to the financial statements", k:["normalised earnings","capitalising expenses","valuing assets","timing issues"]},
      {t:"Ethical issues related to financial reports", k:["Ethical issues"]},
    ],
    "Financial management strategies": [
      {t:"Cash flow management — cash flow statements", k:["cash flow statements"]},
      {t:"Cash flow management — distribution of payments, discounts for early payment, factoring", k:["distribution of payments","discounts for early payment"]},
      {t:"Working capital management — control of current assets: cash, receivables, inventories", k:["current assets","cash, receivables, inventories"]},
      {t:"Working capital management — control of current liabilities: payables, loans, overdrafts", k:["current liabilities","payables, loans, overdrafts"]},
      {t:"Working capital management — strategies: leasing, sale and lease back", k:["sale and lease back"]},
      {t:"Profitability management — cost controls: fixed and variable, cost centres, expense minimisation", k:["cost centres","expense minimisation"]},
      {t:"Profitability management — revenue controls: marketing objectives", k:["revenue controls","marketing objectives"]},
      {t:"Global financial management — exchange rates", k:["exchange rates"]},
      {t:"Global financial management — interest rates", k:["interest rates"]},
      {t:"Global financial management — methods of international payment: payment in advance, letter of credit, clean payment, bill of exchange", k:["payment in advance","letter of credit","clean payment","bill of exchange"]},
      {t:"Global financial management — hedging", k:["hedging"]},
      {t:"Global financial management — derivatives", k:["derivatives"]},
    ],
  },

  "Human Resources": {
    "Role of human resource management": [
      {t:"Strategic role of human resources", k:["Strategic role"]},
      {t:"Interdependence with other key business functions", k:["Interdependence"], x:true},
      {t:"Outsourcing — human resource functions", k:["human resource functions"]},
      {t:"Outsourcing — using contractors: domestic, global", k:["contractors","domestic, global"]},
    ],
    "Key influences": [
      {t:"Stakeholders — employers, employees, employer associations, unions, government organisations, society", k:["employer associations","unions","government organisations"]},
      {t:"Legal — the employment contract: common law (rights and obligations of employers and employees)", k:["common law","rights and obligations"]},
      {t:"Legal — the employment contract: minimum employment standards, minimum wage rates, awards, enterprise agreements, other employment contracts", k:["minimum employment standards","minimum wage rates","awards","enterprise agreements"]},
      {t:"Legal — occupational health and safety and workers compensation", k:["occupational health and safety","workers compensation"]},
      {t:"Legal — antidiscrimination and equal employment opportunity", k:["antidiscrimination","equal employment opportunity"]},
      {t:"Economic", k:["Economic"], x:true},
      {t:"Technological", k:["Technological"]},
      {t:"Social — changing work patterns, living standards", k:["changing work patterns","living standards"]},
      {t:"Ethics and corporate social responsibility", k:["Ethics","corporate social responsibility"]},
    ],
    "Processes of human resource management": [
      {t:"Acquisition", k:["Acquisition"]},
      {t:"Development", k:["Development"], x:true},
      {t:"Maintenance", k:["Maintenance"]},
      {t:"Separation", k:["Separation"]},
    ],
    "Human resource strategies": [
      {t:"Leadership style", k:["Leadership style"]},
      {t:"Job design — general or specific tasks", k:["Job design","general or specific tasks"]},
      {t:"Recruitment — internal or external, general or specific skills", k:["Recruitment","internal or external"]},
      {t:"Training and development — current or future skills", k:["Training and development","current or future skills"]},
      {t:"Performance management — developmental or administrative", k:["Performance management","developmental or administrative"]},
      {t:"Rewards — monetary and non-monetary, individual or group, performance pay", k:["monetary and non-monetary","performance pay"]},
      {t:"Global — costs, skills, supply", k:["costs, skills, supply"]},
      {t:"Workplace disputes — resolution: negotiation, mediation, grievance procedures, involvement of courts and tribunals", k:["negotiation","mediation","grievance procedures","courts and tribunals"]},
    ],
    "Effectiveness of human resource management": [
      {t:"Indicators — corporate culture", k:["corporate culture"]},
      {t:"Indicators — benchmarking key variables", k:["benchmarking key variables"]},
      {t:"Indicators — changes in staff turnover", k:["staff turnover"]},
      {t:"Indicators — absenteeism", k:["absenteeism"]},
      {t:"Indicators — accidents", k:["accidents"]},
      {t:"Indicators — levels of disputation", k:["levels of disputation"]},
      {t:"Indicators — worker satisfaction", k:["worker satisfaction"]},
    ],
  },
};

// ---- flattened index, built once ----------------------------------
// Every item gets a stable id "Topic|Subtopic|n" so progress can be tracked.
const SYL_ITEMS = (() => {
  const out = [];
  for (const [topic, subs] of Object.entries(SYL_CONTENT)) {
    for (const [sub, items] of Object.entries(subs)) {
      items.forEach((it, i) => {
        out.push({ id: topic + '|' + sub + '|' + i, topic, sub, t: it.t,
                   k: it.k || [], x: !!it.x, subKey: topic + '|' + sub });
      });
    }
  }
  return out;
})();

const SYL_SUBS = (() => {
  const out = [];
  for (const [topic, subs] of Object.entries(SYL_CONTENT))
    for (const sub of Object.keys(subs)) out.push({ topic, sub, key: topic + '|' + sub });
  return out;
})();
