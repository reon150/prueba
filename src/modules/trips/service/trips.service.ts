import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTripRequestDto,
  GetInvoiceResponseDto,
  GetTripsRequestDto,
  GetTripsResponseDto,
  UpdateTripRequestDto,
  UpdateTripResponseDto,
} from '../dto';
import { Trip } from '../entities';
import { getLimitValue, PaginationResponseDto } from 'src/common';
import { InvoiceToDtoMapper, TripToDtoMapper } from '../mappers';
import { InvoicesService } from 'src/modules/invoices/service/Invoices.service';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripsRepository: Repository<Trip>,
    private readonly invoicesService: InvoicesService,
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
  ): Promise<CreateTripRequestDto> {
    const trip = this.tripsRepository.create(createTripRequestDto);

    const tripSaved = await this.tripsRepository.save(trip);

    return TripToDtoMapper.toCreateTripResponseDto(tripSaved);
  }

  async update(
    id: string,
    updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<UpdateTripResponseDto> {
    const trip = await this.tripsRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    Object.assign(trip, updateTripRequestDto);

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
}
