import './style.css';

// <1 = normal parallax, 1 = no parallax, >1 = scroll faster than webpage
const BG_PARALLAX = 2;
const BG_TOP = '#0e012cff'
const BG_BOTTOM = '#4a0a8eff'

const PARALLAX_MAX = 0.5;
const STAR_MIN = 1;
const STAR_MAX = 3;
const STAR_GROW = 3;

var meteorLen = 0;
const METEOR_LEN_MAX = 150;
const METEOR_EASE_IN = 0.02;
const METEOR_EASE_OUT = 0.05;
const METEOR_SCROLL_BUFFER = 300; // this many pixels away from the bottom of the screen = show meteors

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
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * (STAR_MAX-STAR_MIN) + STAR_MIN,
        parallax: Math.random() * PARALLAX_MAX
    });
}
let meteors = [];
for (let i = 0; i < 10; i++) {
    meteors.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * (STAR_MAX-STAR_MIN) + STAR_MIN,
        parallax: 0.1 + Math.random() * (PARALLAX_MAX-0.1)
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
        let canvasX = value.x * canvas.width;
        let canvasY = value.y * canvas.height - window.scrollY * value.parallax;
        while(canvasY < -(value.radius + STAR_GROW)/2) canvasY += canvas.height + value.radius + STAR_GROW; // wrap: ensure star is fully off screen (and also mod doesn't work with negative numbers?)

        // let xy = [canvasX, canvasY];

        // draw
        ctx.beginPath();

        ctx.arc(
            canvasX,
            canvasY,
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
    // meteor gets longer if user scrolled down far enough
    if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - METEOR_SCROLL_BUFFER) {
        meteorLen = METEOR_LEN_MAX*METEOR_EASE_IN + meteorLen*(1-METEOR_EASE_IN);
    } else {
        meteorLen = meteorLen*(1-METEOR_EASE_OUT);
    }
    meteors.forEach((value) => {
        let canvasX = value.x * (canvas.width + METEOR_LEN_MAX);
        let canvasY = window.innerHeight - (value.y*canvas.height) + (document.documentElement.scrollHeight - window.scrollY - canvas.height)*value.parallax;

        ctx.beginPath();

        ctx.strokeStyle = 'white';
        ctx.lineCap = "round";
        ctx.lineWidth = value.radius;

        ctx.moveTo(canvasX, canvasY);
        ctx.lineTo(canvasX - meteorLen, canvasY + meteorLen/2);

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