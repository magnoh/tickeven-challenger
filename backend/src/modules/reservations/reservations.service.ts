import { Injectable, NotFoundException, ConflictException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventStatus, ReservationStatus } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const { eventId, quantity } = createReservationDto;

    // Buscar evento
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new ConflictException('Apenas eventos publicados aceitam reservas');
    }

    const total = Number(event.price) * quantity;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expirar em 10 minutos

    // TRANSAÇÃO ATÔMICA COM PROTEÇÃO CONTRA OVERSELLING
    return this.prisma.$transaction(async (tx) => {
      // Tentar decrementar estoque atomicamente onde disponível >= quantidade
      const updatedEvent = await tx.event.updateMany({
        where: {
          id: eventId,
          status: EventStatus.PUBLISHED,
          availableTickets: {
            gte: quantity,
          },
        },
        data: {
          availableTickets: {
            decrement: quantity,
          },
        },
      });

      if (updatedEvent.count === 0) {
        throw new ConflictException('Ingressos insuficientes em estoque para concluir esta reserva');
      }

      // Criar a reserva em estado PENDING
      const reservation = await tx.reservation.create({
        data: {
          userId,
          eventId,
          quantity,
          total,
          status: ReservationStatus.PENDING,
          expiresAt,
        },
        include: {
          event: true,
        },
      });

      return reservation;
    });
  }

  async findOne(id: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        event: true,
        tickets: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta reserva');
    }

    return reservation;
  }

  async findByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: true,
        tickets: true,
      },
    });
  }

  // Job Cron automático para expirar reservas PENDING vencidas e devolver estoque
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations() {
    const now = new Date();
    const expiredReservations = await this.prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
        expiresAt: {
          lt: now,
        },
      },
    });

    if (expiredReservations.length === 0) return;

    this.logger.log(`Processando expiração de ${expiredReservations.length} reservas PENDING...`);

    for (const reservation of expiredReservations) {
      await this.prisma.$transaction(async (tx) => {
        // Atualizar status para EXPIRED
        await tx.reservation.update({
          where: { id: reservation.id },
          data: { status: ReservationStatus.EXPIRED },
        });

        // Devolver estoque ao evento
        await tx.event.update({
          where: { id: reservation.eventId },
          data: {
            availableTickets: {
              increment: reservation.quantity,
            },
          },
        });
      });
    }

    this.logger.log(`Devolução de estoque concluída com sucesso.`);
  }
}
