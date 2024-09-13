import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTripRequestDto,
  CreateTripResponseDto,
  GetInvoiceResponseDto,
  GetTripsRequestDto,
  GetTripsResponseDto,
  UpdateTripRequestDto,
  UpdateTripResponseDto,
} from '../dto';
import { Trip } from '../entities';
import { InvoiceToDtoMapper, TripToDtoMapper } from '../mappers';
import { TripStatus } from '../enums';
import { DriversService } from '../../drivers/service/drivers.service';
import { InvoicesService } from '../../invoices/service/Invoices.service';
import { PassengersService } from '../../passengers/service/passengers.service';
import { getLimitValue, PaginationResponseDto } from '../../../common';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripsRepository: Repository<Trip>,
    private readonly invoicesService: InvoicesService,
    private readonly driversService: DriversService,
    private readonly passengersService: PassengersService,
  ) {}

  async findAll(
    query: GetTripsRequestDto,
  ): Promise<PaginationResponseDto<GetTripsResponseDto>> {
    query.limit = getLimitValue(query.limit);

    const { driverId, passengerId, status, page, limit } = query;

    const qb = this.tripsRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.passenger', 'passenger');

    if (driverId) {
      qb.andWhere('trip.driverId = :driverId', { driverId });
    }

    if (passengerId) {
      qb.andWhere('trip.passengerId = :passengerId', { passengerId });
    }

    if (status) {
      qb.andWhere('trip.status = :status', { status });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const basePath = 'trips';
    const trips = TripToDtoMapper.toGetTripsResponseDtos(data);

    return new PaginationResponseDto(
      trips,
      total,
      query.page,
      query.limit,
      basePath,
    );
  }

  async create(
    createTripRequestDto: CreateTripRequestDto,
  ): Promise<CreateTripResponseDto> {
    await this.validateTripCreate(createTripRequestDto);

    const trip = this.tripsRepository.create(createTripRequestDto);
    trip.status = TripStatus.Active;

    const tripSaved = await this.tripsRepository.save(trip);

    return TripToDtoMapper.toCreateTripResponseDto(tripSaved);
  }

  async update(
    id: string,
    updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<UpdateTripResponseDto> {
    const trip = await this.tripsRepository.findOne({ where: { id } });

    await this.validateTripUpdate(trip, updateTripRequestDto);

    Object.assign(trip, updateTripRequestDto);

    if (updateTripRequestDto.status === TripStatus.Completed) {
      this.invoicesService.create(trip);
    }

    const tripSaved = await this.tripsRepository.save(trip);

    return TripToDtoMapper.toUpdateTripResponseDto(tripSaved);
  }

  async findInvoiceByTripId(
    tripId: string,
  ): Promise<GetInvoiceResponseDto | null> {
    const invoice = await this.invoicesService.findOneByTripId(tripId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return InvoiceToDtoMapper.toGetInvoiceResponseDto(invoice);
  }

  private async validateTripCreate(
    createTripRequestDto: CreateTripRequestDto,
  ): Promise<void> {
    const driverExists = await this.driversService.driverExists(
      createTripRequestDto.driverId,
    );
    if (!driverExists) {
      throw new NotFoundException('Driver not found');
    }

    const isDriverAvailable = await this.driversService.isDriverAvailable(
      createTripRequestDto.driverId,
    );
    if (!isDriverAvailable) {
      throw new BadRequestException('Driver is not available');
    }

    const passengerExists = await this.passengersService.passengerExists(
      createTripRequestDto.passengerId,
    );
    if (!passengerExists) {
      throw new NotFoundException('Passenger not found');
    }
  }

  private async validateTripUpdate(
    trip: Trip,
    updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<void> {
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (
      trip.status === TripStatus.Completed ||
      trip.status === TripStatus.Canceled
    ) {
      throw new ConflictException(
        'Completed or Canceled trips cannot be modified',
      );
    }

    if (updateTripRequestDto.status === TripStatus.Completed) {
      if (
        !updateTripRequestDto.endTime ||
        updateTripRequestDto.endLatitude === undefined ||
        updateTripRequestDto.endLongitude === undefined
      ) {
        throw new BadRequestException(
          'End time and coordinates must be provided for completed trips',
        );
      }
    }
  }
}
