import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  @Roles(Role.CUSTOMER)
  create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: any) {
    return this.reservationsService.create(createReservationDto, user.id);
  }

  @Get('my-reservations')
  @Roles(Role.CUSTOMER)
  findByUser(@CurrentUser() user: any) {
    return this.reservationsService.findByUser(user.id);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reservationsService.findOne(id, user.id);
  }
}
