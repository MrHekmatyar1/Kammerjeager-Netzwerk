const https = require('https');
const CSV_URL = 'https://raw.githubusercontent.com/WZBSocialScienceCenter/plz_geocoord/master/plz_geocoord.csv';
https.get(CSV_URL, function(res) {
    var data = '';
    res.on('data', function(c) { data += c; });
    res.on('end', function() {
        var lines = data.split('\n');
        console.log('Line 0:', JSON.stringify(lines[0]));
        console.log('Line 1:', JSON.stringify(lines[1]));
        console.log('Line 2:', JSON.stringify(lines[2]));
    });
});
