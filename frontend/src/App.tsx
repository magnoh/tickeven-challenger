import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { PublicTicketPage } from './pages/PublicTicketPage';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { CreateEventPage } from './pages/CreateEventPage';
import { GatePage } from './pages/GatePage';
import { VenueMapPage } from './pages/VenueMapPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0E1512] text-[#EDEAE0] flex flex-col font-sans selection:bg-[#E3B341] selection:text-[#0E1512]">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/venue" element={<VenueMapPage />} />
              <Route path="/venues" element={<VenueMapPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/tickets/share/:token" element={<PublicTicketPage />} />

              {/* Rotas Protegidas Cliente */}
              <Route
                path="/checkout/:reservationId"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <MyTicketsPage />
                  </ProtectedRoute>
                }
              />

              {/* Rotas Protegidas Organizador */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute allowedRoles={['ORGANIZER']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/new"
                element={
                  <ProtectedRoute allowedRoles={['ORGANIZER']}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />

              {/* Rota Protegida Portaria */}
              <Route
                path="/gate"
                element={
                  <ProtectedRoute allowedRoles={['GATE']}>
                    <GatePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer estilo Landing Page */}
          <footer className="border-t border-[#26332C] bg-[#0E1512] py-8 text-xs text-[#9AA39B]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-anton text-lg uppercase tracking-wider text-[#EDEAE0]">
                <span className="logo-mark" style={{ width: 16, height: 16 }}></span>
                <span>Tick<span className="text-[#E3B341]">Even</span></span>
              </div>
              <div className="flex items-center gap-6 font-medium">
                <a href="/#eventos" className="hover:text-[#EDEAE0] transition-colors">Eventos</a>
                <a href="/venue" className="hover:text-[#EDEAE0] transition-colors">Mapas de Arenas</a>
                <a href="/#como-funciona" className="hover:text-[#EDEAE0] transition-colors">Como funciona</a>
                <a href="/organizer" className="hover:text-[#EDEAE0] transition-colors">Organizadores</a>
                <a href="/gate" className="hover:text-[#EDEAE0] transition-colors">Portaria</a>
              </div>
              <span className="font-mono text-[11px] text-[#9AA39B]">
                © 2026 TickEven · Desafio Elite Dev
              </span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

