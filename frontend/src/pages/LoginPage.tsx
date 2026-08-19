import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    try {
      await login(demoEmail, '123456');
      if (demoEmail.includes('organizador')) navigate('/organizer');
      else if (demoEmail.includes('portaria')) navigate('/gate');
      else navigate('/events');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar usuário demo');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#151E1A] border border-[#26332C] p-8 rounded-[4px] max-w-md w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#E3B341] bg-[#E3B341]/10 text-[#E3B341] mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <p className="eyebrow">Autenticação Segura</p>
          <h1 className="font-anton text-3xl uppercase text-[#EDEAE0] tracking-wide">
            Entrar no TickEven
          </h1>
          <p className="text-xs text-[#9AA39B]">Acesse sua conta para emitir, gerenciar ou validar ingressos</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-[2px] text-xs text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-mono text-[#9AA39B] mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9AA39B] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] pl-9 pr-3 py-2.5 text-sm text-[#EDEAE0] placeholder-[#9AA39B]/50 focus:outline-none focus:border-[#E3B341]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-mono text-[#9AA39B] mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9AA39B] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E1512] border border-[#26332C] rounded-[2px] pl-9 pr-3 py-2.5 text-sm text-[#EDEAE0] placeholder-[#9AA39B]/50 focus:outline-none focus:border-[#E3B341]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-gold py-3 text-xs uppercase tracking-wider font-bold mt-2"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="pt-5 border-t border-[#26332C] space-y-3">
          <p className="eyebrow text-center text-[#9AA39B]">Atalhos Rápidos (Demo · Senha: 123456)</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickLogin('organizador@demo.com')}
              className="w-full bg-[#0E1512] hover:bg-[#1B2621] border border-[#26332C] hover:border-[#E3B341] text-xs text-[#EDEAE0] p-2.5 rounded-[2px] flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2 font-medium">
                <UserCheck className="w-4 h-4 text-[#E3B341]" />
                Organizador
              </span>
              <span className="mono text-[11px] text-[#9AA39B]">organizador@demo.com</span>
            </button>

            <button
              onClick={() => handleQuickLogin('cliente1@demo.com')}
              className="w-full bg-[#0E1512] hover:bg-[#1B2621] border border-[#26332C] hover:border-[#E3B341] text-xs text-[#EDEAE0] p-2.5 rounded-[2px] flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2 font-medium">
                <UserCheck className="w-4 h-4 text-[#E3B341]" />
                Cliente 1
              </span>
              <span className="mono text-[11px] text-[#9AA39B]">cliente1@demo.com</span>
            </button>

            <button
              onClick={() => handleQuickLogin('portaria@demo.com')}
              className="w-full bg-[#0E1512] hover:bg-[#1B2621] border border-[#26332C] hover:border-emerald-500/40 text-xs text-[#EDEAE0] p-2.5 rounded-[2px] flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Portaria (Scanner)
              </span>
              <span className="mono text-[11px] text-[#9AA39B]">portaria@demo.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

