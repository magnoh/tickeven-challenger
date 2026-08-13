import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Ticket as TicketIcon, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PublicTicketPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [ticketData, setTicketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    apiFetch<any>(`/tickets/share/${token}`)
      .then((data) => setTicketData(data))
      .catch((err) => setError(err.message || 'Ingresso não encontrado ou inválido'))
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-16 text-center text-muted">Validando ingresso público...</div>;
  }

  if (error || !ticketData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <div className="text-red-400 font-bold text-lg">Ingresso Inválido</div>
        <p className="text-xs text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-surface border border-subtle rounded-3xl overflow-hidden shadow-2xl space-y-6">
        <div className="bg-gradient-to-r from-purple-900/40 to-surface p-6 border-b border-subtle text-center">
          <ShieldCheck className="w-10 h-10 text-[#C8B4FF] mx-auto mb-2" />
          <h1 className="text-xl font-extrabold text-white">Ingresso Oficial TickEven</h1>
          <p className="text-xs text-muted">Página pública de validação e visualização</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">{ticketData.eventTitle}</h2>
            <div className="flex items-center justify-center gap-2 text-xs text-muted">
              <Calendar className="w-3.5 h-3.5 text-[#C8B4FF]" />
              <span>{new Date(ticketData.eventDate).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted">
              <MapPin className="w-3.5 h-3.5 text-[#C8B4FF]" />
              <span>{ticketData.eventLocation}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl flex items-center justify-center border border-subtle shadow-lg">
            <QRCodeSVG value={window.location.href} size={200} level="H" />
          </div>

          <div className="bg-black/40 border border-subtle p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Tipo de Ingresso</span>
              <span className="text-white font-semibold">{ticketData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status do Ingresso</span>
              <span className="text-emerald-400 font-bold">{ticketData.ticketStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
