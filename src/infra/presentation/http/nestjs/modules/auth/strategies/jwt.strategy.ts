import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Env } from '@/shared/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Env.SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };
  }
}
