import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@Controller('todo-lists')
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  // Create a new todo list
  @Post()
  async create(@Body(new ValidationPipe()) todoList: CreateTodoListDto) {
    return this.todoListsService.create(todoList);
  }

  // Find all todo lists for an element
  @Get('element/:elementId')
  async findAllByElement(@Param('elementId') elementId: string) {
    return this.todoListsService.findAllByElement(elementId);
  }

  // Find a todo list by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoListsService.findOne(id);
  }

  // Update a todo list
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) todoList: UpdateTodoListDto) {
    return this.todoListsService.update(id, todoList);
  }

  // Delete a todo list
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.todoListsService.delete(id);
  }
}
