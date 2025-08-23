import { IsDateString, IsOptional } from 'class-validator';

export class UpdateReminderDto {
  @IsOptional()
  @IsDateString()
  reminderDate?: string;
}
