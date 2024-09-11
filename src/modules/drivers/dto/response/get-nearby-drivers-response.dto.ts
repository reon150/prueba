import { ApiProperty } from '@nestjs/swagger';

export class GetNearbyDriversResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the driver in UUID format.',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the driver.',
  })
  name: string;

  @ApiProperty({
    example: 'D1234567',
    description:
      'License number of the driver which is unique and issued by the transport authority.',
  })
  licenseNumber: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number of the driver.',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 40.7127,
    description: "Current latitude of the driver's location.",
  })
  locationLatitude: number;

  @ApiProperty({
    example: -74.0059,
    description: "Current longitude of the driver's location.",
  })
  locationLongitude: number;

  @ApiProperty({
    example: 1.5,
    description:
      'Calculated distance from the specified location to the driver, in kilometers.',
  })
  distance: number;
}
