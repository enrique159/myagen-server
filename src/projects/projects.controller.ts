import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserToken } from '@/users/domain/user';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Create a new project
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body(new ValidationPipe()) project: CreateProjectDto, @Req() req: Request & { user: UserToken }) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.projectsService.create({ ...project, userId });
  }

  // Find all projects
  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.projectsService.findAll();
  }

  // Find a project by id
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // Update a project
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body(new ValidationPipe()) project: UpdateProjectDto) {
    return this.projectsService.update(id, project);
  }

  // Delete a project
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
