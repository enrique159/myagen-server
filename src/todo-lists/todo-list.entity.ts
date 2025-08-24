import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Element } from '@/elements/element.entity';
import { Task } from '@/tasks/task.entity';

export enum TodoListType {
  NOTE = "note",
  LIST = "list"
}

@Entity('todo_lists')
export class TodoList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Element, (element) => element.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'element_id' })
  element: Element;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'enum', enum: TodoListType, default: TodoListType.LIST })
  type: TodoListType;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}