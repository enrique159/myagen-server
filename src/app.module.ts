import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseEnv from './config/database.config';
import serverEnv from './config/server.config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ElementsModule } from './elements/elements.module';
import { NotesModule } from './notes/notes.module';
import { TodoListsModule } from './todo-lists/todo-lists.module';
import { TasksModule } from './tasks/tasks.module';
import { RemindersModule } from './reminders/reminders.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseEnv, serverEnv],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretKey'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('isDev'),
      }),
      inject: [ConfigService],
    }),
    FilesModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ElementsModule,
    NotesModule,
    TodoListsModule,
    TasksModule,
    RemindersModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
