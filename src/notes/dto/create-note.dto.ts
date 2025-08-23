import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsUUID()
  elementId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
