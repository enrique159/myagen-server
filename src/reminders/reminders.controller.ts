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
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { UserToken } from '@/users/domain/user';

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
  @Get('user/date-range')
  async findAllByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: Request & { user: UserToken }
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
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
