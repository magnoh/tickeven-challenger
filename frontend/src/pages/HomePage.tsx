import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { type Event } from '../types';
import { EventCard } from '../components/EventCard';
import { Search, Sparkles, Calendar } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<Event[]>('/events')
      .then((data) => setEvents(data))
      .catch((err) => console.error('Erro ao buscar eventos:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/40 via-surface to-surface border border-subtle p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8B4FF]/10 text-[#C8B4FF] text-xs font-semibold border border-[#C8B4FF]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plataforma Oficial de Ingressos</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Descubra e viva momentos inesquecíveis.
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Compre ingressos para os melhores shows, festivais e conferências com total segurança e validação instantânea via QR Code.
          </p>

          <div className="pt-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por evento ou cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/50 border border-subtle rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-[#C8B4FF]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Listed Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#C8B4FF]" />
            Próximos Eventos em Destaque
          </h2>
          <span className="text-xs text-muted font-medium">
            {filteredEvents.length} eventos disponíveis
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-surface h-80 rounded-xl animate-pulse border border-subtle" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-subtle rounded-xl p-12 text-center space-y-3">
            <p className="text-muted text-sm">Nenhum evento encontrado para sua busca.</p>
            <button
              onClick={() => setSearch('')}
              className="text-xs text-[#C8B4FF] underline font-medium"
            >
              Limpar filtros de busca
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
