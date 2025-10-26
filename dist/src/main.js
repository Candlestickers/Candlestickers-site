import './style.css';

let mouse = {x:0, y:0}; // mouse position (see mousemove listener)


/////////////////////////////
// BACKGROUND STARS CANVAS //
/////////////////////////////
const canvas = document.getElementById('stars')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const stars = [];
for (let i=0; i<250; i++){
    stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2
    })
}
function drawStars() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas 

    // adding background gradient
    var scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(Math.max(0,Math.min(1,(scrollRatio/2))), '#000000ff')  // top color
    gradient.addColorStop(1, '#2c006dff')  // bottom color
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw stars
    stars.map((value)=>{
        ctx.beginPath();
        let newHeight = value.y*canvas.height - window.scrollY*value.r; // <-- parallax effect to height
        ctx.arc(value.x*canvas.width, 
            newHeight<0? newHeight+canvas.height : newHeight,
            // buncha numbers for simple resize when mouse is near star
            value.r + Math.min(5,Math.max(1,70/Math.sqrt((value.x*canvas.width-mouse.x)**2 + ((newHeight>canvas.height? newHeight-canvas.height : newHeight)-mouse.y)**2))),
            0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
}

drawStars()


// === IFRAME HANDLER ===
function showIframe(link) {
  const container = document.getElementById('iframe-container')
  container.innerHTML = `
    <iframe
      frameborder="0"
      src="${link}"
      allowfullscreen
      width="720"
      height="440">
    </iframe>
  `
  container.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Make showIframe accessible from HTML
window.showIframe = showIframe


////////////////////////////
// window event listeners //
////////////////////////////
window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
// window.addEventListener('scroll', drawStars)
// update mouse position
window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = event.clientX - rect.left
    mouse.y = event.clientY - rect.top
})

function animate() {
  drawStars();
  requestAnimationFrame(animate);
}
animate();