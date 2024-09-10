import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';

const appConfigService = AppConfigService.create();

const isProduction = appConfigService.appEnv === 'production';

const baseConfig = {
  type: 'postgres' as const,
  host: appConfigService.dbHost,
  port: appConfigService.dbPort,
  username: appConfigService.dbUsername,
  password: appConfigService.dbPassword,
  database: appConfigService.dbName,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: isProduction ? (['error', 'schema'] as LoggerOptions) : true,
};

export const ormConfig: TypeOrmModuleOptions = {
  ...baseConfig,
  autoLoadEntities: true,
};

export const dataSourceConfig: DataSourceOptions = {
  ...baseConfig,
};

export const AppDataSource = new DataSource(dataSourceConfig);
