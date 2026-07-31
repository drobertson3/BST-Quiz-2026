// HSC Business Studies diagram labelling
// Each diagram is an SVG drawn on a 640x400 canvas with the labels stripped out.
// `zones` are the empty boxes a student drops labels into (viewBox coordinates).
// px/py, where present, is the point on the artwork the label refers to — the game
// draws a leader line from the box to that point, so boxes can sit in clear margins.
// Artwork uses CSS variables so it themes with the rest of the app.
const DIAGRAMS = [

{id:"dg-operations-process", title:"The operations process",
 topic:"Operations", sub:"Operations processes",
 note:"Inputs are divided into transformed resources (materials, information, customers) and transforming resources (human resources, facilities). The transformation process converts them into outputs, and monitoring feeds back to improve the process.",
 art:`
  <rect x="40" y="170" width="140" height="80" rx="12" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <rect x="250" y="170" width="140" height="80" rx="12" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <rect x="460" y="170" width="140" height="80" rx="12" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <line x1="184" y1="210" x2="242" y2="210" stroke="var(--accent2)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <line x1="394" y1="210" x2="452" y2="210" stroke="var(--accent2)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <path d="M530 254 C 530 320, 300 340, 110 300" fill="none" stroke="var(--good)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#dgArrowGood)"/>
  <text x="392" y="360" class="dgnote" text-anchor="middle">feedback: monitoring, control and improvement</text>
  <text x="110" y="152" class="dgnote" text-anchor="middle">the resources used</text>
  <text x="320" y="152" class="dgnote" text-anchor="middle">converting resources</text>
  <text x="530" y="152" class="dgnote" text-anchor="middle">what the customer receives</text>`,
 zones:[
  {label:"Inputs", x:60, y:195, w:100, h:32},
  {label:"Transformation", x:255, y:195, w:130, h:32},
  {label:"Outputs", x:480, y:195, w:100, h:32},
  {label:"Transformed resources", x:14, y:266, w:172, h:32, px:70, py:252},
  {label:"Transforming resources", x:200, y:266, w:172, h:32, px:150, py:252}
 ]},

{id:"dg-product-life-cycle", title:"The product life cycle",
 topic:"Marketing", sub:"Marketing process",
 note:"Each stage needs a different marketing mix. Establishment builds awareness, growth builds share, maturity defends share, and decline forces a choice between an extension strategy and deletion.",
 art:`
  <line x1="70" y1="330" x2="614" y2="330" stroke="var(--line)" stroke-width="2"/>
  <line x1="70" y1="330" x2="70" y2="40" stroke="var(--line)" stroke-width="2"/>
  <text x="612" y="390" class="dgaxis" text-anchor="end">Time</text>
  <line x1="200" y1="330" x2="200" y2="70" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="330" y1="330" x2="330" y2="70" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="480" y1="330" x2="480" y2="70" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4"/>
  <path d="M80 322 C 130 318, 165 302, 200 272 C 240 238, 272 142, 330 122 C 390 104, 440 110, 480 118 C 520 128, 562 210, 600 292"
        fill="none" stroke="var(--accent2)" stroke-width="3"/>
  <circle cx="330" cy="122" r="4" fill="var(--gold)"/>
  <circle cx="480" cy="118" r="4" fill="var(--gold)"/>
  <line x1="70" y1="180" x2="78" y2="180" stroke="var(--ink2)" stroke-width="1.2"/>`,
 zones:[
  {label:"Sales revenue", x:96, y:44, w:150, h:30, px:70, py:180},
  {label:"Establishment", x:80, y:342, w:118, h:30},
  {label:"Growth", x:204, y:342, w:122, h:30},
  {label:"Maturity", x:332, y:342, w:144, h:30},
  {label:"Decline", x:482, y:342, w:120, h:30}
 ]},

{id:"dg-break-even", title:"The break-even chart",
 topic:"Finance", sub:"Financial management strategies",
 note:"Break-even is where total revenue equals total costs. Below it the business makes a loss, above it a profit. Break-even units = fixed costs ÷ (price − variable cost per unit).",
 art:`
  <line x1="70" y1="330" x2="614" y2="330" stroke="var(--line)" stroke-width="2"/>
  <line x1="70" y1="330" x2="70" y2="40" stroke="var(--line)" stroke-width="2"/>
  <text x="612" y="352" class="dgaxis" text-anchor="end">Units sold</text>
  <text x="86" y="34" class="dgaxis">$</text>
  <line x1="80" y1="270" x2="600" y2="270" stroke="var(--gold)" stroke-width="2.5"/>
  <line x1="80" y1="270" x2="600" y2="110" stroke="var(--bad)" stroke-width="2.5"/>
  <line x1="80" y1="330" x2="600" y2="60" stroke="var(--good)" stroke-width="2.5"/>
  <circle cx="364" cy="183" r="6" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5"/>
  <line x1="364" y1="183" x2="364" y2="330" stroke="var(--ink2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="258" y="252" class="dgnote" text-anchor="middle">loss</text>`,
 zones:[
  {label:"Total revenue", x:466, y:42, w:152, h:30, px:566, py:76},
  {label:"Total costs", x:466, y:96, w:152, h:30, px:566, py:121},
  {label:"Break-even point", x:186, y:132, w:168, h:30, px:364, py:183},
  {label:"Profit", x:396, y:238, w:110, h:30, px:500, py:186},
  {label:"Fixed costs", x:84, y:288, w:146, h:30, px:160, py:270}
 ]},

{id:"dg-gantt", title:"A Gantt chart",
 topic:"Operations", sub:"Operations processes",
 note:"A Gantt chart schedules tasks against time. Bars that overlap are concurrent; a bar that cannot start until another finishes is dependent. It shows when each activity runs but not why.",
 art:`
  <text x="150" y="116" class="dgaxis" text-anchor="end">Order stock</text>
  <text x="150" y="166" class="dgaxis" text-anchor="end">Fit out store</text>
  <text x="150" y="216" class="dgaxis" text-anchor="end">Hire staff</text>
  <text x="150" y="266" class="dgaxis" text-anchor="end">Train staff</text>
  <line x1="180" y1="80" x2="180" y2="300" stroke="var(--line)" stroke-width="1.5"/>
  <line x1="240" y1="80" x2="240" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="300" y1="80" x2="300" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="360" y1="80" x2="360" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="420" y1="80" x2="420" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="480" y1="80" x2="480" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="540" y1="80" x2="540" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="600" y1="80" x2="600" y2="300" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="180" y1="300" x2="614" y2="300" stroke="var(--line)" stroke-width="1.5"/>
  <text x="210" y="320" class="dgnote" text-anchor="middle">1</text>
  <text x="270" y="320" class="dgnote" text-anchor="middle">2</text>
  <text x="330" y="320" class="dgnote" text-anchor="middle">3</text>
  <text x="390" y="320" class="dgnote" text-anchor="middle">4</text>
  <text x="450" y="320" class="dgnote" text-anchor="middle">5</text>
  <text x="510" y="320" class="dgnote" text-anchor="middle">6</text>
  <text x="570" y="320" class="dgnote" text-anchor="middle">7</text>
  <rect x="180" y="98" width="120" height="22" rx="5" fill="var(--accent2)"/>
  <rect x="300" y="148" width="120" height="22" rx="5" fill="var(--accent2)"/>
  <rect x="300" y="198" width="180" height="22" rx="5" fill="var(--accent2)"/>
  <rect x="480" y="248" width="120" height="22" rx="5" fill="var(--gold)"/>`,
 zones:[
  {label:"Activity", x:24, y:44, w:126, h:30, px:108, py:102},
  {label:"Duration bar", x:180, y:44, w:150, h:30, px:240, py:110},
  {label:"Concurrent tasks", x:436, y:140, w:176, h:30, px:400, py:185},
  {label:"Dependent task", x:430, y:352, w:170, h:30, px:556, py:272},
  {label:"Time scale", x:236, y:352, w:150, h:30, px:360, py:310}
 ]},

{id:"dg-critical-path", title:"Critical path analysis",
 topic:"Operations", sub:"Operations processes",
 note:"The critical path is the longest path through the network — here 3 + 4 + 2 = 9 weeks. Tasks on it have no float, so any delay delays the whole project.",
 art:`
  <line x1="122" y1="188" x2="208" y2="132" stroke="var(--accent)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <line x1="122" y1="212" x2="208" y2="268" stroke="var(--ink2)" stroke-width="2" marker-end="url(#dgArrow)"/>
  <line x1="252" y1="132" x2="358" y2="188" stroke="var(--accent)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <line x1="252" y1="268" x2="358" y2="212" stroke="var(--ink2)" stroke-width="2" marker-end="url(#dgArrow)"/>
  <line x1="402" y1="200" x2="496" y2="200" stroke="var(--accent)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <circle cx="100" cy="200" r="22" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <circle cx="230" cy="120" r="22" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <circle cx="230" cy="280" r="22" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <circle cx="380" cy="200" r="22" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <circle cx="520" cy="200" r="22" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <text x="100" y="206" class="dgaxis" text-anchor="middle">1</text>
  <text x="230" y="126" class="dgaxis" text-anchor="middle">2</text>
  <text x="230" y="286" class="dgaxis" text-anchor="middle">3</text>
  <text x="380" y="206" class="dgaxis" text-anchor="middle">4</text>
  <text x="520" y="206" class="dgaxis" text-anchor="middle">5</text>
  <text x="150" y="142" class="dgnote" text-anchor="middle">A · 3</text>
  <text x="150" y="268" class="dgnote" text-anchor="middle">B · 2</text>
  <text x="362" y="146" class="dgnote" text-anchor="middle">C · 4</text>
  <text x="272" y="320" class="dgnote" text-anchor="middle">D · 1</text>
  <text x="450" y="188" class="dgnote" text-anchor="middle">E · 2</text>`,
 zones:[
  {label:"Node (event)", x:20, y:250, w:150, h:30, px:100, py:222},
  {label:"Activity", x:96, y:40, w:126, h:30, px:165, py:160},
  {label:"Critical path", x:330, y:40, w:150, h:30, px:305, py:158},
  {label:"Float", x:322, y:330, w:120, h:30, px:305, py:243},
  {label:"Duration", x:488, y:296, w:132, h:30, px:450, py:194}
 ]},

{id:"dg-distribution-channels", title:"Distribution channels",
 topic:"Marketing", sub:"Marketing strategies",
 note:"Each intermediary adds cost and takes a margin, but also adds reach and service. A direct channel keeps the margin and the customer relationship but requires the producer to do the distributing.",
 art:`
  <rect x="32" y="150" width="120" height="50" rx="10" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <rect x="184" y="150" width="120" height="50" rx="10" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <rect x="336" y="150" width="120" height="50" rx="10" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <rect x="488" y="150" width="120" height="50" rx="10" fill="var(--card2)" stroke="var(--accent2)" stroke-width="2"/>
  <line x1="156" y1="175" x2="176" y2="175" stroke="var(--accent2)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <line x1="308" y1="175" x2="328" y2="175" stroke="var(--accent2)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <line x1="460" y1="175" x2="480" y2="175" stroke="var(--accent2)" stroke-width="3" marker-end="url(#dgArrow)"/>
  <path d="M92 204 C 92 296, 548 296, 548 208" fill="none" stroke="var(--good)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#dgArrowGood)"/>
  <text x="320" y="118" class="dgnote" text-anchor="middle">each intermediary takes a margin</text>`,
 zones:[
  {label:"Producer", x:37, y:160, w:110, h:30},
  {label:"Wholesaler", x:189, y:160, w:110, h:30},
  {label:"Retailer", x:341, y:160, w:110, h:30},
  {label:"Consumer", x:493, y:160, w:110, h:30},
  {label:"Direct channel", x:244, y:316, w:152, h:30, px:320, py:288}
 ]},

{id:"dg-hr-cycle", title:"The human resource cycle",
 topic:"Human Resources", sub:"Processes of human resource management",
 note:"The four processes run continuously. Acquisition attracts and hires, development builds capability, maintenance retains and motivates, and separation ends the relationship — feeding the need to acquire again.",
 art:`
  <rect x="245" y="40" width="150" height="46" rx="12" fill="var(--card2)" stroke="var(--hr)" stroke-width="2"/>
  <rect x="450" y="175" width="150" height="46" rx="12" fill="var(--card2)" stroke="var(--hr)" stroke-width="2"/>
  <rect x="245" y="310" width="150" height="46" rx="12" fill="var(--card2)" stroke="var(--hr)" stroke-width="2"/>
  <rect x="40" y="175" width="150" height="46" rx="12" fill="var(--card2)" stroke="var(--hr)" stroke-width="2"/>
  <rect x="248" y="175" width="144" height="46" rx="12" fill="var(--bg2)" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 3"/>
  <path d="M400 68 C 470 76, 512 118, 522 168" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>
  <path d="M522 228 C 512 282, 468 322, 402 332" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>
  <path d="M240 332 C 172 322, 128 282, 118 228" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>
  <path d="M118 168 C 128 118, 170 76, 240 68" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>`,
 zones:[
  {label:"Acquisition", x:250, y:48, w:140, h:30},
  {label:"Development", x:455, y:183, w:140, h:30},
  {label:"Maintenance", x:250, y:318, w:140, h:30},
  {label:"Separation", x:45, y:183, w:140, h:30},
  {label:"Human resources", x:252, y:183, w:136, h:30}
 ]},

{id:"dg-swot", title:"SWOT analysis",
 topic:"Marketing", sub:"Marketing process",
 note:"Strengths and weaknesses are internal and can be controlled. Opportunities and threats are external and can only be responded to. SWOT is the situational analysis that starts the marketing process.",
 art:`
  <rect x="140" y="90" width="420" height="240" rx="10" fill="none" stroke="var(--line)" stroke-width="2"/>
  <line x1="350" y1="90" x2="350" y2="330" stroke="var(--line)" stroke-width="2"/>
  <line x1="140" y1="210" x2="560" y2="210" stroke="var(--line)" stroke-width="2"/>
  <rect x="140" y="90" width="210" height="120" fill="var(--good)" fill-opacity="0.10"/>
  <rect x="350" y="90" width="210" height="120" fill="var(--bad)" fill-opacity="0.10"/>
  <rect x="140" y="210" width="210" height="120" fill="var(--good)" fill-opacity="0.10"/>
  <rect x="350" y="210" width="210" height="120" fill="var(--bad)" fill-opacity="0.10"/>
  <text x="245" y="70" class="dgnote" text-anchor="middle">helpful</text>
  <text x="455" y="70" class="dgnote" text-anchor="middle">harmful</text>
  <text x="66" y="276" class="dgaxis" text-anchor="middle">External</text>
  <line x1="106" y1="270" x2="136" y2="270" stroke="var(--ink2)" stroke-width="1.2" stroke-dasharray="3 3"/>`,
 zones:[
  {label:"Internal", x:14, y:135, w:110, h:30, px:140, py:150},
  {label:"Strengths", x:175, y:135, w:140, h:30},
  {label:"Weaknesses", x:385, y:135, w:140, h:30},
  {label:"Opportunities", x:175, y:255, w:140, h:30},
  {label:"Threats", x:385, y:255, w:140, h:30}
 ]},

{id:"dg-balance-sheet", title:"The balance sheet",
 topic:"Finance", sub:"Processes of financial management",
 note:"The two sides always balance: assets = liabilities + owner's equity. Current items are due or realised within twelve months; non-current items sit beyond that.",
 art:`
  <text x="190" y="72" class="dgbig" text-anchor="middle">ASSETS</text>
  <text x="450" y="72" class="dgbig" text-anchor="middle">LIABILITIES + EQUITY</text>
  <rect x="90" y="90" width="200" height="100" fill="var(--fin)" fill-opacity="0.16" stroke="var(--fin)" stroke-width="2"/>
  <rect x="90" y="190" width="200" height="110" fill="var(--fin)" fill-opacity="0.30" stroke="var(--fin)" stroke-width="2"/>
  <rect x="350" y="90" width="200" height="80" fill="var(--accent)" fill-opacity="0.30" stroke="var(--accent)" stroke-width="2"/>
  <rect x="350" y="170" width="200" height="65" fill="var(--bad)" fill-opacity="0.16" stroke="var(--bad)" stroke-width="2"/>
  <rect x="350" y="235" width="200" height="65" fill="var(--bad)" fill-opacity="0.30" stroke="var(--bad)" stroke-width="2"/>
  <text x="320" y="202" class="dgbig" text-anchor="middle">=</text>
  <text x="320" y="336" class="dgnote" text-anchor="middle">the two sides must always balance</text>`,
 zones:[
  {label:"Non-current assets", x:100, y:125, w:180, h:30},
  {label:"Current assets", x:100, y:230, w:180, h:30},
  {label:"Owner's equity", x:360, y:115, w:180, h:30},
  {label:"Non-current liabilities", x:360, y:187, w:180, h:30},
  {label:"Current liabilities", x:360, y:252, w:180, h:30}
 ]},

{id:"dg-working-capital", title:"The working capital cycle",
 topic:"Finance", sub:"Financial management strategies",
 note:"Cash buys inventory, inventory is sold on credit to create receivables, and receivables are collected back into cash. Supplier credit (accounts payable) funds part of the cycle. The shorter the cycle, the less finance the business needs.",
 art:`
  <rect x="245" y="50" width="150" height="46" rx="12" fill="var(--card2)" stroke="var(--fin)" stroke-width="2"/>
  <rect x="440" y="175" width="180" height="46" rx="12" fill="var(--card2)" stroke="var(--fin)" stroke-width="2"/>
  <rect x="245" y="300" width="150" height="46" rx="12" fill="var(--card2)" stroke="var(--fin)" stroke-width="2"/>
  <rect x="20" y="175" width="180" height="46" rx="12" fill="var(--card2)" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 3"/>
  <rect x="248" y="175" width="144" height="46" rx="12" fill="var(--bg2)" stroke="var(--accent)" stroke-width="2"/>
  <path d="M400 78 C 466 86, 508 120, 522 168" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>
  <path d="M520 228 C 500 282, 452 318, 402 326" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>
  <path d="M240 326 C 176 316, 134 274, 128 224" fill="none" stroke="var(--accent2)" stroke-width="2.5" marker-end="url(#dgArrow)"/>
  <path d="M128 172 C 138 122, 178 88, 240 78" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#dgArrowBad)"/>
  <text x="470" y="130" class="dgnote" text-anchor="middle">sold on credit</text>
  <text x="470" y="288" class="dgnote" text-anchor="middle">collected</text>`,
 zones:[
  {label:"Inventory", x:255, y:58, w:130, h:30},
  {label:"Accounts receivable", x:445, y:183, w:170, h:30},
  {label:"Cash", x:270, y:308, w:100, h:30},
  {label:"Accounts payable", x:25, y:183, w:170, h:30},
  {label:"Working capital", x:255, y:183, w:130, h:30}
 ]},
];
