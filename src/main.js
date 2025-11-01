import './style.css';

// <1 = normal parallax, 1 = no parallax, >1 = scroll faster than webpage
const BG_PARALLAX = 2;
const BG_TOP = '#0e012cff'
const BG_BOTTOM = '#4a0a8eff'

const PARALLAX_MAX = 0.5;
const STAR_MIN = 1;
const STAR_MAX = 3;
const STAR_GROW = 3;

let mouse = { x: 0, y: 0 }; // mouse position (see mousemove listener)
var distToMouse = (x, y) => Math.sqrt((x - mouse.x) ** 2 + (y - mouse.y) ** 2);

/////////////////////////////
// BACKGROUND STARS CANVAS //
/////////////////////////////
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 250; i++) {
    stars.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * (STAR_MAX-STAR_MIN) + STAR_MIN,
        parallax: Math.random() * PARALLAX_MAX
    });
}
let meteors = [];
for (let i = 0; i < 20; i++) {
    meteors.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * (STAR_MAX-STAR_MIN) + STAR_MIN,
        parallax: Math.random() * PARALLAX_MAX,
        length: 0
    });
}

function drawBackground() {
    // GRADIENT
    var scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas 
    // var constellation = [];
    
    // adding background gradient
    // determine pan amount based on scrolled amount
    let gradientPan = scrollRatio * BG_PARALLAX;
    // gradient is taller than window height to allow panning gradient up when scrolling
    const gradient = ctx.createLinearGradient(0, -(canvas.height * gradientPan), 0, canvas.height * (1 + BG_PARALLAX - gradientPan));
    // add stops and fill
    gradient.addColorStop(0, BG_TOP); // top color
    gradient.addColorStop(1, BG_BOTTOM); // bottom color
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // STARS
    stars.map((value) => {
        ctx.beginPath();

        let canvasX = value.x * canvas.width;
        // add parallax and wrap stars to top and bottom
        let canvasY = value.y * canvas.height - window.scrollY * value.parallax;
        while(canvasY < -(value.radius + STAR_GROW)/2) canvasY += canvas.height + value.radius + STAR_GROW; // wrap: ensure star is fully off screen (and also mod doesn't work with negative numbers?)

        let xy = [canvasX, canvasY];

        // draw
        ctx.arc(
            xy[0],
            xy[1],
            // magic math for stars growing if the mouse is close
            value.radius + STAR_GROW/(distToMouse(canvasX, canvasY)**2/100 + 1),
            0, Math.PI * 2
        );
        ctx.fillStyle = 'white';
        ctx.fill();

//         if (distToMouse(...xy) <= 200)
//             constellation.push([...xy, 1 / distToMouse(...xy)]);
    });

    // METEORS
    meteors.forEach((value) => {

        const maxL = 200;
        if (scrollRatio > 0.75) {
            value.length += (maxL - value.length) / 52;
        } else {
            value.length = Math.max(value.radius, value.length - 4 || Math.max(1, value.radius * 5));
        }

        ctx.beginPath();
        ctx.strokeStyle = 'white';

        let pos = {
            x: value.x * canvas.width * 1.4,
            y: document.documentElement.scrollHeight - value.y * canvas.height / 1.4 - (scrollY + 200),
            r: Math.min(100, value.radius * 5 * 1 / (1 / Math.max(scrollRatio, 1e5) - 1))
        }

        // ctx.stroke = 10;
        ctx.lineWidth = 1 + value.radius;
        ctx.moveTo(pos.x + maxL / 3, pos.y - maxL / 3);
        ctx.lineTo(pos.x + maxL / 3 - value.length * 2, pos.y - maxL / 3 + value.length * 0.5);

        ctx.stroke();


        // if (constellation.length) {
        //     for (var i = 1; i < constellation.length; i++) {
        //         ctx.beginPath();
        //         ctx.moveTo(...constellation[i - 1]);
        //         ctx.lineWidth = constellation[i][2];
        //         ctx.lineTo(...constellation[i]);
        //         ctx.stroke();
        //     }
        // }


        // ctx.arc(
        //     value.x * canvas.width,
        //     document.documentElement.scrollHeight - value.y * canvas.height/2 - (scrollY + 150),
        //     value.radius * 5,
        //     0,
        //     Math.PI*2
        //   );
        //   ctx.fill();
    });
}

// === IFRAME HANDLER ===
function showIframe(link) {
    const container = document.getElementById('iframe-container');
    container.innerHTML = `
        <iframe
            frameborder="0"
            src="${link}"
            allowfullscreen
            width="720"
            height="440">
        </iframe>`;
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Make showIframe accessible from HTML
window.showIframe = showIframe;


////////////////////////////
// window event listeners //
////////////////////////////
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
// window.addEventListener('scroll', drawStars)
// update mouse position
window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
})

function animate() {
    drawBackground();
    requestAnimationFrame(animate);
}
animate();