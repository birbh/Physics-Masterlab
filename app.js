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
const thSlider=document.getElementById('thslider');
const tcSlider=document.getElementById('tcslider');
const thValue=document.getElementById('thvalue');
const tcValue=document.getElementById('tcvalue');
thSlider.addEventListener('input',()=>{
    thValue.textContent=thSlider.value;
});
tcSlider.addEventListener('input',()=>{
    tcValue.textContent=tcSlider.value;
});
const rxSlider=document.getElementById('rxslider');
const rxValue=document.getElementById('rxvalue');
rxSlider.addEventListener('input',()=>{
    rxValue.textContent=rxSlider.value;
});
const forwardBtn=document.getElementById('forwardBtn');
const reverseBtn=document.getElementById('reverseBtn');
forwardBtn.addEventListener("click",()=>{
    forwardBtn.classList.add("active");
    reverseBtn.classList.remove("active");
});
reverseBtn.addEventListener("click",()=>{
    reverseBtn.classList.add("active");
    forwardBtn.classList.remove("active");
});

//carnot
const carnotCanvas=document.getElementById('carnotCanvas');
const cctx=carnotCanvas.getContext('2d');
const carnotOutput=document.getElementById('carnotOutput');
const gamma=1.4;
function drawAxes(ctx,w,h,pad,xLabel,yLabel){
    ctx.strokeStyle='#8ea3b8';
    ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(pad, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pad, h - pad);
    ctx.lineTo(pad, pad);
    ctx.stroke();

    ctx.fillStyle='#d6deea';
    ctx.font='14px Arial';
    ctx.fillText(xLabel,w - pad - 80,h - pad +28);

    ctx.save();
    ctx.translate(pad - 38, pad + 12);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(yLabel,0,0);
    ctx.restore();
}
function drawGrid(ctx,w,h,pad){
  ctx.strokeStyle = "rgba(120,140,170,0.16)";
  ctx.lineWidth = 1;
  const lines=8;
  for(let i=1;i<=lines;i++){
    const x=pad+(i*(w-2*pad)/lines);
    const y=pad+(i*(h-2*pad)/lines);
    ctx.beginPath();
    ctx.moveTo(x,pad);
    ctx.lineTo(x,h-pad);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pad,y);
    ctx.lineTo(w-pad,y);
    ctx.stroke();
  }
}

function mapToCanvas(v,p,bounds,w,h,pad){
    const x=pad+((v-bounds.vMin)/(bounds.vMax-bounds.vMin))*(w-2*pad);
    const y=h-pad-((p-bounds.pMin)/(bounds.pMax-bounds.pMin))*(h-2*pad);
    return{x,y};

}

function buildCarnotStates(Th, Tc) {
    const V1=1.2;
    const V2=2.2;
    const ratio=Math.pow(Th/Tc,1/(gamma-1));
    const Vc=V2*ratio;
    const Vd=V1*ratio;

    const A={V:V1,P:Th/V1};
    const B={V:V2,P:Th/V2};
    const C={V:Vc,P:Tc/Vc};
    const D={V:Vd,P:Tc/Vd};
    return {A,B,C,D};
}

function sampleCurve(vStart,vEnd,count,fn){
    const pts=[];
    for(let i=0;i<=count;i++){
        const t=i/count;
        const v=vStart+(vEnd-vStart)*t;
        pts.push({V:v,P:fn(v)});

    }
    return pts;
}

function drawCurve(ctx,points,bounds,w,h,pad,color,width=2.4){
    ctx.strokeStyle=color;
    ctx.lineWidth=width;
    ctx.beginPath();
    points.forEach((pt,i)=>{
        const m=mapToCanvas(pt.V,pt.P,bounds,w,h,pad);
        if(i===0){
            ctx.moveTo(m.x,m.y);
        }
        else ctx.lineTo(m.x,m.y);
    });
    ctx.stroke();
}

function drawStageLabel(ctx,text,point,bounds,w,h,pad,color){
    const m=mapToCanvas(point.V,point.P,bounds,w,h,pad);
    ctx.fillStyle=color;
    ctx.font='14px Arial';
    ctx.fillText(text,m.x+8,m.y-8);
}
function renderCarnot(){
    const w=carnotCanvas.width;
    const h=carnotCanvas.height;
    const pad=56;
    let Th=Number(thSlider.value);
    let Tc=Number(tcSlider.value);
    if(Tc>=Th){
        Tc=Th-1;
        tcSlider.value=String(Tc);
        tcValue.textContent=String(Tc);
    }
    const {A,B,C,D}=buildCarnotStates(Th,Tc);

    const kAB=B.P*Math.pow(B.V,gamma);
    const kDA=D.P*Math.pow(D.V,gamma);
    const isoHot=sampleCurve(A.V,B.V,120,v=>Th/v);
    const adiExp=sampleCurve(B.V,C.V,120,v=>kAB/Math.pow(v,gamma));
    const isoCold=sampleCurve(C.V,D.V,120,v=>Tc/v);
    const adiComp=sampleCurve(D.V,A.V,120,v=>kDA/Math.pow(v,gamma));

    const allPts=[...isoHot,...adiExp,...isoCold,...adiComp];
    const vVals=allPts.map(p=>p.V);
    const pVals=allPts.map(p=>p.P);

    const bounds={
        vMin:Math.min(...vVals)*0.9,
        vMax:Math.max(...vVals)*1.05,
        pMin:Math.min(...pVals)*0.8,
        pMax:Math.max(...pVals)*1.1
    };
    cctx.clearRect(0, 0, w, h);
    drawGrid(cctx,w,h,pad);
    drawAxes(cctx,w,h,pad,'Volume (V)','Pressure (P)');
    drawCurve(cctx,isoHot,bounds,w,h,pad,'#00e5ff');
    drawCurve(cctx,adiExp,bounds,w,h,pad,'#ffb300');
    drawCurve(cctx,isoCold,bounds,w,h,pad,'#39ff14');
    drawCurve(cctx,adiComp,bounds,w,h,pad,'#ff4d6d');
    
  drawStageLabel(cctx, "1) Isothermal Expansion", isoHot[Math.floor(isoHot.length * 0.5)], bounds, w, h, pad, "#7ee8ff");
  drawStageLabel(cctx, "2) Adiabatic Expansion", adiExp[Math.floor(adiExp.length * 0.5)], bounds, w, h, pad, "#ffd27a");
  drawStageLabel(cctx, "3) Isothermal Compression", isoCold[Math.floor(isoCold.length * 0.5)], bounds, w, h, pad, "#7dff82");
  drawStageLabel(cctx, "4) Adiabatic Compression", adiComp[Math.floor(adiComp.length * 0.5)], bounds, w, h, pad, "#ff8ba0");

  const eta=1-(Tc/Th);
  carnotOutput.innerHTML=
  "Th = "+Th+" K | Tc = "+Tc+" K | Efficiency (η) = 1-(Tc/Th) = "+eta.toFixed(4)+" ("+(eta*100).toFixed(2)+"%)";

}

thSlider.addEventListener("input",()=>{
    thValue.textContent=thSlider.value;
    renderCarnot();
});
tcSlider.addEventListener("input",()=>{
    tcValue.textContent=tcSlider.value;
    renderCarnot();
});
renderCarnot();

