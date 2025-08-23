import { Module } from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { TodoListsController } from './todo-lists.controller';

@Module({
  providers: [TodoListsService],
  controllers: [TodoListsController]
})
export class TodoListsModule {}
