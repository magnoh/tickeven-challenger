import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('external')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) { }

  @Get('events')
  getExternalEvents(@Query('keyword') keyword?: string) {
    return this.tmdbService.getExternalEvents(keyword);
  }

  @Get('configuration')
  getConfiguration() {
    return this.tmdbService.getConfiguration();
  }

  @Get('trending')
  getTrending(
    @Query('timeWindow') timeWindow?: 'day' | 'week',
    @Query('language') language?: string,
  ) {
    return this.tmdbService.getTrendingMovies(timeWindow || 'day', language || 'pt-BR');
  }
}

