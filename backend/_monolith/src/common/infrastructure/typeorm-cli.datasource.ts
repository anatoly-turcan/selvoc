import { DataSource } from 'typeorm';

import { typeormConfig } from './config';

export default new DataSource({
  ...typeormConfig,
  entities: [
    'src/modules/user/infrastructure/persistence/*.typeorm-entity.ts',
    'src/modules/chat/infrastructure/persistence/entities/*.typeorm-entity.ts',
  ],
  migrations: ['src/**/persistence/migrations/*.{ts,js}'],
});
