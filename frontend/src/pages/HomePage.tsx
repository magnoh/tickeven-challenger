import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { type Event } from '../types';
import { EventCard } from '../components/EventCard';
import { Search, MapPin, ArrowRight, LayoutGrid } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'EVENT' | 'MOVIE'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.allSettled([
      apiFetch<Event[]>('/events'),
      apiFetch<any[]>('/external/events'),
    ]).then(([eventsResult, trendingResult]) => {
      if (eventsResult.status === 'fulfilled') {
        setEvents(eventsResult.value || []);
      }
      if (trendingResult.status === 'fulfilled') {
        setTrendingMovies(trendingResult.value || []);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'ALL' || e.type === activeTab;
    const matchesCity = cityFilter === 'ALL' || e.location.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesSearch && matchesTab && matchesCity;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#26332C] bg-[radial-gradient(#EDEAE0_1px,transparent_1px)] [background-size:22px_22px] [background-position:center] overflow-hidden">
        {/* Glow dourado de fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_0%,rgba(227,179,65,0.10),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3B341]/10 border border-[#E3B341]/30">
              <span className="w-2 h-2 rounded-full bg-[#E3B341] animate-pulse"></span>
              <span className="eyebrow text-[#E3B341]">Ingressos verificados · sem intermediário</span>
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#EDEAE0] leading-[0.95]">
              Seu lugar<br />
              na fila <span className="text-[#E3B341]">já<br />garantido.</span>
            </h1>

            <p className="text-[#9AA39B] text-base sm:text-lg max-w-xl leading-relaxed">
              Reserve em segundos, pague com estoque atômico garantido e entre com um QR Code criptográfico único — validado na portaria sem fila e sem burocracia.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#eventos" className="btn-gold">
                Ver eventos disponíveis
              </a>
              <Link to="/venue" className="btn-ghost flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#E3B341]" />
                Ver Mapas de Sala & Arenas
              </Link>
            </div>
          </div>

          {/* Painel de Busca Estilo Landing Paper */}
          <div className="lg:col-span-5">
            <div className="bg-[#F6F1E4] text-[#0E1512] p-6 sm:p-7 rounded-[4px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] border border-[#E7E0CC]">
              <p className="eyebrow text-[#B98F35] font-bold">Busca rápida</p>
              <h3 className="font-anton text-2xl uppercase mt-1 mb-4 text-[#0E1512] tracking-wide">
                Encontre seu ingresso
              </h3>

              <div className="space-y-3">
                <div className="border-b border-[#0E1512]/20 pb-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#4B5A52] font-bold mb-1">
                    Filtrar por Cidade
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4B5A52]" />
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-[#0E1512] focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Todas as cidades</option>
                      <option value="Belo Horizonte">Belo Horizonte, MG</option>
                      <option value="São Paulo">São Paulo, SP</option>
                      <option value="Rio de Janeiro">Rio de Janeiro, RJ</option>
                    </select>
                  </div>
                </div>

                <div className="border-b border-[#0E1512]/20 pb-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#4B5A52] font-bold mb-1">
                    O que você procura
                  </label>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#4B5A52]" />
                    <input
                      type="text"
                      placeholder="Show, festival, filme, teatro..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-[#0E1512] placeholder-[#4B5A52]/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <a
                href="#eventos"
                className="w-full mt-5 bg-[#0E1512] hover:bg-[#1F2B24] text-[#F6F1E4] font-bold py-3 rounded-[2px] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#E3B341]" />
                Explorar Catálogo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE STRIP ---------- */}
      <div className="border-y border-[#26332C] py-3 bg-[#151E1A]/60 overflow-hidden select-none">
        <div className="marquee-track">
          <span>
            <b>Overselling zero</b> — transação atômica <b>·</b> Reserva expira em <b>10 min</b> se não confirmada <b>·</b> Ingressos <b>HMAC-SHA256</b> <b>·</b> Validação instantânea na portaria <b>·</b> Catálogo The Movie DB (TMDB) integrado
          </span>
          <span>
            <b>Overselling zero</b> — transação atômica <b>·</b> Reserva expira em <b>10 min</b> se não confirmada <b>·</b> Ingressos <b>HMAC-SHA256</b> <b>·</b> Validação instantânea na portaria <b>·</b> Catálogo The Movie DB (TMDB) integrado
          </span>
        </div>
      </div>

      {/* ---------- LISTA DE EVENTOS ---------- */}
      <section id="eventos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#26332C] pb-6">
          <div>
            <p className="eyebrow mb-1">Em cartaz</p>
            <h2 className="font-anton text-3xl sm:text-4xl text-[#EDEAE0] uppercase tracking-wide">
              Próximos Eventos & Filmes
            </h2>
            <p className="text-[#9AA39B] text-sm mt-1 max-w-md">
              Cada cartão é seu ingresso — o canhoto já mostra o valor e o acesso oficial.
            </p>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center bg-[#151E1A] border border-[#26332C] rounded-[3px] p-1 gap-1">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-[2px] text-xs font-mono font-medium transition-all ${
                activeTab === 'ALL'
                  ? 'bg-[#E3B341] text-[#0E1512] font-bold'
                  : 'text-[#9AA39B] hover:text-[#EDEAE0]'
              }`}
            >
              TODOS
            </button>
            <button
              onClick={() => setActiveTab('EVENT')}
              className={`px-3.5 py-1.5 rounded-[2px] text-xs font-mono font-medium transition-all ${
                activeTab === 'EVENT'
                  ? 'bg-[#E3B341] text-[#0E1512] font-bold'
                  : 'text-[#9AA39B] hover:text-[#EDEAE0]'
              }`}
            >
              EVENTOS & SHOWS
            </button>
            <button
              onClick={() => setActiveTab('MOVIE')}
              className={`px-3.5 py-1.5 rounded-[2px] text-xs font-mono font-medium transition-all ${
                activeTab === 'MOVIE'
                  ? 'bg-[#E3B341] text-[#0E1512] font-bold'
                  : 'text-[#9AA39B] hover:text-[#EDEAE0]'
              }`}
            >
              CINEMA (TMDB)
            </button>
          </div>
        </div>

        {/* Grid de Ingressos */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-[#151E1A] h-72 rounded-[4px] animate-pulse border border-[#26332C]" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-[#151E1A] border border-[#26332C] rounded-[4px] p-12 text-center space-y-3">
            <p className="text-[#9AA39B] text-sm">Nenhum evento agendado com os filtros selecionados.</p>
            <button
              onClick={() => {
                setSearch('');
                setCityFilter('ALL');
                setActiveTab('ALL');
              }}
              className="text-xs text-[#E3B341] font-mono hover:underline"
            >
              Limpar todos os filtros de busca
            </button>
          </div>
        )}

        {/* ---------- SEÇÃO TMDB TRENDING MOVIES (EM ALTA HOJE) ---------- */}
        {trendingMovies.length > 0 && (
          <div className="pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#26332C] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-[#E3B341]/10 text-[#E3B341] border border-[#E3B341]/30 text-[10px] font-mono uppercase tracking-wider mb-1">
                  <span>API Oficial The Movie DB (TMDB)</span>
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wide text-[#EDEAE0]">
                  🔥 Filmes em Alta no TMDB Hoje
                </h3>
              </div>
              <span className="text-xs text-[#9AA39B] font-mono">
                Dados atualizados em tempo real via TMDB API
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingMovies.map((movie) => (
                <div
                  key={movie.externalId}
                  className="bg-[#151E1A] border border-[#26332C] hover:border-[#E3B341] rounded-[4px] overflow-hidden group transition-all flex flex-col"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-[#0E1512]">
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-[#0E1512]/90 border border-[#E3B341]/40 px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono text-[#E3B341] font-bold">
                      TMDB
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#EDEAE0] line-clamp-1 group-hover:text-[#E3B341]">
                        {movie.title}
                      </h4>
                      <p className="text-[11px] text-[#9AA39B] line-clamp-2 mt-1">
                        {movie.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#26332C] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#E3B341] font-bold">
                        R$ {movie.suggestedPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <Link
                        to="/organizer/events/new"
                        className="text-[10px] font-mono text-[#EDEAE0] hover:text-[#E3B341] underline"
                      >
                        Abrir Sessão
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ---------- COMO FUNCIONA (EDITORIAL 3 PASSOS) ---------- */}
      <section className="bg-[#151E1A] border-y border-[#26332C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <p className="eyebrow mb-1">Do clique à entrada</p>
            <h2 className="font-anton text-3xl sm:text-4xl text-[#EDEAE0] uppercase tracking-wide">
              Como funciona
            </h2>
            <p className="text-[#9AA39B] text-sm mt-1 max-w-md">
              Três passos simples — sem intermediários e sem surpresa na portaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 border-l md:border-l-0 md:border-t border-dashed border-[#26332C] pl-4 md:pl-0 md:pt-4">
              <span className="font-anton text-2xl text-[#E3B341] tracking-wider">01</span>
              <h4 className="text-lg font-bold text-[#EDEAE0]">Escolha o evento</h4>
              <p className="text-xs text-[#9AA39B] leading-relaxed">
                Filtre por categoria, cidade ou data e consulte o estoque real de ingressos atualizado no exato segundo.
              </p>
            </div>

            <div className="space-y-3 border-l md:border-l-0 md:border-t border-dashed border-[#26332C] pl-4 md:pl-0 md:pt-4">
              <span className="font-anton text-2xl text-[#E3B341] tracking-wider">02</span>
              <h4 className="text-lg font-bold text-[#EDEAE0]">Reserve e confirme</h4>
              <p className="text-xs text-[#9AA39B] leading-relaxed">
                Seu ingresso fica retido por 10 minutos enquanto você realiza o pagamento. Se o tempo expirar, retorna à fila.
              </p>
            </div>

            <div className="space-y-3 border-l md:border-l-0 md:border-t border-dashed border-[#26332C] pl-4 md:pl-0 md:pt-4">
              <span className="font-anton text-2xl text-[#E3B341] tracking-wider">03</span>
              <h4 className="text-lg font-bold text-[#EDEAE0]">Entre com QR Code</h4>
              <p className="text-xs text-[#9AA39B] leading-relaxed">
                Na portaria, seu código é escaneado em milissegundos e validado com criptografia HMAC instantânea.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ROLES SECTION ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="eyebrow mb-1">Perfis de Acesso</p>
          <h2 className="font-anton text-3xl sm:text-4xl text-[#EDEAE0] uppercase tracking-wide">
            Desenvolvido para todos os papéis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0E1512] border border-[#26332C] hover:border-[#B98F35] p-6 rounded-[4px] space-y-4 flex flex-col justify-between transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-full border border-[#B98F35] flex items-center justify-center font-mono text-xs text-[#E3B341]">
                Or
              </div>
              <h4 className="text-lg font-bold text-[#EDEAE0]">Organizadores</h4>
              <p className="text-xs text-[#9AA39B] leading-relaxed">
                Crie eventos personalizados, importe dados instantâneos da API TMDB e acompanhe vendas em tempo real sem planilhas paralelas.
              </p>
            </div>
            <Link to="/organizer" className="text-xs font-semibold text-[#E3B341] flex items-center gap-1 hover:underline">
              <span>Painel do Organizador</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#0E1512] border border-[#26332C] hover:border-[#B98F35] p-6 rounded-[4px] space-y-4 flex flex-col justify-between transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-full border border-[#B98F35] flex items-center justify-center font-mono text-xs text-[#E3B341]">
                Cl
              </div>
              <h4 className="text-lg font-bold text-[#EDEAE0]">Clientes</h4>
              <p className="text-xs text-[#9AA39B] leading-relaxed">
                Navegue com transparência, escolha assentos nos mapas de arenas e receba seu ingresso com QR Code pronto para apresentação.
              </p>
            </div>
            <Link to="/my-tickets" className="text-xs font-semibold text-[#E3B341] flex items-center gap-1 hover:underline">
              <span>Meus Ingressos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#0E1512] border border-[#26332C] hover:border-[#B98F35] p-6 rounded-[4px] space-y-4 flex flex-col justify-between transition-colors">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-full border border-emerald-500/40 flex items-center justify-center font-mono text-xs text-emerald-400">
                Po
              </div>
              <h4 className="text-lg font-bold text-[#EDEAE0]">Equipe de Portaria</h4>
              <p className="text-xs text-[#9AA39B] leading-relaxed">
                Validação por câmera nativa ou digitação manual com proteção contra reentrância, ingressos duplicados ou cancelados.
              </p>
            </div>
            <Link to="/gate" className="text-xs font-semibold text-emerald-400 flex items-center gap-1 hover:underline">
              <span>Abrir Scanner Portaria</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

