import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../services/api';
import type { GateValidationResult } from '../types';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ShieldCheck, Camera, Keyboard, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

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

    // Se o token for uma URL de compartilhamento, extrair o código hash final
    let cleanToken = tokenToValidate.trim();
    if (cleanToken.includes('/share/')) {
      cleanToken = cleanToken.split('/share/').pop() || cleanToken;
    } else if (cleanToken.includes('token=')) {
      cleanToken = new URLSearchParams(cleanToken.split('?')[1]).get('token') || cleanToken;
    }

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
        (errorMessage) => {
          // erros continuos de frames sem qr code ignorados
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
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-xl mb-2 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Controle de Portaria</h1>
        <p className="text-sm text-muted">Escaneie o QR Code pela câmera ou digite o código do ingresso</p>
      </div>

      <div className="bg-surface border border-subtle p-6 rounded-2xl space-y-6">
        {/* Scanner / Camera Toggle */}
        <div className="space-y-4">
          {!isScannerActive ? (
            <button
              onClick={startScanner}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Camera className="w-5 h-5" />
              Abrir Câmera para Leitura de QR Code
            </button>
          ) : (
            <div className="space-y-3">
              <div id="reader" className="bg-black rounded-xl overflow-hidden border border-subtle" />
              <button
                onClick={stopScanner}
                className="w-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white font-bold py-2 rounded-xl text-xs transition-all"
              >
                Fechar Câmera
              </button>
            </div>
          )}
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-subtle"></div>
          <span className="flex-shrink mx-4 text-xs text-muted font-semibold">ou digitação manual</span>
          <div className="flex-grow border-t border-subtle"></div>
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
            <label className="block text-xs font-semibold text-muted mb-1">Código do Ingresso / Hash</label>
            <div className="relative">
              <Keyboard className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Cole ou digite o código aqui..."
                className="w-full bg-black/40 border border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !manualToken.trim()}
            className="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Validar Ingresso'}
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Dynamic Validation Result Overlay */}
        {validationResult && (
          <div className="pt-4 border-t border-subtle animate-in fade-in duration-300">
            {validationResult.result === 'VALID' && (
              <div className="bg-emerald-500/15 border-2 border-emerald-500 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-black text-white">✓ INGRESSO VÁLIDO</h3>
                <div className="text-xs text-muted space-y-1 bg-black/40 p-3 rounded-xl border border-emerald-500/30">
                  <p className="text-white font-bold">{validationResult.event?.title}</p>
                  <p>Titular: {validationResult.user?.name}</p>
                  <p className="text-emerald-400 font-bold mt-1">Entrada Liberada!</p>
                </div>
              </div>
            )}

            {validationResult.result === 'ALREADY_USED' && (
              <div className="bg-yellow-500/15 border-2 border-yellow-500 p-6 rounded-2xl text-center space-y-3">
                <AlertTriangle className="w-14 h-14 text-yellow-400 mx-auto" />
                <h3 className="text-xl font-black text-white">✕ INGRESSO JÁ UTILIZADO</h3>
                <p className="text-xs text-muted">{validationResult.message}</p>
                {validationResult.usedAt && (
                  <p className="text-xs text-yellow-300 font-mono">
                    Utilizado em: {new Date(validationResult.usedAt).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            )}

            {(validationResult.result === 'INVALID' ||
              validationResult.result === 'WRONG_EVENT' ||
              validationResult.result === 'CANCELLED') && (
                <div className="bg-red-500/15 border-2 border-red-500 p-6 rounded-2xl text-center space-y-3">
                  <XCircle className="w-14 h-14 text-red-400 mx-auto" />
                  <h3 className="text-xl font-black text-white">✕ ENTRADA RECUSADA</h3>
                  <p className="text-xs text-red-300 font-semibold">{validationResult.message}</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
