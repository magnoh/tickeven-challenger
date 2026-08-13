import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ingresso não encontrado');
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenException('Acesso negado a este ingresso');
    }

    return ticket;
  }

  async findByShareToken(token: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { codeHash: token },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            location: true,
            imageUrl: true,
            status: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ingresso não encontrado ou inválido');
    }

    return {
      eventTitle: ticket.event.title,
      eventDate: ticket.event.date,
      eventLocation: ticket.event.location,
      eventImageUrl: ticket.event.imageUrl,
      eventStatus: ticket.event.status,
      ticketStatus: ticket.status,
      codeHash: ticket.codeHash,
      type: 'Pista Geral',
    };
  }
}
