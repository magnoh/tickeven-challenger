import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import type { Event } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, PlusCircle, CheckCircle, Ban, DollarSign } from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = () => {
    setIsLoading(true);
    apiFetch<Event[]>('/events/organizer/my-events')
      .then((data) => setEvents(data))
      .catch((err) => console.error('Erro ao carregar meus eventos:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePublish = async (eventId: string) => {
    try {
      await apiFetch(`/events/${eventId}/publish`, { method: 'POST' });
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Erro ao publicar evento');
    }
  };

  const handleCancel = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este evento?')) return;
    try {
      await apiFetch(`/events/${eventId}/cancel`, { method: 'POST' });
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar evento');
    }
  };

  const totalTicketsSold = events.reduce((acc, e) => acc + (e.capacity - e.availableTickets), 0);
  const totalRevenue = events.reduce((acc, e) => acc + (e.capacity - e.availableTickets) * Number(e.price), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Painel do Organizador</h1>
          <p className="text-sm text-muted">Gerencie seus eventos e acompanhe as vendas de ingressos em tempo real</p>
        </div>
        <Link to="/organizer/events/new" className="btn-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Evento
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-[#C8B4FF] rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted">Total de Eventos</p>
            <p className="text-xl font-black text-white">{events.length}</p>
          </div>
        </div>

        <div className="bg-surface border border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted">Ingressos Vendidos</p>
            <p className="text-xl font-black text-white">{totalTicketsSold}</p>
          </div>
        </div>

        <div className="bg-surface border border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted">Receita Simulado</p>
            <p className="text-xl font-black text-white">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </div>

      {/* Table of Events */}
      <div className="bg-surface border border-subtle rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-subtle">
          <h2 className="text-lg font-bold text-white">Seus Eventos Cadastrados</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted">Carregando eventos...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-muted">Você ainda não criou nenhum evento.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted">
              <thead className="bg-black/30 text-xs uppercase text-white font-semibold border-b border-subtle">
                <tr>
                  <th className="p-4">Evento</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Vendas / Capacidade</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {events.map((event) => {
                  const sold = event.capacity - event.availableTickets;
                  return (
                    <tr key={event.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold text-white">{event.title}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold ${event.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : event.status === 'DRAFT'
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4 text-white">R$ {Number(event.price).toFixed(2).replace('.', ',')}</td>
                      <td className="p-4 text-white font-mono">{sold} / {event.capacity}</td>
                      <td className="p-4 text-right space-x-2">
                        {event.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(event.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                          >
                            Publicar
                          </button>
                        )}
                        {event.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancel(event.id)}
                            className="bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
