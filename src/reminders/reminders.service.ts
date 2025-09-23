import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from './reminder.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Task } from '@/tasks/task.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * @description Create a new reminder
   * @param { CreateReminderDto } reminder
   * @returns { Promise<Reminder> }
   */
  async create(reminder: CreateReminderDto): Promise<Reminder> {
    const task = await this.taskRepository.findOne({
      where: { id: reminder.taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${reminder.taskId} not found`);
    }

    const newReminder = this.reminderRepository.create({
      date: reminder.reminderDate,
      task,
    });

    return this.reminderRepository.save(newReminder);
  }

  /**
   * @description Find all reminders for a task
   * @param { string } taskId
   * @returns { Promise<Reminder[]> }
   */
  async findAllByTask(taskId: string): Promise<Reminder[]> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return this.reminderRepository.find({
      where: { task: { id: taskId } },
      relations: ['task'],
    });
  }

  /**
   * @description Find all reminders for a user by date range
   * @param { string } userId
   * @param { Date } startDate
   * @param { Date } endDate
   * @returns { Promise<Reminder[]> }
   */
  async findAllByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Reminder[]> {
    return this.reminderRepository
      .createQueryBuilder('reminder')
      .leftJoinAndSelect('reminder.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.element', 'element')
      .innerJoin('element.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('reminder.date >= :startDate', { startDate })
      .andWhere('reminder.date <= :endDate', { endDate })
      .andWhere('reminder.notified = :notified', { notified: false })
      .orderBy('reminder.date', 'ASC')
      .getMany();
  }

  /**
   * @description Find a reminder by id
   * @param { string } id
   * @returns { Promise<Reminder | null> }
   */
  async findOne(id: string): Promise<Reminder | null> {
    const reminder = await this.reminderRepository.findOne({
      where: { id },
      relations: ['task'],
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    return reminder;
  }

  /**
   * @description Update a reminder
   * @param { string } id
   * @param { UpdateReminderDto } reminder
   * @returns { Promise<Reminder | null> }
   */
  async update(id: string, reminder: UpdateReminderDto): Promise<Reminder | null> {
    const existingReminder = await this.findOne(id);
    if (!existingReminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    return this.reminderRepository.save({ ...existingReminder, ...reminder });
  }

  /**
   * @description Delete a reminder
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    const reminder = await this.findOne(id);
    
    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }
    
    await this.reminderRepository.delete(id);
  }
}
