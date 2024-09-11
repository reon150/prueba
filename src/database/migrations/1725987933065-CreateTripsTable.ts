import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTripsTable1725987933065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "trip_status_enum" AS ENUM('active', 'completed')`,
    );

    await queryRunner.query(`
      CREATE TABLE trips (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          driver_id UUID REFERENCES drivers(id),
          passenger_id UUID REFERENCES passengers(id) NOT NULL,
          start_latitude DOUBLE PRECISION NOT NULL,
          start_longitude DOUBLE PRECISION NOT NULL,
          end_latitude DOUBLE PRECISION,
          end_longitude DOUBLE PRECISION,
          start_time TIMESTAMP WITH TIME ZONE,
          end_time TIMESTAMP WITH TIME ZONE,
          status "trip_status_enum" NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS trips`);
  }
}
