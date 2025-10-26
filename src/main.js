import './style.css';


/////////////////////////////
// BACKGROUND STARS CANVAS //
/////////////////////////////
const canvas = document.getElementById('stars')
const ctx = canvas.getContext('2d')

const stars = [];
for (let i=0; i<200; i++){
    stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2
    })
}
function drawStars() {
    // match size & position to window
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    var scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(Math.max(0,Math.min(1,(scrollRatio/2))), '#000000ff')  // top color (dark blue)
    gradient.addColorStop(1, '#2c006dff')  // bottom color (black)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    stars.map((value)=>{
        ctx.beginPath();
        let newHeight = value.y*canvas.height + window.scrollY*value.r
        ctx.arc(value.x*canvas.width, 
            newHeight>canvas.height? newHeight-canvas.height : newHeight,
            value.r, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
}

drawStars()
window.addEventListener('resize', drawStars)
window.addEventListener('scroll', drawStars)


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
