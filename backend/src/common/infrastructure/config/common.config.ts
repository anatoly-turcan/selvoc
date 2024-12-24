import 'dotenv/config';
import { typeormConfig, TypeormConfig } from './typeorm.config';

export type CommonConfig = {
  typeorm: TypeormConfig;
};

export function loadCommonConfig(): CommonConfig {
  return {
    typeorm: typeormConfig,
  };
}
