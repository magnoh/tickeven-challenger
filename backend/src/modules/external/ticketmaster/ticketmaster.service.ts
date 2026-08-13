import { Injectable } from '@nestjs/common';

export interface ExternalEvent {
  externalId: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  suggestedPrice: number;
}

@Injectable()
export class TicketmasterService {
  async getExternalEvents(keyword?: string): Promise<ExternalEvent[]> {
    const mockEvents: ExternalEvent[] = [
      {
        externalId: 'tm-rock-in-rio-2026',
        title: 'Rock in Rio 2026 - Palco Mundo',
        description: 'Um dos maiores festivais de música do mundo com headliners internacionais.',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        date: new Date('2026-09-15T18:00:00Z').toISOString(),
        location: 'Parque Olímpico - Rio de Janeiro, RJ',
        suggestedPrice: 350.00,
      },
      {
        externalId: 'tm-coldplay-tour',
        title: 'Coldplay - Music of the Spheres World Tour',
        description: 'Show espetacular com efeitos visuais e luzes sustentáveis.',
        imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
        date: new Date('2026-10-22T21:00:00Z').toISOString(),
        location: 'Estádio do Morumbi - São Paulo, SP',
        suggestedPrice: 280.00,
      },
      {
        externalId: 'tm-jazz-festival',
        title: 'São Paulo International Jazz Festival',
        description: 'Noites inesquecíveis de jazz, blues e soul com grandes lendas da música.',
        imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
        date: new Date('2026-11-05T19:30:00Z').toISOString(),
        location: 'Sala São Paulo - São Paulo, SP',
        suggestedPrice: 120.00,
      },
    ];

    if (keyword) {
      return mockEvents.filter(e =>
        e.title.toLowerCase().includes(keyword.toLowerCase()) ||
        e.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    return mockEvents;
  }
}
