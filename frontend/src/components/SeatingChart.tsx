import React, { useMemo } from 'react';
import { Armchair, Sparkles } from 'lucide-react';

interface SeatingChartProps {
  capacity: number;
  occupiedSeats: string[];
  selectedSeats: string[];
  onSeatToggle: (seat: string) => void;
  type?: 'EVENT' | 'MOVIE';
}

export const SeatingChart: React.FC<SeatingChartProps> = ({
  capacity,
  occupiedSeats,
  selectedSeats,
  onSeatToggle,
  type = 'EVENT',
}) => {
  const COLS = 12; // Máximo de cadeiras por fileira
  
  // Calcular grid dinamicamente
  const { seatsData } = useMemo(() => {
    const numRows = Math.ceil(capacity / COLS);
    const grid: { id: string; isOccupied: boolean; isSelected: boolean }[][] = [];
    
    let seatCount = 0;
    
    for (let r = 0; r < numRows; r++) {
      const rowLetter = String.fromCharCode(65 + (r % 26)) + (r >= 26 ? Math.floor(r / 26) : '');
      const rowSeats = [];
      
      for (let c = 1; c <= COLS; c++) {
        if (seatCount >= capacity) break;
        
        const seatId = `${rowLetter}${c}`;
        rowSeats.push({
          id: seatId,
          isOccupied: occupiedSeats.includes(seatId),
          isSelected: selectedSeats.includes(seatId),
        });
        
        seatCount++;
      }
      if (rowSeats.length > 0) {
        grid.push(rowSeats);
      }
    }
    
    return { rows: numRows, seatsData: grid };
  }, [capacity, occupiedSeats, selectedSeats]);

  return (
    <div className="flex flex-col items-center bg-[#0E1512] border border-[#26332C] rounded-[4px] p-6 sm:p-10 w-full overflow-hidden">
      
      {/* Stage / Screen */}
      <div className="w-full max-w-lg mb-12 relative flex justify-center">
        <div className="absolute top-0 w-[120%] h-12 rounded-[50%] blur-xl opacity-15 pointer-events-none bg-[#E3B341]" />
        <div className="w-[90%] h-2.5 rounded-[50%] shadow-[0_10px_30px_rgba(227,179,65,0.4)] bg-gradient-to-r from-[#26332C] via-[#E3B341] to-[#26332C]" />
        <p className="absolute top-4 text-xs font-mono font-bold tracking-widest text-[#E3B341] uppercase">
          {type === 'MOVIE' ? 'Tela do Cinema (TMDB)' : 'Palco Principal'}
        </p>
      </div>

      {/* Grid de Cadeiras */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex flex-col gap-3 sm:gap-4 min-w-max mx-auto items-center">
          {seatsData.map((row, rIndex) => (
            <div key={rIndex} className="flex gap-2 sm:gap-3 items-center">
              {/* Row Label L */}
              <div className="w-6 text-center text-[10px] font-mono font-bold text-[#9AA39B]/50">
                {row[0]?.id.match(/[A-Z]+/)?.[0]}
              </div>
              
              {/* Seats */}
              <div className="flex gap-2 sm:gap-3">
                {row.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => !seat.isOccupied && onSeatToggle(seat.id)}
                    disabled={seat.isOccupied}
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-[3px] flex items-center justify-center transition-all duration-200 group ${
                      seat.isOccupied
                        ? 'bg-[#151E1A] border border-[#26332C] cursor-not-allowed opacity-30'
                        : seat.isSelected
                        ? 'bg-[#E3B341] border border-[#E3B341] text-[#0E1512] shadow-[0_0_15px_rgba(227,179,65,0.6)] scale-110 z-10'
                        : 'bg-[#151E1A] border border-[#26332C] hover:border-[#E3B341] hover:bg-[#E3B341]/10 hover:-translate-y-0.5'
                    }`}
                    title={seat.isOccupied ? `Assento ${seat.id} indisponível` : `Assento ${seat.id}`}
                  >
                    <Armchair className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      seat.isOccupied ? 'text-[#9AA39B]/30' : seat.isSelected ? 'text-[#0E1512]' : 'text-[#9AA39B] group-hover:text-[#E3B341]'
                    }`} />
                    
                    {seat.isSelected && (
                      <Sparkles className="absolute -top-1.5 -right-1.5 w-3 h-3 text-[#0E1512] animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Row Label R */}
              <div className="w-6 text-center text-[10px] font-mono font-bold text-[#9AA39B]/50">
                {row[0]?.id.match(/[A-Z]+/)?.[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-10 flex gap-6 items-center flex-wrap justify-center bg-[#151E1A] px-6 py-2.5 rounded-[3px] border border-[#26332C]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[2px] bg-[#151E1A] border border-[#26332C]" />
          <span className="text-xs font-mono text-[#9AA39B]">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[2px] bg-[#E3B341] border border-[#E3B341]" />
          <span className="text-xs font-mono text-[#EDEAE0] font-semibold">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-[2px] bg-[#151E1A] border border-[#26332C] opacity-30" />
          <span className="text-xs font-mono text-[#9AA39B]">Ocupado</span>
        </div>
      </div>
    </div>
  );
};

