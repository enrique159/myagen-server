import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList } from './todo-list.entity';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { Element } from '@/elements/element.entity';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
    @InjectRepository(Element)
    private readonly elementRepository: Repository<Element>,
  ) {}

  /**
   * @description Create a new todo list
   * @param { CreateTodoListDto } todoList
   * @returns { Promise<TodoList> }
   */
  async create(todoList: CreateTodoListDto): Promise<TodoList> {
    const element = await this.elementRepository.findOne({
      where: { id: todoList.elementId },
    });

    if (!element) {
      throw new NotFoundException(`Element with ID ${todoList.elementId} not found`);
    }

    const newTodoList = this.todoListRepository.create({
      element,
      order: todoList.order,
      type: todoList.type,
    });

    return this.todoListRepository.save(newTodoList);
  }

  /**
   * @description Find all todo lists for an element
   * @param { string } elementId
   * @returns { Promise<TodoList[]> }
   */
  async findAllByElement(elementId: string): Promise<TodoList[]> {
    const element = await this.elementRepository.findOne({
      where: { id: elementId },
    });

    if (!element) {
      throw new NotFoundException(`Element with ID ${elementId} not found`);
    }

    return this.todoListRepository.find({
      where: { element: { id: elementId } },
      relations: ['element', 'tasks'],
    });
  }

  /**
   * @description Find a todo list by id
   * @param { string } id
   * @returns { Promise<TodoList | null> }
   */
  async findOne(id: string): Promise<TodoList | null> {
    const todoList = await this.todoListRepository.findOne({
      where: { id },
      relations: ['element', 'tasks'],
    });

    if (!todoList) {
      throw new NotFoundException(`TodoList with ID ${id} not found`);
    }

    return todoList;
  }

  /**
   * @description Update a todo list
   * @param { string } id
   * @param { UpdateTodoListDto } todoList
   * @returns { Promise<TodoList | null> }
   */
  async update(id: string, todoList: UpdateTodoListDto): Promise<TodoList | null> {
    const existingTodoList = await this.findOne(id);
    
    if (!existingTodoList) {
      throw new NotFoundException(`TodoList with ID ${id} not found`);
    }

    return this.todoListRepository.save({ ...existingTodoList, ...todoList, id });
  }

  /**
   * @description Delete a todo list
   * @param { string } id
   * @returns { Promise<void> }
   */
  async delete(id: string): Promise<void> {
    const todoList = await this.findOne(id);
    
    if (!todoList) {
      throw new NotFoundException(`TodoList with ID ${id} not found`);
    }
    
    await this.todoListRepository.delete(id);
  }
}
