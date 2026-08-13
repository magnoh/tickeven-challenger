import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { PlusCircle, Sparkles, AlertCircle } from 'lucide-react';

export const CreateEventPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [price, setPrice] = useState(50);
  const [externalId, setExternalId] = useState('');

  const [externalEvents, setExternalEvents] = useState<any[]>([]);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar eventos externos simulados da Ticketmaster
    setIsSearchingExternal(true);
    apiFetch<any[]>('/external/events')
      .then((data) => setExternalEvents(data))
      .catch((err) => console.error('Erro ao buscar Ticketmaster mock:', err))
      .finally(() => setIsSearchingExternal(false));
  }, []);

  const handleSelectExternal = (ext: any) => {
    setTitle(ext.title);
    setDescription(ext.description);
    setImageUrl(ext.imageUrl);
    setLocation(ext.location);
    setPrice(ext.suggestedPrice);
    setExternalId(ext.externalId);
    setDate(ext.date.substring(0, 16));
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Criar Novo Evento</h1>
        <p className="text-sm text-muted">Cadastre manualmente ou importe dados do catálogo Ticketmaster</p>
      </div>

      {/* Ticketmaster Mock Catalog Import */}
      <div className="bg-gradient-to-r from-purple-900/30 via-surface to-surface border border-subtle p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-[#C8B4FF]">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-white text-base">Importar do Catálogo Ticketmaster</h3>
        </div>
        <p className="text-xs text-muted">Selecione um evento sugerido para preencher automaticamente os campos:</p>

        {isSearchingExternal ? (
          <p className="text-xs text-muted">Buscando catálogo Ticketmaster...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {externalEvents.map((ext) => (
              <button
                key={ext.externalId}
                type="button"
                onClick={() => handleSelectExternal(ext)}
                className="bg-black/40 border border-subtle hover:border-[#C8B4FF] p-3 rounded-xl text-left space-y-1 group transition-all"
              >
                <p className="text-xs font-bold text-white group-hover:text-[#C8B4FF] line-clamp-1">{ext.title}</p>
                <p className="text-[10px] text-muted line-clamp-1">{ext.location}</p>
                <span className="inline-block text-[10px] font-semibold text-[#C8B4FF] bg-[#C8B4FF]/10 px-2 py-0.5 rounded">
                  Importar Dados
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-surface border border-subtle p-6 sm:p-8 rounded-2xl space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1">Título do Evento</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Festival de Verão 2026"
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1">Descrição Completa</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as atrações e detalhes do evento..."
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Data e Horário</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Local / Endereço</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Arena Anhembi - São Paulo, SP"
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Capacidade Total (Ingressos)</label>
            <input
              type="number"
              min={1}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Preço Unitário (R$)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-muted mb-1">URL da Imagem de Capa (Opcional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black/40 border border-subtle rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {isSubmitting ? 'Salvando Evento...' : 'Salvar Evento em Rascunho'}
        </button>
      </form>
    </div>
  );
};
