import { createParamDecorator } from '@nestjs/common';

/**
 * Usuario autenticado que viaja dentro del JWT: { id, email, rol }.
 * Uso en un controlador: @Bind(UsuarioActual()).
 */
export const UsuarioActual = createParamDecorator((_dato, ctx) => ctx.switchToHttp().getRequest().user);
