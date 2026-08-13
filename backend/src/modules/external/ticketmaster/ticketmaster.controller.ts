import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TicketmasterService } from './ticketmaster.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('external')
export class TicketmasterController {
  constructor(private readonly ticketmasterService: TicketmasterService) { }

  @Get('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  getExternalEvents(@Query('keyword') keyword?: string) {
    return this.ticketmasterService.getExternalEvents(keyword);
  }
}
