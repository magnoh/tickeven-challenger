import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProcessPaymentDto, PaymentResult } from './dto/process-payment.dto';
import { ReservationStatus, TicketStatus } from '@prisma/client';
import { randomBytes, createHmac } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async processPayment(processPaymentDto: ProcessPaymentDto, userId: string) {
    const { reservationId, result } = processPaymentDto;

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { event: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta reserva');
    }

    // Regra de Idempotência
    if (reservation.status === ReservationStatus.PAID) {
      throw new ConflictException('Esta reserva já foi paga e os ingressos foram gerados');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(`Não é possível pagar uma reserva com status ${reservation.status}`);
    }

    // Verificar se expirou
    if (new Date() > reservation.expiresAt) {
      // Marcar como expirada e devolver estoque
      await this.prisma.$transaction(async (tx) => {
        await tx.reservation.update({
          where: { id: reservation.id },
          data: { status: ReservationStatus.EXPIRED },
        });
        await tx.event.update({
          where: { id: reservation.eventId },
          data: { availableTickets: { increment: reservation.quantity } },
        });
      });
      throw new BadRequestException('Sua reserva expirou. Ingressos devolvidos ao estoque.');
    }

    if (result === PaymentResult.DECLINED) {
      // Pagamento Recusado
      return this.prisma.$transaction(async (tx) => {
        const updatedReservation = await tx.reservation.update({
          where: { id: reservationId },
          data: { status: ReservationStatus.PAYMENT_FAILED },
        });

        // Devolver estoque
        await tx.event.update({
          where: { id: reservation.eventId },
          data: { availableTickets: { increment: reservation.quantity } },
        });

        return {
          status: 'DECLINED',
          message: 'Pagamento recusado. Estoque liberado.',
          reservation: updatedReservation,
        };
      });
    }

    // Pagamento Aprovado -> Criar Tickets com Hash Criptográfico
    return this.prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.PAID },
      });

      const ticketsData: Array<{
        reservationId: string;
        eventId: string;
        userId: string;
        codeHash: string;
        status: TicketStatus;
      }> = [];
      const secret = process.env.TICKET_SECRET || 'tickeven-ticket-token-hmac-secret-998877';

      for (let i = 0; i < reservation.quantity; i++) {
        const randomSalt = randomBytes(32).toString('hex');
        const codeHash = createHmac('sha256', secret)
          .update(`${reservation.id}-${userId}-${i}-${randomSalt}`)
          .digest('hex');

        ticketsData.push({
          reservationId: reservation.id,
          eventId: reservation.eventId,
          userId,
          codeHash,
          status: TicketStatus.ACTIVE,
        });
      }

      await tx.ticket.createMany({
        data: ticketsData,
      });

      const createdTickets = await tx.ticket.findMany({
        where: { reservationId: reservation.id },
      });

      return {
        status: 'APPROVED',
        message: 'Pagamento aprovado e ingressos gerados com sucesso!',
        reservation: updatedReservation,
        tickets: createdTickets,
      };
    });
  }
}
