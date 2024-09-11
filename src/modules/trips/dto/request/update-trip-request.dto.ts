import { PartialType } from '@nestjs/swagger';
import { CreateTripRequestDto } from './create-trip-request.dto';

export class UpdateTripRequestDto extends PartialType(CreateTripRequestDto) {}
