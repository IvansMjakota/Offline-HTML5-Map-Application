const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

// Adjusts the size of canvas to the screen size 
canvas.width = window.innerWidth - canvasOffsetX; 
canvas.height = window.innerHeight - canvasOffsetY;

const drawButton = document.getElementById('drawButton');

const drawShape = () => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get the selected shape, stroke colour, and line width
    const selectedShape = document.getElementById('shape').value;
    const strokeColor = document.getElementById('stroke').value;
    const selectedLineWidth = parseInt(document.getElementById('linewidth').value);

    // Set line width and stroke color
    ctx.lineWidth = selectedLineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = 'round';
    
    // Calculate the center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (selectedShape) {
        //draws a circle
        case 'circle':
            const radius = Math.min(canvas.width, canvas.height) / 5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            break;
        //draws a triangle 
        case 'triangle':
            const triangleSize = Math.min(canvas.width, canvas.height) / 5;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - triangleSize);
            ctx.lineTo(centerX - triangleSize, centerY + triangleSize);
            ctx.lineTo(centerX + triangleSize, centerY + triangleSize);
            ctx.closePath();
            break;
        //draws a square
        case 'square':
            const sideLength = Math.min(canvas.width, canvas.height) / 5;
            const x = centerX - sideLength / 2;
            const y = centerY - sideLength / 2;
            ctx.beginPath();
            ctx.rect(x, y, sideLength, sideLength);
            break;
    }
    ctx.stroke();
};

drawButton.addEventListener('click', drawShape); //triggers the drawShape function when button is clicked