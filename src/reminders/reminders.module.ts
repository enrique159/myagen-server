import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { Reminder } from './reminder.entity';
import { Task } from '@/tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, Task])],
  providers: [RemindersService],
  controllers: [RemindersController],
  exports: [RemindersService],
})
export class RemindersModule {}
