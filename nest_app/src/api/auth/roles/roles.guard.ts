import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // get user id in cookie and user instance 

    if (!roles) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const cookies = request.cookies;
      console.log('test-role ',request, cookies)
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const cookies = request.cookies;
    console.log(request, cookies)

    if (!user) {
      throw new UnauthorizedException('You are not logged in');
    }

    const hasRole = roles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
