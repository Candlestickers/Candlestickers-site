import './style.css';

function showIframe(link) {
        // alert("OPENING IFRAME")
    const container = document.getElementById('iframe-container');
    container.innerHTML = `
        <iframe
        frameborder="0"
        src="${link}"
        allowfullscreen
        width="720"
        height="440">
        </iframe>
    `
    container.scrollIntoView({ behavior: 'smooth' })
    }