import { BaseEntity } from 'src/common';
import { Trip } from 'src/modules/trips/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'drivers' })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'license_number' })
  licenseNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({
    name: 'location_latitude',
    type: 'double precision',
    nullable: true,
  })
  locationLatitude: number;

  @Column({
    name: 'location_longitude',
    type: 'double precision',
    nullable: true,
  })
  locationLongitude: number;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: Trip[];
}
