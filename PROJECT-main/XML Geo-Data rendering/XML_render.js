$(document).ready(function () {
    //Overpass API URL
    var overpassUrl = 'https://overpass-api.de/api/interpreter';

    //Overpass query 
    var overpassQuery = '[out:xml];(node(40.775,-73.975,40.778,-73.971);way(40.775,-73.975,40.778,-73.971);rel(40.775,-73.975,40.778,-73.971););out meta;';

    //Makes an AJAX Request to fetch the XML data from the Overpass API using jQuery 
    $.ajax({
        type: 'POST',
        url: overpassUrl,
        data: {
            data: overpassQuery
        },
        dataType: 'xml',
        success: function (xml) {
            // <pre> element to maintain formatting and add XML data to it
            var element = document.createElement('element');
            element.textContent = new XMLSerializer().serializeToString(xml);

            // Add the <pre> element to the xmlContainer 
            $('#xmlContainer').html(element);
        },
        error: function (message, error, status) {
            console.error('Error occurred when fetching the Overpass XML:', error, status);
        }
    });
});