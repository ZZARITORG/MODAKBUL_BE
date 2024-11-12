import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequentGroupService } from './frequent-group.service';
import { FrequentGroupController } from './frequent-group.controller';
@Module({
  providers: [FrequentGroupService],
  controllers: [FrequentGroupController],
})
export class FrequentGroupModule {}
