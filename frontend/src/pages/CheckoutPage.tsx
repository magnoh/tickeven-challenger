import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import type { Reservation } from '../types';
import { CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'APPROVED' | 'DECLINED' | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservationId) return;
    apiFetch<Reservation>(`/reservations/${reservationId}`)
      .then((data) => setReservation(data))
      .catch((err) => setError(err.message || 'Erro ao carregar os dados do checkout'))
      .finally(() => setIsLoading(false));
  }, [reservationId]);

  const handleSimulatePayment = async (result: 'APPROVED' | 'DECLINED') => {
    setIsProcessing(true);
    setError('');

    try {
      await apiFetch<any>('/payments', {
        method: 'POST',
        body: JSON.stringify({
          reservationId: reservation!.id,
          result,
        }),
      });

      setPaymentResult(result);
      if (result === 'APPROVED') {
        setTimeout(() => navigate('/my-tickets'), 2200);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento simulado');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center mono text-sm text-[#9AA39B]">Carregando dados da reserva...</div>;
  }

  if (!reservation) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center mono text-sm text-[#9AA39B]">Reserva não encontrada.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-mono text-[#9AA39B] hover:text-[#E3B341] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o evento
      </button>

      <div className="text-center space-y-2">
        <p className="eyebrow">Etapa de Finalização</p>
        <h1 className="font-anton text-3xl uppercase tracking-wide text-[#EDEAE0]">
          Checkout de Pagamento
        </h1>
        <p className="text-xs text-[#9AA39B]">Revise os detalhes do seu pedido antes de confirmar a transação atômica</p>
      </div>

      <div className="bg-[#151E1A] border border-[#26332C] p-6 sm:p-8 rounded-[4px] space-y-6 shadow-2xl">
        {/* Resumo do Evento */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#26332C]">
          <img
            src={reservation.event.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80'}
            alt={reservation.event.title}
            className="w-20 h-20 object-cover rounded-[2px] border border-[#26332C] flex-shrink-0"
          />
          <div>
            <span className="mono text-[10px] uppercase text-[#E3B341] border border-[#E3B341]/30 bg-[#E3B341]/10 px-2 py-0.5 rounded-[2px]">
              {reservation.event.type === 'MOVIE' ? 'Cinema · TMDB' : 'Show / Evento'}
            </span>
            <h3 className="font-bold text-[#EDEAE0] text-base mt-1.5 line-clamp-1">{reservation.event.title}</h3>
            <p className="text-xs font-mono text-[#9AA39B] mt-0.5">{new Date(reservation.event.date).toLocaleString('pt-BR')}</p>
            <p className="text-xs text-[#9AA39B]">{reservation.event.location}</p>
          </div>
        </div>

        {/* Detalhes da Reserva */}
        <div className="space-y-2.5 text-xs font-mono">
          <div className="flex justify-between text-[#9AA39B]">
            <span>Ingressos ({reservation.quantity}x)</span>
            <span className="text-[#EDEAE0] font-semibold">R$ {Number(reservation.event.price).toFixed(2).replace('.', ',')} cada</span>
          </div>
          {reservation.seats && reservation.seats.length > 0 && (
            <div className="flex justify-between text-[#9AA39B]">
              <span>Assentos marcados</span>
              <span className="text-[#E3B341] font-semibold">{reservation.seats.join(', ')}</span>
            </div>
          )}
          <div className="flex justify-between text-[#9AA39B]">
            <span>Status da Reserva</span>
            <span className="text-[#E3B341] font-bold">{reservation.status}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#EDEAE0] pt-3 border-t border-[#26332C]">
            <span className="font-sans">Total a Pagar</span>
            <span className="text-[#E3B341] font-mono text-xl">R$ {Number(reservation.total).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Timer de Expiração */}
        <div className="bg-[#E3B341]/10 border border-[#E3B341]/30 p-3.5 rounded-[2px] flex items-center gap-3 text-xs text-[#E3B341] font-mono">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Sua reserva expira em 10 minutos. O estoque atômico está bloqueado exclusivamente para você.</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-[2px] text-xs text-red-400 font-mono">
            {error}
          </div>
        )}

        {/* Tela de Resultado do Pagamento Simulado */}
        {paymentResult === 'APPROVED' ? (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/40 p-6 rounded-[4px] text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-anton text-2xl uppercase tracking-wide text-white">Pagamento Confirmado!</h4>
            <p className="text-xs text-[#9AA39B]">Seus ingressos com hash HMAC e QR Codes foram gerados com sucesso. Redirecionando para "Meus Ingressos"...</p>
          </div>
        ) : paymentResult === 'DECLINED' ? (
          <div className="bg-red-500/10 border-2 border-red-500/40 p-6 rounded-[4px] text-center space-y-2">
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h4 className="font-anton text-2xl uppercase tracking-wide text-white">Pagamento Recusado</h4>
            <p className="text-xs text-[#9AA39B]">A transação simulada foi recusada. O estoque foi devolvido ao evento.</p>
          </div>
        ) : (
          <div className="pt-4 border-t border-[#26332C] space-y-3">
            <p className="eyebrow text-center text-[#9AA39B]">Simular Resposta do Gateway de Pagamento</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSimulatePayment('APPROVED')}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-[#0E1512] font-mono font-bold py-3 rounded-[2px] text-xs transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isProcessing ? 'Processando...' : 'Aprovar Pagamento'}
              </button>

              <button
                onClick={() => handleSimulatePayment('DECLINED')}
                disabled={isProcessing}
                className="bg-red-600/80 hover:bg-red-500 text-white font-mono font-bold py-3 rounded-[2px] text-xs transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <XCircle className="w-4 h-4" />
                {isProcessing ? 'Processando...' : 'Recusar Pagamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

