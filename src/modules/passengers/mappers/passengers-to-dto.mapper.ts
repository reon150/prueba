import { GetPassengerResponseDto, GetPassengersResponseDto } from '../dto';
import { Passenger } from '../entities/passenger.entity';

export class PassengerToDtoMapper {
  static toGetPassengerResponseDto(
    passenger: Passenger,
  ): GetPassengerResponseDto {
    return {
      id: passenger.id,
      name: passenger.name,
      email: passenger.email,
      phoneNumber: passenger.phoneNumber,
      trips: passenger.trips.map((trip) => ({
        id: trip.id,
        driver: {
          id: trip.driver.id,
          name: trip.driver.name,
        },
        startLatitude: trip.startLatitude,
        startLongitude: trip.startLongitude,
        endLatitude: trip.endLatitude,
        endLongitude: trip.endLongitude,
        startTime: trip.startTime,
        endTime: trip.endTime,
      })),
    };
  }

  static toGetPassengersResponseDto(
    passengers: Passenger[],
  ): GetPassengersResponseDto[] {
    return passengers.map((passenger) => ({
      id: passenger.id,
      name: passenger.name,
      email: passenger.email,
      phoneNumber: passenger.phoneNumber,
      createdAt: passenger.createdAt,
      updatedAt: passenger.updatedAt,
    }));
  }
}
