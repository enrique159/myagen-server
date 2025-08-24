import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoList } from '@/todo-lists/todo-list.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
  ) {}

  /**
   * @description Create a new task
   * @param { CreateTaskDto } task
   * @returns { Promise<Task> }
   */
  async create(task: CreateTaskDto): Promise<Task> {
    const list = await this.todoListRepository.findOne({
      where: { id: task.listId },
    });

    if (!list) {
      throw new NotFoundException(`TodoList with ID ${task.listId} not found`);
    }

    const newTask = this.taskRepository.create({
      description: task.description,
      list,
    });

    return this.taskRepository.save(newTask);
  }

  /**
   * @description Find all tasks for a todo list
   * @param { string } listId
   * @returns { Promise<Task[]> }
   */
  async findAllByList(listId: string): Promise<Task[]> {
    const list = await this.todoListRepository.findOne({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException(`TodoList with ID ${listId} not found`);
    }

    return this.taskRepository.find({
      where: { list: { id: listId } },
      relations: ['list', 'reminder'],
    });
  }

  /**
   * @description Find a task by id
   * @param { string } id
   * @returns { Promise<Task | null> }
   */
  async findOne(id: string): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['list', 'reminder'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * @description Update a task
   * @param { string } id
   * @param { UpdateTaskDto } task
   * @returns { Promise<Task | null> }
   */
  async update(id: string, task: UpdateTaskDto): Promise<Task | null> {
    const existingTask = await this.findOne(id);
    
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.taskRepository.save({ ...existingTask, ...task, id });
  }

  /**
   * @description Delete a task
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    const task = await this.findOne(id);
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    await this.taskRepository.delete(id);
  }

  /**
   * @description Toggle task completion status
   * @param { string } id
   * @returns { Promise<Task> }
   */
  async toggleComplete(id: string): Promise<Task> {
    const task = await this.findOne(id);
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    task.completed = !task.completed;
    return this.taskRepository.save(task);
  }
}
