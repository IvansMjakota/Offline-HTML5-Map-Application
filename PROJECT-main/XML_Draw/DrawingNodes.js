/**
 * This class defines various functions and variables related to mapping application functionalities and geo-data rendering.
 * It includes features such as defining base coordinates, initializing canvas elements, managing zoom levels, handling IndexedDB for data storage,
 * drawing nodes on the canvas, and making AJAX requests when online.
 *
 * @author [Ivans Mjakota]
 * @version 1.0
 * @since [12/04/2024]
 */
// Define base coordinates
var baseRight = -0.5332;
var baseLeft = -0.5586;
var baseTop = 51.4336;
var baseBottom = 51.4248;
var overpassUrl = 'https://overpass-api.de/api/interpreter';

// Initial canvas dimensions
var initialCanvasWidth = $(window).width();
var initialCanvasHeight = $(window).height();

// Create canvas element
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

// Initial zoom level
var zoomFactor = 1;

// Predefined color set
var colorSet = ['#003366', '#fdde62', '#F6546A', '#F59662', '#33FFFF'];
var colorIndex = 0; // Index to select colors from the set

// Map to store colors associated with tag names
var tagColorsMap = {};

// Array to store nodes
var nodes = [];

// Variable to store the color of the last drawn node
var lastNodeColor = null;

// Formulate Overpass query for the current cell
var overpassQuery = '[out:xml];' +
    '(' +
    'node(' + baseBottom + ',' + baseLeft + ',' + baseTop + ',' + baseRight + ');' +
    ');out meta;';

/**
* Function to open IndexedDB database.
*
* @return A Promise object that resolves with the IndexedDB database instance if successful, otherwise rejects with an error message.
**/

// Function to open IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('canvasDB', 1);

        request.onerror = (event) => {
            reject('Error opening database');
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('canvasData');
        };
    });
}
/**
* Function to save canvas data to IndexedDB after drawing nodes.
* Asynchronously saves canvas data to IndexedDB for persistent storage.
*/

// Function to save canvas data to IndexedDB after drawing nodes
async function saveCanvasToIndexedDB() {
    try {
        // Open IndexedDB
        const db = await openDatabase();

        // Get a transaction and object store
        const tx = db.transaction('canvasData', 'readwrite');
        const store = tx.objectStore('canvasData');

        // Convert canvas data to a data URL
        const canvasDataURL = canvas.toDataURL();

        // Save canvas data to IndexedDB
        await store.put(canvasDataURL, 'canvas');

        // Close the transaction
        await tx.done;

        // Log successful save
        console.log('Canvas saved to IndexedDB successfully.');
        console.log(canvasDataURL);
    } catch (error) {
        console.error('Error saving canvas data to IndexedDB:', error);
    }
}

/**
* Function to draw nodes and shaded areas on the canvas.
* Draws nodes based on zoom factor and canvas size, and saves canvas data to IndexedDB.

* */

// Function to draw nodes and shaded areas
function redrawNodes() {
    resizeCanvas(); // Resize canvas according to zoom factor

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nodes
    nodes.forEach(function(node) {
        ctx.fillStyle = node.color;

        // Adjust node position based on zoom factor and canvas size, including pan offset
        var scaledX = node.x * zoomFactor + panOffsetX;
        var scaledY = node.y * zoomFactor + panOffsetY;

        var nodeSize = 5 * zoomFactor; // Adjust node size based on zoom factor
        ctx.fillRect(scaledX - nodeSize / 2, scaledY - nodeSize / 2, nodeSize, nodeSize); // Draw a square for each node
    });

    // Save canvas data to IndexedDB
    saveCanvasToIndexedDB();
}

/**
* Function to extract base tag name.
*
* @param tagName The full tag name.
* @return The base tag name extracted from the full tag name.
*/

// Function to extract base tag name
function getTagBaseName(tagName) {
    // Split tag name by colon and return the first part
    var parts = tagName.split(':');
    return parts.length > 1 ? parts[0] : tagName;
}

/**
* Function to redraw canvas.
*
* @param canvasDataURL The data URL of the canvas to redraw.
*/

// Function to redraw canvas
function redrawCanvas(canvasDataURL) {
    const image = new Image();
    image.onload = function() {
        // Set canvas dimensions to match the initial canvas height and width
        canvas.width = $(window).width();
        canvas.height = $(window).height();

        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = canvasDataURL;
}

/**
* Function to check if there's an existing canvas in IndexedDB and use it.
* Asynchronously loads canvas data from IndexedDB and redraws canvas if data exists.
*/

// Check if there's an existing canvas in IndexedDB and use it
async function loadCanvasFromIndexedDB() {
    try {
        // Open IndexedDB
        const db = await openDatabase();

        // Get canvas data from IndexedDB
        const transaction = db.transaction(['canvasData'], 'readonly');
        const objectStore = transaction.objectStore('canvasData');
        const canvasDataURL = await objectStore.get('canvas');

        // If canvas data exists, redraw canvas
        if (canvasDataURL) {
            redrawCanvas(canvasDataURL);
            console.log('Canvas loaded from IndexedDB successfully.');
            console.log(canvasDataURL);
        }
    } catch (error) {
        console.error('Error loading canvas data from IndexedDB:', error);
    }
}
// Add event listener for when the connection status changes
window.addEventListener('online', () => {
    console.log('Back online');
    // Redraw canvas if necessary
    redrawNodes();
});

/**
* Event listener triggered when the connection status changes to offline.
* Logs went offline message.
*/

// Add event listener for when the connection status changes
window.addEventListener('offline', () => {
    console.log('Went offline');
    // Do something when the connection goes offline, if needed
});

/**
* Function to handle AJAX request when online.
* Makes an AJAX request to the Overpass API and processes the XML response to draw nodes on the canvas.
*/

// Function to handle AJAX request when online
function makeAjaxRequestIfOnline() {
    if (navigator.onLine) {
        $.ajax({
            type: 'POST',
            url: overpassUrl,
            data: {
                data: overpassQuery
            },
            dataType: 'xml',
            success: function(xml) {
                // Extract nodes from XML response
                $(xml).find("node").each(function(index, node) {
                    var lat = parseFloat($(node).attr("lat"));
                    var lon = parseFloat($(node).attr("lon"));
                    var scaledLat = (1 - ((baseTop - lat) / (baseTop - baseBottom))) * initialCanvasHeight;
                    var scaledLon = ((lon - baseLeft) / (baseRight - baseLeft)) * initialCanvasWidth;

                    var tags = $(node).find("tag");
                    if (tags.length > 0) {
                        tags.each(function(index, tag) {
                            var tagName = $(tag).attr("k"); // Get the tag name
                            var baseTagName = getTagBaseName(tagName);
                            var color = tagColorsMap[baseTagName] || colorSet[colorIndex++ % colorSet.length]; // Check if base tag name has already been assigned a color
                            if (!tagColorsMap[tagName]) { // Check if full tag name is already assigned
                                tagColorsMap[tagName] = color; // Assign color to full tag name
                                console.log("Assigned color " + tagColorsMap[tagName] + " to tag: " + tagName); // Log color assignment
                            }
                            lastNodeColor = tagColorsMap[tagName]; // Set the color of the last drawn node
                        });
                    }

                    nodes.push({
                        x: scaledLon,
                        y: scaledLat,
                        color: lastNodeColor || colorSet[colorIndex++ % colorSet.length] // If no tag color, assign a color from the set
                    });
                }); // Draw nodes
                redrawNodes();
            },
            error: function(xhr, status, error) {
                console.error('Error occurred when fetching data:', error);
            }
        });
    } else {
        console.log('Page is offline. Skipping AJAX request.');
    }
}

// Call the function to make AJAX request when online
makeAjaxRequestIfOnline();