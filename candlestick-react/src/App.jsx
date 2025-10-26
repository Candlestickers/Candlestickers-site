import { useEffect, useRef, useState } from 'react'
import './index.css'

export default function App() {
  const canvasRef = useRef(null)
  const [iframeSrc, setIframeSrc] = useState('public/display.mp4')

  useEffect(() => {
    const canvas = document.getElementById('stars')
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * canvas.width
            const y = Math.random() * canvas.height
            const r = Math.random() * 1.2
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fillStyle = 'white'
            ctx.fill()
        }
  }, [])


  const showIframe = (link) => {
    setIframeSrc(link)
    setTimeout(() => {
      const container = document.getElementById('iframe-container')
      const rect = container.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offset = rect.top + scrollTop - window.innerHeight / 2 + 150
      window.scrollTo({ top: offset, behavior: 'smooth' })
    }, 100)
  }

  return (
    <div style={{ backgroundColor: '#000' }}>
      <canvas id="stars" ref={canvasRef}></canvas>

      <ul style={{ listStyle: 'none', display: 'flex', marginLeft: '-15px' }}>
        <li><a href="https://discord.gg/5esxxWxd7Z" target="_blank">Discord</a></li>
        <li>Support</li>
        <li style={{ fontSize: '25px' }}>Candlestick!</li>
        <li>Learn</li>
        <li>About</li>
      </ul>

      <div id="banner">
        <img src="public/cs_banner.png" width="900" style={{ margin: 'auto', display: 'flex', marginTop: '-50px' }} />
      </div>

      <h1 className="typewriter">In a void of stars, Candlestick is enough!</h1>

      <a href="https://candlestickers.app" target="_blank" style={{ textDecoration: 'none', margin: 'auto', display: 'flex' }}>
        <button className="launch_button">Launch Web Editor!</button>
      </a>

      <div id="iframe-container">
        <iframe frameBorder="0" src={iframeSrc} width="720" height="440" allowFullScreen></iframe>
      </div>
      <p>Check out games created with Candlestick!</p>

      <div className="square-grid">
        <div className="square" onClick={() => showIframe('https://itch.io/embed-upload/10607562?color=000000')}>
          <img src="public/showcase/flagRaise.png" alt="Flag Raise" />
        </div>
        <div className="square" onClick={() => showIframe('https://itch.io/embed-upload/10859424?color=000000')}>
          <img src="public/showcase/newtonsApple.png" alt="Newton's Apple" />
        </div>
        <div className="square"><img src="vite.svg" alt="Game 3" /></div>
        <div className="square"><img src="vite.svg" alt="Game 4" /></div>
        <div className="square"><img src="vite.svg" alt="Game 5" /></div>
        <div className="square"><img src="vite.svg" alt="Game 6" /></div>
      </div>
    </div>
  )
}
