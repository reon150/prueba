export const convertDegreesToRadians = (degrees: number): number =>
  (degrees * Math.PI) / 180;

// Calculate distance between two geo points using Haversine
export const calculateAngularDistance = (
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
): number => {
  const latitudeDifference = convertDegreesToRadians(
    endLatitude - startLatitude,
  );
  const longitudeDifference = convertDegreesToRadians(
    endLongitude - startLongitude,
  );

  const haversineFormulaComponent =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(convertDegreesToRadians(startLatitude)) *
      Math.cos(convertDegreesToRadians(endLatitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return (
    2 *
    Math.atan2(
      Math.sqrt(haversineFormulaComponent),
      Math.sqrt(1 - haversineFormulaComponent),
    )
  );
};

// Calculate distance between two geo points in kilometers
export const calculateDistanceInKm = (
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
): number => {
  const angularDistance = calculateAngularDistance(
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
  );

  // Earth's average radius in kilometers
  const earthRadiusKm = 6371;

  return angularDistance * earthRadiusKm;
};
