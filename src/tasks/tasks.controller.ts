import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Create a new task
  @Post()
  async create(@Body(new ValidationPipe()) task: CreateTaskDto) {
    return this.tasksService.create(task);
  }

  // Find all tasks for a todo list
  @Get('list/:listId')
  async findAllByList(@Param('listId') listId: string) {
    return this.tasksService.findAllByList(listId);
  }

  // Find a task by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // Update a task
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) task: UpdateTaskDto) {
    return this.tasksService.update(id, task);
  }

  // Delete a task
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  // Toggle task completion status
  @Patch(':id/toggle')
  async toggleComplete(@Param('id') id: string) {
    return this.tasksService.toggleComplete(id);
  }
}
