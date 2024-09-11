import { BaseEntity } from 'src/common';
import { Trip } from 'src/modules/trips/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'passengers' })
export class Passenger extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @OneToMany(() => Trip, (trip) => trip.passenger)
  trips: Trip[];
}
