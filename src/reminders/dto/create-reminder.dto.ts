import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsUUID()
  taskId: string;

  @IsNotEmpty()
  @IsDateString()
  reminderDate: string;
}
