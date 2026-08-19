import { PrismaClient, Role, EventStatus, EventType, ReservationStatus, TicketStatus } from '@prisma/client';
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

  // 2. Criar Eventos e Filmes TMDB
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
      type: EventType.EVENT,
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
    },
  });

  const amphitheaterShow = await prisma.event.create({
    data: {
      title: 'Noite Sinfônica no Orion',
      description: 'Concerto acústico ao ar livre com a Orquestra Filarmônica no The Orion Amphitheater.',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      date: new Date('2026-10-18T19:30:00Z'),
      location: 'The Orion Amphitheater - Huntsville',
      capacity: 350,
      availableTickets: 350,
      price: 120.00,
      type: EventType.EVENT,
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
    },
  });

  const movieDeadpool = await prisma.event.create({
    data: {
      title: 'Deadpool & Wolverine',
      description: 'Um apático Wade Wilson labuta na vida civil até que o multiverso o chama de volta para uma missão épica.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      date: new Date('2026-09-15T21:00:00Z'),
      location: 'Cine Theatro Brasil / Sala TMDB 1',
      capacity: 120,
      availableTickets: 120,
      price: 42.00,
      type: EventType.MOVIE,
      externalId: 'tmdb-533535',
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
    },
  });

  const movieSpiderMan = await prisma.event.create({
    data: {
      title: 'Homem-Aranha: Um Novo Dia',
      description: 'Peter Parker enfrenta novos desafios e uma surpreendente nova ameaça à cidade no cinema.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/x0nvYzQpyJc5pdT9lMnkMuYAg0O.jpg',
      date: new Date('2026-09-20T18:30:00Z'),
      location: 'Cine Theatro Brasil / Sala TMDB 2',
      capacity: 96,
      availableTickets: 96,
      price: 38.00,
      type: EventType.MOVIE,
      externalId: 'tmdb-969681',
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
    },
  });

  const movieDuna = await prisma.event.create({
    data: {
      title: 'Duna: Parte 2',
      description: 'Paul Atreides se une a Chani e aos Fremen em busca de vingança contra os conspiradores que destruíram sua família.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg',
      date: new Date('2026-09-25T20:00:00Z'),
      location: 'Cineplex Imax / Sala TMDB 3',
      capacity: 150,
      availableTickets: 150,
      price: 45.00,
      type: EventType.MOVIE,
      externalId: 'tmdb-693134',
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
      type: EventType.EVENT,
      status: EventStatus.DRAFT,
      organizerId: organizer.id,
    },
  });

  console.log('✅ Eventos e Filmes TMDB criados com sucesso!');

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
