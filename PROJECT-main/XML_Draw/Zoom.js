// Initial zoom level
var zoomFactor = 1;

// Predefined color set
var colorSet = ['#003366', '#fdde62', '#F6546A', '#F59662', '#33FFFF'];
var colorIndex = 0; // Index to select colors from the set

/**
 * Increases the zoom factor.
 * 
 * @function
 */

// Zoom in function
function zoomIn() {
    zoomFactor *= 1.2; // Increase zoom factor for zooming in
    resizeCanvas();
    redrawNodes();
}

/**
 * Decreases the zoom factor.
 * 
 * @function
 */

// Zoom out function
function zoomOut() {
    zoomFactor /= 1.2; // Decrease zoom factor for zooming out
    resizeCanvas();
    redrawNodes();
}

/**
 * Binds the zoom in and zoom out functions to dropdown options.
 * 
 * @callback onClickCallback
 * @param {Event} event - The click event.
 */

// Bind zoom in and zoom out functions to dropdown options
$('#zoomInButton').on('click', zoomIn);
$('#zoomOutButton').on('click', zoomOut);

/**
 * Resizes the canvas based on the current zoom factor.
 * 
 * @function
 */

// Resize canvas function
function resizeCanvas() {
    var newCanvasWidth = initialCanvasWidth * zoomFactor;
    var newCanvasHeight = initialCanvasHeight * zoomFactor;
    canvas.width = newCanvasWidth;
    canvas.height = newCanvasHeight;
}