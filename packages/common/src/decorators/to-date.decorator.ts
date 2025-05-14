import { Transform } from 'class-transformer';

export const ToDate = Transform(({ value }) => new Date(value), { toClassOnly: true });
