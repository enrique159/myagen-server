import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '@/users/user.entity';
import { Project } from '@/projects/project.entity';
import { Tag } from '@/tags/tag.entity';
import { Note } from '@/notes/note.entity';
import { TodoList } from '@/todo-lists/todo-list.entity';

@Entity('elements')
export class Element {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.elements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.elements, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  title: string;

  @Column({ name: 'assigned_date', type: 'date' })
  assignedDate: Date;

  @OneToMany(() => Note, (note) => note.element)
  notes: Note[];

  @OneToMany(() => TodoList, (list) => list.element)
  lists: TodoList[];

  @ManyToMany(() => Tag, (tag) => tag.elements, { cascade: true })
  @JoinTable({
    name: 'element_tags',
    joinColumn: { name: 'element_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}