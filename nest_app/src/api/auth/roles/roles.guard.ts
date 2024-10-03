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
    
  
    // If no roles are defined, grant access without role checking
    if (!roles) {
      return true
    }
    // test if role is in UserGroup table 
    const request = context.switchToHttp().getRequest()
    const payload = await this.JwtService.verifyAsync(request.cookies.jwt)
    const user = await this.UserService.getUserById(payload.userId)

    if (!user.groupId) {
      throw new UnauthorizedException('User is not in correct group.');
    }
    
    const role = this.GroupService.getGroupById(user.groupId)
    console.log(role)

  

  
    return true;
  }
}
