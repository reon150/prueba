import {
  GetDriverResponseDto,
  GetDriversResponseDto,
  GetNearbyDriversResponseDto,
} from '../dto';
import { Driver } from '../entities/driver.entity';

export class DriverToDtoMapper {
  static toGetDriverResponseDto(driver: Driver): GetDriverResponseDto {
    return {
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      isAvailable: driver.isAvailable,
      locationLatitude: driver.locationLatitude,
      locationLongitude: driver.locationLongitude,
      trips:
        driver.trips?.map((trip) => ({
          id: trip.id,
          passenger: {
            id: trip.passenger.id,
            name: trip.passenger.name,
          },
          startLatitude: trip.startLatitude,
          startLongitude: trip.startLongitude,
          endLatitude: trip.endLatitude,
          endLongitude: trip.endLongitude,
          startTime: trip.startTime,
          endTime: trip.endTime,
        })) || [],
    };
  }

  static toGetNearbyDriversResponseDto(
    drivers: any[],
  ): GetNearbyDriversResponseDto[] {
    return drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phoneNumber: driver.phoneNumber,
      locationLatitude: driver.locationLatitude,
      locationLongitude: driver.locationLongitude,
      distance: driver.distance,
    }));
  }

  static toGetDriversResponseDto(drivers: Driver[]): GetDriversResponseDto[] {
    return drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phoneNumber: driver.phoneNumber,
      email: driver.email,
      isAvailable: driver.isAvailable,
      locationLatitude: driver.locationLatitude,
      locationLongitude: driver.locationLongitude,
      createdAt: driver.createdAt,
    }));
  }
}
