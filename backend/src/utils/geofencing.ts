export interface GeoPoint {
  lat: number;
  lng: number;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371000;
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isWithinRadius(
  userLocation: GeoPoint,
  officeLocation: GeoPoint,
  maxRadiusMeters: number = 100
): boolean {
  const distance = calculateDistance(userLocation, officeLocation);
  return distance <= maxRadiusMeters;
}
