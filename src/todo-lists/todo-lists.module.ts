import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoListsService } from './todo-lists.service';
import { TodoListsController } from './todo-lists.controller';
import { TodoList } from './todo-list.entity';
import { Element } from '@/elements/element.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList, Element])],
  providers: [TodoListsService],
  controllers: [TodoListsController],
  exports: [TodoListsService],
})
export class TodoListsModule {}
