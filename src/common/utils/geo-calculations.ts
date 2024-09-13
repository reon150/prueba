export const convertDegreesToRadians = (degrees: number): number =>
  (degrees * Math.PI) / 180;

// Calculate distance between two geo points using Haversine
export const calculateAngularDistance = (
  latitudeDifference: number,
  longitudeDifference: number,
  startLatitude: number,
  endLatitude: number,
): number => {
  const haversineFormulaComponent =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(convertDegreesToRadians(startLatitude)) *
      Math.cos(convertDegreesToRadians(endLatitude)) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  return (
    2 *
    Math.atan2(
      Math.sqrt(haversineFormulaComponent),
      Math.sqrt(1 - haversineFormulaComponent),
    )
  );
};
