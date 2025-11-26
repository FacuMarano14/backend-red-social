import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { UsersService } from '../users/users.service';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class StatsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('posts-by-user')
  async postsByUser(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.postsService.statsPostsByUser(from, to);
  }

  @Get('comments-by-user')
  async commentsByUser(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.commentsService.statsCommentsByUser(from, to);
  }

  @Get('comments-by-post')
  async commentsByPost(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.commentsService.statsCommentsByPost(from, to);
  }
}
