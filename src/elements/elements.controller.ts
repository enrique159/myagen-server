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
import { ElementsService } from './elements.service';
import { Element } from './element.entity';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementDto } from './dto/update-element.dto';

@Controller('elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  // Create a new element
  @Post()
  async create(@Body(new ValidationPipe()) element: CreateElementDto) {
    return this.elementsService.create(element);
  }

  // Find all elements for a user
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.elementsService.findAllByUser(userId);
  }

  // Find all elements for a project
  @Get('project/:projectId')
  async findAllByProject(@Param('projectId') projectId: string) {
    return this.elementsService.findAllByProject(projectId);
  }

  // Find an element by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.elementsService.findOne(id);
  }

  // Update an element
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) element: UpdateElementDto) {
    return this.elementsService.update(id, element);
  }

  // Delete an element
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.elementsService.delete(id);
  }

  // Add tags to an element
  @Post(':id/tags')
  async addTags(@Param('id') id: string, @Body() body: { tagIds: string[] }) {
    return this.elementsService.addTags(id, body.tagIds);
  }

  // Remove tags from an element
  @Delete(':id/tags')
  async removeTags(@Param('id') id: string, @Body() body: { tagIds: string[] }) {
    return this.elementsService.removeTags(id, body.tagIds);
  }
}
