//Code taken and edited if needed from https://youtu.be/mRDo-QXVUv8?si=ca-_vZoIk8UU_TZo

const canvas = document.getElementById('drawing-board'); // Fetches drawing-board id

const toolbar = document.getElementById('toolbar');// Get a reference to the 'toolbar' element by its ID
const ctx = canvas.getContext('2d');// Get a 2D rendering context for the 'canvas' element  

const canvasOffsetX = canvas.offsetLeft;// Calculate the horizontal offset of the canvas from the document's left edge
const canvasOffsetY = canvas.offsetTop;// Calculate the vertical offset of the canvas from the document's top edge

canvas.width = window.innerWidth - canvasOffsetX;// Set the width of the 'canvas' element to the available width in the window
canvas.height = window.innerHeight - canvasOffsetY;// Set the height of the 'canvas' element to the available height in the window

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);