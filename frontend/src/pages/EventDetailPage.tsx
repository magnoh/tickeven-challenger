import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import type { Event, Reservation } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket, AlertCircle, Users, ArrowLeft } from 'lucide-react';
import { SeatingChart } from '../components/SeatingChart';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    apiFetch<Event>(`/events/${id}`)
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message || 'Erro ao carregar detalhes do evento'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : prev.length < 10
          ? [...prev, seatId]
          : prev
    );
  };

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      setError('Apenas clientes podem reservar ingressos');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Selecione pelo menos um assento para prosseguir');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reservation = await apiFetch<Reservation>('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          eventId: event!.id,
          quantity: selectedSeats.length,
          seats: selectedSeats,
        }),
      });

      navigate(`/checkout/${reservation.id}`);
    } catch (err: any) {
      setError(err.message || 'Falha ao criar reserva de ingresso');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center mono text-sm text-[#9AA39B]">
        Carregando informações do evento...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center mono text-sm text-[#9AA39B]">
        Evento não encontrado.
      </div>
    );
  }

  const quantity = selectedSeats.length;
  const totalPrice = Number(event.price) * quantity;
  const occupiedSeats = event.reservations?.flatMap(r => r.seats) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-mono text-[#9AA39B] hover:text-[#E3B341] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a listagem
      </button>

      <div className="bg-[#151E1A] border border-[#26332C] rounded-[4px] overflow-hidden shadow-2xl">
        {/* Banner do Evento */}
        <div className="h-72 sm:h-96 w-full relative bg-[#0E1512]">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            className="w-full h-full object-cover filter saturate-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151E1A] via-[#151E1A]/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 space-y-6 -mt-16 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-[2px] border border-[#E3B341]/40 text-[#E3B341] bg-[#E3B341]/10">
                {event.status}
              </span>
              {event.type === 'MOVIE' && (
                <span className="mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-[2px] border border-[#26332C] text-[#EDEAE0] bg-[#0E1512]">
                  Cinema · TMDB
                </span>
              )}
            </div>
            <h1 className="font-anton text-3xl sm:text-5xl uppercase tracking-wide text-[#EDEAE0]">
              {event.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#0E1512] p-4 rounded-[3px] border border-[#26332C]">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#E3B341] flex-shrink-0" />
              <div>
                <p className="font-mono uppercase text-[10px] text-[#9AA39B]">Data e Horário</p>
                <p className="font-semibold text-sm text-[#EDEAE0]">{new Date(event.date).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#E3B341] flex-shrink-0" />
              <div>
                <p className="font-mono uppercase text-[10px] text-[#9AA39B]">Localização</p>
                <p className="font-semibold text-sm text-[#EDEAE0]">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="eyebrow text-[#E3B341]">Sobre o evento</h3>
            <p className="text-[#9AA39B] text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Seleção de Assentos */}
          <div className="bg-[#0E1512] border border-[#26332C] p-6 rounded-[4px] space-y-6">
            <div className="flex items-center justify-between border-b border-[#26332C] pb-4">
              <div>
                <h4 className="font-anton text-xl uppercase tracking-wide text-[#EDEAE0]">
                  Escolha seus Lugares
                </h4>
                <p className="text-xs text-[#9AA39B] flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-[#E3B341]" />
                  Máximo de 10 ingressos por reserva (expira em 10 min).
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-[#E3B341]">
                  R$ {Number(event.price).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] font-mono text-[#9AA39B] block">por ingresso</span>
              </div>
            </div>

            <SeatingChart
              capacity={event.capacity}
              type={event.type}
              occupiedSeats={occupiedSeats}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
            />

            <div className="flex items-center justify-between pt-4 border-t border-[#26332C] font-mono text-xs">
              <span className="text-[#9AA39B]">Lugares selecionados:</span>
              <span className="text-[#EDEAE0] font-bold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nenhum'} ({quantity} ingressos)
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#26332C]">
              <div>
                <span className="eyebrow">Total a pagar</span>
                <p className="text-xs text-[#9AA39B]">Transação atômica protegida</p>
              </div>
              <span className="font-mono text-3xl font-bold text-[#EDEAE0]">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-[2px] text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleReserve}
              disabled={isSubmitting || quantity === 0}
              className="w-full btn-gold py-3.5 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2"
            >
              <Ticket className="w-4 h-4" />
              {isSubmitting ? 'Gerando Reserva Atômica...' : 'Garantir Ingressos Agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

