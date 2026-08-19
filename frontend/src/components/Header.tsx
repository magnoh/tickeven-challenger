import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LogOut, ShieldCheck, PlusCircle, LayoutGrid, Ticket } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0E1512]/90 backdrop-blur-md border-b border-[#26332C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-anton text-2xl tracking-wider text-[#EDEAE0] hover:text-[#E3B341] transition-colors uppercase">
          <span className="logo-mark"></span>
          <span>Tick<span className="text-[#E3B341]">Even</span></span>
        </Link>

        <nav className="flex items-center gap-5 text-xs sm:text-sm font-medium">
          <Link to="/events" className="text-[#9AA39B] hover:text-[#EDEAE0] transition-colors flex items-center gap-1.5 py-1">
            <Calendar className="w-4 h-4 text-[#E3B341]" />
            <span>Eventos</span>
          </Link>

          <Link to="/venue" className="text-[#9AA39B] hover:text-[#EDEAE0] transition-colors flex items-center gap-1.5 py-1">
            <LayoutGrid className="w-4 h-4 text-[#E3B341]" />
            <span>Mapas de Sala</span>
          </Link>

          {user?.role === 'CUSTOMER' && (
            <Link to="/my-tickets" className="text-[#9AA39B] hover:text-[#EDEAE0] transition-colors flex items-center gap-1.5 py-1">
              <Ticket className="w-4 h-4 text-[#E3B341]" />
              <span>Meus Ingressos</span>
            </Link>
          )}

          {user?.role === 'ORGANIZER' && (
            <div className="flex items-center gap-3">
              <Link to="/organizer" className="text-[#9AA39B] hover:text-[#EDEAE0] transition-colors py-1">
                Painel
              </Link>
              <Link to="/organizer/events/new" className="btn-gold py-1.5 px-3 text-xs flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Novo Evento</span>
              </Link>
            </div>
          )}

          {user?.role === 'GATE' && (
            <Link to="/gate" className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-all text-xs font-mono font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Portaria / Scanner</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 border-l border-[#26332C] pl-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-[#EDEAE0] font-semibold">{user.name}</span>
                <span className="text-[10px] text-[#E3B341] font-mono tracking-wider uppercase">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[#9AA39B] hover:text-red-400 transition-colors p-1.5 rounded border border-transparent hover:border-[#26332C]"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-ghost py-1.5 px-3.5 text-xs font-semibold"
              >
                Entrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

