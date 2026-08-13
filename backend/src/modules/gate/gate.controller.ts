import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { GateService } from './gate.service';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('gate')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GateController {
  constructor(private readonly gateService: GateService) { }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.GATE)
  validateTicket(@Body() validateTicketDto: ValidateTicketDto) {
    return this.gateService.validateTicket(validateTicketDto);
  }
}
