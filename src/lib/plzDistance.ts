/**
 * Haversine distance between two German PLZ codes.
 * Uses a bundled static JSON of ~8300 German postal codes with lat/lon coordinates.
 * Source: WZB Social Science Center / plz_geocoord dataset
 */

// We use a require-style import to avoid the large JSON ending up in client bundles.
// This file must only be imported in server-side code (API routes, server actions).
import plzData from './data/plz_coords.json';

type PlzCoords = Record<string, [number, number]>;
const PLZ_COORDS: PlzCoords = plzData as unknown as PlzCoords;

/**
 * Calculate the Haversine great-circle distance in kilometers
 * between two [lat, lon] points.
 */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns the distance in km between two PLZ codes.
 * Returns Infinity if either PLZ is not found in the dataset.
 */
export function distanceBetweenPlz(plz1: string, plz2: string): number {
    const coord1 = PLZ_COORDS[plz1.trim()];
    const coord2 = PLZ_COORDS[plz2.trim()];
    if (!coord1 || !coord2) return Infinity;
    return haversineKm(coord1[0], coord1[1], coord2[0], coord2[1]);
}

/**
 * Returns true if the distance between two PLZ codes is within `maxKm` km.
 * Falls back to true (accept) if either PLZ is unknown, to avoid missing leads.
 */
export function isWithinRadius(plzMaster: string, plzLead: string, maxKm = 4): boolean {
    const d = distanceBetweenPlz(plzMaster, plzLead);
    // If we don't know one of the PLZs, fall back to PLZ prefix match
    if (d === Infinity) return plzLead.startsWith(plzMaster.slice(0, 3));
    return d <= maxKm;
}
