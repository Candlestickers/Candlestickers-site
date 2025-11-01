import './style.css';

let mouse = { x: 0, y: 0 }; // mouse position (see mousemove listener)


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
        r: Math.random() * 1.2
    });
}
let meteors = [];
for (let i = 0; i < 20; i++) {
    meteors.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random(),
        length: 0
    });
}

function drawStars() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas 
    var constellation = [];

    // adding background gradient
    var scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(Math.max(0, Math.min(1, 0.7 - (scrollRatio / 1.5))), '#00002cff');  // top color
    gradient.addColorStop(1, '#2c006dff');  // bottom color
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    var distToMouse = (x, y) => Math.sqrt((x - mouse.x) ** 2 + (y - mouse.y) ** 2);

    // draw stars
    stars.map((value) => {
        ctx.beginPath();
        let newHeight = value.y * canvas.height - window.scrollY * value.r; // <-- parallax effect to height
        let xy = [value.x * canvas.width, newHeight < 0 ? newHeight + canvas.height : newHeight];
        ctx.arc(
            xy[0],
            xy[1],
            // buncha numbers for simple resize when mouse is near star
            value.r + Math.min(5, Math.max(1, 70 / Math.sqrt((value.x * canvas.width - mouse.x) ** 2 + ((newHeight > canvas.height ? newHeight - canvas.height : newHeight) - mouse.y) ** 2))),
            0, Math.PI * 2
        );
        ctx.fillStyle = 'white';
        ctx.fill();

        if (distToMouse(...xy) <= 200)
            constellation.push([...xy, 1 / distToMouse(...xy)]);
    });

    meteors.forEach((value) => {

        const maxL = 200;
        if (scrollRatio > 0.75) {
            value.length += (maxL - value.length) / 52;
        } else {
            value.length = Math.max(value.r, value.length - 4 || Math.max(1, value.r * 5));
        }

        ctx.beginPath();
        ctx.strokeStyle = 'white';

        let pos = {
            x: value.x * canvas.width * 1.4,
            y: document.documentElement.scrollHeight - value.y * canvas.height / 1.4 - (scrollY + 200),
            r: Math.min(100, value.r * 5 * 1 / (1 / Math.max(scrollRatio, 1e5) - 1))
        }

        // ctx.stroke = 10;
        ctx.lineWidth = 1 + value.r;
        ctx.moveTo(pos.x + maxL / 3, pos.y - maxL / 3);
        ctx.lineTo(pos.x + maxL / 3 - value.length * 2, pos.y - maxL / 3 + value.length * 0.5);

        ctx.stroke();


        if (constellation.length) {
            for (var i = 1; i < constellation.length; i++) {
                ctx.beginPath();
                ctx.moveTo(...constellation[i - 1]);
                ctx.lineWidth = constellation[i][2];
                ctx.lineTo(...constellation[i]);
                ctx.stroke();
            }
        }


        // ctx.arc(
        //     value.x * canvas.width,
        //     document.documentElement.scrollHeight - value.y * canvas.height/2 - (scrollY + 150),
        //     value.r * 5,
        //     0,
        //     Math.PI*2
        //   );
        //   ctx.fill();
    });
}

drawStars();


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
    drawStars();
    requestAnimationFrame(animate);
}
animate();