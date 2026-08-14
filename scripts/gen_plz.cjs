const https = require('https');
const fs = require('fs');
const path = require('path');

const CSV_URL = 'https://raw.githubusercontent.com/WZBSocialScienceCenter/plz_geocoord/master/plz_geocoord.csv';
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'data', 'plz_coords.json');

https.get(CSV_URL, function(res) {
    var data = '';
    res.on('data', function(c) { data += c; });
    res.on('end', function() {
        if (res.statusCode !== 200) { console.error('HTTP ' + res.statusCode); process.exit(1); }
        // Format: ,lat,lng  (first col = PLZ, no header name)
        var lines = data.trim().split('\n');
        var result = {};
        var count = 0;
        for (var i = 1; i < lines.length; i++) {
            var cols = lines[i].split(',');
            if (cols.length < 3) continue;
            var plz = cols[0].trim();
            var lat = parseFloat(cols[1]);
            var lon = parseFloat(cols[2]);
            if (plz && !isNaN(lat) && !isNaN(lon)) {
                result[plz] = [lat, lon];
                count++;
            }
        }
        fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
        fs.writeFileSync(OUT_FILE, JSON.stringify(result), 'utf8');
        var kb = (fs.statSync(OUT_FILE).size / 1024).toFixed(1);
        console.log('OK ' + count + ' PLZ entries, ' + kb + 'KB');
        console.log('Sample:', JSON.stringify(Object.entries(result).slice(0, 3)));
    });
}).on('error', function(e) { console.error('NET', e.message); process.exit(1); });
