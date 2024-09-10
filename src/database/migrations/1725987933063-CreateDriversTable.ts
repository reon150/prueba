import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDriversTable1725987933063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE drivers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR NOT NULL,
          license_number VARCHAR NOT NULL,
          email VARCHAR NOT NULL UNIQUE,
          phone_number VARCHAR NOT NULL UNIQUE,
          is_available BOOLEAN NOT NULL DEFAULT TRUE,
          location_latitude DOUBLE PRECISION,
          location_longitude DOUBLE PRECISION,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS drivers`);
  }
}
