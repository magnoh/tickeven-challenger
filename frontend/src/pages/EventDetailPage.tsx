import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import type { Event, Reservation } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket, AlertCircle, Minus, Plus, ShieldCheck } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
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

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      setError('Apenas clientes podem reservar ingressos');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reservation = await apiFetch<Reservation>('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          eventId: event!.id,
          quantity,
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">
        Carregando informações do evento...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">
        Evento não encontrado.
      </div>
    );
  }

  const totalPrice = Number(event.price) * quantity;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-surface border border-subtle rounded-2xl overflow-hidden">
        <div className="h-80 w-full relative bg-black/50">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-8 space-y-6 -mt-12 relative z-10">
          <div>
            <span className="bg-[#C8B4FF]/10 border border-[#C8B4FF]/20 text-[#C8B4FF] text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
              {event.status}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{event.title}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted bg-black/30 p-4 rounded-xl border border-subtle">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#C8B4FF]" />
              <div>
                <p className="text-xs font-semibold text-white">Data e Hora</p>
                <p>{new Date(event.date).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#C8B4FF]" />
              <div>
                <p className="text-xs font-semibold text-white">Local</p>
                <p>{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Sobre o Evento</h3>
            <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Seletor de Quantidade Pista */}
          <div className="bg-black/40 border border-subtle p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Ingresso Pista Geral</h4>
                <p className="text-xs text-muted">Estoque disponível: {event.availableTickets} unidades</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-[#C8B4FF]">
                  R$ {Number(event.price).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-muted block">cada</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-subtle">
              <span className="text-sm font-medium text-white">Quantidade</span>
              <div className="flex items-center gap-3 bg-surface p-1.5 rounded-lg border border-subtle">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 hover:bg-white/10 rounded-md text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-white px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(event.availableTickets, quantity + 1))}
                  className="p-1.5 hover:bg-white/10 rounded-md text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-subtle">
              <span className="text-base font-bold text-white">Valor Total</span>
              <span className="text-2xl font-black text-white">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleReserve}
              disabled={isSubmitting || event.availableTickets === 0}
              className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-4"
            >
              <Ticket className="w-4 h-4" />
              {isSubmitting ? 'Gerando Reserva...' : 'Garantir Ingressos Agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
