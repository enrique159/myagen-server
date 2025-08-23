import { Module } from '@nestjs/common';
import { ElementsService } from './elements.service';
import { ElementsController } from './elements.controller';

@Module({
  providers: [ElementsService],
  controllers: [ElementsController]
})
export class ElementsModule {}
