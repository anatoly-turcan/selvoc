import { DataSource } from 'typeorm';

import { typeormConfig } from './config';

export default new DataSource({
  ...typeormConfig,
  entities: ['src/modules/**/persistence/*.typeorm-entity.ts'],
  migrations: ['src/**/persistence/migrations/*.{ts,js}'],
});
