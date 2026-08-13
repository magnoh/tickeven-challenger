import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
import { TicketStatus, EventStatus } from '@prisma/client';

export type GateValidationResponse =
  | { result: 'VALID'; message: string; ticket: any; event: any; user: any }
  | { result: 'INVALID'; message: string }
  | { result: 'ALREADY_USED'; message: string; usedAt?: Date }
  | { result: 'WRONG_EVENT'; message: string }
  | { result: 'CANCELLED'; message: string };

@Injectable()
export class GateService {
  constructor(private prisma: PrismaService) {}

  async validateTicket(validateTicketDto: ValidateTicketDto): Promise<GateValidationResponse> {
    const { token, eventId } = validateTicketDto;

    // Buscar ticket pelo codeHash (ou id como fallback amigável)
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        OR: [
          { codeHash: token },
          { id: token }
        ]
      },
      include: {
        event: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!ticket) {
      return {
        result: 'INVALID',
        message: 'Ingresso inválido ou não encontrado no sistema',
      };
    }

    if (ticket.status === TicketStatus.CANCELLED || ticket.event.status === EventStatus.CANCELLED) {
      return {
        result: 'CANCELLED',
        message: 'Este ingresso ou evento foi cancelado',
      };
    }

    if (eventId && ticket.eventId !== eventId) {
      return {
        result: 'WRONG_EVENT',
        message: `Ingresso pertence a outro evento: "${ticket.event.title}"`,
      };
    }

    if (ticket.status === TicketStatus.USED) {
      return {
        result: 'ALREADY_USED',
        message: 'Este ingresso já foi utilizado anteriormente',
        usedAt: ticket.usedAt || undefined,
      };
    }

    // ALTERAÇÃO ATÔMICA: ACTIVE -> USED
    const updateResult = await this.prisma.ticket.updateMany({
      where: {
        id: ticket.id,
        status: TicketStatus.ACTIVE,
      },
      data: {
        status: TicketStatus.USED,
        usedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      return {
        result: 'ALREADY_USED',
        message: 'Este ingresso já foi utilizado simultaneamente por outra validação',
      };
    }

    return {
      result: 'VALID',
      message: '✓ INGRESSO VÁLIDO. Entrada liberada!',
      ticket: {
        id: ticket.id,
        type: 'Pista Geral',
        status: TicketStatus.USED,
      },
      event: {
        title: ticket.event.title,
        date: ticket.event.date,
        location: ticket.event.location,
      },
      user: ticket.user,
    };
  }
}
