import './style.css';

// === STAR CANVAS ===
const canvas = document.getElementById('stars')
if (canvas) {
  const ctx = canvas.getContext('2d')
  function drawStars() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const r = Math.random() * 1.2
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
    }
  }

  drawStars()
  window.addEventListener('resize', drawStars)
}

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
