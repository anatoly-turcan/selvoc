import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExpressJwtOptions, passportJwtSecret } from 'jwks-rsa';
import {
  BaseStrategyOptions,
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
  StrategyOptionsWithRequest,
} from 'passport-jwt';

export type JwksStrategyOptions = {
  jwks: ExpressJwtOptions;
  jwt?: Partial<BaseStrategyOptions>;
};

@Injectable()
export class JwksStrategy extends PassportStrategy(Strategy) {
  constructor(options: JwksStrategyOptions) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      ...options.jwt,
      secretOrKeyProvider: passportJwtSecret(options.jwks),
    } satisfies StrategyOptionsWithoutRequest | StrategyOptionsWithRequest);
  }

  public validate(payload: unknown): unknown {
    return payload;
  }
}
