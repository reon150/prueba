import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePassengersTable1725987933064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE passengers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR NOT NULL,
          email VARCHAR NOT NULL UNIQUE,
          phone_number VARCHAR NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS passengers`);
  }
}
