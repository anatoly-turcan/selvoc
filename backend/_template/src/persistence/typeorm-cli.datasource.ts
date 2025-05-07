import 'dotenv/config';

import { DataSource } from 'typeorm';

import { typeormConfig } from '../config/typeorm.config';

export default new DataSource({
  ...typeormConfig,
  entities: ['src/modules/rename/infrastructure/persistence/entities/*.typeorm-entity.ts'],
  migrations: ['src/persistence/migrations/*.{ts,js}'],
});
