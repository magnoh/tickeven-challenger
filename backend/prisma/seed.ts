import { PrismaClient, Role, EventStatus, ReservationStatus, TicketStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a geração de Seed no banco de dados...');

  // Limpar banco de dados
  await prisma.ticket.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Criar Usuários
  const organizer = await prisma.user.create({
    data: {
      name: 'Organizador Verzel',
      email: 'organizador@demo.com',
      passwordHash,
      role: Role.ORGANIZER,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Cliente Um',
      email: 'cliente1@demo.com',
      passwordHash,
      role: Role.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Cliente Dois',
      email: 'cliente2@demo.com',
      passwordHash,
      role: Role.CUSTOMER,
    },
  });

  const gate = await prisma.user.create({
    data: {
      name: 'Agente Portaria',
      email: 'portaria@demo.com',
      passwordHash,
      role: Role.GATE,
    },
  });

  console.log('✅ Usuários criados com sucesso!');

  // 2. Criar Eventos
  const publishedEvent = await prisma.event.create({
    data: {
      title: 'Rock Festival 2026',
      description: 'O maior festival de rock da América Latina com atrações internacionais incríveis!',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-11-20T20:00:00Z'),
      location: 'Arena Allianz - São Paulo, SP',
      capacity: 500,
      availableTickets: 498,
      price: 150.00,
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
    },
  });

  const draftEvent = await prisma.event.create({
    data: {
      title: 'Workshop Dev Tech 2026',
      description: 'Evento de tecnologia e inteligência artificial para desenvolvedores sênior.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-12-05T09:00:00Z'),
      location: 'Centro de Convenções - Rio de Janeiro, RJ',
      capacity: 200,
      availableTickets: 200,
      price: 80.00,
      status: EventStatus.DRAFT,
      organizerId: organizer.id,
    },
  });

  const cancelledEvent = await prisma.event.create({
    data: {
      title: 'Stand Up Comedy Show',
      description: 'Apresentação especial cancelada.',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-10-10T21:00:00Z'),
      location: 'Teatro Bradesco - São Paulo, SP',
      capacity: 100,
      availableTickets: 100,
      price: 60.00,
      status: EventStatus.CANCELLED,
      organizerId: organizer.id,
    },
  });

  console.log('✅ Eventos criados com sucesso!');

  // 3. Criar Reserva Pago e Tickets para Cliente 2 (para testes de portaria)
  const paidReservation = await prisma.reservation.create({
    data: {
      userId: customer2.id,
      eventId: publishedEvent.id,
      quantity: 2,
      total: 300.00,
      status: ReservationStatus.PAID,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // Ticket 1: Ativo (Válido para entrada)
  const activeTicket = await prisma.ticket.create({
    data: {
      reservationId: paidReservation.id,
      eventId: publishedEvent.id,
      userId: customer2.id,
      codeHash: 'demo-ticket-active-hash-12345',
      status: TicketStatus.ACTIVE,
    },
  });

  // Ticket 2: Já utilizado
  const usedTicket = await prisma.ticket.create({
    data: {
      reservationId: paidReservation.id,
      eventId: publishedEvent.id,
      userId: customer2.id,
      codeHash: 'demo-ticket-used-hash-67890',
      status: TicketStatus.USED,
      usedAt: new Date(),
    },
  });

  console.log('✅ Ingressos de teste (Ativo e Utilizado) gerados!');
  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
