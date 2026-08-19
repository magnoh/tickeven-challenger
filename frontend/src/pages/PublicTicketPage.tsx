import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, ShieldCheck } from 'lucide-react';

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
    return <div className="max-w-md mx-auto px-4 py-20 text-center mono text-sm text-[#9AA39B]">Validando ingresso público...</div>;
  }

  if (error || !ticketData) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="text-red-400 font-anton text-2xl uppercase">Ingresso Inválido</div>
        <p className="text-xs font-mono text-[#9AA39B]">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[#151E1A] border border-[#26332C] rounded-[4px] overflow-hidden shadow-2xl space-y-6">
        <div className="bg-[#0E1512] p-6 border-b border-[#26332C] text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E3B341]/10 border border-[#E3B341]/30 text-[#E3B341]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="eyebrow">Autenticidade Garantida</p>
          <h1 className="font-anton text-2xl uppercase tracking-wide text-[#EDEAE0]">
            Ingresso Oficial TickEven
          </h1>
          <p className="text-xs text-[#9AA39B]">Apresente este voucher na portaria para leitura ótica instantânea</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-anton text-2xl uppercase tracking-wide text-[#EDEAE0]">{ticketData.eventTitle}</h2>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#9AA39B]">
              <Calendar className="w-3.5 h-3.5 text-[#E3B341]" />
              <span>{new Date(ticketData.eventDate).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-[#9AA39B]">
              <MapPin className="w-3.5 h-3.5 text-[#9AA39B]" />
              <span>{ticketData.eventLocation}</span>
            </div>
          </div>

          <div className="bg-[#F6F1E4] p-6 rounded-[4px] flex flex-col items-center justify-center border-2 border-dashed border-[#26332C]/30 shadow-inner">
            <QRCodeSVG value={window.location.href} size={190} level="H" />
            <span className="font-mono text-[10px] font-bold text-[#0E1512] mt-3 uppercase tracking-wider">
              Token HMAC Criptografado
            </span>
          </div>

          <div className="bg-[#0E1512] border border-[#26332C] p-4 rounded-[2px] space-y-2.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#9AA39B]">Assento / Categoria:</span>
              <span className="text-[#EDEAE0] font-bold">{ticketData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9AA39B]">Status do Ingresso:</span>
              <span className={`font-bold ${ticketData.ticketStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {ticketData.ticketStatus === 'ACTIVE' ? '● VÁLIDO' : '✕ UTILIZADO'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

