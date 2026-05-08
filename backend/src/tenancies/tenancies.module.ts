import { Module } from '@nestjs/common';
import { TenanciesService } from './tenancies.service';
import { TenanciesController } from './tenancies.controller';

@Module({
  providers: [TenanciesService],
  controllers: [TenanciesController],
  exports: [TenanciesService],
})
export class TenanciesModule {}
