import { GetDriversResponseDto, GetNearbyDriversResponseDto } from '../dto';
import { Driver } from '../entities/driver.entity';

export class DriverToDtoMapper {
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
