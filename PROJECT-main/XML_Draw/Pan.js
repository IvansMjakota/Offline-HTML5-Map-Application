/**
 * Class representing panning functionality for a canvas element.
 * Tracks mouse movement to enable panning across the canvas.
 */

// Variables for panning functionality
var isPanning = false;
var panStartX = 0;
var panStartY = 0;
var panOffsetX = 0;
var panOffsetY = 0;

/**
 * Event listener triggered when the mouse button is pressed down on the canvas.
 * Sets the flag to indicate panning and records the starting position of the mouse.
 * 
 * @param {MouseEvent} event - The mouse event object containing information about the event.
 */

// Add event listeners for mouse down, move, and up events
canvas.addEventListener('mousedown', function(event) {
    isPanning = true;
    panStartX = event.clientX;
    panStartY = event.clientY;
});

/**
 * Event listener triggered when the mouse is moved over the canvas.
 * If panning is active, calculates the amount of movement and updates the pan offset.
 * Redraws the nodes after panning.
 * 
 * @param {MouseEvent} event - The mouse event object containing information about the event.
 */

canvas.addEventListener('mousemove', function(event) {
    if (isPanning) {
        var deltaX = event.clientX - panStartX;
        var deltaY = event.clientY - panStartY;
        panOffsetX += deltaX;
        panOffsetY += deltaY;
        panStartX = event.clientX;
        panStartY = event.clientY;
        redrawNodes();
    }
});

/**
 * Event listener triggered when the mouse button is released on the canvas.
 * Resets the flag indicating panning to false.
 * 
 * @param {MouseEvent} event - The mouse event object containing information about the event.
 */

canvas.addEventListener('mouseup', function(event) {
    isPanning = false;
});