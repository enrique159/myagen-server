import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ElementsService } from './elements.service';
import { CreateElementDto } from './dto/create-element.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { UserToken } from '@/users/domain/user';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  // Create a new element
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body(new ValidationPipe()) element: CreateElementDto, @Req() req: Request & { user: UserToken }) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.elementsService.create({ ...element, userId });
  }

  // Find elements with filters
  @Get()
  @UseGuards(AuthGuard)
  async findElements(
    @Req() req: Request & { user: UserToken },
    @Query('assignedDate') assignedDateStr?: string,
    @Query('projectId') projectId?: string,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    
    // Parse the date if provided
    let assignedDate: Date | undefined;
    if (assignedDateStr) {
      assignedDate = new Date(assignedDateStr);
      // Validate date
      if (isNaN(assignedDate.getTime())) {
        throw new Error('Invalid date format');
      }
    }
    
    return this.elementsService.findElements(userId, assignedDate, projectId);
  }

  // Find any elements that match the search query
  @Get('search')
  @UseGuards(AuthGuard)
  async searchElements(
    @Req() req: Request & { user: UserToken },
    @Query('query') query: string,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.elementsService.searchElements(userId, query);
  }

  // Get elements by user and year
  @Get('calendar')
  @UseGuards(AuthGuard)
  async getArray(
    @Req() req: Request & { user: UserToken },
    @Query('year') year: string,
    @Query('projectId') projectId?: string,
  ) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.elementsService.getElementsByUserAndYear(userId, year, projectId);
  }

  // Find an element by id
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.elementsService.findOne(id);
  }

  // Update an element
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body(new ValidationPipe()) element: UpdateElementDto) {
    return this.elementsService.update(id, element);
  }

  // Delete an element
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.elementsService.delete(id);
  }

  // Add tags to an element
  @Post(':id/tags')
  @UseGuards(AuthGuard)
  async addTags(@Param('id') id: string, @Body() body: { tagIds: string[] }) {
    return this.elementsService.addTags(id, body.tagIds);
  }

  // Remove tags from an element
  @Delete(':id/tags')
  @UseGuards(AuthGuard)
  async removeTags(@Param('id') id: string, @Body() body: { tagIds: string[] }) {
    return this.elementsService.removeTags(id, body.tagIds);
  }
}
