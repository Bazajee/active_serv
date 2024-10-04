import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { UsersService } from 'src/core/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { GroupService } from 'src/group/group.service';



@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private JwtService: JwtService,
    private UserService: UsersService,
    private GroupService: GroupService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const allGroup = await this.GroupService.getAllGroup()
    if (!roles) {
      return true
    }
    roles.forEach(role => {
      if ( !allGroup.includes(role) ) {
        throw new UnauthorizedException('Role setup for this function is not correctly')}
    })

    const request = context.switchToHttp().getRequest()
    const payload =  await this.JwtService.verify(request.cookies.jwt)
    const user =  await this.UserService.getUserById(payload.userId)
    if (!user.groupId) {
      throw new UnauthorizedException('User is not in correct group.');
    }

    const userRole = await this.GroupService.getGroupById(user.groupId)
    if (roles.includes(userRole.group)){
      return true
    }    
    // design table to give possibilie to an admin to create group, and activate and deactivate functionality for specific group
  }
}
