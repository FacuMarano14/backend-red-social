// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no roles required
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.perfil) {
      throw new ForbiddenException('No autorizado: rol requerido');
    }

    const has = requiredRoles.includes(user.perfil);
    if (!has) {
      throw new ForbiddenException('Acceso denegado: no posee rol requerido');
    }
    return true;
  }
}
