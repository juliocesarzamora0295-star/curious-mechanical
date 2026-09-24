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
            ]
    }
  };

  var form = document.getElementById('loginform');
  var err = document.getElementById('loginerr');
  var loginBox = document.getElementById('portal-login');
  var app = document.getElementById('portal-app');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var id = form.acct.value.trim().toUpperCase(), pin = form.pin.value.trim();
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

  function render(id, a) {
    var h = '';
    h += '<div class="acct"><div class="who"><b>' + esc(a.building) + '</b>'
       + '<span>' + esc(a.address) + ' · Account ' + esc(id) + ' · ' + esc(a.plan) + '</span></div>'
       + '<div class="kpis">';
    a.kpis.forEach(function (k) { h += '<div><b>' + esc(k.v) + '</b><small>' + esc(k.l) + '</small></div>'; });
    h += '</div><button class="btn btn-line btn-sm" id="signout" type="button">Sign out</button></div>';

    /* calendar */
    h += '<div class="tblwrap"><table class="cal"><caption>Maintenance calendar — which month each part of the program falls</caption><thead><tr><th>Task group</th><th>Ref.</th>';
    MONTHS.forEach(function (m, i) { h += '<th title="month ' + (i + 1) + '">' + m + '</th>'; });
    h += '</tr></thead><tbody>';
    a.schedule.forEach(function (row) {
      h += '<tr><th>' + esc(row[0]) + '</th><td style="white-space:nowrap;color:var(--ink-muted)">' + esc(row[1]) + '</td>';
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

    /* inspection */
    h += '<h3 style="margin:48px 0 16px">Initial inspection — result</h3>';
    h += '<div class="tblwrap"><table><caption>Walk-through of 2026-09-19</caption><thead><tr>'
       + '<th>Item</th><th>Result</th><th>What we saw</th><th>Source</th></tr></thead><tbody>';
    a.inspection.forEach(function (r) {
      var hi = (r[1] === 'Fail') ? ' hi' : '';
      h += '<tr><th>' + esc(r[0]) + '</th><td><span class="sev' + hi + '">' + esc(r[1]) + '</span></td>'
         + '<td style="color:var(--ink-muted)">' + esc(r[2]) + '</td>'
         + '<td><span class="src">' + esc(r[3]) + '</span></td></tr>';
    });
    h += '</tbody></table></div>';

    /* findings */
    h += '<h3 style="margin:48px 0 16px">Problems found and the plan to remedy them</h3>';
    a.findings.forEach(function (f) { h += card(f); });

    h += '<p style="font-size:13px;color:var(--ink-muted);margin-top:18px">Sample portal. The account, the calendar and the findings above are illustrative, shown so you can see what you would receive. '
       + 'The data above is this building\'s real assessment; the sign-in is seeded in the page and '
       + 'is not a secure login.</p>';
    return h;
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
