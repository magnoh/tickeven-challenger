import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../services/api';
import type { GateValidationResult } from '../types';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ShieldCheck, Camera, Keyboard, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Ticket, MapPin, Calendar, User } from 'lucide-react';

export const GatePage: React.FC = () => {
  const [manualToken, setManualToken] = useState('');
  const [validationResult, setValidationResult] = useState<GateValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerActive, setIsScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleValidate = async (tokenToValidate: string) => {
    if (!tokenToValidate.trim()) return;
    setIsLoading(true);
    setError('');
    setValidationResult(null);

    // Normalização no cliente (mesmo padrão robusto do backend)
    let cleanToken = tokenToValidate.trim();
    if (cleanToken.includes('/tickets/share/')) {
      cleanToken = cleanToken.split('/tickets/share/')[1] || cleanToken;
    } else if (cleanToken.includes('/share/')) {
      cleanToken = cleanToken.split('/share/')[1] || cleanToken;
    }

    if (cleanToken.includes('token=')) {
      cleanToken = cleanToken.split('token=')[1] || cleanToken;
    }

    cleanToken = cleanToken.split('?')[0].split('&')[0].split('#')[0].replace(/['"\s]/g, '').trim();

    try {
      const result = await apiFetch<GateValidationResult>('/gate/validate', {
        method: 'POST',
        body: JSON.stringify({ token: cleanToken }),
      });

      setValidationResult(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com o servidor de validação');
    } finally {
      setIsLoading(false);
    }
  };

  const startScanner = () => {
    setIsScannerActive(true);
    setTimeout(() => {
      if (scannerRef.current) return;

      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleValidate(decodedText);
          scanner.clear();
          setIsScannerActive(false);
          scannerRef.current = null;
        },
        () => {
          // frames intermediários sem QR ignorados
        }
      );

      scannerRef.current = scanner;
    }, 300);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => { });
      scannerRef.current = null;
    }
    setIsScannerActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => { });
      }
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-1 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <p className="eyebrow text-emerald-400">Scanner de Validação Instantânea</p>
        <h1 className="font-anton text-3xl uppercase tracking-wide text-[#EDEAE0]">
          Controle de Portaria
        </h1>
        <p className="text-xs text-[#9AA39B]">Escaneie o QR Code pela câmera ou digite o código/hash do ingresso</p>
      </div>

      <div className="bg-[#151E1A] border border-[#26332C] p-6 sm:p-8 rounded-[4px] space-y-6 shadow-2xl">
        {/* Scanner / Camera Toggle */}
        <div className="space-y-3">
          {!isScannerActive ? (
            <button
              onClick={startScanner}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-[#0E1512] font-mono font-bold py-3.5 px-4 rounded-[2px] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Camera className="w-4 h-4" />
              Abrir Câmera para Leitura do QR Code
            </button>
          ) : (
            <div className="space-y-3">
              <div id="reader" className="bg-[#0E1512] rounded-[3px] overflow-hidden border border-[#26332C]" />
              <button
                onClick={stopScanner}
                className="w-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white font-mono font-bold py-2 rounded-[2px] text-xs transition-all uppercase cursor-pointer"
              >
                Fechar Câmera
              </button>
            </div>
          )}
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#26332C]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-[#9AA39B] font-bold">ou digitação manual</span>
          <div className="flex-grow border-t border-[#26332C]"></div>
        </div>

        {/* Manual Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleValidate(manualToken);
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9AA39B] mb-1.5">
              Código do Ingresso / URL de Compartilhamento
            </label>
            <div className="relative">
              <Keyboard className="w-4 h-4 text-[#9AA39B] absolute left-3 top-3.5" />
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Cole o código hash ou URL do ingresso..."
                className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] pl-9 pr-3 py-2.5 text-xs text-[#EDEAE0] font-mono placeholder-[#9AA39B]/40 focus:outline-none focus:border-[#E3B341]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !manualToken.trim()}
            className="w-full btn-gold py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Validar Ingresso na Portaria'}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-[2px] text-xs text-center font-mono">
            {error}
          </div>
        )}

        {/* Dynamic Validation Result Overlay */}
        {validationResult && (
          <div className="pt-4 border-t border-[#26332C] animate-in fade-in duration-300">
            {validationResult.result === 'VALID' && (
              <div className="bg-emerald-500/15 border-2 border-emerald-500 p-6 rounded-[4px] text-center space-y-4 shadow-xl">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <div>
                  <h3 className="font-anton text-2xl uppercase tracking-wide text-white">✓ INGRESSO VÁLIDO</h3>
                  <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5 uppercase tracking-wider">Entrada Liberada!</p>
                </div>
                <div className="text-xs text-[#9AA39B] space-y-2 bg-[#0E1512] p-4 rounded-[2px] border border-emerald-500/30 text-left">
                  <div className="flex items-center gap-2 text-[#EDEAE0] font-bold">
                    <Ticket className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="line-clamp-1">{validationResult.event?.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <User className="w-3.5 h-3.5 text-[#9AA39B]" />
                    <span>Titular: <strong className="text-[#EDEAE0]">{validationResult.user?.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#9AA39B]" />
                    <span>Local: {validationResult.event?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#9AA39B]" />
                    <span>Data: {new Date(validationResult.event?.date).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            )}

            {validationResult.result === 'ALREADY_USED' && (
              <div className="bg-[#E3B341]/15 border-2 border-[#E3B341] p-6 rounded-[4px] text-center space-y-3">
                <AlertTriangle className="w-14 h-14 text-[#E3B341] mx-auto" />
                <h3 className="font-anton text-2xl uppercase tracking-wide text-white">✕ INGRESSO JÁ UTILIZADO</h3>
                <p className="text-xs text-[#9AA39B]">{validationResult.message}</p>
                {validationResult.usedAt && (
                  <p className="text-xs text-[#E3B341] font-mono bg-[#0E1512] p-2 rounded-[2px] border border-[#E3B341]/30">
                    Utilizado em: {new Date(validationResult.usedAt).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            )}

            {(validationResult.result === 'INVALID' ||
              validationResult.result === 'WRONG_EVENT' ||
              validationResult.result === 'CANCELLED') && (
                <div className="bg-red-500/15 border-2 border-red-500 p-6 rounded-[4px] text-center space-y-3">
                  <XCircle className="w-14 h-14 text-red-400 mx-auto" />
                  <h3 className="font-anton text-2xl uppercase tracking-wide text-white">✕ ENTRADA RECUSADA</h3>
                  <p className="text-xs text-red-300 font-mono font-semibold">{validationResult.message}</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

