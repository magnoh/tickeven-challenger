import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import type { Reservation } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

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
      const response = await apiFetch<any>('/payments', {
        method: 'POST',
        body: JSON.stringify({
          reservationId: reservation!.id,
          result,
        }),
      });

      setPaymentResult(result);
      if (result === 'APPROVED') {
        setTimeout(() => navigate('/my-tickets'), 2500);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento simulado');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">Carregando dados da reserva...</div>;
  }

  if (!reservation) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">Reserva não encontrada.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-white">Checkout de Pagamento Simulado</h1>
        <p className="text-sm text-muted">Revise os detalhes do seu pedido antes de concluir a transação</p>
      </div>

      <div className="bg-surface border border-subtle p-6 rounded-2xl space-y-6">
        {/* Resumo do Evento */}
        <div className="flex items-center gap-4 pb-6 border-b border-subtle">
          <img
            src={reservation.event.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80'}
            alt={reservation.event.title}
            className="w-20 h-20 object-cover rounded-xl border border-subtle"
          />
          <div>
            <h3 className="font-bold text-white text-base">{reservation.event.title}</h3>
            <p className="text-xs text-muted mt-1">{new Date(reservation.event.date).toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted">{reservation.event.location}</p>
          </div>
        </div>

        {/* Detalhes da Reserva */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Ingressos Pista ({reservation.quantity}x)</span>
            <span className="text-white font-medium">R$ {Number(reservation.event.price).toFixed(2).replace('.', ',')} cada</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Status da Reserva</span>
            <span className="text-[#C8B4FF] font-semibold">{reservation.status}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-subtle">
            <span>Total a Pagar</span>
            <span className="text-[#C8B4FF]">R$ {Number(reservation.total).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Timer de Expiração */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3.5 rounded-xl flex items-center gap-3 text-xs text-yellow-300">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Sua reserva expira em 10 minutos. O estoque está reservado para você.</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Tela de Resultado do Pagamento Simulado */}
        {paymentResult === 'APPROVED' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Pagamento Aprovado com Sucesso!</h4>
            <p className="text-xs text-muted">Seus ingressos e QR Codes foram gerados. Redirecionando para "Meus Ingressos"...</p>
          </div>
        ) : paymentResult === 'DECLINED' ? (
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-center space-y-2">
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Pagamento Recusado Simulado</h4>
            <p className="text-xs text-muted">O pagamento foi recusado. Os ingressos foram devolvidos ao estoque do evento.</p>
          </div>
        ) : (
          <div className="pt-4 border-t border-subtle space-y-3">
            <p className="text-xs font-semibold text-center text-muted uppercase tracking-wider">Simular Resposta do Gateway de Pagamento</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSimulatePayment('APPROVED')}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simular Aprovação
              </button>

              <button
                onClick={() => handleSimulatePayment('DECLINED')}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Simular Recusa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
