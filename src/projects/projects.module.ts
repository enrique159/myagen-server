import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './project.entity';
import { ElementsModule } from '@/elements/elements.module';
import { NotesModule } from '@/notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    ElementsModule,
    NotesModule
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule {}
