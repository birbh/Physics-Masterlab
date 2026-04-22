const navButtons=document.querySelectorAll('.nav-btn');
const labs=document.querySelectorAll('.lab');
navButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
        navButtons.forEach(b=>b.classList.remove('active'));
        labs.forEach(l=>l.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});
const rxSlider=document.getElementById('rxSlider');
const rxValue=document.getElementById('rxValue');
const bridgeSvg=document.getElementById('bridgeSvg');
const bridgeOutput=document.getElementById('bridgeOutput');

function renderBridge(){
    const rx=Number(rxSlider.value);

    const vin=5;
    const r1=100;
    const r2=100;
    const r3=100;
    const balanceRx=(r2*r3)/r1;
    const vout=vin*((r2/(r1+r2))-(rx/(r3+rx)));
    const balanceError=rx-balanceRx;
    const needleAngle=Math.max(-0.55,Math.min(0.55,vout*0.25));

    const width=900;
    const height=450;
    const A={x:220,y:120};
    const B={x:720,y:120};
    const C={x:220,y:330};
    const D={x:720,y:330};
    const M={x:470,y:225};
    const T={x:470,y:120};
    const N={x:470,y:330};

    const resistorTopLeft=svgResistor(A.x,A.y, T.x,A.y);
    const resistorTopRight=svgResistor(T.x,B.y, B.x,B.y);
    const resistorBottomLeft=svgResistor(C.x,C.y, N.x,C.y);
    const resistorBottomRight=svgResistor(N.x,D.y, D.x,D.y);
    const needleX=M.x;
    const needleY=M.y;
    const needleLen=18;
    const armGap=35;
    const balanceAngleDeg=needleAngle*180/Math.PI;

    bridgeSvg.innerHTML = `
      <defs>
        <marker id="bridgeArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#00e5ff"></path>
        </marker>
        <marker id="smallArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#ff4d6d"></path>
        </marker>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="#0b0f15" rx="10"></rect>

      <text x="65" y="190" fill="#ffb300" font-family="Space Grotesk, sans-serif" font-size="20">Vin</text>
      <line x1="120" y1="150" x2="120" y2="290" stroke="#ffb300" stroke-width="3"></line>
      <rect x="112" y="180" width="18" height="8" fill="#ffffff"></rect>
      <rect x="108" y="206" width="34" height="8" fill="#ffffff"></rect>

      <polyline points="120,150 120,120 ${A.x},${A.y}" fill="none" stroke="#ffb300" stroke-width="3"></polyline>
      <polyline points="120,290 120,390 ${D.x},390 ${D.x},${D.y}" fill="none" stroke="#ffb300" stroke-width="3"></polyline>

      <line x1="${A.x}" y1="${A.y}" x2="${C.x}" y2="${C.y}" stroke="#cfd8e3" stroke-width="3"></line>
      <line x1="${B.x}" y1="${B.y}" x2="${D.x}" y2="${D.y}" stroke="#cfd8e3" stroke-width="3"></line>

      <circle cx="${A.x}" cy="${A.y}" r="5" fill="#00e5ff"></circle>
      <circle cx="${B.x}" cy="${B.y}" r="5" fill="#00e5ff"></circle>
      <circle cx="${C.x}" cy="${C.y}" r="5" fill="#00e5ff"></circle>
      <circle cx="${D.x}" cy="${D.y}" r="5" fill="#00e5ff"></circle>
    <circle cx="${T.x}" cy="${T.y}" r="5" fill="#00e5ff"></circle>
    <circle cx="${N.x}" cy="${N.y}" r="5" fill="#00e5ff"></circle>
      <circle cx="${M.x}" cy="${M.y}" r="5" fill="#00e5ff"></circle>

      <path d="${resistorTopLeft}" stroke="#f5f7fa" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"></path>
      <path d="${resistorTopRight}" stroke="#f5f7fa" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"></path>
      <path d="${resistorBottomLeft}" stroke="#f5f7fa" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"></path>
      <path d="${resistorBottomRight}" stroke="#f5f7fa" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"></path>

    <line x1="${T.x}" y1="${T.y}" x2="${M.x}" y2="${M.y-armGap}" stroke="#ff4d6d" stroke-width="3"></line>
    <line x1="${M.x}" y1="${M.y+armGap}" x2="${N.x}" y2="${N.y}" stroke="#ff4d6d" stroke-width="3"></line>
      <circle cx="${M.x}" cy="${M.y}" r="28" fill="#0f141d" stroke="#ff4d6d" stroke-width="3"></circle>
      <text x="${M.x-8}" y="${M.y+6}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">G</text>
      <line x1="${M.x}" y1="${M.y}" x2="${M.x + needleLen*Math.cos(needleAngle)}" y2="${M.y + needleLen*Math.sin(needleAngle)}" stroke="#00e5ff" stroke-width="3"></line>

      <text x="${A.x-16}" y="${A.y-12}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">A</text>
      <text x="${B.x+8}" y="${B.y-12}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">B</text>
      <text x="${C.x-16}" y="${C.y+28}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">C</text>
      <text x="${D.x+8}" y="${D.y+28}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">D</text>

      <text x="${A.x+74}" y="${A.y-14}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">R1</text>
      <text x="${B.x-46}" y="${B.y-14}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">R2</text>
      <text x="${C.x+74}" y="${C.y+28}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">R3</text>
      <text x="${D.x-46}" y="${D.y+28}" fill="#f5f7fa" font-family="Space Grotesk, sans-serif" font-size="18">Rx</text>

      <text x="${M.x-48}" y="${M.y-38}" fill="#ff4d6d" font-family="Space Grotesk, sans-serif" font-size="16">Galvanometer</text>
    `;

    // Balance indicator
    const balanced=Math.abs(vout)<0.01;
    bridgeOutput.innerHTML=
        'Vin = '+vin.toFixed(2)+' V | R1 = '+r1+' Ω | R2 = '+r2+' Ω | R3 = '+r3+' Ω | Rx = '+rx+' Ω | Vout = '+vout.toFixed(4)+' V | '+
        (balanced ? '<span style="color:#39ff14">Balanced: galvanometer at zero</span>' : '<span style="color:#ffb300">Unbalanced: needle deflects</span>')+
        '<br>Balance Rx = '+balanceRx.toFixed(2)+' Ω | Error = '+balanceError.toFixed(2)+' Ω';
}

function svgResistor(x1,y1,x2,y2){
    const steps=8;
    const lead=30;
    const startX=x1+lead;
    const endX=x2-lead;
    const width=endX-startX;
    const amp=14;
    let d=`M ${x1} ${y1} L ${startX} ${y1}`;
    for(let i=0;i<steps;i++){
        const t0=startX + (width/steps)*i;
        const t1=startX + (width/steps)*(i+0.5);
        const t2=startX + (width/steps)*(i+1);
        const yA = i%2===0 ? y1-amp : y1+amp;
        d += ` L ${t1} ${yA} L ${t2} ${y1}`;
    }
    d += ` L ${x2} ${y2}`;
    return d;
}

if(rxSlider && rxValue && bridgeSvg){
    rxSlider.addEventListener('input',()=>{
        rxValue.textContent=rxSlider.value;
        renderBridge();
    });
}
const forwardBtn=document.getElementById('forwardBtn');
const reverseBtn=document.getElementById('reverseBtn');
if(forwardBtn && reverseBtn){
    forwardBtn.addEventListener("click",()=>{
        forwardBtn.classList.add("active");
        reverseBtn.classList.remove("active");
        tracePoints = [];
    });
    reverseBtn.addEventListener("click",()=>{
        reverseBtn.classList.add("active");
        forwardBtn.classList.remove("active");
        tracePoints = [];
    });
}

if(bridgeSvg){
    renderBridge();
}


const diodeCanvas = document.getElementById("diodeCanvas");
const diodeOutput = document.getElementById("diodeOutput");

// Create controls dynamically
const diodeControls = document.querySelector("#lab-diode .controls");

const sliderHTML = `
<br>
<label>Voltage (V): <span id="voltageValue">0</span></label>
<input type="range" id="voltageSlider" min="-2" max="2" step="0.01" value="0" style="width:300px;">
<br>
<label>Zoom:</label>
<input type="range" id="zoomSlider" min="100" max="500000" step="100" value="200000" style="width:300px;">
<br>
<label>Material:</label>
<select id="materialSelect">
  <option value="si">Silicon (0.7V)</option>
  <option value="ge">Germanium (0.3V)</option>
</select>

<br>
<label>
  <input type="checkbox" id="logToggle"> Log Scale (I)
</label>
<br>
<button id="animateBtn">Start Sweep</button>
<div style="max-height:150px;overflow-y:auto;border:1px solid #555;margin-top:10px;">
<table id="dataTable" border="1" style="width:100%;color:white;font-size:12px">
<tr><th>Voltage (V)</th><th>Current (A)</th></tr>
</table>
</div>
`;

diodeControls.insertAdjacentHTML("beforeend", sliderHTML);

const voltageSlider = document.getElementById("voltageSlider");
const voltageValue = document.getElementById("voltageValue");
const zoomSlider = document.getElementById("zoomSlider");
const animateBtn = document.getElementById("animateBtn");
const dataTable = document.getElementById("dataTable");

const materialSelect = document.getElementById("materialSelect");
const logToggle = document.getElementById("logToggle");

let biasMode = "forward";
let zoomFactor = Number(zoomSlider.value);
let animating = false;
let tracePoints = [];

if (forwardBtn && reverseBtn) {
    forwardBtn.addEventListener("click", () => {
        biasMode = "forward";
        tracePoints = [];
        renderDiode();
    });

    reverseBtn.addEventListener("click", () => {
        biasMode = "reverse";
        tracePoints = [];
        renderDiode();
    });
}

function diodeCurrent(V) {
    let Is, n, Vt = 0.026, Vbr = -1.2;

    if (materialSelect.value === "ge") {
        Is = 5e-6;
        n = 1.2;
    } else {
        Is = 1e-6;
        n = 1.5;
    }

    if (V >= 0) {
        return Is * (Math.exp(V / (n * Vt)) - 1);
    } else {
        if (V > Vbr) {
            return -Is;
        } else {
            return -Is * Math.exp((Math.abs(V) - Math.abs(Vbr)) * 12);
        }
    }
}

function drawAxes(ctx, width, height) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(50, height / 2);
    ctx.lineTo(width - 20, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    // axis labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px sans-serif";

    // Voltage axis (X)
    ctx.fillText("Voltage (V)", width - 140, height / 2 - 10);
    ctx.beginPath();
    ctx.moveTo(width - 30, height / 2);
    ctx.lineTo(width - 10, height / 2);
    ctx.stroke();

    // Current axis (Y)
    ctx.fillText("Current (I)", width / 2 + 10, 30);
    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, 10);
    ctx.stroke();

    // quadrant hints
    ctx.fillStyle = "#aaa";
    ctx.font = "12px sans-serif";
    ctx.fillText("Forward Bias", width/2 + 80, height/2 - 80);
    ctx.fillText("Reverse Bias", width/2 - 220, height/2 + 80);

    if (logToggle.checked) {
        ctx.fillStyle = "#aaa";
        ctx.fillText("Log Scale Active", width - 180, 30);
    }
}

function plotCurve(ctx, width, height) {
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    let first = true;

    let start = biasMode === "forward" ? 0 : -1;
    let end = biasMode === "forward" ? 1 : 0;

    for (let x = start; x <= end; x += 0.01) {
        let V = x * 2;
        let I = diodeCurrent(V);

        let scale = biasMode === "forward" ? zoomFactor : zoomFactor * 3;
        let displayI = logToggle.checked ? Math.sign(I) * Math.log10(Math.abs(I) + 1e-12) : I;
        let canvasX = width / 2 + x * 300;
        let canvasY = height / 2 - displayI * scale;

        if (first) {
            ctx.moveTo(canvasX, canvasY);
            first = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }

    ctx.stroke();

    ctx.globalAlpha = 0.1;
    ctx.fillStyle = biasMode === "forward" ? "#8e44ad" : "#555";
    ctx.fillRect(
        biasMode === "forward" ? width/2 : 0,
        0,
        width/2,
        height
    );
    ctx.globalAlpha = 1;

    // improved knee voltage detection using slope (dI/dV)
    let kneeV = 0;
    let prevI = diodeCurrent(0);
    for (let V = 0.1; V <= 1; V += 0.01) {
        let currI = diodeCurrent(V);
        let slope = (currI - prevI) / 0.01;

        if (slope > 0.01) { // slope threshold
            kneeV = V;
            break;
        }
        prevI = currI;
    }

    let kneeX = width / 2 + (kneeV / 2) * 300;
    let kneeY = height / 2 - diodeCurrent(kneeV) * zoomFactor;

    // draw knee point
    ctx.fillStyle = "#ffb300";
    ctx.beginPath();
    ctx.arc(kneeX, kneeY, 5, 0, Math.PI * 2);
    ctx.fill();

    // draw vertical dashed line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#ffb300";
    ctx.beginPath();
    ctx.moveTo(kneeX, height - 20);
    ctx.lineTo(kneeX, 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // label
    ctx.fillStyle = "#ffb300";
    ctx.font = "12px sans-serif";
    ctx.fillText("Knee ≈ " + kneeV.toFixed(2) + "V", kneeX + 10, kneeY - 10);

    // breakdown voltage marker (reverse side)
    const Vbr = -1.2;
    let brX = width / 2 + (Vbr / 2) * 300;

    ctx.setLineDash([5,5]);
    ctx.strokeStyle = "#00ff88";
    ctx.beginPath();
    ctx.moveTo(brX, height - 20);
    ctx.lineTo(brX, 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#00ff88";
    ctx.font = "12px sans-serif";
    ctx.fillText("Breakdown Region", brX - 70, 40);
}

function drawPoint(ctx, width, height, V) {
    let I = diodeCurrent(V);

    let scale = biasMode === "forward" ? zoomFactor : zoomFactor * 3;
    let displayI = logToggle.checked ? Math.sign(I) * Math.log10(Math.abs(I) + 1e-12) : I;
    let x = width / 2 + (V / 2) * 300;
    let y = height / 2 - displayI * scale;

    ctx.fillStyle = "#ff4d6d";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    tracePoints.push({ x, y });

    return I;
}

function updateTable(V, I) {
    const row = `<tr><td>${V.toFixed(2)}</td><td>${I.toExponential(2)}</td></tr>`;
    dataTable.insertAdjacentHTML("beforeend", row);
}

function renderDiode() {
    if (!diodeCanvas) return;

    const ctx = diodeCanvas.getContext("2d");
    ctx.clearRect(0, 0, diodeCanvas.width, diodeCanvas.height);

    const width = diodeCanvas.width;
    const height = diodeCanvas.height;

    drawAxes(ctx, width, height);
    plotCurve(ctx, width, height);

    // draw trace
    if (tracePoints.length > 1) {
        ctx.strokeStyle = "#ff4d6d";
        ctx.lineWidth = 2;
        ctx.beginPath();
        tracePoints.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    }

    let V = Number(voltageSlider.value);
    let I = drawPoint(ctx, width, height, V);

    voltageValue.textContent = V.toFixed(2);

    diodeOutput.innerHTML =
        "Mode: " + (biasMode === "forward" ? "Forward Bias" : "Reverse Bias") +
        `<br>Voltage: ${V.toFixed(2)} V` +
        `<br>Current: ${I.toExponential(3)} A`;
}

voltageSlider.addEventListener("input", renderDiode);

zoomSlider.addEventListener("input", () => {
    zoomFactor = Number(zoomSlider.value);
    renderDiode();
});

animateBtn.addEventListener("click", () => {
    if (animating) return;

    animating = true;
    dataTable.innerHTML = "<tr><th>Voltage (V)</th><th>Current (A)</th></tr>";

    tracePoints = [];
    let V = biasMode === "forward" ? 0 : 0;

    function sweep() {
        if (biasMode === "forward") {
            if (V > 2) {
                animating = false;
                return;
            }
        } else {
            if (V < -3) {
                animating = false;
                return;
            }
        }

        voltageSlider.value = V;
        let I = diodeCurrent(V);

        updateTable(V, I);
        renderDiode();

        V += (biasMode === "forward" ? 0.05 : -0.08);
        requestAnimationFrame(sweep);
    }

    sweep();
});

// initial render
if (diodeCanvas) {
    renderDiode();
}

