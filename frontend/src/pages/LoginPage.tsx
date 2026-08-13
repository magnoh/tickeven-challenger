import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react';

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
      <div className="bg-surface border border-subtle p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-[#C8B4FF]/10 rounded-xl mb-3 text-[#C8B4FF]">
            <Ticket className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Entrar no TickEven</h1>
          <p className="text-muted text-sm mt-1">Acesse sua conta para gerenciar ou comprar ingressos</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-black/40 border border-subtle rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-subtle rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8B4FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold mt-2"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-subtle">
          <p className="text-xs text-muted text-center font-semibold mb-3">Atalhos de Usuários Demo (Senha: 123456)</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickLogin('organizador@demo.com')}
              className="w-full bg-white/5 hover:bg-white/10 text-xs text-white p-2 rounded-lg flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                Organizador
              </span>
              <span className="text-muted">organizador@demo.com</span>
            </button>

            <button
              onClick={() => handleQuickLogin('cliente1@demo.com')}
              className="w-full bg-white/5 hover:bg-white/10 text-xs text-white p-2 rounded-lg flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                Cliente 1
              </span>
              <span className="text-muted">cliente1@demo.com</span>
            </button>

            <button
              onClick={() => handleQuickLogin('portaria@demo.com')}
              className="w-full bg-white/5 hover:bg-white/10 text-xs text-white p-2 rounded-lg flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Portaria
              </span>
              <span className="text-muted">portaria@demo.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
