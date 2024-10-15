import { Global, Module } from '@nestjs/common';
import { GroupService } from './group.service';

@Global()
@Module({
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {}
