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
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // Create a new note
  @Post()
  async create(@Body(new ValidationPipe()) note: CreateNoteDto) {
    return this.notesService.create(note);
  }

  // Find all notes for an element
  @Get('element/:elementId')
  async findAllByElement(@Param('elementId') elementId: string) {
    return this.notesService.findAllByElement(elementId);
  }

  // Find a note by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  // Update a note
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) note: UpdateNoteDto) {
    return this.notesService.update(id, note);
  }

  // Delete a note
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }
}
