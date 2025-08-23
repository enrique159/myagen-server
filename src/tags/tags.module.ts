import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './tag.entity';
import { User } from '@/users/user.entity';
import { Element } from '@/elements/element.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User, Element])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
