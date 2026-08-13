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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0A0A0F] text-[#F0EEF6] flex flex-col font-sans">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
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
          <footer className="bg-surface border-t border-subtle py-6 text-center text-xs text-muted">
            TickEven © 2026 — Desafio Elite Dev Verzel. Todos os direitos reservados.
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
