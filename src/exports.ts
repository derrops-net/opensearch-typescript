
export type GeoPoint = {
    lon: number;
    lat: number;
}

export type Location = {
    "type": "envelope",
    "coordinates": [number, number][]
}