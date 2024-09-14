import { UUIDValidationPipe } from './uuid-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('UUIDValidationPipe', () => {
  let pipe: UUIDValidationPipe;

  beforeEach(() => {
    pipe = new UUIDValidationPipe();
  });

  it('should pass with a valid UUID', () => {
    const validUUID = '0c10ad47-6dad-4b5f-bb51-cf3a80c0e1ce';
    expect(pipe.transform(validUUID)).toEqual(validUUID);
  });

  it('should fail with a completely invalid UUID', () => {
    const invalidUUID = '12345';
    expect(() => pipe.transform(invalidUUID)).toThrow(BadRequestException);
    expect(() => pipe.transform(invalidUUID)).toThrow('Invalid UUID format');
  });

  it('should fail with an incorrectly formatted UUID', () => {
    const incorrectlyFormattedUUID = '0c10ad47-6dad-4b5f-bb51-zz3a80c0e10e';
    expect(() => pipe.transform(incorrectlyFormattedUUID)).toThrow(
      BadRequestException,
    );
    expect(() => pipe.transform(incorrectlyFormattedUUID)).toThrow(
      'Invalid UUID format',
    );
  });
});
