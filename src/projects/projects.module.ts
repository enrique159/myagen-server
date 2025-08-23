import { Module } from '@nestjs/common';
import { NotesService } from './notes/notes.service';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  providers: [NotesService, ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
