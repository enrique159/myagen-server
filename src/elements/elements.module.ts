import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElementsService } from './elements.service';
import { ElementsController } from './elements.controller';
import { Element } from './element.entity';
import { User } from '@/users/user.entity';
import { Project } from '@/projects/project.entity';
import { Tag } from '@/tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Element, User, Project, Tag])],
  providers: [ElementsService],
  controllers: [ElementsController],
  exports: [ElementsService],
})
export class ElementsModule {}
