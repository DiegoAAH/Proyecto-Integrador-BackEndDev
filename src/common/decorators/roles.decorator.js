import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Roles que pueden usar una ruta, por ejemplo @Roles(Rol.VENDEDOR, Rol.ADMIN). */
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
