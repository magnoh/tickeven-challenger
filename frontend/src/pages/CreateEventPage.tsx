import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { PlusCircle, Sparkles, AlertCircle, LayoutGrid, Film, Music } from 'lucide-react';

export const CreateEventPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(120);
  const [price, setPrice] = useState(60);
  const [externalId, setExternalId] = useState('');
  const [type, setType] = useState<'EVENT' | 'MOVIE'>('EVENT');
  const [venueType, setVenueType] = useState<'AMPHITHEATER' | 'STADIUM' | 'THEATER'>('AMPHITHEATER');

  const [externalEvents, setExternalEvents] = useState<any[]>([]);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar filmes do catálogo TMDB (The Movie Database)
    setIsSearchingExternal(true);
    apiFetch<any[]>('/external/events')
      .then((data) => setExternalEvents(data))
      .catch((err) => console.error('Erro ao buscar TMDB:', err))
      .finally(() => setIsSearchingExternal(false));
  }, []);

  const handleSelectExternal = (ext: any) => {
    setTitle(ext.title);
    setDescription(ext.description);
    setImageUrl(ext.imageUrl);
    setLocation(ext.location === 'Cinema' ? 'Cine Theatro Brasil / Sala TMDB' : ext.location);
    setPrice(ext.suggestedPrice);
    setExternalId(ext.externalId);
    setDate(ext.date.substring(0, 16));
    setType('MOVIE');
    setVenueType('THEATER');
    setCapacity(96);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          imageUrl: imageUrl || undefined,
          date: new Date(date).toISOString(),
          location,
          capacity: Number(capacity),
          price: Number(price),
          externalId: externalId || undefined,
          type,
        }),
      });

      navigate('/organizer');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <p className="eyebrow">Novo Cadastro</p>
        <h1 className="font-anton text-3xl sm:text-4xl uppercase tracking-wide text-[#EDEAE0]">
          Criar Novo Evento / Sessão
        </h1>
        <p className="text-xs text-[#9AA39B] mt-1">
          Cadastre seu evento com layout de sala personalizado ou importe metadados do catálogo oficial TMDB
        </p>
      </div>

      {/* Painel TMDB de Importação Rápida */}
      <div className="bg-[#151E1A] border border-[#26332C] p-6 rounded-[4px] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#E3B341]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-anton text-xl uppercase tracking-wide text-[#EDEAE0]">
              Catálogo The Movie DB (TMDB API)
            </h3>
          </div>
          <span className="mono text-[10px] uppercase tracking-wider text-[#E3B341] bg-[#E3B341]/10 px-2 py-0.5 rounded-[2px] border border-[#E3B341]/30">
            API Integrada
          </span>
        </div>

        <p className="text-xs text-[#9AA39B]">
          Clique em qualquer filme em destaque para preencher automaticamente título, sinopse, capa em alta resolução e data de lançamento:
        </p>

        {isSearchingExternal ? (
          <div className="p-4 text-center mono text-xs text-[#9AA39B]">Consultando catálogo TMDB...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {externalEvents.slice(0, 6).map((ext) => (
              <button
                key={ext.externalId}
                type="button"
                onClick={() => handleSelectExternal(ext)}
                className="bg-[#0E1512] border border-[#26332C] hover:border-[#E3B341] p-3 rounded-[3px] text-left space-y-1.5 group transition-all cursor-pointer"
              >
                <p className="text-xs font-bold text-[#EDEAE0] group-hover:text-[#E3B341] line-clamp-1">
                  {ext.title}
                </p>
                <p className="text-[11px] text-[#9AA39B] line-clamp-1">{ext.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-[#E3B341] bg-[#E3B341]/10 px-1.5 py-0.5 rounded-[2px]">
                    Importar TMDB &rarr;
                  </span>
                  <span className="text-[10px] font-mono text-[#9AA39B]">R$ {ext.suggestedPrice}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="bg-[#151E1A] border border-[#26332C] p-6 sm:p-8 rounded-[4px] space-y-6 shadow-xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-[2px] text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tipo de Conteúdo */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B]">
              Tipo de Evento
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#EDEAE0] bg-[#0E1512] px-4 py-2.5 rounded-[2px] border border-[#26332C] hover:border-[#E3B341]">
                <input
                  type="radio"
                  name="type"
                  value="EVENT"
                  checked={type === 'EVENT'}
                  onChange={() => setType('EVENT')}
                  className="accent-[#E3B341]"
                />
                <Music className="w-3.5 h-3.5 text-[#E3B341]" />
                Show / Festival / Evento
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#EDEAE0] bg-[#0E1512] px-4 py-2.5 rounded-[2px] border border-[#26332C] hover:border-[#E3B341]">
                <input
                  type="radio"
                  name="type"
                  value="MOVIE"
                  checked={type === 'MOVIE'}
                  onChange={() => setType('MOVIE')}
                  className="accent-[#E3B341]"
                />
                <Film className="w-3.5 h-3.5 text-[#E3B341]" />
                Filme / Cinema (TMDB)
              </label>
            </div>
          </div>

          {/* Seleção do Tipo de Venue (Sala / Arena / Anfiteatro) */}
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#E3B341] font-bold">
                Layout de Sala / Arena (3 Opções)
              </label>
              <Link to="/venue" target="_blank" className="text-[11px] font-mono text-[#9AA39B] hover:text-[#E3B341] flex items-center gap-1 underline">
                <LayoutGrid className="w-3 h-3" />
                Abrir Demonstração dos 3 Mapas
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setVenueType('AMPHITHEATER');
                  setCapacity(120);
                }}
                className={`p-3 rounded-[3px] border text-left space-y-1 transition-all cursor-pointer ${
                  venueType === 'AMPHITHEATER'
                    ? 'border-[#E3B341] bg-[#E3B341]/10 text-[#EDEAE0]'
                    : 'border-[#26332C] bg-[#0E1512] text-[#9AA39B] hover:border-[#E3B341]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-anton text-sm uppercase tracking-wide">1. Anfiteatro Orion</span>
                  <span className="mono text-[10px] text-[#E3B341]">Arco</span>
                </div>
                <p className="text-[10px] text-[#9AA39B]">Palco + GA Pit + Setores 100/200/300 em semicírculo</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVenueType('STADIUM');
                  setCapacity(240);
                }}
                className={`p-3 rounded-[3px] border text-left space-y-1 transition-all cursor-pointer ${
                  venueType === 'STADIUM'
                    ? 'border-[#E3B341] bg-[#E3B341]/10 text-[#EDEAE0]'
                    : 'border-[#26332C] bg-[#0E1512] text-[#9AA39B] hover:border-[#E3B341]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-anton text-sm uppercase tracking-wide">2. Estádio / Arena</span>
                  <span className="mono text-[10px] text-emerald-400">Gramado</span>
                </div>
                <p className="text-[10px] text-[#9AA39B]">Campo central + Arquibancadas Norte/Sul/Leste/Oeste</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVenueType('THEATER');
                  setCapacity(96);
                }}
                className={`p-3 rounded-[3px] border text-left space-y-1 transition-all cursor-pointer ${
                  venueType === 'THEATER'
                    ? 'border-[#E3B341] bg-[#E3B341]/10 text-[#EDEAE0]'
                    : 'border-[#26332C] bg-[#0E1512] text-[#9AA39B] hover:border-[#E3B341]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-anton text-sm uppercase tracking-wide">3. Teatro Clássico</span>
                  <span className="mono text-[10px] text-purple-400">Plateia</span>
                </div>
                <p className="text-[10px] text-[#9AA39B]">Palco italiano + Plateia A-O + Balcão e Camarotes</p>
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Título do Evento / Filme
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Noite de Gala no Anfiteatro"
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Descrição / Sinopse
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes sobre a apresentação..."
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Data e Horário
            </label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Local / Endereço da Venue
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: The Orion Amphitheater - Huntsville"
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Capacidade de Assentos
            </label>
            <input
              type="number"
              min={1}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Preço Base do Ingresso (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              URL da Capa / Poster
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://image.tmdb.org/t/p/w500/..."
              className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] px-3 py-2.5 text-sm text-[#EDEAE0] focus:outline-none focus:border-[#E3B341]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gold py-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {isSubmitting ? 'Cadastrando Evento...' : 'Salvar Evento em Rascunho'}
        </button>
      </form>
    </div>
  );
};

