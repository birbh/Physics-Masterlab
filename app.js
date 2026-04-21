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
    });
    reverseBtn.addEventListener("click",()=>{
        reverseBtn.classList.add("active");
        forwardBtn.classList.remove("active");
    });
}

if(bridgeSvg){
    renderBridge();
}




