import React, { useState } from 'react';
import type { IColor } from '../../domain/entities/IColor';
import { FiCopy } from 'react-icons/fi';

interface PalettePreviewCardProps {
  colors: IColor[];
}

export const PalettePreviewCard: React.FC<PalettePreviewCardProps> = ({
  colors,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (hex: string, idx: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-white flex h-56 transition-all">
      {colors.map((color, idx) => (
        <div
          key={color.hex + idx}
          className={`flex-1 flex flex-col items-center justify-end cursor-pointer group transition-all duration-300 relative ${hovered === idx ? 'z-10' : ''}`}
          style={{
            background: color.hex,
            flexGrow: hovered === null ? 1 : hovered === idx ? 2.2 : 0.8,
            flexBasis: 0,
            minWidth: 0,
            transition: 'flex-grow 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleCopy(color.hex, idx)}
          tabIndex={0}
          onKeyDown={e =>
            (e.key === 'Enter' || e.key === ' ') && handleCopy(color.hex, idx)
          }
          aria-label={`Copiar código ${color.hex}`}
        >
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${hovered === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <FiCopy className="text-white text-3xl mb-2 drop-shadow" />
            <span className="text-white text-lg font-mono font-bold drop-shadow">
              {color.hex.toUpperCase()}
            </span>
            {copiedIdx === idx && (
              <span className="mt-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow animate-bounce z-10">
                Copiado!
              </span>
            )}
          </div>
          <div
            className={`absolute bottom-4 left-4 text-white text-base font-mono font-bold drop-shadow transition-opacity duration-200 ${hovered === idx ? 'opacity-0' : 'opacity-100'}`}
          >
            {color.hex.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
};
