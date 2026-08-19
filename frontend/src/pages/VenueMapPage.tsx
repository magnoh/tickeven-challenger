import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Info, Sparkles, Ticket } from 'lucide-react';

type VenueType = 'ORION_AMPHITHEATER' | 'STADIUM_ARENA' | 'GRAND_THEATER';

interface SectorInfo {
  id: string;
  name: string;
  category: string;
  price: number;
  capacity: number;
  available: number;
  color: string;
}

export const VenueMapPage: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('ORION_AMPHITHEATER');
  const [selectedSector, setSelectedSector] = useState<SectorInfo | null>({
    id: 'GA_PIT',
    name: 'GA Pit (Pista Premium)',
    category: 'Pista em Pé',
    price: 180,
    capacity: 250,
    available: 84,
    color: '#D9534F',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#26332C] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3B341]/10 border border-[#E3B341]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E3B341]" />
            <span className="eyebrow text-[#E3B341]">Modelagem Arquitetural de Venues</span>
          </div>
          <h1 className="font-anton text-3xl sm:text-5xl uppercase tracking-wide text-[#EDEAE0]">
            Plantas de Salas & Arenas
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA39B] mt-1 max-w-xl">
            Visualize os 3 tipos de layout interativos com setores em arco, estádio e teatro clássico. Clique nos setores para inspecionar capacidades e valores.
          </p>
        </div>

        {/* Venue Selector Tabs */}
        <div className="flex items-center bg-[#151E1A] border border-[#26332C] rounded-[3px] p-1 gap-1">
          <button
            onClick={() => {
              setSelectedVenue('ORION_AMPHITHEATER');
              setSelectedSector({
                id: 'GA_PIT',
                name: 'GA Pit (Pista Premium)',
                category: 'Pista em Pé',
                price: 180,
                capacity: 250,
                available: 84,
                color: '#D9534F',
              });
            }}
            className={`px-3.5 py-2 rounded-[2px] text-xs font-mono transition-all uppercase cursor-pointer ${
              selectedVenue === 'ORION_AMPHITHEATER'
                ? 'bg-[#E3B341] text-[#0E1512] font-bold shadow-sm'
                : 'text-[#9AA39B] hover:text-[#EDEAE0]'
            }`}
          >
            1. Anfiteatro Orion
          </button>

          <button
            onClick={() => {
              setSelectedVenue('STADIUM_ARENA');
              setSelectedSector({
                id: 'GRAMADO',
                name: 'Gramado Central (Pista)',
                category: 'Pista Livre',
                price: 150,
                capacity: 800,
                available: 310,
                color: '#2E7D32',
              });
            }}
            className={`px-3.5 py-2 rounded-[2px] text-xs font-mono transition-all uppercase cursor-pointer ${
              selectedVenue === 'STADIUM_ARENA'
                ? 'bg-[#E3B341] text-[#0E1512] font-bold shadow-sm'
                : 'text-[#9AA39B] hover:text-[#EDEAE0]'
            }`}
          >
            2. Estádio / Arena
          </button>

          <button
            onClick={() => {
              setSelectedVenue('GRAND_THEATER');
              setSelectedSector({
                id: 'PLATEIA_A',
                name: 'Plateia Central Nobre',
                category: 'Assento Numerado',
                price: 120,
                capacity: 180,
                available: 42,
                color: '#9C27B0',
              });
            }}
            className={`px-3.5 py-2 rounded-[2px] text-xs font-mono transition-all uppercase cursor-pointer ${
              selectedVenue === 'GRAND_THEATER'
                ? 'bg-[#E3B341] text-[#0E1512] font-bold shadow-sm'
                : 'text-[#9AA39B] hover:text-[#EDEAE0]'
            }`}
          >
            3. Teatro Clássico
          </button>
        </div>
      </div>

      {/* Main Grid: Visualizer + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-[#151E1A] border border-[#26332C] rounded-[4px] p-6 sm:p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-[#26332C] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#E3B341]" />
              <span className="font-anton text-lg uppercase tracking-wide text-[#EDEAE0]">
                {selectedVenue === 'ORION_AMPHITHEATER' && 'The Orion Amphitheater (Visão de Planta)'}
                {selectedVenue === 'STADIUM_ARENA' && 'Arena Olímpica & Estádio Multiuso'}
                {selectedVenue === 'GRAND_THEATER' && 'Theatro Municipal / Sala de Ópera'}
              </span>
            </div>
            <span className="mono text-[10px] text-[#9AA39B] uppercase tracking-wider">
              Clique para selecionar setor
            </span>
          </div>

          {/* Renderização do mapa selecionado */}
          {selectedVenue === 'ORION_AMPHITHEATER' && (
            <OrionAmphitheaterSvg
              selectedId={selectedSector?.id || ''}
              onSelect={setSelectedSector}
            />
          )}

          {selectedVenue === 'STADIUM_ARENA' && (
            <StadiumArenaSvg
              selectedId={selectedSector?.id || ''}
              onSelect={setSelectedSector}
            />
          )}

          {selectedVenue === 'GRAND_THEATER' && (
            <GrandTheaterSvg
              selectedId={selectedSector?.id || ''}
              onSelect={setSelectedSector}
            />
          )}
        </div>

        {/* Sector Details Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#151E1A] border border-[#26332C] rounded-[4px] p-6 space-y-6 shadow-2xl">
            <div className="border-b border-[#26332C] pb-4">
              <p className="eyebrow text-[#E3B341]">Detalhamento do Setor</p>
              <h3 className="font-anton text-2xl uppercase tracking-wide text-[#EDEAE0] mt-1">
                {selectedSector?.name || 'Selecione um setor'}
              </h3>
              <p className="text-xs text-[#9AA39B] mt-0.5">{selectedSector?.category}</p>
            </div>

            {selectedSector ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-[#0E1512] p-4 rounded-[2px] border border-[#26332C] space-y-3">
                  <div className="flex justify-between items-center text-[#9AA39B]">
                    <span>Preço Base:</span>
                    <span className="font-bold text-base text-[#E3B341]">
                      R$ {selectedSector.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#9AA39B]">
                    <span>Capacidade Máxima:</span>
                    <span className="text-[#EDEAE0] font-semibold">{selectedSector.capacity} lugares</span>
                  </div>
                  <div className="flex justify-between items-center text-[#9AA39B]">
                    <span>Disponibilidade:</span>
                    <span className="text-emerald-400 font-bold">{selectedSector.available} ingressos</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#9AA39B] bg-[#E3B341]/10 border border-[#E3B341]/20 p-3 rounded-[2px]">
                  <Info className="w-4 h-4 text-[#E3B341] flex-shrink-0" />
                  <span>Este modelo de layout pode ser associado a qualquer evento criado no painel do organizador.</span>
                </div>

                <Link
                  to="/events"
                  className="w-full btn-gold py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Ver Eventos Nesta Arena</span>
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center text-[#9AA39B] text-xs">
                Clique em qualquer setor colorido no mapa para ver informações de preço e lotação.
              </div>
            )}
          </div>

          {/* Legenda de Setores */}
          <div className="bg-[#151E1A] border border-[#26332C] rounded-[4px] p-6 space-y-3">
            <h4 className="font-anton text-sm uppercase tracking-wider text-[#EDEAE0]">
              Legenda de Categorias
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-[2px] bg-[#D9534F] flex-shrink-0"></span>
                <span className="text-[#EDEAE0]">GA Pit / Pista Premium</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-[2px] bg-[#F59E0B] flex-shrink-0"></span>
                <span className="text-[#EDEAE0]">Floor Level (FL 1 - 4)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-[2px] bg-[#AB47BC] flex-shrink-0"></span>
                <span className="text-[#EDEAE0]">Setor Inferior 100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-[2px] bg-[#42A5F5] flex-shrink-0"></span>
                <span className="text-[#EDEAE0]">Arquibancada Nível 200</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-[2px] bg-[#9CCC65] flex-shrink-0"></span>
                <span className="text-[#EDEAE0]">Arquibancada Superior 300</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   1. MAPA ANFITEATRO (Fiel à imagem Orion Amphitheater)
   ========================================================================= */
interface SvgProps {
  selectedId: string;
  onSelect: (sector: SectorInfo) => void;
}

const OrionAmphitheaterSvg: React.FC<SvgProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <svg
        viewBox="0 0 800 850"
        className="w-full h-auto select-none"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
      >
        {/* Título Orion */}
        <text
          x="400"
          y="40"
          textAnchor="middle"
          fill="#EDEAE0"
          fontFamily="Anton, sans-serif"
          fontSize="30"
          letterSpacing="2"
        >
          THE ORION AMPHITHEATER
        </text>

        {/* Palco / Stage */}
        <g id="stage-group" transform="translate(260, 70)">
          <rect
            width="280"
            height="110"
            rx="4"
            fill="#333333"
            stroke="#555555"
            strokeWidth="2"
          />
          <text
            x="140"
            y="65"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Anton, sans-serif"
            fontSize="32"
            letterSpacing="2"
          >
            STAGE
          </text>
        </g>

        {/* GA Pit (Vermelho) */}
        <g
          className="cursor-pointer transition-transform hover:opacity-90"
          onClick={() =>
            onSelect({
              id: 'GA_PIT',
              name: 'GA Pit (Pista Central)',
              category: 'Pista em Pé',
              price: 180,
              capacity: 250,
              available: 84,
              color: '#D9534F',
            })
          }
        >
          <rect
            x="260"
            y="210"
            width="280"
            height="85"
            rx="4"
            fill="#D9534F"
            stroke={selectedId === 'GA_PIT' ? '#FFFFFF' : '#B03A2E'}
            strokeWidth={selectedId === 'GA_PIT' ? '4' : '1.5'}
          />
          <text
            x="400"
            y="262"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Anton, sans-serif"
            fontSize="28"
            letterSpacing="1.5"
          >
            GA Pit
          </text>
        </g>

        {/* Setores Floor FL 4, FL 3, FL 2, FL 1 (Laranja) */}
        {/* FL 4 */}
        <g
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() =>
            onSelect({
              id: 'FL_4',
              name: 'Floor Level 4 (FL 4)',
              category: 'Pista Premium Lateral',
              price: 140,
              capacity: 60,
              available: 18,
              color: '#F59E0B',
            })
          }
        >
          <path
            d="M 270 310 L 315 310 L 315 370 L 295 370 L 295 350 L 270 330 Z"
            fill="#F59E0B"
            stroke={selectedId === 'FL_4' ? '#FFFFFF' : '#D97706'}
            strokeWidth={selectedId === 'FL_4' ? '3' : '1'}
          />
          <text x="290" y="332" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold">
            FL 4
          </text>
        </g>

        {/* FL 3 */}
        <g
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() =>
            onSelect({
              id: 'FL_3',
              name: 'Floor Level 3 (FL 3)',
              category: 'Pista Premium Central',
              price: 160,
              capacity: 100,
              available: 26,
              color: '#F59E0B',
            })
          }
        >
          <path
            d="M 330 310 L 395 310 L 395 395 L 355 395 L 355 410 L 345 395 L 330 395 Z"
            fill="#F59E0B"
            stroke={selectedId === 'FL_3' ? '#FFFFFF' : '#D97706'}
            strokeWidth={selectedId === 'FL_3' ? '3' : '1'}
          />
          <text x="362" y="345" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">
            FL 3
          </text>
        </g>

        {/* FL 2 */}
        <g
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() =>
            onSelect({
              id: 'FL_2',
              name: 'Floor Level 2 (FL 2)',
              category: 'Pista Premium Central',
              price: 160,
              capacity: 100,
              available: 34,
              color: '#F59E0B',
            })
          }
        >
          <path
            d="M 405 310 L 470 310 L 470 395 L 455 395 L 445 410 L 445 395 L 405 395 Z"
            fill="#F59E0B"
            stroke={selectedId === 'FL_2' ? '#FFFFFF' : '#D97706'}
            strokeWidth={selectedId === 'FL_2' ? '3' : '1'}
          />
          <text x="438" y="345" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">
            FL 2
          </text>
        </g>

        {/* FL 1 */}
        <g
          className="cursor-pointer transition-all hover:opacity-90"
          onClick={() =>
            onSelect({
              id: 'FL_1',
              name: 'Floor Level 1 (FL 1)',
              category: 'Pista Premium Lateral',
              price: 140,
              capacity: 60,
              available: 15,
              color: '#F59E0B',
            })
          }
        >
          <path
            d="M 485 310 L 530 310 L 530 330 L 505 350 L 505 370 L 485 370 Z"
            fill="#F59E0B"
            stroke={selectedId === 'FL_1' ? '#FFFFFF' : '#D97706'}
            strokeWidth={selectedId === 'FL_1' ? '3' : '1'}
          />
          <text x="508" y="332" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold">
            FL 1
          </text>
        </g>

        {/* SETOR 100 (Roxo em arco) */}
        {/* 111 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_111', name: 'Setor 111', category: 'Camarote Lateral Oeste', price: 130, capacity: 40, available: 12, color: '#AB47BC' })}>
          <rect x="210" y="210" width="28" height="60" rx="3" fill="#AB47BC" stroke={selectedId === 'SEC_111' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="224" y="245" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold">111</text>
        </g>
        {/* 110 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_110', name: 'Setor 110', category: 'Setor Inferior Oeste', price: 120, capacity: 50, available: 14, color: '#AB47BC' })}>
          <path d="M 225 305 L 255 315 L 265 390 L 235 375 Z" fill="#AB47BC" stroke={selectedId === 'SEC_110' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="245" y="350" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold">110</text>
        </g>
        {/* 109 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_109', name: 'Setor 109', category: 'Setor Inferior Sudoeste', price: 120, capacity: 50, available: 18, color: '#AB47BC' })}>
          <path d="M 265 395 L 295 410 L 320 450 L 290 435 Z" fill="#AB47BC" stroke={selectedId === 'SEC_109' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="290" y="425" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold">109</text>
        </g>
        {/* 107 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_107', name: 'Setor 107', category: 'Setor Inferior Sul', price: 120, capacity: 40, available: 8, color: '#AB47BC' })}>
          <path d="M 335 440 L 365 445 L 360 465 L 330 460 Z" fill="#AB47BC" stroke={selectedId === 'SEC_107' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="350" y="457" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="9" fontWeight="bold">107</text>
        </g>
        {/* Arco Central Preto */}
        <path d="M 368 445 Q 400 450 432 445 L 435 470 Q 400 478 365 470 Z" fill="#333333" stroke="#555" />
        {/* 105 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_105', name: 'Setor 105', category: 'Setor Inferior Sul', price: 120, capacity: 40, available: 9, color: '#AB47BC' })}>
          <path d="M 435 445 L 465 440 L 470 460 L 440 465 Z" fill="#AB47BC" stroke={selectedId === 'SEC_105' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="450" y="457" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="9" fontWeight="bold">105</text>
        </g>
        {/* 103 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_103', name: 'Setor 103', category: 'Setor Inferior Sudeste', price: 120, capacity: 50, available: 16, color: '#AB47BC' })}>
          <path d="M 480 410 L 510 395 L 485 435 L 510 450 Z" fill="#AB47BC" stroke={selectedId === 'SEC_103' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="510" y="425" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold">103</text>
        </g>
        {/* 102 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_102', name: 'Setor 102', category: 'Setor Inferior Leste', price: 120, capacity: 50, available: 11, color: '#AB47BC' })}>
          <path d="M 545 315 L 575 305 L 565 375 L 535 390 Z" fill="#AB47BC" stroke={selectedId === 'SEC_102' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="555" y="350" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold">102</text>
        </g>
        {/* 101 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_101', name: 'Setor 101', category: 'Camarote Lateral Leste', price: 130, capacity: 40, available: 15, color: '#AB47BC' })}>
          <rect x="562" y="210" width="28" height="60" rx="3" fill="#AB47BC" stroke={selectedId === 'SEC_101' ? '#FFF' : '#8E24AA'} strokeWidth="2" />
          <text x="576" y="245" textAnchor="middle" fill="#FFF" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold">101</text>
        </g>

        {/* SETOR 200 (Azul Claro) */}
        {/* 211 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_211', name: 'Setor 211', category: 'Arquibancada Oeste Alta', price: 95, capacity: 90, available: 32, color: '#42A5F5' })}>
          <path d="M 70 215 L 175 220 L 175 285 L 125 285 L 125 310 L 75 330 Z" fill="#42A5F5" stroke={selectedId === 'SEC_211' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="120" y="260" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">211</text>
        </g>
        {/* 210 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_210', name: 'Setor 210', category: 'Arquibancada Sudoeste', price: 95, capacity: 110, available: 45, color: '#42A5F5' })}>
          <path d="M 80 345 L 140 325 L 210 405 L 130 460 Z" fill="#42A5F5" stroke={selectedId === 'SEC_210' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="145" y="390" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">210</text>
        </g>
        {/* 209 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_209', name: 'Setor 209', category: 'Arquibancada Sul-Oeste', price: 95, capacity: 120, available: 38, color: '#42A5F5' })}>
          <path d="M 140 480 L 225 425 L 280 570 L 180 595 Z" fill="#42A5F5" stroke={selectedId === 'SEC_209' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="215" y="510" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">209</text>
        </g>
        {/* 207 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_207', name: 'Setor 207', category: 'Arquibancada Sul Central', price: 95, capacity: 80, available: 20, color: '#42A5F5' })}>
          <path d="M 295 540 L 340 500 L 370 610 L 265 635 Z" fill="#42A5F5" stroke={selectedId === 'SEC_207' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="320" y="565" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">207</text>
        </g>
        {/* 206 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_206', name: 'Setor 206', category: 'Arquibancada Sul Central Nobre', price: 100, capacity: 80, available: 22, color: '#42A5F5' })}>
          <path d="M 375 510 L 425 510 L 440 615 L 360 615 Z" fill="#42A5F5" stroke={selectedId === 'SEC_206' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="400" y="565" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">206</text>
        </g>
        {/* 205 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_205', name: 'Setor 205', category: 'Arquibancada Sul Central', price: 95, capacity: 80, available: 29, color: '#42A5F5' })}>
          <path d="M 460 500 L 505 540 L 535 635 L 430 610 Z" fill="#42A5F5" stroke={selectedId === 'SEC_205' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="480" y="565" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">205</text>
        </g>
        {/* 203 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_203', name: 'Setor 203', category: 'Arquibancada Sul-Leste', price: 95, capacity: 120, available: 41, color: '#42A5F5' })}>
          <path d="M 575 425 L 660 480 L 620 595 L 520 570 Z" fill="#42A5F5" stroke={selectedId === 'SEC_203' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="585" y="510" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">203</text>
        </g>
        {/* 202 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_202', name: 'Setor 202', category: 'Arquibancada Sudeste', price: 95, capacity: 110, available: 37, color: '#42A5F5' })}>
          <path d="M 660 325 L 720 345 L 670 460 L 590 405 Z" fill="#42A5F5" stroke={selectedId === 'SEC_202' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="655" y="390" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">202</text>
        </g>
        {/* 201 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_201', name: 'Setor 201', category: 'Arquibancada Leste Alta', price: 95, capacity: 90, available: 30, color: '#42A5F5' })}>
          <path d="M 625 220 L 730 215 L 725 330 L 675 310 L 675 285 L 625 285 Z" fill="#42A5F5" stroke={selectedId === 'SEC_201' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="680" y="260" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold">201</text>
        </g>

        {/* SETOR 300 (Verde Claro) */}
        {/* 311 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_311', name: 'Setor 311', category: 'Superior Lateral Oeste', price: 70, capacity: 60, available: 20, color: '#9CCC65' })}>
          <path d="M 35 250 L 22 350 L 35 340 Z" fill="#9CCC65" stroke={selectedId === 'SEC_311' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="27" y="305" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold" transform="rotate(-90 27 305)">311</text>
        </g>
        {/* 310 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_310', name: 'Setor 310', category: 'Superior Oeste', price: 70, capacity: 80, available: 28, color: '#9CCC65' })}>
          <path d="M 20 370 L 70 355 L 85 455 L 30 500 Z" fill="#9CCC65" stroke={selectedId === 'SEC_310' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="50" y="430" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold">310</text>
        </g>
        {/* 309 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_309', name: 'Setor 309', category: 'Superior Sudoeste', price: 70, capacity: 90, available: 31, color: '#9CCC65' })}>
          <path d="M 45 520 L 105 470 L 160 590 L 80 645 Z" fill="#9CCC65" stroke={selectedId === 'SEC_309' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="100" y="565" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold">309</text>
        </g>
        {/* 308 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_308', name: 'Setor 308', category: 'Superior Sul-Oeste', price: 70, capacity: 90, available: 40, color: '#9CCC65' })}>
          <path d="M 105 660 L 185 605 L 245 715 L 155 770 Z" fill="#9CCC65" stroke={selectedId === 'SEC_308' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="170" y="690" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">308</text>
        </g>
        {/* 307 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_307', name: 'Setor 307', category: 'Superior Sul Central', price: 75, capacity: 80, available: 22, color: '#9CCC65' })}>
          <path d="M 180 780 L 265 725 L 345 805 L 250 840 Z" fill="#9CCC65" stroke={selectedId === 'SEC_307' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="260" y="785" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">307</text>
        </g>
        {/* 306 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_306', name: 'Setor 306', category: 'Superior Sul Central', price: 80, capacity: 100, available: 35, color: '#9CCC65' })}>
          <path d="M 360 730 L 440 730 L 455 830 L 345 830 Z" fill="#9CCC65" stroke={selectedId === 'SEC_306' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="400" y="785" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">306</text>
        </g>
        {/* 305 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_305', name: 'Setor 305', category: 'Superior Sul Central', price: 75, capacity: 80, available: 19, color: '#9CCC65' })}>
          <path d="M 535 725 L 620 780 L 550 840 L 455 805 Z" fill="#9CCC65" stroke={selectedId === 'SEC_305' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="540" y="785" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">305</text>
        </g>
        {/* 304 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_304', name: 'Setor 304', category: 'Superior Sul-Leste', price: 70, capacity: 90, available: 33, color: '#9CCC65' })}>
          <path d="M 615 605 L 695 660 L 645 770 L 555 715 Z" fill="#9CCC65" stroke={selectedId === 'SEC_304' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="630" y="690" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="13" fontWeight="bold">304</text>
        </g>
        {/* 303 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_303', name: 'Setor 303', category: 'Superior Sudeste', price: 70, capacity: 90, available: 42, color: '#9CCC65' })}>
          <path d="M 695 470 L 755 520 L 720 645 L 640 590 Z" fill="#9CCC65" stroke={selectedId === 'SEC_303' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="700" y="565" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold">303</text>
        </g>
        {/* 302 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_302', name: 'Setor 302', category: 'Superior Leste', price: 70, capacity: 80, available: 25, color: '#9CCC65' })}>
          <path d="M 730 355 L 780 370 L 770 500 L 715 455 Z" fill="#9CCC65" stroke={selectedId === 'SEC_302' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="750" y="430" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold">302</text>
        </g>
        {/* 301 */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'SEC_301', name: 'Setor 301', category: 'Superior Lateral Leste', price: 70, capacity: 60, available: 14, color: '#9CCC65' })}>
          <path d="M 765 250 L 778 350 L 765 340 Z" fill="#9CCC65" stroke={selectedId === 'SEC_301' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="773" y="305" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="bold" transform="rotate(90 773 305)">301</text>
        </g>
      </svg>
    </div>
  );
};

/* =========================================================================
   2. MAPA ESTÁDIO (Arena Esportiva e Shows)
   ========================================================================= */
const StadiumArenaSvg: React.FC<SvgProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <svg
        viewBox="0 0 800 700"
        className="w-full h-auto select-none"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
      >
        <text
          x="400"
          y="40"
          textAnchor="middle"
          fill="#EDEAE0"
          fontFamily="Anton, sans-serif"
          fontSize="28"
          letterSpacing="2"
        >
          ARENA OLÍMPICA & ESTÁDIO
        </text>

        {/* Anel Externo do Estádio */}
        <rect x="80" y="70" width="640" height="580" rx="200" fill="#0E1512" stroke="#26332C" strokeWidth="4" />

        {/* Arquibancada Superior Norte (Palco de Show) */}
        <g
          className="cursor-pointer"
          onClick={() =>
            onSelect({
              id: 'PALCO_NORTE',
              name: 'Setor Palco & Backstage Norte',
              category: 'Área Técnica',
              price: 250,
              capacity: 100,
              available: 12,
              color: '#333333',
            })
          }
        >
          <path d="M 220 90 L 580 90 L 530 160 L 270 160 Z" fill="#333333" stroke={selectedId === 'PALCO_NORTE' ? '#FFF' : '#555'} strokeWidth="2" />
          <text x="400" y="135" textAnchor="middle" fill="#FFF" fontFamily="Anton, sans-serif" fontSize="22" letterSpacing="1.5">
            MEGA PALCO NORTE
          </text>
        </g>

        {/* Pista Premium */}
        <g
          className="cursor-pointer"
          onClick={() =>
            onSelect({
              id: 'PISTA_PREMIUM',
              name: 'Pista Premium Front-Stage',
              category: 'Pista em Pé',
              price: 220,
              capacity: 400,
              available: 95,
              color: '#D9534F',
            })
          }
        >
          <rect x="250" y="180" width="300" height="110" rx="6" fill="#D9534F" stroke={selectedId === 'PISTA_PREMIUM' ? '#FFF' : '#B03A2E'} strokeWidth="3" />
          <text x="400" y="245" textAnchor="middle" fill="#FFF" fontFamily="Anton, sans-serif" fontSize="22">
            PISTA PREMIUM
          </text>
        </g>

        {/* Gramado / Pista Comum */}
        <g
          className="cursor-pointer"
          onClick={() =>
            onSelect({
              id: 'GRAMADO',
              name: 'Gramado Central (Pista Comum)',
              category: 'Pista Livre',
              price: 150,
              capacity: 800,
              available: 310,
              color: '#2E7D32',
            })
          }
        >
          <rect x="230" y="310" width="340" height="170" rx="8" fill="#2E7D32" stroke={selectedId === 'GRAMADO' ? '#FFF' : '#1B5E20'} strokeWidth="3" />
          <text x="400" y="405" textAnchor="middle" fill="#FFF" fontFamily="Anton, sans-serif" fontSize="26">
            GRAMADO CENTRAL
          </text>
        </g>

        {/* Arquibancada Oeste (Inferior e Superior) */}
        <g
          className="cursor-pointer"
          onClick={() =>
            onSelect({
              id: 'ARQ_OESTE',
              name: 'Arquibancada Lateral Oeste',
              category: 'Assento Coberto',
              price: 110,
              capacity: 450,
              available: 120,
              color: '#42A5F5',
            })
          }
        >
          <path d="M 105 180 L 205 200 L 205 480 L 105 500 Z" fill="#42A5F5" stroke={selectedId === 'ARQ_OESTE' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="155" y="350" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold" transform="rotate(-90 155 350)">
            ARQUIBANCADA OESTE
          </text>
        </g>

        {/* Arquibancada Leste (Inferior e Superior) */}
        <g
          className="cursor-pointer"
          onClick={() =>
            onSelect({
              id: 'ARQ_LESTE',
              name: 'Arquibancada Lateral Leste',
              category: 'Assento Coberto',
              price: 110,
              capacity: 450,
              available: 140,
              color: '#42A5F5',
            })
          }
        >
          <path d="M 595 200 L 695 180 L 695 500 L 595 480 Z" fill="#42A5F5" stroke={selectedId === 'ARQ_LESTE' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="645" y="350" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="bold" transform="rotate(90 645 350)">
            ARQUIBANCADA LESTE
          </text>
        </g>

        {/* Arquibancada Sul (Inferior e Superior) */}
        <g
          className="cursor-pointer"
          onClick={() =>
            onSelect({
              id: 'ARQ_SUL',
              name: 'Arquibancada Sul (Fundo)',
              category: 'Assento com Visão Panorâmica',
              price: 90,
              capacity: 500,
              available: 190,
              color: '#9CCC65',
            })
          }
        >
          <path d="M 200 500 L 600 500 L 550 620 L 250 620 Z" fill="#9CCC65" stroke={selectedId === 'ARQ_SUL' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="400" y="565" textAnchor="middle" fill="#000" fontFamily="Anton, sans-serif" fontSize="22">
            ARQUIBANCADA SUL (PANORÂMICA)
          </text>
        </g>
      </svg>
    </div>
  );
};

/* =========================================================================
   3. MAPA TEATRO CLÁSSICO (Plateia, Frisas, Camarotes)
   ========================================================================= */
const GrandTheaterSvg: React.FC<SvgProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <svg
        viewBox="0 0 800 680"
        className="w-full h-auto select-none"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
      >
        <text
          x="400"
          y="40"
          textAnchor="middle"
          fill="#EDEAE0"
          fontFamily="Anton, sans-serif"
          fontSize="28"
          letterSpacing="2"
        >
          THEATRO MUNICIPAL · SALA PRINCIPAL
        </text>

        {/* Palco Italiano */}
        <g id="theater-stage" transform="translate(180, 70)">
          <rect width="440" height="90" rx="4" fill="#8E24AA" stroke="#AB47BC" strokeWidth="2" />
          <text x="220" y="55" textAnchor="middle" fill="#FFF" fontFamily="Anton, sans-serif" fontSize="24" letterSpacing="2">
            PALCO ITALIANO
          </text>
        </g>

        {/* Fosso da Orquestra */}
        <path d="M 220 170 Q 400 200 580 170 L 550 205 Q 400 225 250 205 Z" fill="#333333" stroke="#555" />
        <text x="400" y="195" textAnchor="middle" fill="#AAA" fontFamily="IBM Plex Mono" fontSize="10">
          FOSSO DA ORQUESTRA
        </text>

        {/* Frisas Laterais Esquerdas */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'FRISAS_ESQ', name: 'Frisas Nobres (Esquerda)', category: 'Camarote Lateral Privativo', price: 160, capacity: 36, available: 8, color: '#F59E0B' })}>
          <rect x="80" y="180" width="75" height="260" rx="4" fill="#F59E0B" stroke={selectedId === 'FRISAS_ESQ' ? '#FFF' : '#D97706'} strokeWidth="2" />
          <text x="117" y="315" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold" transform="rotate(-90 117 315)">
            FRISAS ESQUERDA
          </text>
        </g>

        {/* Frisas Laterais Direitas */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'FRISAS_DIR', name: 'Frisas Nobres (Direita)', category: 'Camarote Lateral Privativo', price: 160, capacity: 36, available: 6, color: '#F59E0B' })}>
          <rect x="645" y="180" width="75" height="260" rx="4" fill="#F59E0B" stroke={selectedId === 'FRISAS_DIR' ? '#FFF' : '#D97706'} strokeWidth="2" />
          <text x="682" y="315" textAnchor="middle" fill="#000" fontFamily="IBM Plex Mono" fontSize="12" fontWeight="bold" transform="rotate(90 682 315)">
            FRISAS DIREITA
          </text>
        </g>

        {/* Plateia Nobre Central */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'PLATEIA_A', name: 'Plateia Central Nobre', category: 'Assento Numerado VIP', price: 140, capacity: 180, available: 38, color: '#AB47BC' })}>
          <rect x="180" y="230" width="440" height="150" rx="6" fill="#AB47BC" stroke={selectedId === 'PLATEIA_A' ? '#FFF' : '#8E24AA'} strokeWidth="3" />
          <text x="400" y="315" textAnchor="middle" fill="#FFF" fontFamily="Anton, sans-serif" fontSize="26">
            PLATEIA NOBRE CENTRAL
          </text>
        </g>

        {/* Balcão Nobre */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'BALCAO_NOBRE', name: 'Balcão Nobre Superior', category: 'Assento Elevado', price: 100, capacity: 140, available: 45, color: '#42A5F5' })}>
          <path d="M 160 410 L 640 410 L 610 500 L 190 500 Z" fill="#42A5F5" stroke={selectedId === 'BALCAO_NOBRE' ? '#FFF' : '#1E88E5'} strokeWidth="2" />
          <text x="400" y="465" textAnchor="middle" fill="#000" fontFamily="Anton, sans-serif" fontSize="22">
            BALCÃO NOBRE SUPERIOR
          </text>
        </g>

        {/* Mezanino / Galeria */}
        <g className="cursor-pointer" onClick={() => onSelect({ id: 'MEZANINO', name: 'Galeria & Mezanino', category: 'Visão Geral Panorâmica', price: 75, capacity: 160, available: 60, color: '#9CCC65' })}>
          <path d="M 130 530 L 670 530 L 630 630 L 170 630 Z" fill="#9CCC65" stroke={selectedId === 'MEZANINO' ? '#FFF' : '#7CB342'} strokeWidth="2" />
          <text x="400" y="585" textAnchor="middle" fill="#000" fontFamily="Anton, sans-serif" fontSize="22">
            GALERIA & MEZANINO
          </text>
        </g>
      </svg>
    </div>
  );
};
