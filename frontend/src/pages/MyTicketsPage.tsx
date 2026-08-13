import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import type { Ticket } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket as TicketIcon, Calendar, MapPin, Share2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Ticket[]>('/tickets')
      .then((data) => setTickets(data))
      .catch((err) => console.error('Erro ao carregar meus ingressos:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleShare = (codeHash: string, ticketId: string) => {
    const shareUrl = `${window.location.origin}/tickets/share/${codeHash}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">Carregando seus ingressos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <TicketIcon className="w-6 h-6 text-[#C8B4FF]" />
          Meus Ingressos Comprados
        </h1>
        <p className="text-sm text-muted">Apresente o QR Code na portaria do evento ou compartilhe o link de entrada</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-surface border border-subtle p-12 rounded-2xl text-center space-y-4">
          <TicketIcon className="w-12 h-12 text-muted mx-auto" />
          <h3 className="text-lg font-bold text-white">Nenhum ingresso encontrado</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Você ainda não possui ingressos comprados. Explore os eventos disponíveis para garantir sua presença!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const shareUrl = `${window.location.origin}/tickets/share/${ticket.codeHash}`;
            return (
              <div
                key={ticket.id}
                className="bg-surface border border-subtle rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#C8B4FF]/10 text-[#C8B4FF] border border-[#C8B4FF]/20">
                      Pista Geral
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${ticket.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                        }`}
                    >
                      {ticket.status === 'ACTIVE' ? 'ATIVO' : 'UTILIZADO'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{ticket.event.title}</h3>
                    <div className="space-y-1 text-xs text-muted mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C8B4FF]" />
                        <span>{new Date(ticket.event.date).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C8B4FF]" />
                        <span className="line-clamp-1">{ticket.event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="bg-white p-4 rounded-xl flex items-center justify-center border border-subtle shadow-inner my-4">
                    <QRCodeSVG
                      value={shareUrl}
                      size={160}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <p className="text-[10px] text-center text-muted font-mono break-all">
                    TOKEN: {ticket.codeHash.substring(0, 24)}...
                  </p>
                </div>

                <div className="p-4 bg-black/40 border-t border-subtle flex items-center justify-between">
                  <button
                    onClick={() => handleShare(ticket.codeHash, ticket.id)}
                    className="w-full btn-primary py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedId === ticket.id ? 'Link Copiado!' : 'Compartilhar Link'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
