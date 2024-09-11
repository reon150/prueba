import { Trip } from '../entities/trip.entity';
import {
  GetTripsResponseDto,
  GetTripsDriverResponseDto,
  GetTripsPassengerResponseDto,
  UpdateTripResponseDto,
  CreateTripResponseDto,
} from '../dto';

export class TripToDtoMapper {
  static toGetTripsResponseDto(trip: Trip): GetTripsResponseDto {
    return {
      id: trip.id,
      driver: {
        id: trip.driverId,
        name: trip.driver.name,
      } as GetTripsDriverResponseDto,
      passenger: {
        id: trip.passengerId,
        name: trip.passenger.name,
      } as GetTripsPassengerResponseDto,
      startLatitude: trip.startLatitude,
      startLongitude: trip.startLongitude,
      endLatitude: trip.endLatitude,
      endLongitude: trip.endLongitude,
      status: trip.status,
    };
  }

  static toGetTripsResponseDtos(trips: Trip[]): GetTripsResponseDto[] {
    return trips.map((trip) => this.toGetTripsResponseDto(trip));
  }

  static toCreateTripResponseDto(trip: Trip): CreateTripResponseDto {
    return {
      id: trip.id,
      driverId: trip.driverId,
      passengerId: trip.passengerId,
      startLatitude: trip.startLatitude,
      startLongitude: trip.startLongitude,
      endLatitude: trip.endLatitude,
      endLongitude: trip.endLongitude,
      status: trip.status,
      createdAt: trip.createdAt.toISOString(),
    };
  }

  static toUpdateTripResponseDto(trip: Trip): UpdateTripResponseDto {
    return {
      id: trip.id,
      driverId: trip.driverId,
      passengerId: trip.passengerId,
      startLatitude: trip.startLatitude,
      startLongitude: trip.startLongitude,
      endLatitude: trip.endLatitude,
      endLongitude: trip.endLongitude,
      status: trip.status,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
    };
  }
}
