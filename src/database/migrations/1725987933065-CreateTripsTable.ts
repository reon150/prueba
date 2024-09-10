import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTripsTable1725987933065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE trips (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          driver_id UUID REFERENCES drivers(id),
          passenger_id UUID REFERENCES passengers(id),
          start_latitude DOUBLE PRECISION,
          start_longitude DOUBLE PRECISION,
          end_latitude DOUBLE PRECISION,
          end_longitude DOUBLE PRECISION,
          start_time TIMESTAMP WITH TIME ZONE,
          end_time TIMESTAMP WITH TIME ZONE,
          status VARCHAR CHECK (status IN ('active', 'completed')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS trips`);
  }
}
