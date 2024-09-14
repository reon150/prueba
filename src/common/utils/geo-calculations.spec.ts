import {
  calculateAngularDistance,
  calculateDistanceInKm,
  convertDegreesToRadians,
} from './geo-calculations';

describe('Geo calculations', () => {
  describe('convertDegreesToRadians', () => {
    it('should convert 180 degrees to PI radians', () => {
      const radians = convertDegreesToRadians(180);
      expect(radians).toBeCloseTo(Math.PI);
    });

    it('should convert 360 degrees to 2 * PI radians', () => {
      const radians = convertDegreesToRadians(360);
      expect(radians).toBeCloseTo(2 * Math.PI);
    });

    it('should convert 90 degrees to PI/2 radians', () => {
      const radians = convertDegreesToRadians(90);
      expect(radians).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('calculateAngularDistance', () => {
    it('should calculate angular distance for the same point', () => {
      const angularDistance = calculateAngularDistance(0, 0, 0, 0);
      expect(angularDistance).toBe(0);
    });

    it('should calculate angular distance for antipodal points', () => {
      const angularDistance = calculateAngularDistance(0, 0, 0, 180);
      expect(angularDistance).toBeCloseTo(Math.PI);
    });

    it('should calculate angular distance between equatorial points 90 degrees apart', () => {
      const angularDistance = calculateAngularDistance(0, 0, 0, 90);
      expect(angularDistance).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('calculateDistanceInKm', () => {
    it('should calculate distance in kilometers for the same point', () => {
      const distance = calculateDistanceInKm(0, 0, 0, 0);
      expect(distance).toBe(0);
    });

    it('should calculate distance in kilometers for antipodal points on the equator', () => {
      const distance = calculateDistanceInKm(0, 0, 0, 180);
      expect(distance).toBeCloseTo((2 * Math.PI * 6371) / 2);
    });

    it('should calculate distance in kilometers between equatorial points 90 degrees apart', () => {
      const distance = calculateDistanceInKm(0, 0, 0, 90);
      expect(distance).toBeCloseTo((Math.PI * 6371) / 2);
    });
  });
});
