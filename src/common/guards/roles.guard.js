import { Dependencies, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
@Dependencies(Reflector)
export class RolesGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }

  canActivate(ctx) {
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!roles?.length) return true;
    const usuario = ctx.switchToHttp().getRequest().user;
    return roles.includes(usuario?.rol);
  }
}
