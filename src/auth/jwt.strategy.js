import { Dependencies, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
@Dependencies(ConfigService)
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  /** Lo que devuelve este método queda disponible como request.user. */
  validate(payload) {
    if (!payload?.sub) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  }
}
