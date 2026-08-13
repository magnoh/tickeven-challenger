import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, LogOut, ShieldCheck, PlusCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface border-b border-subtle sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <Ticket className="w-6 h-6 text-[#C8B4FF]" />
          <span>Tick<span className="text-[#C8B4FF]">Even</span></span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/events" className="text-muted hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Eventos
          </Link>

          {user?.role === 'CUSTOMER' && (
            <Link to="/my-tickets" className="text-muted hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              <Ticket className="w-4 h-4" />
              Meus Ingressos
            </Link>
          )}

          {user?.role === 'ORGANIZER' && (
            <div className="flex items-center gap-4">
              <Link to="/organizer" className="text-muted hover:text-white transition-colors text-sm font-medium">
                Painel
              </Link>
              <Link to="/organizer/events/new" className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                <PlusCircle className="w-4 h-4" />
                Criar Evento
              </Link>
            </div>
          )}

          {user?.role === 'GATE' && (
            <Link to="/gate" className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Portaria
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 border-l border-subtle pl-4">
              <span className="text-xs text-muted font-medium hidden sm:inline">
                {user.name} <span className="text-xs text-[#C8B4FF]">({user.role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-muted hover:text-red-400 transition-colors p-1"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
