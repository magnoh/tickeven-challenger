export type Role = 'ORGANIZER' | 'CUSTOMER' | 'GATE';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'FINISHED';

export type ReservationStatus = 'PENDING' | 'PAID' | 'PAYMENT_FAILED' | 'CANCELLED' | 'EXPIRED';

export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Event {
  id: string;
  externalId?: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  location: string;
  capacity: number;
  availableTickets: number;
  price: number;
  status: EventStatus;
  type: 'EVENT' | 'MOVIE';
  organizerId: string;
  reservations?: Reservation[];
}

export interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  seats: string[];
  total: number;
  status: ReservationStatus;
  expiresAt: string;
  event: Event;
  tickets?: Ticket[];
}

export interface Ticket {
  id: string;
  reservationId: string;
  eventId: string;
  userId: string;
  codeHash: string;
  seat?: string;
  status: TicketStatus;
  usedAt?: string;
  event: Event;
}

export interface GateValidationResult {
  result: 'VALID' | 'INVALID' | 'ALREADY_USED' | 'WRONG_EVENT' | 'CANCELLED';
  message: string;
  usedAt?: string;
  ticket?: any;
  event?: any;
  user?: any;
}
