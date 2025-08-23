import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UserToken } from '@/users/domain/user';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // Create a new tag
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body(new ValidationPipe()) tag: CreateTagDto, @Req() req: Request & { user: UserToken }) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.tagsService.create({ ...tag, userId });
  }

  // Find all tags for a user
  @Get()
  @UseGuards(AuthGuard)
  async findAllByUser(@Req() req: Request & { user: UserToken }) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.tagsService.findAllByUser(userId);
  }

  // Find a tag by id
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  // Update a tag
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body(new ValidationPipe()) tag: UpdateTagDto) {
    return this.tagsService.update(id, tag);
  }

  // Delete a tag
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }

  // Find all elements for a tag
  @Get(':id/elements')
  @UseGuards(AuthGuard)
  async findElementsByTag(@Param('id') id: string) {
    return this.tagsService.findElementsByTag(id);
  }
}
