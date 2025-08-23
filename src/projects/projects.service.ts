import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * @description Create a new project
   * @param { CreateProjectDto } project
   * @returns { Promise<Project> }
   */
  async create(project: CreateProjectDto): Promise<Project> {
    return this.projectRepository.save(project);
  }

  /**
   * @description Find all projects
   * @returns { Promise<Project[]> }
   */
  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  /**
   * @description Find a project by id
   * @param { string } id
   * @returns { Promise<Project | null> }
   */
  async findOne(id: string): Promise<Project | null> {
    return this.projectRepository.findOne({ where: { id } });
  }

  /**
   * @description Update a project
   * @param { string } id
   * @param { UpdateProjectDto } project
   * @returns { Promise<Project | null> }
   */
  async update(id: string, project: UpdateProjectDto): Promise<Project | null> {
    return this.projectRepository.save({ ...project, id });
  }

  /**
   * @description Delete a project
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
