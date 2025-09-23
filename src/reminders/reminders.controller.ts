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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { UserToken } from '@/users/domain/user';
import dayjs from 'dayjs';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  // Create a new reminder
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body(new ValidationPipe()) reminder: CreateReminderDto) {
    return this.remindersService.create(reminder);
  }

  // Find all reminders for a task
  @Get('task/:taskId')
  @UseGuards(AuthGuard)
  async findAllByTask(@Param('taskId') taskId: string) {
    return this.remindersService.findAllByTask(taskId);
  }

  // Find all reminders for a user by date range
  @Get('user/date-range')
  @UseGuards(AuthGuard)
  async findAllByDateRange(
    @Req() req: Request & { user: UserToken },
    @Query('startDate') startDate: string | undefined,
    @Query('endDate') endDate: string | undefined,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    const customStartDate = startDate ? new Date(startDate) : dayjs().subtract(1, 'week').startOf('day').toDate();
    const customEndDate = endDate ? new Date(endDate) : dayjs().add(3, 'month').endOf('day').toDate();
    return this.remindersService.findAllByDateRange(
      userId,
      customStartDate,
      customEndDate,
    );
  }

  // Find a reminder by id
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  // Update a reminder
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body(new ValidationPipe()) reminder: UpdateReminderDto) {
    return this.remindersService.update(id, reminder);
  }

  // Delete a reminder
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.remindersService.delete(id);
  }
}
