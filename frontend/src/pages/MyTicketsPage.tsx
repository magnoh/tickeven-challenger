import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import type { Ticket } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket as TicketIcon, Calendar, MapPin, Share2, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center mono text-sm text-[#9AA39B]">Carregando seus ingressos...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <p className="eyebrow">Carteira Digital</p>
        <h1 className="font-anton text-3xl sm:text-4xl text-[#EDEAE0] uppercase tracking-wide flex items-center gap-2.5">
          <TicketIcon className="w-8 h-8 text-[#E3B341]" />
          Meus Ingressos Emitidos
        </h1>
        <p className="text-xs text-[#9AA39B] mt-1">Apresente o QR Code na portaria do evento ou compartilhe o link direto de entrada</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-[#151E1A] border border-[#26332C] p-12 rounded-[4px] text-center space-y-4">
          <TicketIcon className="w-12 h-12 text-[#9AA39B] mx-auto opacity-50" />
          <h3 className="font-anton text-2xl uppercase text-[#EDEAE0]">Nenhum ingresso encontrado</h3>
          <p className="text-xs text-[#9AA39B] max-w-sm mx-auto">
            Você ainda não possui ingressos comprados. Explore os eventos disponíveis no catálogo para garantir seu acesso.
          </p>
          <Link to="/events" className="btn-gold text-xs uppercase tracking-wider font-bold inline-block">
            Explorar Eventos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const shareUrl = `${window.location.origin}/tickets/share/${ticket.codeHash}`;
            const isActive = ticket.status === 'ACTIVE';

            return (
              <div
                key={ticket.id}
                className="bg-[#151E1A] border border-[#26332C] rounded-[4px] overflow-hidden flex flex-col justify-between shadow-xl"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#26332C] pb-3">
                    <span className="mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-[2px] border border-[#E3B341]/40 text-[#E3B341] bg-[#E3B341]/10">
                      {ticket.seat ? `Assento ${ticket.seat}` : 'Pista Geral'}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-[2px] ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {isActive ? '● ATIVO / VÁLIDO' : '✕ JÁ UTILIZADO'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-[#EDEAE0] line-clamp-1">{ticket.event.title}</h3>
                    <div className="space-y-1 text-xs text-[#9AA39B] mt-2">
                      <div className="flex items-center gap-1.5 mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-[#E3B341]" />
                        <span>{new Date(ticket.event.date).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#9AA39B]" />
                        <span className="line-clamp-1">{ticket.event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Container estilo Ticket Paper */}
                  <div className="bg-[#F6F1E4] p-5 rounded-[4px] flex flex-col items-center justify-center border-2 border-dashed border-[#26332C]/30 my-4">
                    <QRCodeSVG
                      value={shareUrl}
                      size={150}
                      level="H"
                      includeMargin={false}
                    />
                    <p className="text-[10px] font-mono font-bold text-[#0E1512] mt-3 uppercase tracking-wider">
                      Voucher Oficial TickEven
                    </p>
                  </div>

                  <p className="text-[10px] text-center text-[#9AA39B] font-mono break-all">
                    HASH: {ticket.codeHash.substring(0, 32)}...
                  </p>
                </div>

                <div className="p-3.5 bg-[#0E1512] border-t border-[#26332C] flex items-center gap-2">
                  <button
                    onClick={() => handleShare(ticket.codeHash, ticket.id)}
                    className="flex-1 btn-gold py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5 uppercase"
                  >
                    {copiedId === ticket.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copiar Link QR</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/tickets/share/${ticket.codeHash}`}
                    target="_blank"
                    className="btn-ghost py-2 px-3 text-xs flex items-center justify-center text-[#9AA39B] hover:text-[#EDEAE0]"
                    title="Abrir página pública"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

