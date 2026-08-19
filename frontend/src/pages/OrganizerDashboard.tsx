import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import type { Event } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, PlusCircle, DollarSign, LayoutGrid } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332C] pb-6">
        <div>
          <p className="eyebrow">Gestão de Produção</p>
          <h1 className="font-anton text-3xl sm:text-4xl uppercase tracking-wide text-[#EDEAE0]">
            Painel do Organizador
          </h1>
          <p className="text-xs text-[#9AA39B] mt-1">Gerencie seus eventos e acompanhe as vendas de ingressos em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/venue" className="btn-ghost py-2.5 px-3 text-xs flex items-center gap-1.5 font-mono">
            <LayoutGrid className="w-3.5 h-3.5 text-[#E3B341]" />
            <span>Mapas de Arenas</span>
          </Link>
          <Link to="/organizer/events/new" className="btn-gold py-2.5 px-4 text-xs font-mono font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            <span>Criar Evento</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151E1A] border border-[#26332C] p-5 rounded-[4px] flex items-center gap-4">
          <div className="p-3 bg-[#E3B341]/10 text-[#E3B341] border border-[#E3B341]/20 rounded-[2px]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#9AA39B]">Total de Eventos</p>
            <p className="font-anton text-3xl text-[#EDEAE0]">{events.length}</p>
          </div>
        </div>

        <div className="bg-[#151E1A] border border-[#26332C] p-5 rounded-[4px] flex items-center gap-4">
          <div className="p-3 bg-[#E3B341]/10 text-[#E3B341] border border-[#E3B341]/20 rounded-[2px]">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#9AA39B]">Ingressos Vendidos</p>
            <p className="font-anton text-3xl text-[#EDEAE0]">{totalTicketsSold}</p>
          </div>
        </div>

        <div className="bg-[#151E1A] border border-[#26332C] p-5 rounded-[4px] flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-[2px]">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#9AA39B]">Receita Total</p>
            <p className="font-anton text-3xl text-emerald-400">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </div>

      {/* Table of Events */}
      <div className="bg-[#151E1A] border border-[#26332C] rounded-[4px] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#26332C]">
          <h2 className="font-anton text-xl uppercase tracking-wide text-[#EDEAE0]">
            Eventos Cadastrados
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center mono text-sm text-[#9AA39B]">Carregando eventos...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-[#9AA39B] text-xs">Você ainda não criou nenhum evento.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#9AA39B]">
              <thead className="bg-[#0E1512] text-[10px] uppercase font-mono text-[#EDEAE0] border-b border-[#26332C]">
                <tr>
                  <th className="p-4">Evento</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Vendas / Capacidade</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26332C]">
                {events.map((event) => {
                  const sold = event.capacity - event.availableTickets;
                  return (
                    <tr key={event.id} className="hover:bg-[#1B2621]/50 transition-colors">
                      <td className="p-4 font-semibold text-[#EDEAE0]">{event.title}</td>
                      <td className="p-4 font-mono text-[11px] text-[#E3B341]">
                        {event.type === 'MOVIE' ? 'Cinema (TMDB)' : 'Evento'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold ${
                            event.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : event.status === 'DRAFT'
                              ? 'bg-[#E3B341]/10 text-[#E3B341] border border-[#E3B341]/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[#EDEAE0]">R$ {Number(event.price).toFixed(2).replace('.', ',')}</td>
                      <td className="p-4 text-[#EDEAE0] font-mono">{sold} / {event.capacity}</td>
                      <td className="p-4 text-right space-x-2">
                        {event.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(event.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-[#0E1512] font-mono text-[10px] px-3 py-1.5 rounded-[2px] font-bold transition-all uppercase"
                          >
                            Publicar
                          </button>
                        )}
                        {event.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancel(event.id)}
                            className="bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-[10px] font-mono px-3 py-1.5 rounded-[2px] font-semibold transition-all uppercase"
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

