import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { TodoList } from '@/todo-lists/todo-list.entity';
import { Reminder } from '@/reminders/reminder.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TodoList, (list) => list.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: TodoList;

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @OneToOne(() => Reminder, (reminder) => reminder.task, {
    cascade: true,
    nullable: true,
  })
  reminder: Reminder;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}