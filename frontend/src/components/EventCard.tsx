import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { MapPin, Calendar, QrCode } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).toUpperCase();

  const isLowStock = event.availableTickets <= 15 && event.availableTickets > 0;
  const isSoldOut = event.availableTickets === 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className="ticket-card block group text-left cursor-pointer"
    >
      {/* Corpo principal do ingresso */}
      <div className="p-5 flex flex-col justify-between min-w-0 bg-[#151E1A]">
        <div>
          {/* Tag de status */}
          <div className="flex items-center gap-2 mb-3">
            {isSoldOut ? (
              <span className="mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm border border-red-500/40 text-red-400 bg-red-500/10">
                Esgotado
              </span>
            ) : isLowStock ? (
              <span className="mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm border border-[#E3B341] text-[#E3B341] bg-[#E3B341]/10">
                Últimas unidades
              </span>
            ) : (
              <span className="mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm border border-[#26332C] text-[#9AA39B] bg-[#0E1512]">
                {event.type === 'MOVIE' ? 'Cinema / TMDB' : 'Vendas Abertas'}
              </span>
            )}
          </div>

          {/* Imagem do evento */}
          <div className="h-32 w-full rounded-sm overflow-hidden mb-3.5 bg-black/40 border border-[#26332C]">
            <img
              src={event.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'}
              alt={event.title}
              className="w-full h-full object-cover filter saturate-90 contrast-105 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Título */}
          <h4 className="text-base font-bold text-[#EDEAE0] mb-2 leading-snug line-clamp-1 group-hover:text-[#E3B341] transition-colors">
            {event.title}
          </h4>

          {/* Metadados */}
          <div className="space-y-1 text-xs text-[#9AA39B]">
            <div className="flex items-center gap-1.5 mono text-[11px] text-[#EDEAE0]">
              <Calendar className="w-3.5 h-3.5 text-[#E3B341] flex-shrink-0" />
              <span className="line-clamp-1">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#9AA39B] flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-[#26332C] flex items-center justify-between text-[11px] text-[#9AA39B]">
          <span>
            <strong className="text-[#EDEAE0]">{event.availableTickets}</strong> disp.
          </span>
          <span className="text-[#E3B341] font-semibold group-hover:translate-x-0.5 transition-transform">
            Garantir &rarr;
          </span>
        </div>
      </div>

      {/* Canhoto destacável do ingresso (Ticket Stub) */}
      <div className="ticket-stub">
        <span className="stub-from">A partir de</span>
        <span className="stub-price">R${Number(event.price).toFixed(0)}</span>
        <div className="w-7 h-7 border border-[#0E1512] rounded-sm flex items-center justify-center p-0.5">
          <QrCode className="w-5 h-5 text-[#0E1512]" />
        </div>
      </div>
    </Link>
  );
};

