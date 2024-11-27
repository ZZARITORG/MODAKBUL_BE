import { Module } from '@nestjs/common';
import { FrequentGroupController } from './frequent-group.controller';
import { FrequentGroupService } from './frequent-group.service';
@Module({
  providers: [FrequentGroupService],
  controllers: [FrequentGroupController],
})
export class FrequentGroupModule {}
