import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Element } from '@/elements/element.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Element)
    private readonly elementRepository: Repository<Element>,
  ) {}

  /**
   * @description Create a new note
   * @param { CreateNoteDto } note
   * @returns { Promise<Note> }
   */
  async create(note: CreateNoteDto): Promise<Note> {
    const element = await this.elementRepository.findOne({
      where: { id: note.elementId },
    });

    if (!element) {
      throw new NotFoundException(`Element with ID ${note.elementId} not found`);
    }

    const newNote = this.noteRepository.create({
      content: note.content,
      element,
    });

    return this.noteRepository.save(newNote);
  }

  /**
   * @description Find all notes for an element
   * @param { string } elementId
   * @returns { Promise<Note[]> }
   */
  async findAllByElement(elementId: string): Promise<Note[]> {
    const element = await this.elementRepository.findOne({
      where: { id: elementId },
    });

    if (!element) {
      throw new NotFoundException(`Element with ID ${elementId} not found`);
    }

    return this.noteRepository.find({
      where: { element: { id: elementId } },
      relations: ['element'],
    });
  }

  /**
   * @description Find a note by id
   * @param { string } id
   * @returns { Promise<Note | null> }
   */
  async findOne(id: string): Promise<Note | null> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['element'],
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  /**
   * @description Update a note
   * @param { string } id
   * @param { UpdateNoteDto } note
   * @returns { Promise<Note | null> }
   */
  async update(id: string, note: UpdateNoteDto): Promise<Note | null> {
    const existingNote = await this.findOne(id);
    
    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return this.noteRepository.save({ ...existingNote, ...note, id });
  }

  /**
   * @description Delete a note
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    const note = await this.findOne(id);
    
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    
    await this.noteRepository.delete(id);
  }
}
