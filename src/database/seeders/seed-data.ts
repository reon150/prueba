import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { Driver } from '../../modules/drivers/entities';
import { Passenger } from '../../modules/passengers/entities';
import { Invoice } from '../../modules/invoices/entities';
import { Trip } from '../../modules/trips/entities';
import { TripStatus } from '../../modules/trips/enums';
import { PaymentStatus } from '../../modules/invoices/enums';
import { faker } from '@faker-js/faker';

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
  const invoicesRepository: Repository<Invoice> =
    dataSource.getRepository(Invoice);

  // Check if data already exists
  const driverCount = await driversRepository.count();
  const passengerCount = await passengersRepository.count();
  const tripCount = await tripsRepository.count();
  const invoiceCount = await invoicesRepository.count();

  // If there is already data, skip seeding
  if (
    driverCount > 0 ||
    passengerCount > 0 ||
    tripCount > 0 ||
    invoiceCount > 0
  ) {
    console.log('Data already exists, skipping seeding.');
    return;
  }

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
        phoneNumber: faker.phone.number({ style: 'international' }),
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
        phoneNumber: faker.phone.number({ style: 'international' }),
      }),
    );
  passengers = await passengersRepository.save(passengers);

  // Create trips
  let trips: Trip[] = [];
  let noEligiblePassengersOrDrivers = false;
  for (let i = 0; i < 5723; i++) {
    let selectedPassenger: Passenger;
    let selectedDriver: Driver;
    let status: TripStatus;

    if (!noEligiblePassengersOrDrivers) {
      status = TripStatus.Active;

      const availableDrivers = drivers.filter(
        (driver) =>
          driver.isAvailable &&
          !trips.some(
            (trip) =>
              trip.driver.id === driver.id && trip.status === TripStatus.Active,
          ),
      );

      const eligiblePassengers = passengers.filter(
        (passenger) =>
          !trips.some(
            (trip) =>
              trip.passenger.id === passenger.id &&
              trip.status === TripStatus.Active,
          ),
      );

      selectedDriver = faker.helpers.arrayElement(availableDrivers);
      selectedPassenger = faker.helpers.arrayElement(eligiblePassengers);

      if (availableDrivers.length === 1 || eligiblePassengers.length === 1) {
        noEligiblePassengersOrDrivers = true;
      }
    } else {
      const weightedStatuses = [
        ...Array(17).fill(TripStatus.Completed),
        TripStatus.Canceled,
      ];
      status = faker.helpers.arrayElement(weightedStatuses);
      selectedDriver = faker.helpers.arrayElement(drivers);
      selectedPassenger = faker.helpers.arrayElement(passengers);
    }

    const [startLatitude, startLongitude] = faker.location.nearbyGPSCoordinate({
      origin: [
        selectedDriver.locationLatitude,
        selectedDriver.locationLongitude,
      ],
      radius: 10,
      isMetric: true,
    });

    const trip = {
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

    if (status === TripStatus.Completed) {
      const [endLatitude, endLongitude] = faker.location.nearbyGPSCoordinate({
        origin: [startLatitude, startLongitude],
        radius: 10,
        isMetric: true,
      });
      trip.endLatitude = endLatitude;
      trip.endLongitude = endLongitude;
      trip.endTime = faker.date.future();
    }

    trips.push(tripsRepository.create(trip));
  }
  trips = await tripsRepository.save(trips);

  const invoices: Invoice[] = trips
    .filter((trip) => trip.status === TripStatus.Completed)
    .map((trip) => {
      return invoicesRepository.create({
        trip,
        amount: parseFloat(
          faker.finance.amount({ min: 100, max: 2000, dec: 2 }),
        ),
        paymentStatus: faker.helpers.arrayElement(Object.values(PaymentStatus)),
      });
    });
  await invoicesRepository.save(invoices);
}

runSeeder();
