import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Element } from './element.entity';
import { UpdateElementDto } from './dto/update-element.dto';
import { User } from '@/users/user.entity';
import { Project } from '@/projects/project.entity';
import { Tag } from '@/tags/tag.entity';
import dayjs from 'dayjs';

const setAssignedDate = (date: Date) => {
  const today = dayjs().format('YYYY-MM-DD');
  const assignedDate = dayjs(date).format('YYYY-MM-DD');
  return assignedDate + ' 12:00:00';
};

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
  async create(element: Partial<Element & { userId: string, projectId?: string }>): Promise<Element> {
    const user = await this.userRepository.findOne({
      where: { id: element.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${element.userId} not found`);
    }

    const newElement = this.elementRepository.create({
      assignedDate: setAssignedDate(element.assignedDate!),
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
   * @description Find elements with filters
   * @param { string } userId - Required user ID
   * @param { Date } [assignedDate] - Optional date filter (defaults to current date)
   * @param { string } [projectId] - Optional project ID filter
   * @returns { Promise<Element[]> }
   */
  async findElements(
    userId: string,
    assignedDate?: Date,
    projectId?: string,
  ): Promise<Element[]> {
    // Validate user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Use current date if not provided
    const filterDate = assignedDate || new Date();
    
    // Format date to match database format (YYYY-MM-DD)
    const formattedDate = filterDate.toISOString().split('T')[0];

    // Build where conditions
    const whereConditions: any = {
      user: { id: userId },
      assignedDate: formattedDate,
    };

    // Add project filter if provided
    if (projectId) {
      // Validate project exists
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      whereConditions.project = { id: projectId };
    }

    return this.elementRepository.find({
      where: whereConditions,
      relations: ['user', 'project', 'tags', 'lists', 'lists.tasks', 'lists.tasks.reminder'],
    });
  }

  /**
   * @description Find elements that match the search query in title, tags, or list content
   * @param { string } userId - Required user ID
   * @param { string } query - Search query
   * @returns { Promise<Element[]> }
   */
  async searchElements(userId: string, query: string): Promise<Element[]> {
    // Validate user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create query builder to search across multiple related entities
    return this.elementRepository
      .createQueryBuilder('element')
      .leftJoinAndSelect('element.user', 'user')
      .leftJoinAndSelect('element.project', 'project')
      .leftJoinAndSelect('element.tags', 'tags')
      .leftJoinAndSelect('element.lists', 'lists')
      .leftJoinAndSelect('lists.tasks', 'tasks')
      .leftJoinAndSelect('tasks.reminder', 'reminder')
      .where('element.user_id = :userId', { userId })
      .andWhere(
        '(element.title LIKE :query OR tags.name LIKE :query OR lists.content LIKE :query)',
        { query: `%${query}%` }
      )
      .getMany();
  }

  /**
   * @description Get all elements from a user, all or by project, by year as an array of months and elements with the assigned day
   * The idea of this endpoint is to show markers in a calendar of the frontend and the user can see the elements of a specific month
   * @param { string } userId - Required user ID
   * @param { string } year - Required year
   * @param { string | undefined } projectId - Optional project ID
   * @returns { Promise<Array<Pick<Element, 'id' | 'title' | 'assignedDate'>>> }
   */
  async getElementsByUserAndYear(userId: string, year: string, projectId?: string): Promise<Array<Pick<Element, 'id' | 'title' | 'assignedDate'>>> {
    // search elements by user, project and year
    const whereConditions: any = {
      user: { id: userId },
    };

    // Add project filter if provided
    if (projectId) {
      // Validate project exists
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      whereConditions.project = { id: projectId };
    }

    const elements = await this.elementRepository.find({
      where: whereConditions,
    });
    return elements.map(element => ({
      id: element.id,
      title: element.title,
      assignedDate: element.assignedDate,
    })).filter(element => dayjs(element.assignedDate).year() === parseInt(year));
  }

  /**
   * @description Find all elements for a user (legacy method)
   * @param { string } userId
   * @returns { Promise<Element[]> }
   * @deprecated Use findElements instead
   */
  async findAllByUser(userId: string): Promise<Element[]> {
    return this.findElements(userId);
  }

  /**
   * @description Find all elements for a project (legacy method)
   * @param { string } projectId
   * @returns { Promise<Element[]> }
   * @deprecated Use findElements instead
   */
  async findAllByProject(projectId: string): Promise<Element[]> {
    // We need a userId for this method, but since it's a legacy method and we don't have it,
    // we'll get the project first and then find elements by project
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['user'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.findElements(project.user.id, undefined, projectId);
  }

  /**
   * @description Find an element by id
   * @param { string } id
   * @returns { Promise<Element | null> }
   */
  async findOne(id: string): Promise<Element | null> {
    const element = await this.elementRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'tags', 'lists'],
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

    // Initialize tags array if it doesn't exist
    if (!element.tags) {
      element.tags = [];
    }

    // Get existing tag IDs to avoid duplicates
    const existingTagIds = element.tags.map(tag => tag.id);

    // Filter out tag IDs that are already associated with the element
    const newTagIds = tagIds.filter(tagId => !existingTagIds.includes(tagId));

    // If there are no new tags to add, return the element as is
    if (newTagIds.length === 0) {
      return element;
    }

    // Fetch only the new tags
    const newTags = await Promise.all(
      newTagIds.map(async (tagId) => {
        const tag = await this.tagRepository.findOne({ where: { id: tagId } });
        if (!tag) {
          throw new NotFoundException(`Tag with ID ${tagId} not found`);
        }
        return tag;
      })
    );

    // Add new tags to the element's existing tags
    element.tags = [...element.tags, ...newTags];
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
