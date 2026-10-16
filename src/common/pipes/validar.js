import { ValidationPipe } from '@nestjs/common';

/**
 * Valida y transforma un body o query con las reglas del DTO indicado.
 * Uso en un controlador: @Bind(Body(validar(CrearTiendaDto))).
 *
 * En TypeScript Nest deduce el DTO a partir del tipo del parámetro; en JavaScript
 * no existe esa información, así que se le indica explícitamente con expectedType.
 */
export function validar(Dto) {
  return new ValidationPipe({
    expectedType: Dto,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
}
