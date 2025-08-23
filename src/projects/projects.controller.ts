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
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Create a new project
  @Post()
  async create(@Body(new ValidationPipe()) project: CreateProjectDto) {
    return this.projectsService.create(project);
  }

  // Find all projects
  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  // Find a project by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // Update a project
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) project: UpdateProjectDto) {
    return this.projectsService.update(id, project);
  }

  // Delete a project
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
