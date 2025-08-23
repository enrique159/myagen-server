import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '@/users/user.entity';
import { Element } from '@/elements/element.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Element)
    private readonly elementRepository: Repository<Element>,
  ) {}

  /**
   * @description Create a new tag
   * @param { CreateTagDto } tag
   * @returns { Promise<Tag> }
   */
  async create(tag: CreateTagDto & { userId: string }): Promise<Tag> {
    const user = await this.userRepository.findOne({
      where: { id: tag.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${tag.userId} not found`);
    }

    const newTag = this.tagRepository.create({
      name: tag.name,
      color: tag.color,
      user,
    });

    return this.tagRepository.save(newTag);
  }

  /**
   * @description Find all tags for a user
   * @param { string } userId
   * @returns { Promise<Tag[]> }
   */
  async findAllByUser(userId: string): Promise<Tag[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.tagRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'elements'],
    });
  }

  /**
   * @description Find a tag by id
   * @param { string } id
   * @returns { Promise<Tag | null> }
   */
  async findOne(id: string): Promise<Tag | null> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['user', 'elements'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  /**
   * @description Update a tag
   * @param { string } id
   * @param { UpdateTagDto } tag
   * @returns { Promise<Tag | null> }
   */
  async update(id: string, tag: UpdateTagDto): Promise<Tag | null> {
    const existingTag = await this.findOne(id);
    
    if (!existingTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return this.tagRepository.save({ ...existingTag, ...tag, id });
  }

  /**
   * @description Delete a tag
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    const tag = await this.findOne(id);
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    
    await this.tagRepository.delete(id);
  }

  /**
   * @description Find all elements for a tag
   * @param { string } tagId
   * @returns { Promise<Element[]> }
   */
  async findElementsByTag(tagId: string): Promise<Element[]> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['elements'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    return tag.elements;
  }
}
