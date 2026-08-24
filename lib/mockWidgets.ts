// Hand-authored stand-ins for real Claude generations, used when ANTHROPIC_API_KEY
// isn't set. Each widget_html still has to pass the same validateWidgetHtml() checks
// a real generation would, so this also doubles as a fixture for the validation path.
import type { ExplainResponse, WidgetShape, FollowUpContext } from "./types";

type MockEntry = { explanation: string; widgetHtml: string };

const compoundInterest: MockEntry = {
  explanation:
    "Compound interest grows a balance not just on the original principal, but on the interest that principal has already earned. Over time this produces an upward-curving growth pattern rather than a straight line, which is why small differences in rate or time horizon compound into large differences in outcome.",
  widgetHtml: `
<div class="wrap">
  <div class="controls">
    <label>Interest rate: <span id="rateVal">6</span>%
      <input id="rate" type="range" min="1" max="15" value="6" step="0.5" />
    </label>
    <label>Years: <span id="yearsVal">20</span>
      <input id="years" type="range" min="1" max="40" value="20" step="1" />
    </label>
  </div>
  <canvas id="chart" width="600" height="280"></canvas>
  <div class="result">Final balance on a $1,000 principal: <strong id="finalVal"></strong></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .controls { display:flex; gap:24px; margin-bottom:16px; flex-wrap:wrap; }
  label { font-size:13px; color:#444; display:flex; flex-direction:column; gap:4px; }
  input[type=range] { accent-color:#2f5bff; }
  canvas { width:100%; height:auto; display:block; border:1px solid #e5e5e5; border-radius:8px; }
  .result { margin-top:12px; font-size:14px; color:#1a1a1a; }
  .result strong { color:#2f5bff; }
</style>
<script>
  (function () {
    var rateInput = document.getElementById('rate');
    var yearsInput = document.getElementById('years');
    var rateVal = document.getElementById('rateVal');
    var yearsVal = document.getElementById('yearsVal');
    var finalVal = document.getElementById('finalVal');
    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');
    var principal = 1000;

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function draw() {
      var rate = parseFloat(rateInput.value) / 100;
      var years = parseInt(yearsInput.value, 10);
      rateVal.textContent = rateInput.value;
      yearsVal.textContent = String(years);

      var w = canvas.width, h = canvas.height, pad = 30;
      ctx.clearRect(0, 0, w, h);

      var points = [];
      var maxVal = principal;
      for (var y = 0; y <= years; y++) {
        var val = principal * Math.pow(1 + rate, y);
        points.push(val);
        if (val > maxVal) maxVal = val;
      }

      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      ctx.strokeStyle = '#2f5bff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (var i = 0; i < points.length; i++) {
        var x = pad + (i / years) * (w - pad * 2);
        var yy = h - pad - (points[i] / maxVal) * (h - pad * 2);
        if (i === 0) { ctx.moveTo(x, yy); } else { ctx.lineTo(x, yy); }
      }
      ctx.stroke();

      finalVal.textContent = '$' + Math.round(points[points.length - 1]).toLocaleString();
    }

    rateInput.addEventListener('input', draw);
    yearsInput.addEventListener('input', draw);
    draw();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const populationGrowth: MockEntry = {
  explanation:
    "A population grows exponentially when its growth rate stays roughly constant, because each new individual eventually contributes its own offspring. Small changes in growth rate compound over generations, which is why populations can look flat for a long stretch and then rise sharply.",
  widgetHtml: `
<div class="wrap">
  <div class="controls">
    <label>Growth rate: <span id="rateVal">2</span>% / year
      <input id="rate" type="range" min="0.5" max="8" value="2" step="0.5" />
    </label>
    <label>Years: <span id="yearsVal">50</span>
      <input id="years" type="range" min="5" max="100" value="50" step="5" />
    </label>
  </div>
  <canvas id="chart" width="600" height="280"></canvas>
  <div class="result">Population after that time, starting from 1,000: <strong id="finalVal"></strong></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .controls { display:flex; gap:24px; margin-bottom:16px; flex-wrap:wrap; }
  label { font-size:13px; color:#444; display:flex; flex-direction:column; gap:4px; }
  input[type=range] { accent-color:#2f5bff; }
  canvas { width:100%; height:auto; display:block; border:1px solid #e5e5e5; border-radius:8px; }
  .result { margin-top:12px; font-size:14px; color:#1a1a1a; }
  .result strong { color:#2f5bff; }
</style>
<script>
  (function () {
    var rateInput = document.getElementById('rate');
    var yearsInput = document.getElementById('years');
    var rateVal = document.getElementById('rateVal');
    var yearsVal = document.getElementById('yearsVal');
    var finalVal = document.getElementById('finalVal');
    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');
    var start = 1000;

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function draw() {
      var rate = parseFloat(rateInput.value) / 100;
      var years = parseInt(yearsInput.value, 10);
      rateVal.textContent = rateInput.value;
      yearsVal.textContent = String(years);

      var w = canvas.width, h = canvas.height, pad = 30;
      ctx.clearRect(0, 0, w, h);

      var points = [];
      var maxVal = start;
      for (var y = 0; y <= years; y++) {
        var val = start * Math.pow(1 + rate, y);
        points.push(val);
        if (val > maxVal) maxVal = val;
      }

      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      ctx.strokeStyle = '#2f5bff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (var i = 0; i < points.length; i++) {
        var x = pad + (i / years) * (w - pad * 2);
        var yy = h - pad - (points[i] / maxVal) * (h - pad * 2);
        if (i === 0) { ctx.moveTo(x, yy); } else { ctx.lineTo(x, yy); }
      }
      ctx.stroke();

      finalVal.textContent = Math.round(points[points.length - 1]).toLocaleString();
    }

    rateInput.addEventListener('input', draw);
    yearsInput.addEventListener('input', draw);
    draw();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const photosynthesis: MockEntry = {
  explanation:
    "Photosynthesis unfolds as a sequence of linked steps: light is captured, water is split, energy carriers are built, and those carriers power the assembly of glucose from carbon dioxide. Each stage depends on the output of the one before it.",
  widgetHtml: `
<div class="wrap">
  <div class="stages" id="stages">
    <div class="stage" data-i="0">Light absorbed</div>
    <div class="stage" data-i="1">Water split</div>
    <div class="stage" data-i="2">ATP &amp; NADPH made</div>
    <div class="stage" data-i="3">CO2 fixed</div>
    <div class="stage" data-i="4">Glucose built</div>
  </div>
  <input id="scrubber" type="range" min="0" max="4" value="0" step="1" />
  <div class="desc" id="desc"></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .stages { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
  .stage { flex:1; min-width:90px; padding:10px 8px; text-align:center; font-size:12px; border-radius:8px; background:#f5f5f5; color:#6b6b6b; border:1px solid #e5e5e5; transition: background 0.15s, color 0.15s; }
  .stage.active { background:#2f5bff; color:#fff; border-color:#2f5bff; }
  input[type=range] { width:100%; accent-color:#2f5bff; margin-bottom:16px; }
  .desc { font-size:14px; color:#1a1a1a; min-height:40px; }
</style>
<script>
  (function () {
    var scrubber = document.getElementById('scrubber');
    var desc = document.getElementById('desc');
    var stages = document.querySelectorAll('.stage');
    var descriptions = [
      'Chlorophyll in the leaf absorbs photons of sunlight.',
      'That energy splits water molecules, releasing oxygen and electrons.',
      'The light reactions use those electrons to produce ATP and NADPH, the energy carriers.',
      'ATP and NADPH power the Calvin cycle, which fixes carbon dioxide from the air.',
      'Fixed carbon is assembled into glucose, storing the captured energy.'
    ];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function render() {
      var i = parseInt(scrubber.value, 10);
      for (var j = 0; j < stages.length; j++) {
        stages[j].className = (j === i) ? 'stage active' : 'stage';
      }
      desc.textContent = descriptions[i];
    }

    scrubber.addEventListener('input', render);
    render();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const raftConsensus: MockEntry = {
  explanation:
    "In Raft, one node is elected leader by a majority vote among peers. The leader then sends periodic heartbeats to followers; if followers stop hearing from it, they start a new election. All writes flow through the leader and are replicated to followers before being considered committed.",
  widgetHtml: `
<div class="wrap">
  <svg id="graph" viewBox="0 0 400 260" width="100%" height="220">
    <line x1="100" y1="60" x2="300" y2="60" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="100" y1="60" x2="100" y2="200" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="100" y1="60" x2="300" y2="200" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="300" y1="60" x2="100" y2="200" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="300" y1="60" x2="300" y2="200" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="100" y1="200" x2="300" y2="200" stroke="#e5e5e5" stroke-width="2"></line>
    <circle id="n0" cx="100" cy="60" r="28" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="100" y="65" text-anchor="middle" font-size="12" fill="#6b6b6b">A</text>
    <circle id="n1" cx="300" cy="60" r="28" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="300" y="65" text-anchor="middle" font-size="12" fill="#6b6b6b">B</text>
    <circle id="n2" cx="100" cy="200" r="28" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="100" y="205" text-anchor="middle" font-size="12" fill="#6b6b6b">C</text>
    <circle id="n3" cx="300" cy="200" r="28" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="300" y="205" text-anchor="middle" font-size="12" fill="#6b6b6b">D</text>
  </svg>
  <button id="trigger" type="button">Trigger election</button>
  <div class="status" id="status">Cluster idle. Click Trigger election to start.</div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  svg { display:block; margin-bottom:12px; }
  button { background:#2f5bff; color:#fff; border:none; border-radius:6px; padding:8px 16px; font-size:14px; cursor:pointer; }
  button:disabled { opacity:0.5; cursor:default; }
  .status { margin-top:12px; font-size:14px; color:#1a1a1a; min-height:20px; }
</style>
<script>
  (function () {
    var button = document.getElementById('trigger');
    var status = document.getElementById('status');
    var nodeIds = ['n0', 'n1', 'n2', 'n3'];
    var labels = ['A', 'B', 'C', 'D'];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function resetNodes() {
      for (var i = 0; i < nodeIds.length; i++) {
        var n = document.getElementById(nodeIds[i]);
        n.setAttribute('fill', '#f5f5f5');
        n.setAttribute('stroke', '#e5e5e5');
      }
    }

    function runElection() {
      button.disabled = true;
      resetNodes();
      var step = 0;

      function nextStep() {
        if (step < nodeIds.length) {
          resetNodes();
          var n = document.getElementById(nodeIds[step]);
          n.setAttribute('fill', '#dbe4ff');
          n.setAttribute('stroke', '#2f5bff');
          status.textContent = labels[step] + ' is requesting votes...';
          step++;
          setTimeout(nextStep, 300);
        } else {
          resetNodes();
          var leader = document.getElementById(nodeIds[0]);
          leader.setAttribute('fill', '#2f5bff');
          leader.setAttribute('stroke', '#2f5bff');
          status.textContent = labels[0] + ' elected leader. Sending heartbeats to followers.';
          button.disabled = false;
        }
      }

      nextStep();
    }

    button.addEventListener('click', runElection);
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const tcpVsUdp: MockEntry = {
  explanation:
    "TCP and UDP are both ways to send data over a network, but they trade reliability for speed differently. TCP sets up a connection and guarantees ordered, complete delivery, which costs some overhead. UDP skips that setup and just sends packets, which is faster but offers no delivery guarantees.",
  widgetHtml: `
<div class="wrap">
  <div class="tabs">
    <button class="tab active" id="tabTcp" type="button">TCP</button>
    <button class="tab" id="tabUdp" type="button">UDP</button>
  </div>
  <div class="cards">
    <div class="card active" id="cardTcp">
      <h3>TCP</h3>
      <ul>
        <li>Connection-oriented</li>
        <li>Reliable, ordered delivery</li>
        <li>Flow &amp; congestion control</li>
        <li>Higher overhead</li>
      </ul>
    </div>
    <div class="card" id="cardUdp">
      <h3>UDP</h3>
      <ul>
        <li>Connectionless</li>
        <li>No delivery guarantees</li>
        <li>No ordering</li>
        <li>Minimal overhead, low latency</li>
      </ul>
    </div>
  </div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .tabs { display:flex; gap:8px; margin-bottom:16px; }
  .tab { border:1px solid #e5e5e5; background:#fff; color:#6b6b6b; border-radius:999px; padding:6px 16px; font-size:13px; cursor:pointer; }
  .tab.active { border-color:#2f5bff; color:#2f5bff; }
  .cards { display:flex; gap:16px; flex-wrap:wrap; }
  .card { flex:1; min-width:160px; padding:16px; border-radius:10px; border:1px solid #e5e5e5; background:#fafafa; opacity:0.5; transition: opacity 0.15s, border-color 0.15s; }
  .card.active { opacity:1; border-color:#2f5bff; }
  .card h3 { margin:0 0 8px; font-size:14px; }
  .card ul { margin:0; padding-left:18px; font-size:13px; color:#444; line-height:1.6; }
</style>
<script>
  (function () {
    var tabTcp = document.getElementById('tabTcp');
    var tabUdp = document.getElementById('tabUdp');
    var cardTcp = document.getElementById('cardTcp');
    var cardUdp = document.getElementById('cardUdp');

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function show(which) {
      var tcpOn = which === 'tcp';
      tabTcp.className = tcpOn ? 'tab active' : 'tab';
      tabUdp.className = tcpOn ? 'tab' : 'tab active';
      cardTcp.className = tcpOn ? 'card active' : 'card';
      cardUdp.className = tcpOn ? 'card' : 'card active';
    }

    tabTcp.addEventListener('click', function () { show('tcp'); });
    tabUdp.addEventListener('click', function () { show('udp'); });
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

function genericChartFallback(query: string): MockEntry {
  const safeQuery = query.replace(/[<>&]/g, "");
  return {
    explanation: `Mock mode doesn't have a hand-tuned example for "${safeQuery}" yet, so here's a representative parameterized-chart widget instead — the shape the real Claude-generated version would take once a live API key is configured.`,
    widgetHtml: `
<div class="wrap">
  <div class="controls">
    <label>Rate: <span id="rateVal">4</span>%
      <input id="rate" type="range" min="1" max="10" value="4" step="0.5" />
    </label>
  </div>
  <canvas id="chart" width="600" height="280"></canvas>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .controls { display:flex; gap:24px; margin-bottom:16px; }
  label { font-size:13px; color:#444; display:flex; flex-direction:column; gap:4px; }
  input[type=range] { accent-color:#2f5bff; }
  canvas { width:100%; height:auto; display:block; border:1px solid #e5e5e5; border-radius:8px; }
</style>
<script>
  (function () {
    var rateInput = document.getElementById('rate');
    var rateVal = document.getElementById('rateVal');
    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function draw() {
      var rate = parseFloat(rateInput.value) / 100;
      rateVal.textContent = rateInput.value;

      var w = canvas.width, h = canvas.height, pad = 30;
      ctx.clearRect(0, 0, w, h);

      var points = [];
      var maxVal = 1;
      for (var x = 0; x <= 30; x++) {
        var val = Math.pow(1 + rate, x);
        points.push(val);
        if (val > maxVal) maxVal = val;
      }

      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      ctx.strokeStyle = '#2f5bff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (var i = 0; i < points.length; i++) {
        var px = pad + (i / 30) * (w - pad * 2);
        var py = h - pad - (points[i] / maxVal) * (h - pad * 2);
        if (i === 0) { ctx.moveTo(px, py); } else { ctx.lineTo(px, py); }
      }
      ctx.stroke();
    }

    rateInput.addEventListener('input', draw);
    draw();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
  };
}

function genericProcessFallback(query: string): MockEntry {
  const safeQuery = query.replace(/[<>&]/g, "");
  return {
    explanation: `Mock mode doesn't have a hand-tuned example for "${safeQuery}" yet, so here's a representative process/pipeline widget instead — the shape the real Claude-generated version would take once a live API key is configured.`,
    widgetHtml: `
<div class="wrap">
  <div class="stages" id="stages">
    <div class="stage" data-i="0">Step 1</div>
    <div class="stage" data-i="1">Step 2</div>
    <div class="stage" data-i="2">Step 3</div>
  </div>
  <input id="scrubber" type="range" min="0" max="2" value="0" step="1" />
  <div class="desc" id="desc"></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .stages { display:flex; gap:8px; margin-bottom:16px; }
  .stage { flex:1; padding:10px 8px; text-align:center; font-size:12px; border-radius:8px; background:#f5f5f5; color:#6b6b6b; border:1px solid #e5e5e5; }
  .stage.active { background:#2f5bff; color:#fff; border-color:#2f5bff; }
  input[type=range] { width:100%; accent-color:#2f5bff; margin-bottom:16px; }
  .desc { font-size:14px; color:#1a1a1a; min-height:24px; }
</style>
<script>
  (function () {
    var scrubber = document.getElementById('scrubber');
    var desc = document.getElementById('desc');
    var stages = document.querySelectorAll('.stage');
    var descriptions = ['The first stage of the process.', 'The middle stage of the process.', 'The final stage of the process.'];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function render() {
      var i = parseInt(scrubber.value, 10);
      for (var j = 0; j < stages.length; j++) {
        stages[j].className = (j === i) ? 'stage active' : 'stage';
      }
      desc.textContent = descriptions[i];
    }

    scrubber.addEventListener('input', render);
    render();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
  };
}

function genericNetworkFallback(query: string): MockEntry {
  const safeQuery = query.replace(/[<>&]/g, "");
  return {
    explanation: `Mock mode doesn't have a hand-tuned example for "${safeQuery}" yet, so here's a representative network/graph widget instead — the shape the real Claude-generated version would take once a live API key is configured.`,
    widgetHtml: `
<div class="wrap">
  <svg id="graph" viewBox="0 0 300 200" width="100%" height="180">
    <line x1="150" y1="30" x2="60" y2="160" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="150" y1="30" x2="240" y2="160" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="60" y1="160" x2="240" y2="160" stroke="#e5e5e5" stroke-width="2"></line>
    <circle id="n0" cx="150" cy="30" r="24" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="n1" cx="60" cy="160" r="24" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="n2" cx="240" cy="160" r="24" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
  </svg>
  <button id="trigger" type="button">Highlight path</button>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  svg { display:block; margin-bottom:12px; }
  button { background:#2f5bff; color:#fff; border:none; border-radius:6px; padding:8px 16px; font-size:14px; cursor:pointer; }
</style>
<script>
  (function () {
    var button = document.getElementById('trigger');
    var ids = ['n0', 'n1', 'n2'];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    button.addEventListener('click', function () {
      for (var i = 0; i < ids.length; i++) {
        var n = document.getElementById(ids[i]);
        n.setAttribute('fill', '#2f5bff');
        n.setAttribute('stroke', '#2f5bff');
      }
    });

    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
  };
}

function genericComparisonFallback(query: string): MockEntry {
  const safeQuery = query.replace(/[<>&]/g, "");
  return {
    explanation: `Mock mode doesn't have a hand-tuned example for "${safeQuery}" yet, so here's a representative comparison widget instead — the shape the real Claude-generated version would take once a live API key is configured.`,
    widgetHtml: `
<div class="wrap">
  <div class="tabs">
    <button class="tab active" id="tabA" type="button">Option A</button>
    <button class="tab" id="tabB" type="button">Option B</button>
  </div>
  <div class="cards">
    <div class="card active" id="cardA">
      <h3>Option A</h3>
      <ul><li>Attribute one</li><li>Attribute two</li></ul>
    </div>
    <div class="card" id="cardB">
      <h3>Option B</h3>
      <ul><li>Attribute one</li><li>Attribute two</li></ul>
    </div>
  </div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .tabs { display:flex; gap:8px; margin-bottom:16px; }
  .tab { border:1px solid #e5e5e5; background:#fff; color:#6b6b6b; border-radius:999px; padding:6px 16px; font-size:13px; cursor:pointer; }
  .tab.active { border-color:#2f5bff; color:#2f5bff; }
  .cards { display:flex; gap:16px; flex-wrap:wrap; }
  .card { flex:1; min-width:140px; padding:16px; border-radius:10px; border:1px solid #e5e5e5; background:#fafafa; opacity:0.5; }
  .card.active { opacity:1; border-color:#2f5bff; }
  .card h3 { margin:0 0 8px; font-size:14px; }
  .card ul { margin:0; padding-left:18px; font-size:13px; color:#444; line-height:1.6; }
</style>
<script>
  (function () {
    var tabA = document.getElementById('tabA');
    var tabB = document.getElementById('tabB');
    var cardA = document.getElementById('cardA');
    var cardB = document.getElementById('cardB');

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function show(which) {
      var aOn = which === 'a';
      tabA.className = aOn ? 'tab active' : 'tab';
      tabB.className = aOn ? 'tab' : 'tab active';
      cardA.className = aOn ? 'card active' : 'card';
      cardB.className = aOn ? 'card' : 'card active';
    }

    tabA.addEventListener('click', function () { show('a'); });
    tabB.addEventListener('click', function () { show('b'); });
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
  };
}

const mitosis: MockEntry = {
  explanation:
    "Mitosis divides one cell's chromosomes into two identical sets through a sequence of distinct phases. Each phase depends on the one before it: chromosomes must condense before they can be aligned, and aligned before they can be pulled apart.",
  widgetHtml: `
<div class="wrap">
  <div class="stages" id="stages">
    <div class="stage" data-i="0">Prophase</div>
    <div class="stage" data-i="1">Metaphase</div>
    <div class="stage" data-i="2">Anaphase</div>
    <div class="stage" data-i="3">Telophase</div>
  </div>
  <input id="scrubber" type="range" min="0" max="3" value="0" step="1" />
  <div class="desc" id="desc"></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .stages { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
  .stage { flex:1; min-width:100px; padding:10px 8px; text-align:center; font-size:12px; border-radius:8px; background:#f5f5f5; color:#6b6b6b; border:1px solid #e5e5e5; transition: background 0.15s, color 0.15s; }
  .stage.active { background:#2f5bff; color:#fff; border-color:#2f5bff; }
  input[type=range] { width:100%; accent-color:#2f5bff; margin-bottom:16px; }
  .desc { font-size:14px; color:#1a1a1a; min-height:40px; }
</style>
<script>
  (function () {
    var scrubber = document.getElementById('scrubber');
    var desc = document.getElementById('desc');
    var stages = document.querySelectorAll('.stage');
    var descriptions = [
      'Chromosomes condense and become visible; the mitotic spindle begins to form.',
      'Chromosomes line up along the cell equator, attached to spindle fibers.',
      'Sister chromatids separate and are pulled to opposite poles of the cell.',
      'Nuclear membranes reform around each set of chromosomes as the cell prepares to divide.'
    ];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function render() {
      var i = parseInt(scrubber.value, 10);
      for (var j = 0; j < stages.length; j++) {
        stages[j].className = (j === i) ? 'stage active' : 'stage';
      }
      desc.textContent = descriptions[i];
    }

    scrubber.addEventListener('input', render);
    render();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const cellularRespiration: MockEntry = {
  explanation:
    "Cellular respiration breaks down glucose across four linked stages to produce usable energy. Most of the payoff comes at the end: the first stages mainly set up electron carriers that the final stage uses to generate the bulk of the cell's ATP.",
  widgetHtml: `
<div class="wrap">
  <div class="stages" id="stages">
    <div class="stage" data-i="0">Glycolysis</div>
    <div class="stage" data-i="1">Pyruvate oxidation</div>
    <div class="stage" data-i="2">Krebs cycle</div>
    <div class="stage" data-i="3">Electron transport chain</div>
  </div>
  <input id="scrubber" type="range" min="0" max="3" value="0" step="1" />
  <div class="desc" id="desc"></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .stages { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
  .stage { flex:1; min-width:110px; padding:10px 8px; text-align:center; font-size:12px; border-radius:8px; background:#f5f5f5; color:#6b6b6b; border:1px solid #e5e5e5; transition: background 0.15s, color 0.15s; }
  .stage.active { background:#2f5bff; color:#fff; border-color:#2f5bff; }
  input[type=range] { width:100%; accent-color:#2f5bff; margin-bottom:16px; }
  .desc { font-size:14px; color:#1a1a1a; min-height:40px; }
</style>
<script>
  (function () {
    var scrubber = document.getElementById('scrubber');
    var desc = document.getElementById('desc');
    var stages = document.querySelectorAll('.stage');
    var descriptions = [
      'Glucose is split into two pyruvate molecules in the cytoplasm, yielding a small amount of ATP.',
      'Pyruvate is converted into acetyl-CoA, releasing carbon dioxide.',
      'Acetyl-CoA is oxidized, generating the electron carriers NADH and FADH2.',
      'Electron carriers power ATP synthase, producing the majority of the cell energy as ATP.'
    ];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function render() {
      var i = parseInt(scrubber.value, 10);
      for (var j = 0; j < stages.length; j++) {
        stages[j].className = (j === i) ? 'stage active' : 'stage';
      }
      desc.textContent = descriptions[i];
    }

    scrubber.addEventListener('input', render);
    render();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const paxos: MockEntry = {
  explanation:
    "Paxos reaches agreement in two phases: a proposer first asks acceptors to promise not to accept older proposals, then sends the actual value once a majority has promised. A value is only chosen once a majority of acceptors accept it, which is what keeps the protocol correct even if some nodes fail.",
  widgetHtml: `
<div class="wrap">
  <svg id="graph" viewBox="0 0 400 260" width="100%" height="220">
    <line x1="200" y1="50" x2="80" y2="190" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="200" y1="50" x2="200" y2="190" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="200" y1="50" x2="320" y2="190" stroke="#e5e5e5" stroke-width="2"></line>
    <circle id="proposer" cx="200" cy="50" r="28" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="200" y="55" text-anchor="middle" font-size="11" fill="#6b6b6b">Proposer</text>
    <circle id="a0" cx="80" cy="190" r="26" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="80" y="195" text-anchor="middle" font-size="11" fill="#6b6b6b">A1</text>
    <circle id="a1" cx="200" cy="190" r="26" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="200" y="195" text-anchor="middle" font-size="11" fill="#6b6b6b">A2</text>
    <circle id="a2" cx="320" cy="190" r="26" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <text x="320" y="195" text-anchor="middle" font-size="11" fill="#6b6b6b">A3</text>
  </svg>
  <button id="trigger" type="button">Run Paxos round</button>
  <div class="status" id="status">Idle. Click Run Paxos round to start.</div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  svg { display:block; margin-bottom:12px; }
  button { background:#2f5bff; color:#fff; border:none; border-radius:6px; padding:8px 16px; font-size:14px; cursor:pointer; }
  button:disabled { opacity:0.5; cursor:default; }
  .status { margin-top:12px; font-size:14px; color:#1a1a1a; min-height:20px; }
</style>
<script>
  (function () {
    var button = document.getElementById('trigger');
    var status = document.getElementById('status');
    var acceptorIds = ['a0', 'a1', 'a2'];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function resetAcceptors() {
      for (var i = 0; i < acceptorIds.length; i++) {
        var n = document.getElementById(acceptorIds[i]);
        n.setAttribute('fill', '#f5f5f5');
        n.setAttribute('stroke', '#e5e5e5');
      }
    }

    function setAcceptors(fill, stroke) {
      for (var i = 0; i < acceptorIds.length; i++) {
        var n = document.getElementById(acceptorIds[i]);
        n.setAttribute('fill', fill);
        n.setAttribute('stroke', stroke);
      }
    }

    function runRound() {
      button.disabled = true;
      var proposer = document.getElementById('proposer');
      resetAcceptors();
      proposer.setAttribute('fill', '#dbe4ff');
      proposer.setAttribute('stroke', '#2f5bff');
      status.textContent = 'Proposer sends Prepare to all acceptors...';
      reportHeight();

      setTimeout(function () {
        setAcceptors('#dbe4ff', '#2f5bff');
        status.textContent = 'A majority of acceptors promise not to accept older proposals.';
        reportHeight();

        setTimeout(function () {
          status.textContent = 'Proposer sends Accept(value) to the acceptors.';
          reportHeight();

          setTimeout(function () {
            setAcceptors('#2f5bff', '#2f5bff');
            proposer.setAttribute('fill', '#2f5bff');
            status.textContent = 'Majority accepted. Value is chosen.';
            button.disabled = false;
            reportHeight();
          }, 500);
        }, 500);
      }, 500);
    }

    button.addEventListener('click', runRound);
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const socialNetworkSpread: MockEntry = {
  explanation:
    "Information in a social network spreads outward in waves: a post reaches its immediate connections first, then their connections, and so on. The scrubber below steps through those waves so you can see how far a piece of content has reached after each hop.",
  widgetHtml: `
<div class="wrap">
  <svg id="graph" viewBox="0 0 320 240" width="100%" height="200">
    <line x1="160" y1="30" x2="70" y2="110" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="160" y1="30" x2="250" y2="110" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="70" y1="110" x2="30" y2="190" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="70" y1="110" x2="110" y2="190" stroke="#e5e5e5" stroke-width="2"></line>
    <line x1="250" y1="110" x2="210" y2="190" stroke="#e5e5e5" stroke-width="2"></line>
    <circle id="s" cx="160" cy="30" r="22" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="a" cx="70" cy="110" r="20" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="b" cx="250" cy="110" r="20" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="c" cx="30" cy="190" r="18" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="d" cx="110" cy="190" r="18" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
    <circle id="e" cx="210" cy="190" r="18" fill="#f5f5f5" stroke="#e5e5e5" stroke-width="2"></circle>
  </svg>
  <input id="scrubber" type="range" min="0" max="2" value="0" step="1" />
  <div class="desc" id="desc"></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  svg { display:block; margin-bottom:12px; }
  input[type=range] { width:100%; accent-color:#2f5bff; margin-bottom:12px; }
  .desc { font-size:14px; color:#1a1a1a; min-height:24px; }
</style>
<script>
  (function () {
    var scrubber = document.getElementById('scrubber');
    var desc = document.getElementById('desc');
    var waves = [['s'], ['s', 'a', 'b'], ['s', 'a', 'b', 'c', 'd', 'e']];
    var descriptions = [
      'A single node posts. No one else has seen it yet.',
      'The poster\\'s direct connections see it and some re-share.',
      'Their connections\\' connections see it too. The post has now reached the whole visible network.'
    ];
    var allIds = ['s', 'a', 'b', 'c', 'd', 'e'];

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function render() {
      var i = parseInt(scrubber.value, 10);
      var active = waves[i];
      for (var j = 0; j < allIds.length; j++) {
        var n = document.getElementById(allIds[j]);
        var isActive = active.indexOf(allIds[j]) !== -1;
        n.setAttribute('fill', isActive ? '#2f5bff' : '#f5f5f5');
        n.setAttribute('stroke', isActive ? '#2f5bff' : '#e5e5e5');
      }
      desc.textContent = descriptions[i];
      reportHeight();
    }

    scrubber.addEventListener('input', render);
    render();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const sqlVsNosql: MockEntry = {
  explanation:
    "SQL and NoSQL databases make different trade-offs around structure and scale. SQL databases enforce a fixed schema and strong transactional guarantees, which suits data with clear relationships. NoSQL databases relax that structure to scale more easily across many machines, which suits data that's large, fast-changing, or loosely structured.",
  widgetHtml: `
<div class="wrap">
  <div class="tabs">
    <button class="tab active" id="tabSql" type="button">SQL</button>
    <button class="tab" id="tabNosql" type="button">NoSQL</button>
  </div>
  <div class="cards">
    <div class="card active" id="cardSql">
      <h3>SQL</h3>
      <ul>
        <li>Structured, fixed schema</li>
        <li>ACID transactions</li>
        <li>Scales vertically</li>
        <li>Best for relational data</li>
      </ul>
    </div>
    <div class="card" id="cardNosql">
      <h3>NoSQL</h3>
      <ul>
        <li>Flexible, schema-less</li>
        <li>Often eventual consistency</li>
        <li>Scales horizontally</li>
        <li>Best for unstructured or fast-changing data</li>
      </ul>
    </div>
  </div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .tabs { display:flex; gap:8px; margin-bottom:16px; }
  .tab { border:1px solid #e5e5e5; background:#fff; color:#6b6b6b; border-radius:999px; padding:6px 16px; font-size:13px; cursor:pointer; }
  .tab.active { border-color:#2f5bff; color:#2f5bff; }
  .cards { display:flex; gap:16px; flex-wrap:wrap; }
  .card { flex:1; min-width:160px; padding:16px; border-radius:10px; border:1px solid #e5e5e5; background:#fafafa; opacity:0.5; transition: opacity 0.15s, border-color 0.15s; }
  .card.active { opacity:1; border-color:#2f5bff; }
  .card h3 { margin:0 0 8px; font-size:14px; }
  .card ul { margin:0; padding-left:18px; font-size:13px; color:#444; line-height:1.6; }
</style>
<script>
  (function () {
    var tabSql = document.getElementById('tabSql');
    var tabNosql = document.getElementById('tabNosql');
    var cardSql = document.getElementById('cardSql');
    var cardNosql = document.getElementById('cardNosql');

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function show(which) {
      var sqlOn = which === 'sql';
      tabSql.className = sqlOn ? 'tab active' : 'tab';
      tabNosql.className = sqlOn ? 'tab' : 'tab active';
      cardSql.className = sqlOn ? 'card active' : 'card';
      cardNosql.className = sqlOn ? 'card' : 'card active';
      reportHeight();
    }

    tabSql.addEventListener('click', function () { show('sql'); });
    tabNosql.addEventListener('click', function () { show('nosql'); });
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const radioactiveDecay: MockEntry = {
  explanation:
    "Radioactive decay reduces a quantity by the same fraction over every equal time interval, called the half-life. That constant-fraction shrinkage is why decay curves fall steeply at first and then flatten out, rather than declining at a constant rate.",
  widgetHtml: `
<div class="wrap">
  <div class="controls">
    <label>Half-life: <span id="hlVal">5</span> years
      <input id="halflife" type="range" min="1" max="20" value="5" step="1" />
    </label>
    <label>Years shown: <span id="yearsVal">30</span>
      <input id="years" type="range" min="10" max="100" value="30" step="5" />
    </label>
  </div>
  <canvas id="chart" width="600" height="280"></canvas>
  <div class="result">Remaining after that time: <strong id="finalVal"></strong></div>
</div>
<style>
  .wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .controls { display:flex; gap:24px; margin-bottom:16px; flex-wrap:wrap; }
  label { font-size:13px; color:#444; display:flex; flex-direction:column; gap:4px; }
  input[type=range] { accent-color:#2f5bff; }
  canvas { width:100%; height:auto; display:block; border:1px solid #e5e5e5; border-radius:8px; }
  .result { margin-top:12px; font-size:14px; color:#1a1a1a; }
  .result strong { color:#2f5bff; }
</style>
<script>
  (function () {
    var halflifeInput = document.getElementById('halflife');
    var yearsInput = document.getElementById('years');
    var hlVal = document.getElementById('hlVal');
    var yearsVal = document.getElementById('yearsVal');
    var finalVal = document.getElementById('finalVal');
    var canvas = document.getElementById('chart');
    var ctx = canvas.getContext('2d');

    function reportHeight() {
      window.parent.postMessage({ type: 'explainly:resize', height: document.documentElement.scrollHeight }, '*');
    }

    function draw() {
      var halflife = parseFloat(halflifeInput.value);
      var years = parseInt(yearsInput.value, 10);
      hlVal.textContent = halflifeInput.value;
      yearsVal.textContent = String(years);

      var w = canvas.width, h = canvas.height, pad = 30;
      ctx.clearRect(0, 0, w, h);

      var points = [];
      for (var t = 0; t <= years; t++) {
        points.push(Math.pow(0.5, t / halflife));
      }

      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      ctx.strokeStyle = '#2f5bff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (var i = 0; i < points.length; i++) {
        var x = pad + (i / years) * (w - pad * 2);
        var yy = pad + (1 - points[i]) * (h - pad * 2);
        if (i === 0) { ctx.moveTo(x, yy); } else { ctx.lineTo(x, yy); }
      }
      ctx.stroke();

      finalVal.textContent = Math.round(points[points.length - 1] * 1000) / 10 + '%';
      reportHeight();
    }

    halflifeInput.addEventListener('input', draw);
    yearsInput.addEventListener('input', draw);
    draw();
    new ResizeObserver(reportHeight).observe(document.body);
  })();
</script>
`.trim(),
};

const MOCK_ENTRIES: Record<WidgetShape, Record<string, MockEntry>> = {
  chart: {
    "compound interest": compoundInterest,
    "population growth": populationGrowth,
    "radioactive decay": radioactiveDecay,
  },
  process: {
    photosynthesis: photosynthesis,
    mitosis: mitosis,
    "cellular respiration": cellularRespiration,
  },
  network: {
    "raft consensus": raftConsensus,
    "raft leader election": raftConsensus,
    paxos: paxos,
    "social network spread": socialNetworkSpread,
  },
  comparison: {
    "tcp vs udp": tcpVsUdp,
    "sql vs nosql": sqlVsNosql,
  },
};

function genericFallback(query: string, shape: WidgetShape): MockEntry {
  switch (shape) {
    case "process":
      return genericProcessFallback(query);
    case "network":
      return genericNetworkFallback(query);
    case "comparison":
      return genericComparisonFallback(query);
    case "chart":
    default:
      return genericChartFallback(query);
  }
}

const MOCK_LATENCY_MS = 900;

export async function getMockExplainer(
  query: string,
  shape: WidgetShape,
  context?: FollowUpContext
): Promise<ExplainResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  const entry = MOCK_ENTRIES[shape][query.trim().toLowerCase()] ?? genericFallback(query, shape);
  // Mock widgets are static and can't actually generate context-aware content —
  // this note proves the context plumbing works without pretending otherwise.
  const explanation = context
    ? `${entry.explanation} (Follow-up context received: building on your earlier question, "${context.query}".)`
    : entry.explanation;
  return {
    query,
    explanation,
    widgetType: shape,
    widgetHtml: entry.widgetHtml,
  };
}
