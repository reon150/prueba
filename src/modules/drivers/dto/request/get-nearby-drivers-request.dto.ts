import { IsNumber, IsOptional, Min, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetNearbyDriversRequestDto {
  @ApiProperty({
    example: 40.7128,
    description: 'Latitude of the location to find nearby drivers.',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: -74.006,
    description: 'Longitude of the location to find nearby drivers.',
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    example: 5,
    description:
      'Radius in kilometers within which to search for nearby drivers. Optional.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  radius?: number;

  @ApiProperty({
    example: 10,
    description:
      'Number of drivers to return if no radius is provided. Required if radius is not provided.',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @ValidateIf((o) => o.radius === undefined)
  count?: number;
}
