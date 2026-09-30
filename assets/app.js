/* ============================================================
   C. SIMULATED CTAs  (Installation + Service are demonstrations)
   ============================================================ */
(function () {
  document.querySelectorAll('[data-sim]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('b-type'), want = a.getAttribute('data-sim');
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.indexOf(want) === 0) { sel.selectedIndex = i; break; }
      }
      document.getElementById('tab-book').click();
    });
  });
})();

/* ============================================================
   D. TABS
   ============================================================ */
(function () {
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });
})();

/* ============================================================
   E. SCHEDULER  (simulated: confirms on screen, sends nothing)
   ============================================================ */
(function () {
  var f = document.getElementById('bookform'), out = document.getElementById('bookok');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = f.name.value.trim(), email = f.email.value.trim(), bld = f.building.value.trim();
    if (!name || !email || !bld || !f.phone.value.trim()) {
      out.hidden = false; out.classList.add('err');
      out.innerHTML = '<b>Not sent</b><p style="margin:8px 0 0">Name, email, phone and building are required.</p>';
      out.scrollIntoView({ block: 'nearest' }); return;
    }
    var d = new Date();
    var ticket = 'CMS-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0')
               + String(d.getDate()).padStart(2, '0') + '-'
               + String(Math.floor(Math.random() * 9000) + 1000);
    out.hidden = false; out.classList.remove('err');
    out.innerHTML = '<b>Request logged</b><span class="tick">' + ticket + '</span>'
      + '<p style="margin:0 0 10px">' + esc(f.type.value) + ' — ' + esc(bld) + '.</p>'
      + '<p style="margin:0;font-size:13px;color:var(--ink-muted)">Demonstration only: this form '
      + 'is confirmed on screen and is not transmitted.</p>';
    out.scrollIntoView({ block: 'nearest' });
    f.reset();
  });
  window.esc = esc;
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
})();

/* ============================================================
   G. LIMIT SHEET
   Every row traces to a project file. Nothing here is invented; where a limit
   is genuinely undecided the cell says so.
   ============================================================ */
(function () {
  var PEND = '<span class="pending">not set</span>';
  var ROWS = [
    { p:'Natural frequency found, by bump test', u:'Hz', task:'ELE-02',
      base:'Measured per machine and per direction \u2014 horizontal, vertical, axial',
      alert:'Within 10 % of a speed the machine has to run at',
      act:'Inside the working speed range with no band set',
      src:'Impact test with the drive and starter locked out; confirmed against a phase-referenced speed sweep' },
    { p:'Lockout band programmed', u:'Hz low / Hz high', task:'ELE-02',
      base:'Set either side of the proven resonance, above the drive minimum speed',
      alert:'Band overlaps another, or eats turndown the sequence needs',
      act:'Band absent, disabled, or not live in the building control loop',
      src:'Drive critical-speed parameters, e.g. ABB ACS800 group 25; three bands on most drives' },
    { p:'First-order amplitude at each band edge, after programming', u:'in/s RMS', task:'ELE-02',
      base:'Re-measured at both edges once the band is set',
      alert:'No fall against the pre-programming sweep',
      act:'Above the evaluation zone for that machine, mounting and support',
      src:'ISO 10816-7 for rotodynamic pumps; ISO 20816-1 and -3 for the motors. Zones depend on machine class and mounting, so no single number is quoted here' },
    { p:'Band re-verified after mechanical work', u:'date', task:'ELE-02',
      base:'Re-measured after a sheave, motor, belt retension or impeller change',
      alert:'Mechanical work logged with no re-measurement',
      act:'Band never re-checked since the change',
      src:'Natural frequency moves with mass and stiffness; on a tower, basin level recorded beside the reading' },
    { p:'Tower approach to wet bulb', u:'\u00b0F', task:'CT-03',
      base:'Start-up reading at a recorded fan speed',
      alert:'+2 \u00b0F over baseline', act:'+4 \u00b0F over baseline',
      src:'The tower schedule for your building \u2014 design leaving water temperature at the design wet bulb' },
    { p:'Plate HX approach, tower side', u:'\u00b0F', task:'HX-01',
      base:'Start-up reading at a recorded pump speed',
      alert:'+2 \u00b0F over baseline', act:'+4 \u00b0F over baseline',
      src:'The exchanger submittal \u2014 design duty and approach on both sides at the scheduled flow' },
    { p:'Plate HX pressure drop at reference flow', u:'psi', task:'HX-01',
      base:'Start-up reading at the same pump speed',
      alert:'+25 % over baseline', act:'+50 % over baseline',
      src:'The maker sets no fixed cleaning interval, so the trend decides \u2014 rising approach means scaling, rising \u0394P at the same flow means plugging' },
    { p:'Closed-loop supply temperature', u:'\u00b0F', task:'CTL-03',
      base:'Seasonal band from the first year of readings',
      alert:PEND, act:PEND,
      src:'Heat pump entering-water range, maker IOM \u2014 to confirm at the nameplate' },
    { p:'WSHP lockouts, same failure mode', u:'units / month', task:'CTL-05',
      base:'0',
      alert:'2 similar units in one month',
      act:'3 or more similar units in one month \u2014 one group Root Cause Report',
      src:'Our Root Cause Report trigger for a repeated failure mode across similar units' },
    { p:'Pump vibration, overall', u:'in/s RMS', task:'PMP-05',
      base:'First FFT route sets it',
      alert:'+2\u03c3 over baseline',
      act:'0.15 in/s RMS at 70\u2013120 % of BEP',
      src:'B&amp;G e-1510 example limit; ISO 10816-7 zones as a second reference, and only where the pump is flexibly coupled' },
    { p:'Motor vibration, overall', u:'in/s RMS', task:'PMP-05',
      base:'First FFT route sets it',
      alert:'+2\u03c3 over baseline', act:'ISO 20816-3 zone limit',
      src:'Motors are 50 hp (open loop) and 100 hp (closed loop), both above 15 kW, so ISO 20816-3 applies' },
    { p:'Free halogen residual', u:'ppm', task:'WT-02',
      base:'Vendor control range',
      alert:'Below range on one independent spot test',
      act:'Below range on two consecutive tests',
      src:'ASHRAE/ACCA 180 Table 5-10; the vendor water management plan sets the range' },
    { p:'Cycles of concentration, meter vs conductivity', u:'% apart', task:'WT-03',
      base:'The two agree',
      alert:'Flow-based cycles more than 10 % above conductivity-based',
      act:'Investigate as leak, overflow or drift',
      src:'EPA WaterSense guidance' },
    { p:'Elevator hoistway pressurization', u:'in. w.g.', task:'LSF-04',
      base:'Commissioning target',
      alert:'Any fall toward zero',
      act:'Zero or negative at the test',
      src:'The building\u2019s own smoke-control acceptance criteria. Any positive pressure is acceptable; a target is set at commissioning' },
    { p:'Stair pressurization', u:'in. w.g.', task:'LSF-04',
      base:'Within 0.05 to 0.35',
      alert:'Approaching either end of the range',
      act:'Outside 0.05\u20130.35, or door force above 30 lb to set in motion',
      src:'The building\u2019s own smoke-control acceptance criteria, from the commissioning report' }
  ];

  var tb = document.querySelector('#limits tbody');
  if (!tb) return;
  var esc = window.esc;
  ROWS.forEach(function (r, i) {
    var tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.dataset.i = i;
    tr.innerHTML = '<th>' + esc(r.p) + ', ' + r.u + '</th>'
      + '<td style="white-space:nowrap;color:var(--ink-muted)">' + esc(r.task) + '</td>'
      + '<td style="color:var(--ink-muted)">' + esc(r.base) + '</td>'
      + '<td style="color:var(--ink-muted)">' + r.alert + '</td>'
      + '<td style="color:var(--ink-muted)">' + r.act + '</td>'
      + '<td style="color:var(--ink-muted)">' + r.src + '</td>';
    tb.appendChild(tr);
  });

  var yAxis = document.getElementById('trend-y');
  var cap = document.getElementById('trend-cap');
  var capBase = cap ? cap.innerHTML : '';
  var picked = null;

  function pick(i) {
    var tr = tb.children[i], r = ROWS[i];
    if (picked === i) {
      tr.classList.remove('on'); picked = null;
      if (yAxis) yAxis.textContent = 'HX approach, \u00b0F';
      if (cap) cap.innerHTML = capBase;
      return;
    }
    Array.prototype.forEach.call(tb.children, function (x) { x.classList.remove('on'); });
    tr.classList.add('on'); picked = i;
    if (yAxis) yAxis.textContent = r.p + ', ' + r.u;
    if (cap) cap.innerHTML = 'Fig. 1 now reads as <b>' + esc(r.p) + '</b> (' + r.u
      + '), task ' + esc(r.task) + '. The control logic is the same for every parameter on the '
      + 'limit sheet: the report opens at the alert limit, so the action limit is never reached. '
      + 'Shape of a real case; illustration, not measured data.';
    var fig = document.querySelector('.trend');
    if (fig) fig.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  tb.addEventListener('click', function (e) {
    var tr = e.target.closest('tr');
    if (tr) pick(+tr.dataset.i);
  });
  tb.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var tr = e.target.closest('tr');
    if (tr) { e.preventDefault(); pick(+tr.dataset.i); }
  });
})();

/* ============================================================
   F. CLIENT PORTAL  (demo data seeded in the page)
   ============================================================ */
(function () {
  var MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  var ACCOUNTS = {
    'CMS-SAMPLE': {
      pin: '0500',
      building: 'Sample account',
      address: 'This is what your portal looks like — illustrative data',
      plan: 'Curious Root Cause',
      since: 'Sample',
      kpis: [
        { v: '4', l: 'Visits logged this quarter' },
        { v: '12', l: 'Months of trend on every ID' },
        { v: '3', l: 'Open findings in this sample' },
        { v: '48 h', l: 'Retest after water remediation' }
      ],
      schedule: [
        ['Cooling towers — inspection, clean, fill and drift check', 'CT-01…12', [1,1,1,1,2,1,1,1,1,1,1,1]],
        ['Water treatment + Legionella control', 'WT-01…12', [1,1,1,1,1,1,1,1,1,1,1,1]],
        ['Condenser water pumps', 'PMP-01…05', [1,2,1,1,2,1,1,2,1,2,2,1]],
        ['Plate heat exchangers — approach and ΔP', 'HX-01…04', [1,2,2,1,2,1,1,2,1,1,2,1]],
        ['Boilers — monthly check, safety devices, certificate inspection', 'BLR-01…08', [2,1,1,2,2,1,2,1,1,2,2,1]],
        ['Outdoor air unit RTU-1 (DOAS)', 'DOAS-01…06', [2,1,2,2,2,1,2,1,1,2,2,1]],
        ['Elevator machine room cooling', 'EMR-01…05', [1,1,1,2,2,2,1,1,1,1,1,2]],
        ['Equipment-room mini-splits', 'MS-01…05', [1,1,1,2,1,1,2,1,1,2,1,1]],
        ['Common-area water-source heat pumps', 'WSHP-01…07', [2,2,2,2,1,1,2,2,1,2,1,1]],
        ['Life-safety fan readiness and smoke control test', 'LSF-01…09', [2,2,1,1,2,1,1,2,1,1,1,1]],
        ['FFT vibration — pumps and tower fans', 'CT-13, PMP-05', [0,0,0,0,2,0,0,0,0,0,2,0]],
        ['VFD checks and skip-frequency sweep', 'ELE-01, ELE-02', [0,0,0,2,0,2,0,0,0,0,0,2]],
        ['IR thermography of panels — needs 40% load', 'ELE-03', [0,0,0,0,0,0,2,0,0,0,0,0]],
        ['Controls and BAS', 'CTL-01…04', [0,2,0,0,2,2,0,2,0,0,2,2]],
        ['Monthly failure trend report', 'CTL-05', [1,1,1,1,1,1,1,1,1,1,1,1]]
      ],
      inspection: [
        ['Cooling tower water \u2014 visual', 'Fail', 'Heavy mineral scale on the fill; larvae in the basin; algae on wet outer surfaces.', 'sample'],
        ['Condenser water chemistry control', 'Fail', 'A control in the treatment program is not holding. Which one is the open question.', 'sample'],
        ['Heat pump high-pressure lockouts', 'To verify', 'Afternoon lockouts point to loop temperature rather than one bad unit: lost heat rejection at the tower and the exchangers, with closed-loop debris as a second cause. Fault histories are downloaded before any reset.', 'sample'],
        ['Plate exchanger approach and \u0394P', 'Not yet measured', 'No baseline can be taken until pressure and temperature ports exist on both sides. Fitting them is the first corrective item.', 'sample'],
        ['Boilers', 'Verified on paper', 'Nameplate input, ASME stamp, National Board number and the state certificate of operation are checked at the first visit, not assumed from a drawing.', 'sample'],
        ['Life-safety fans', 'Open', 'Fans found in the field are reconciled against the approved fan schedule. Every difference is a site check, never a finding until it is confirmed.', 'sample']
      ],
      findings: [
        {
          id: 'P-01', title: 'Mineral scale on fill and louvers', sev: 'High',
          observed: 'Heavy white deposit across the fill and louvers of the tower.',
          why: 'Scale on the fill indicates a severe scaling situation. A white deposit can also be white rust from zinc corrosion, and the two need opposite treatments. The approved design specifies a 316 stainless basin and a 304 stainless casing, so white rust is unlikely here — but galvanized hardware can still appear in the upper structure or in replaced parts, and the nameplate settles it before any cleaner is chosen.',
          plan: 'Laboratory test on the deposit to separate scale from white rust, and confirm the metallurgy at the nameplate. If scale is confirmed and the material allows it, acid clean; if white rust, passivate instead. Then correct the cycles of concentration that let it form.',
          std: 'UFM 3-230-13 §5-6.7.2 · Chem-Aqua TB 2-032', status: 'Specimen'
        },
        {
          id: 'P-02', title: 'Worms in the tower water', sev: 'High',
          observed: 'Live worms visible in the tower water. Most likely midge larvae; nematodes also possible.',
          why: 'Larvae need sediment, biofilm and a biocide that is not working. Higher life forms in the water show a strong potential for amplification even when the Legionella count reads low.',
          plan: 'Health risk first: samples, then a working biocide, before any cleaning. Legionella culture per basin to an ISO/IEC 17025 laboratory, with sodium thiosulfate in the bottle, plus deposit and organism samples. Restore a measurable disinfectant residual online — the CDC first remediation step — with the crew in respiratory protection and the fans off where possible, since dosing can raise drift. Only then drain one cell at a time \u2014 the drain route confirmed with the county and the city first, and the drain water analysed \u2014 remove the sediment, and clean and disinfect the basin and wetted surfaces. Restore automatic bleed and feed control, and retest at least 48 hours after normal operation resumes.',
          std: 'CDC remediation ladder · CTI WTB-148 · ASHRAE 188', status: 'Specimen'
        },
        {
          id: 'P-03', title: 'Algae on wet outer surfaces', sev: 'Medium',
          observed: 'Green growth on outside surfaces of the tower.',
          why: 'Algae grow only where surfaces are both wet and sunlit. Wet outer surfaces point to splash, drift or an overflowing basin — and drift is the path that carries Legionella to people, so it is the one we rule in or out first.',
          plan: 'Inspect the drift eliminators seated and undamaged and the basin float and overflow (CT-02, CT-03), then compare cycles by make-up meter against cycles by conductivity (WT-03): more than 10 % apart means water is leaving as drift, splash or overflow. Clean the affected surfaces, then confirm with independent testing that the control holds rather than assuming the cleaning fixed it.',
          std: 'UFM 3-230-13 §5-4.1 · CTI WTB-148', status: 'Specimen'
        }
            ],
      note: 'Sample portal. The account, the calendar, the inspection and the findings above are illustrative, shown so you can see what you would receive. The sign-in is seeded in the page and is not a secure login.'
    },

    /* ------------------------------------------------------------------
       A live client account. Everything below is the field inspection as
       it was recorded: the findings, the readings and the maintenance
       matrix are transcribed from the report, not illustrative.
       ------------------------------------------------------------------ */
    'ARPEC GENERAL MANAGER': {
      pin: '1949',
      building: 'ARPEC Training Facility',
      address: 'Initial inspection and proposed maintenance program',
      plan: 'Curious Root Cause',
      visit: 'Field inspection September 2026, by Julio, Mauricio, Dalton and Kevens. Equipment covered: CT-1 cooling tower, CWP-1 condenser water pump, WSHP heat pumps and PKG-1 package unit.',
      kpis: [
        { v: '4', l: 'Equipment groups inspected' },
        { v: '20', l: 'Findings opened' },
        { v: '7', l: 'Urgent — first visit' },
        { v: '12', l: 'Visits per year proposed' }
      ],
      equipment: [
        {
          id: 'CT-1', name: 'Marley Aquatower cooling tower', cond: 'Condition: Poor', poor: true,
          why: 'Why: no preventive maintenance.',
          items: [
            ['Urgent',  'Algae in the water — Legionella risk',    'Clean, disinfect, start water treatment'],
            ['Soon',    'Fan bearings noisy and vibrating',          'Replace fan bearings'],
            ['Soon',    'Mineral buildup on the air intake',         'Remove the buildup'],
            ['Planned', 'No vibration isolators — noise and wear', 'Install vibration isolators'],
            ['Planned', 'Rust on the steel base',                    'Treat rust and repaint']
          ]
        },
        {
          id: 'CWP-1', name: 'Condenser water pump', cond: 'Condition: Fair', poor: false,
          items: [
            ['Soon', 'Strainer clogged — less water flow', 'Clean strainer, check it every visit']
          ]
        },
        {
          id: 'WSHP', name: 'Water-source heat pumps (ClimateMaster)',
          cond: 'Pending full inspection', poor: false,
          why: 'Root cause: low water flow.',
          items: [
            ['Urgent', 'Low water flow from the tower loop',      'Fix tower water and pump first'],
            ['Urgent', 'Compressors overheating (high pressure)', 'Recheck once water flow is fixed'],
            ['Urgent', 'Filters very dirty',                      'Replace filters; set a change schedule'],
            ['Soon',   'Unit #1: low refrigerant charge',         'Leak test, repair, recharge'],
            ['Soon',   'Hard-start kits on all compressors',      'Compressor check; track every year'],
            ['Soon',   'Condensate lines loose, unsupported',     'Secure and support drain lines'],
            ['Soon',   'Full inspection not possible yet',        'Inspect each unit once flow is fixed']
          ],
          note: 'Thermal image: compressor hot spots of 257–284 °F. Hard-start kits can point to worn compressors.'
        },
        {
          id: 'PKG-1', name: 'Lennox LGA048H package unit',
          cond: 'Condition: Poor · Running', poor: true,
          why: 'Unit age: 23 years (built 2003).',
          items: [
            ['Urgent',  'Readings point to low refrigerant (R-22)', 'Confirm leak; plan unit replacement'],
            ['Urgent',  'Rust in the gas heating section',          'Inspect heat exchanger; test for CO'],
            ['Urgent',  'Air filters fully clogged',                'Replace filters; set a change schedule'],
            ['Soon',    'Dirty condenser coil',                     'Clean the coil; check airflow'],
            ['Soon',    'Water ponding under the unit',             'Extend the drain away from the base'],
            ['Done',    'Condensate trap installed backwards',      'Corrected on site'],
            ['Planned', 'Rust on stand, base and cabinet',          'Treat rust and repaint']
          ],
          note: 'Readings: suction 66.9 psig — Lennox Table 14 for this model is indexed to outdoor entering-air temperature and gives 78 psig ±5 at 90 °F. Subcooling 4.7 °F against the 10 °F ±1 of Lennox Table 20. Superheat 39.2 °F is reported as measured: Lennox publishes no superheat target for this unit, which is charged by subcooling and the pressure tables. Both referenced readings sit below the manufacturer band, consistent with low charge.'
        }
      ],
      recommend: {
        title: 'PKG-1 — we recommend replacing this unit',
        why: '23 years old (built October 2003, serial 5603K09506), running on R-22, and the measured charge is low.',
        reasons: [
          'Age: past the typical 15–20 year service life',
          'Refrigerant: R-22 is phased out; recharging a leak is costly',
          'Performance: low charge cuts capacity and efficiency',
          'Corrosion: heating section, cabinet, base and stand',
          'Energy: costs more to run than new equipment',
          'Aging parts: motors, controls, contactors, compressor',
          'Reliability: more repairs; parts harder to find'
        ],
        until: 'Until it is replaced: filters, drain and a CO safety check only. Skip major repairs on the old R-22 system and put that budget into the new unit.'
      },
      pm: {
        intro: 'Monthly visits, 12 per year. Each visit adds its own tasks to the ones in the columns to its left.',
        rows: [
          ['CT-1 — Cooling tower',
            ['Basin, strainer, float', 'Belt and bearings', 'Water treatment check'],
            ['Grease fan bearings', 'Vibration check', 'Legionella test'],
            ['Drain, clean, disinfect', 'Inspect louvers, fill'],
            ['Descale fill, louvers', 'Motor amps, wiring', 'Rust repair, paint']],
          ['CWP-1 — Pump',
            ['Clean strainer', 'Leaks and noise'],
            ['Amps, volts, speed', 'Flow check'],
            ['O-ring and seal'],
            ['Grounding test', 'Motor inspection']],
          ['WSHP — Heat pumps, all units',
            ['Check filters', 'Check drain lines'],
            ['Replace filters', 'Water temps in/out', 'Compressor amps'],
            ['Clean coil, drain pan', 'Contactors, capacitors'],
            ['Refrigerant readings', 'Compressor trend']],
          ['PKG-1 — Package unit, current and new',
            ['Check filters', 'Check drain'],
            ['Replace filters', 'Clean drain, trap', 'Refrigerant readings'],
            ['Clean coils', 'Belts, contactors'],
            ['Heat exchanger, CO test', 'Electrical check']],
          ['Site — Stands, pads, drains',
            ['Clear debris, weeds'],
            ['Ponding, drainage'],
            ['Stands, anchors'],
            ['Rust repair, paint']]
        ],
        foot: 'Every visit is logged in this portal, dated. Based on ASHRAE/ACCA Standard 180.'
      },
      documents: [
        { title: 'Master Service and Maintenance Agreement \u2014 with the priced Exhibit A',
          desc: 'The agreement that governs the work: covered services and exclusions, response times, workmanship warranty, refrigerant handling, payment and termination. Exhibit A is the completed Service Plan, and it carries the maintenance price: the three plans side by side, the monthly fee, the heat pumps as a per-unit rate with the count left open until we have measured it, the labour and after-hours rates, and the year-one work that sits outside the recurring fee.',
          href: 'docs/master-service-agreement.pdf', meta: 'PDF \u00b7 15 pages \u00b7 0.6 MB' },
        { title: 'HVAC Equipment Inspection \u2014 full report',
          desc: 'All four equipment groups in one document: every finding with the action against it, the field photographs, the replacement recommendation for the package unit, and the preventive maintenance plan.',
          href: 'docs/hvac-equipment-inspection.html', meta: 'Presentation \u00b7 9 pages \u00b7 4.3 MB' },
        { title: 'Cooling Tower and Pump \u2014 CT-1, CWP-1',
          desc: 'The condenser water side on its own, with eleven field photographs: the basin and fill, the air intake, the strainer opened, the stand, the disconnect and the motor nameplate.',
          href: 'docs/cooling-tower-and-pump.html', meta: 'Presentation \u00b7 4 pages \u00b7 3.3 MB' },
        { title: 'Heat Pumps \u2014 WSHP',
          desc: 'The water-source heat pumps on their own: why low water flow upstream explains what the units were doing, with the thermal image of the compressor hot spots.',
          href: 'docs/heat-pumps.html', meta: 'Presentation \u00b7 3 pages \u00b7 1.8 MB' },
        { title: 'Package Unit \u2014 PKG-1',
          desc: 'The 23-year-old Lennox on its own, with nine field photographs, the measured refrigerant readings and the case for replacing it rather than repairing it.',
          href: 'docs/package-unit.html', meta: 'Presentation \u00b7 5 pages \u00b7 3.5 MB' },
        { title: 'RTU-1 Replacement Estimate \u2014 PKG-1',
          desc: 'What the replacement costs, built from the bottom up. Two options, the nameplate decoded against Lennox literature, the change-out and the corroded base priced as separate sections, every allowance declared as an allowance, and a plain statement of why we are not selling this on energy savings.',
          href: 'docs/rtu1-replacement-estimate.pdf', meta: 'PDF \u00b7 8 pages \u00b7 0.9 MB' }
      ],
      note: 'Findings stay open in this portal until a verification reading closes them. Timing is the order of work, not a promise of a date: urgent items are done on the first visit, and anything that depends on water flow is re-read after the flow is corrected rather than judged twice. This sign-in is seeded in the page and is not a secure login.'
    }
  };

  var form = document.getElementById('loginform');
  var err = document.getElementById('loginerr');
  var loginBox = document.getElementById('portal-login');
  var app = document.getElementById('portal-app');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* an account name of several words has to sign in however it is typed:
       any run of whitespace collapses to one space, and case is ignored */
    var id = form.acct.value.trim().replace(/\s+/g, ' ').toUpperCase(),
        pin = form.pin.value.trim();
    var a = ACCOUNTS[id];
    if (!a || a.pin !== pin) {
      err.hidden = false;
      err.innerHTML = '<b>Not recognized</b><p style="margin:8px 0 0">Check the account number and PIN. '
        + 'The sample account is CMS-SAMPLE / 0500.</p>';
      return;
    }
    err.hidden = true;
    loginBox.hidden = true;
    app.hidden = false;
    app.innerHTML = render(id, a);
    document.getElementById('signout').addEventListener('click', function () {
      app.hidden = true; app.innerHTML = ''; loginBox.hidden = false; form.reset();
    });
    app.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  /* one finding, rendered the same way wherever it appears */
  function card(f) {
    return '<div class="find"><header><h4>' + esc(f.id) + ' — ' + esc(f.title) + '</h4>'
         + '<span class="sev' + (f.sev === 'High' ? ' hi' : '') + '">' + esc(f.sev) + '</span>'
         + '<span class="src">' + esc(f.status) + '</span></header><dl>'
         + '<dt>Observed</dt><dd>' + esc(f.observed) + '</dd>'
         + '<dt>Why it happened</dt><dd>' + esc(f.why) + '</dd>'
         + '<dt>Plan</dt><dd>' + esc(f.plan) + '</dd>'
         + '<dt>Basis</dt><dd>' + esc(f.std) + '</dd></dl></div>';
  }

  /* the findings are the strongest thing on the page, so they also run in the open,
     above the plans - from this same array, never a second copy */
  (function publish() {
    var box = document.getElementById('open-findings');
    if (!box) return;
    var a = ACCOUNTS['CMS-SAMPLE'];
    box.innerHTML = card(a.findings[1]);   /* the water one; the other two are in the portal */
  })();

  /* the deep link has to switch tab, not just jump */
  var jump = document.getElementById('to-portal');
  if (jump) jump.addEventListener('click', function () {
    document.getElementById('tab-portal').click();
  });

  var DOCICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
             + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
             + '<path d="M14 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V7z"/>'
             + '<path d="M14 2v5h5"/><path d="M8.5 13h7M8.5 17h5"/></svg>';

  /* Every block below draws only if the account carries that data. One renderer
     serves the sample account and a real one, with no branch on the account name -
     which is what keeps the sample from breaking when a real account is added. */
  function render(id, a) {
    var h = '';
    h += '<div class="acct"><div class="who"><b>' + esc(a.building) + '</b>'
       + '<span>' + esc(a.address) + ' \u00b7 Account ' + esc(id) + ' \u00b7 ' + esc(a.plan) + '</span></div>'
       + '<div class="kpis">';
    a.kpis.forEach(function (k) { h += '<div><b>' + esc(k.v) + '</b><small>' + esc(k.l) + '</small></div>'; });
    h += '</div><button class="btn btn-line btn-sm" id="signout" type="button">Sign out</button></div>';

    if (a.schedule)   h += calendar(a.schedule);
    if (a.equipment)  h += equipment(a);
    if (a.recommend)  h += recommend(a.recommend);
    if (a.pm)         h += maintenance(a.pm);
    if (a.inspection) h += inspection(a.inspection);
    if (a.findings) {
      h += '<h3 style="margin:48px 0 16px">Problems found and the plan to remedy them</h3>';
      a.findings.forEach(function (f) { h += card(f); });
    }
    if (a.documents)  h += documents(a.documents);
    if (a.note) h += '<p style="font-size:13px;color:var(--ink-muted);margin-top:26px;max-width:78ch">'
                   + esc(a.note) + '</p>';
    return h;
  }

  function calendar(rows) {
    var h = '<div class="tblwrap"><table class="cal"><caption>Maintenance calendar \u2014 which month each '
          + 'part of the program falls</caption><thead><tr><th>Task group</th><th>Ref.</th>';
    MONTHS.forEach(function (m, i) { h += '<th title="month ' + (i + 1) + '">' + m + '</th>'; });
    h += '</tr></thead><tbody>';
    rows.forEach(function (row) {
      h += '<tr><th>' + esc(row[0]) + '</th><td style="white-space:nowrap;color:var(--ink-muted)">'
         + esc(row[1]) + '</td>';
      row[2].forEach(function (v, i) {
        var cls = v === 2 ? 'dot' : (v === 1 ? 'dot r' : 'dot o');
        var lab = v === 2 ? 'Major service' : (v === 1 ? 'Routine monthly round' : 'No scheduled task');
        h += '<td><span class="' + cls + '" title="' + lab + ', month ' + (i + 1) + '"></span></td>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    h += '<div class="legend-key"><span><span class="dot"></span> Major service</span>'
       + '<span><span class="dot r"></span> Routine monthly round</span>'
       + '<span><span class="dot o"></span> No task this month</span>'
       + '<span>Task references are our own PM schedule IDs.</span></div>';
    return h;
  }

  /* One equipment group. The finding and the action against it stay in the same row:
     that pairing is the deliverable, and a layout that separates them loses it. */
  function equipment(a) {
    var h = '<h3 style="margin:48px 0 6px">Initial inspection \u2014 result</h3>'
          + '<p style="margin:0 0 22px;font-size:14px;color:var(--ink-muted)">' + esc(a.visit) + '</p>';
    a.equipment.forEach(function (e) {
      h += '<div class="eq"><header><h4>' + esc(e.id) + ' \u00b7 ' + esc(e.name) + '</h4>'
         + '<span class="sev' + (e.poor ? ' hi' : '') + '">' + esc(e.cond) + '</span></header>';
      if (e.why) h += '<p class="why">' + esc(e.why) + '</p>';
      h += '<table><thead><tr><th>Timing</th><th>What we found</th><th>What we\u2019ll do</th></tr></thead><tbody>';
      e.items.forEach(function (it) {
        var cls = it[0] === 'Urgent' ? 'sev hi' : (it[0] === 'Done' ? 'sev q' : 'sev');
        h += '<tr><td><span class="' + cls + '">' + esc(it[0]) + '</span></td>'
           + '<th scope="row">' + esc(it[1]) + '</th>'
           + '<td class="act">' + esc(it[2]) + '</td></tr>';
      });
      h += '</tbody></table>';
      if (e.note) h += '<p class="note">' + esc(e.note) + '</p>';
      h += '</div>';
    });
    h += '<div class="legend-key"><span><span class="sev hi">Urgent</span> first visit</span>'
       + '<span><span class="sev">Soon</span> within 30 days</span>'
       + '<span><span class="sev">Planned</span> annual calendar</span>'
       + '<span><span class="sev q">Done</span> fixed on site</span></div>';
    return h;
  }

  function recommend(r) {
    var h = '<div class="find" style="margin-top:32px"><header><h4>' + esc(r.title) + '</h4>'
          + '<span class="sev hi">Recommendation</span></header><dl>'
          + '<dt>Why</dt><dd>' + esc(r.why) + '</dd>'
          + '<dt>Reasons</dt><dd><ul style="margin:0;padding-left:18px">';
    r.reasons.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
    h += '</ul></dd><dt>Meanwhile</dt><dd>' + esc(r.until) + '</dd></dl></div>';
    return h;
  }

  function maintenance(p) {
    var h = '<h3 style="margin:48px 0 6px">Preventive maintenance plan</h3>'
          + '<p style="margin:0 0 22px;font-size:14px;color:var(--ink-muted)">' + esc(p.intro) + '</p>'
          + '<div class="tblwrap"><table id="pm"><caption>What we do, and how often</caption><thead><tr>'
          + '<th>Equipment</th><th>Monthly</th><th>Quarterly</th><th>Semi-annual</th><th>Annual</th>'
          + '</tr></thead><tbody>';
    p.rows.forEach(function (row) {
      h += '<tr><th scope="row">' + esc(row[0]) + '</th>';
      for (var i = 1; i <= 4; i++) {
        var cell = [];
        row[i].forEach(function (t) { cell.push(esc(t)); });
        h += '<td>' + cell.join('<br>') + '</td>';
      }
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    h += '<p style="margin-top:14px;font-size:13.5px;color:var(--ink-muted)">' + esc(p.foot) + '</p>';
    return h;
  }

  function inspection(rows) {
    var h = '<h3 style="margin:48px 0 16px">Initial inspection \u2014 result</h3>';
    h += '<div class="tblwrap"><table><caption>Walk-through of 2026-09-19</caption><thead><tr>'
       + '<th>Item</th><th>Result</th><th>What we saw</th><th>Source</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      var hi = (r[1] === 'Fail') ? ' hi' : '';
      h += '<tr><th>' + esc(r[0]) + '</th><td><span class="sev' + hi + '">' + esc(r[1]) + '</span></td>'
         + '<td style="color:var(--ink-muted)">' + esc(r[2]) + '</td>'
         + '<td><span class="src">' + esc(r[3]) + '</span></td></tr>';
    });
    return h + '</tbody></table></div>';
  }

  function documents(list) {
    var h = '<h3 style="margin:48px 0 6px">Documents</h3>'
          + '<p style="margin:0 0 22px;font-size:14px;color:var(--ink-muted)">Your agreement and every '
          + 'report issued on this equipment. Each one opens in a new tab.</p><div class="doclist">';
    list.forEach(function (d) {
      h += '<a class="doc" href="' + esc(d.href) + '" target="_blank" rel="noopener">'
         + '<span class="ico">' + DOCICO + '</span><span>'
         + '<b>' + esc(d.title) + '</b>'
         + '<span class="desc">' + esc(d.desc) + '</span>'
         + '<span class="meta">' + esc(d.meta) + '</span></span></a>';
    });
    return h + '</div>';
  }
})();


/* ============================================================
   H. DEEP LINKS
   maintenance.html#portal and #limits have to OPEN that tab. Landing on a
   tab strip that is showing something else is worse than not linking at all.
   ============================================================ */
(function () {
  var map = { '#portal': 'tab-portal', '#limits': 'tab-limits', '#schedule': 'tab-book' };
  function apply() {
    var t = document.getElementById(map[location.hash] || '');
    if (!t) return;
    t.click();
    t.scrollIntoView({ block: 'start' });
  }
  apply();
  addEventListener('hashchange', apply);
})();
