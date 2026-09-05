/**
 * Generates src/lib/data/plz_coords.json
 * Source: https://github.com/WZBSocialScienceCenter/plz_geocoord/blob/master/plz_geocoord.csv
 * Format: { "10115": [lat, lon], ... }
 *
 * Run: node scripts/generate_plz_coords.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CSV_URL = 'https://raw.githubusercontent.com/WZBSocialScienceCenter/plz_geocoord/master/plz_geocoord.csv';
const OUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'data', 'plz_coords.json');

console.log('Downloading PLZ geocoordinates...');

https.get(CSV_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error('HTTP error:', res.statusCode, data.slice(0, 200));
            process.exit(1);
        }

        const lines = data.trim().split('\n');
        const header = lines[0].split(',');
        console.log('Columns:', header);

        const plzIdx = header.findIndex(h => h.trim().toLowerCase().includes('plz') || h.trim() === 'plz');
        const latIdx = header.findIndex(h => h.trim().toLowerCase() === 'lat');
        const lonIdx = header.findIndex(h => h.trim().toLowerCase() === 'lon' || h.trim().toLowerCase() === 'lng');

        console.log(`Indices — plz:${plzIdx} lat:${latIdx} lon:${lonIdx}`);

        const result = {};
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length < 3) continue;
            const plz = cols[plzIdx]?.trim().replace(/"/g, '');
            const lat = parseFloat(cols[latIdx]?.trim());
            const lon = parseFloat(cols[lonIdx]?.trim());
            if (plz && !isNaN(lat) && !isNaN(lon)) {
                result[plz] = [lat, lon];
                count++;
            }
        }

        fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
        fs.writeFileSync(OUT_FILE, JSON.stringify(result), 'utf8');
        console.log(`Written ${count} PLZ entries to ${OUT_FILE}`);
        console.log(`File size: ${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} KB`);
    });
}).on('error', err => {
    console.error('Network error:', err.message);
    process.exit(1);
});
