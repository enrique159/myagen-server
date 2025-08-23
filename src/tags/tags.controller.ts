import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // Create a new tag
  @Post()
  async create(@Body(new ValidationPipe()) tag: CreateTagDto) {
    return this.tagsService.create(tag);
  }

  // Find all tags for a user
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.tagsService.findAllByUser(userId);
  }

  // Find a tag by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  // Update a tag
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) tag: UpdateTagDto) {
    return this.tagsService.update(id, tag);
  }

  // Delete a tag
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }

  // Find all elements for a tag
  @Get(':id/elements')
  async findElementsByTag(@Param('id') id: string) {
    return this.tagsService.findElementsByTag(id);
  }
}
