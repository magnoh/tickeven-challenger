import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { Calendar, MapPin, Ticket } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-surface border border-subtle rounded-xl overflow-hidden hover:border-[#C8B4FF]/40 transition-all flex flex-col group">
      <div className="h-48 w-full overflow-hidden relative bg-black/40">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-[#C8B4FF] border border-white/10">
          R$ {Number(event.price).toFixed(2).replace('.', ',')}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#C8B4FF] transition-colors">
            {event.title}
          </h3>
          <p className="text-muted text-xs line-clamp-2 mb-4">
            {event.description}
          </p>

          <div className="space-y-1.5 text-xs text-muted mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8B4FF]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C8B4FF]" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-subtle flex items-center justify-between">
          <span className="text-xs text-muted">
            <strong className="text-white">{event.availableTickets}</strong> ingressos restantes
          </span>
          <Link
            to={`/events/${event.id}`}
            className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Ticket className="w-3.5 h-3.5" />
            Ver evento
          </Link>
        </div>
      </div>
    </div>
  );
};
