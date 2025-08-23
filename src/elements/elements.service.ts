import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Element } from './element.entity';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { User } from '@/users/user.entity';
import { Project } from '@/projects/project.entity';
import { Tag } from '@/tags/tag.entity';

@Injectable()
export class ElementsService {
  constructor(
    @InjectRepository(Element)
    private readonly elementRepository: Repository<Element>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * @description Create a new element
   * @param { CreateElementDto } element
   * @returns { Promise<Element> }
   */
  async create(element: CreateElementDto): Promise<Element> {
    const user = await this.userRepository.findOne({
      where: { id: element.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${element.userId} not found`);
    }

    const newElement = this.elementRepository.create({
      title: element.title,
      assignedDate: element.assignedDate,
      user,
    });

    if (element.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: element.projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${element.projectId} not found`);
      }

      newElement.project = project;
    }

    return this.elementRepository.save(newElement);
  }

  /**
   * @description Find all elements for a user
   * @param { string } userId
   * @returns { Promise<Element[]> }
   */
  async findAllByUser(userId: string): Promise<Element[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.elementRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'project', 'tags', 'notes', 'lists'],
    });
  }

  /**
   * @description Find all elements for a project
   * @param { string } projectId
   * @returns { Promise<Element[]> }
   */
  async findAllByProject(projectId: string): Promise<Element[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.elementRepository.find({
      where: { project: { id: projectId } },
      relations: ['user', 'project', 'tags', 'notes', 'lists'],
    });
  }

  /**
   * @description Find an element by id
   * @param { string } id
   * @returns { Promise<Element | null> }
   */
  async findOne(id: string): Promise<Element | null> {
    const element = await this.elementRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'tags', 'notes', 'lists'],
    });

    if (!element) {
      throw new NotFoundException(`Element with ID ${id} not found`);
    }

    return element;
  }

  /**
   * @description Update an element
   * @param { string } id
   * @param { UpdateElementDto } element
   * @returns { Promise<Element | null> }
   */
  async update(id: string, element: UpdateElementDto): Promise<Element | null> {
    const existingElement = await this.findOne(id);
    
    if (!existingElement) {
      throw new NotFoundException(`Element with ID ${id} not found`);
    }

    // Handle project update if provided
    if (element.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: element.projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${element.projectId} not found`);
      }

      existingElement.project = project;
    }

    // Update other fields
    if (element.title) existingElement.title = element.title;
    if (element.assignedDate) existingElement.assignedDate = element.assignedDate;

    return this.elementRepository.save(existingElement);
  }

  /**
   * @description Delete an element
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    const element = await this.findOne(id);
    
    if (!element) {
      throw new NotFoundException(`Element with ID ${id} not found`);
    }
    
    await this.elementRepository.delete(id);
  }

  /**
   * @description Add tags to an element
   * @param { string } elementId
   * @param { string[] } tagIds
   * @returns { Promise<Element> }
   */
  async addTags(elementId: string, tagIds: string[]): Promise<Element> {
    const element = await this.findOne(elementId);
    
    if (!element) {
      throw new NotFoundException(`Element with ID ${elementId} not found`);
    }

    const tags = await Promise.all(
      tagIds.map(async (tagId) => {
        const tag = await this.tagRepository.findOne({ where: { id: tagId } });
        if (!tag) {
          throw new NotFoundException(`Tag with ID ${tagId} not found`);
        }
        return tag;
      })
    );

    // Add new tags to the element's existing tags
    if (!element.tags) {
      element.tags = [];
    }
    
    element.tags = [...element.tags, ...tags];
    return this.elementRepository.save(element);
  }

  /**
   * @description Remove tags from an element
   * @param { string } elementId
   * @param { string[] } tagIds
   * @returns { Promise<Element> }
   */
  async removeTags(elementId: string, tagIds: string[]): Promise<Element> {
    const element = await this.findOne(elementId);
    
    if (!element) {
      throw new NotFoundException(`Element with ID ${elementId} not found`);
    }

    if (!element.tags) {
      return element;
    }

    element.tags = element.tags.filter(tag => !tagIds.includes(tag.id));
    return this.elementRepository.save(element);
  }
}
