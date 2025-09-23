import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsUUID()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  reminderDate: string;
}
