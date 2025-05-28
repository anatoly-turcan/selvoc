import { get } from 'env-var';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export type TypeormConfig = DataSourceOptions;

const postgresSslCert = get('POSTGRES_SSL_CERT').asString();

export const typeormConfig: TypeormConfig = {
  type: 'postgres',
  host: get('POSTGRES_HOST').required().asString(),
  port: get('POSTGRES_PORT').required().asIntPositive(),
  username: get('POSTGRES_USERNAME').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DATABASE').required().asString(),
  ssl: postgresSslCert ? { ca: postgresSslCert } : undefined,
  migrationsRun: true,
  synchronize: false,
  logging: ['error', 'migration', 'schema'],
  entities: [],
  migrations: ['dist/**/persistence/migrations/*.js'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  poolSize: get('POSTGRES_POOL_SIZE').required().asIntPositive(),
};
