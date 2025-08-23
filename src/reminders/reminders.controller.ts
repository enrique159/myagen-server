import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { Reminder } from './reminder.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  // Create a new reminder
  @Post()
  async create(@Body(new ValidationPipe()) reminder: CreateReminderDto) {
    return this.remindersService.create(reminder);
  }

  // Find all reminders for a task
  @Get('task/:taskId')
  async findAllByTask(@Param('taskId') taskId: string) {
    return this.remindersService.findAllByTask(taskId);
  }

  // Find all reminders for a user by date range
  @Get('user/:userId/date-range')
  async findAllByDateRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.remindersService.findAllByDateRange(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  // Find a reminder by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  // Update a reminder
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) reminder: UpdateReminderDto) {
    return this.remindersService.update(id, reminder);
  }

  // Delete a reminder
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.remindersService.delete(id);
  }
}
