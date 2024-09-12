import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { Driver } from 'src/modules/drivers/entities';
import { Passenger } from 'src/modules/passengers/entities';
import { Trip } from 'src/modules/trips/entities';
import { faker } from '@faker-js/faker';
import { TripStatus } from 'src/modules/trips/enums';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  await seedData(dataSource);
  await app.close();
}

async function seedData(dataSource: DataSource): Promise<void> {
  const driversRepository: Repository<Driver> =
    dataSource.getRepository(Driver);
  const passengersRepository: Repository<Passenger> =
    dataSource.getRepository(Passenger);
  const tripsRepository: Repository<Trip> = dataSource.getRepository(Trip);

  const santoDomingoCenter: [number, number] = [18.486058, -69.931212];

  // Create drivers
  let drivers = Array(57)
    .fill(null)
    .map(() => {
      const [locationLatitude, locationLongitude] =
        faker.location.nearbyGPSCoordinate({
          origin: santoDomingoCenter,
          radius: 15,
          isMetric: true,
        });
      return driversRepository.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        licenseNumber: faker.vehicle.vrm(),
        isAvailable: faker.datatype.boolean(),
        locationLatitude,
        locationLongitude,
      });
    });
  drivers = await driversRepository.save(drivers);

  // Create passengers
  let passengers = Array(1352)
    .fill(null)
    .map(() =>
      passengersRepository.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
      }),
    );
  passengers = await passengersRepository.save(passengers);

  // Create trips
  const trips = Array(5723)
    .fill(null)
    .map(() => {
      let selectedDriver: Driver;
      let selectedPassenger: Passenger;

      // Select the trip status first
      const status = faker.helpers.arrayElement(Object.values(TripStatus));

      // If the trip status is 'Active', select an available driver not already on an active trip
      if (status === TripStatus.Active) {
        do {
          selectedDriver = faker.helpers.arrayElement(drivers);
        } while (
          !selectedDriver.isAvailable ||
          trips.some(
            (trip) =>
              trip.driver === selectedDriver &&
              trip.status === TripStatus.Active,
          )
        );
      } else {
        selectedDriver = faker.helpers.arrayElement(drivers);
      }

      // Ensure the passenger is not currently on an active trip
      if (status === TripStatus.Active) {
        do {
          selectedPassenger = faker.helpers.arrayElement(passengers);
        } while (
          trips.some(
            (trip) =>
              trip.passenger === selectedPassenger &&
              trip.status === TripStatus.Active,
          )
        );
      }

      const [startLatitude, startLongitude] =
        faker.location.nearbyGPSCoordinate({
          origin: [
            selectedDriver.locationLatitude,
            selectedDriver.locationLongitude,
          ],
          radius: 10,
          isMetric: true,
        });

      const tripDetails: Partial<Trip> = {
        driver: selectedDriver,
        passenger: selectedPassenger,
        startLatitude,
        startLongitude,
        startTime: faker.date.recent(),
        status,
        endLatitude: null,
        endLongitude: null,
        endTime: null,
      };

      // If the status is 'Completed', add end location and end time
      if (status === TripStatus.Completed) {
        const [endLatitude, endLongitude] = faker.location.nearbyGPSCoordinate({
          origin: [startLatitude, startLongitude],
          radius: 10,
          isMetric: true,
        });
        tripDetails.endLatitude = endLatitude;
        tripDetails.endLongitude = endLongitude;
        tripDetails.endTime = faker.date.future();
      }

      return tripsRepository.create(tripDetails);
    });

  // Save all entities to the database
  await driversRepository.save(drivers);
  await passengersRepository.save(passengers);
  await tripsRepository.save(trips);
}

runSeeder();
