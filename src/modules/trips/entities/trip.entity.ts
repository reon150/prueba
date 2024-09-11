import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TripStatus } from '../enums';
import { Passenger } from 'src/modules/passengers/entities';
import { Driver } from 'src/modules/drivers/entities';
import { BaseEntity } from 'src/common';

@Entity({ name: 'trips' })
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'driver_id', type: 'uuid' })
  driverId: string;

  @ManyToOne(() => Driver, (driver) => driver.trips)
  driver: Driver;

  @Column({ name: 'passenger_id', type: 'uuid' })
  passengerId: string;

  @ManyToOne(() => Passenger, (passenger) => passenger.trips)
  @JoinColumn({ name: 'passenger_id' })
  passenger: Passenger;

  @Column({ name: 'start_latitude', type: 'double precision' })
  startLatitude: number;

  @Column({ name: 'start_longitude', type: 'double precision' })
  startLongitude: number;

  @Column({ name: 'end_latitude', type: 'double precision', nullable: true })
  endLatitude: number;

  @Column({ name: 'end_longitude', type: 'double precision', nullable: true })
  endLongitude: number;

  @Column({
    name: 'start_time',
    type: 'timestamp with time zone',
    nullable: true,
  })
  startTime: Date;

  @Column({
    name: 'end_time',
    type: 'timestamp with time zone',
    nullable: true,
  })
  endTime: Date;

  @Column({ type: 'enum', enum: TripStatus })
  status: TripStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
