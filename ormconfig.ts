import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';

const appConfigService = new AppConfigService();

const isProduction = appConfigService.appEnv === 'production';

const baseConfig = {
  type: 'postgres' as const,
  url: appConfigService.dbUrl,
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
