import { Base } from '@/shared/domain/base';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { UserStatus } from './domain/user';
import { Project } from '@/projects/project.entity';
import { Tag } from '@/tags/tag.entity';
import { Element } from '@/elements/element.entity';

@Entity('users')
@Unique(['email'])
export class User implements Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Projects
  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  // Tags
  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  // Elements
  @OneToMany(() => Element, (element) => element.user)
  elements: Element[];

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone_number', default: null, type: 'varchar' })
  phoneNumber: string | null;

  @Column({ name: 'profile_image_url', default: null, type: 'varchar' })
  profileImageUrl: string | null;

  @Column({
    name: 'status',
    default: UserStatus.ACTIVE,
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
