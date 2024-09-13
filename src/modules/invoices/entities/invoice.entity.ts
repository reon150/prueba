import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentStatus } from '../enums';
import { Trip } from 'src/modules/trips/entities';
import { BaseEntity } from 'src/common';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id', type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.id)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;
}
