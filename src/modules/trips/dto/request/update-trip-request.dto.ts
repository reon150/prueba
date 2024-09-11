import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTripRequestDto } from './create-trip-request.dto';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { TripStatus } from '../../enums';

export class UpdateTripRequestDto extends PartialType(CreateTripRequestDto) {
  @ApiProperty({
    description: 'The current status of the trip',
    enum: TripStatus,
    example: TripStatus.Completed,
    required: false,
  })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiProperty({
    description: 'End latitude of the trip',
    type: Number,
    example: 40.73061,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  endLatitude?: number;

  @ApiProperty({
    description: 'End longitude of the trip',
    type: Number,
    example: -73.935242,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  endLongitude?: number;
}
