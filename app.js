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
