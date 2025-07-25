import React, { useState } from 'react';
import type { IColor } from '../../domain/entities/IColor';
import { FiCopy, FiTrash2 } from 'react-icons/fi';

interface PaletteEditCardProps {
  colors: IColor[];
  onEdit: (idx: number, hex: string) => void;
  onRemove: (idx: number) => void;
}

export const PaletteEditCard: React.FC<PaletteEditCardProps> = ({
  colors,
  onEdit,
  onRemove,
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
          tabIndex={0}
        >
          {/* Overlay de edição ao expandir */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${hovered === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="flex flex-col items-center gap-2">
              <input
                type="text"
                value={color.hex}
                onChange={e => onEdit(idx, e.target.value)}
                className="text-center font-mono text-lg rounded px-2 py-1 bg-white bg-opacity-80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                maxLength={7}
                style={{ width: 90 }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleCopy(color.hex, idx)}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <FiCopy className="text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
              {copiedIdx === idx && (
                <span className="mt-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow animate-bounce z-10">
                  Copiado!
                </span>
              )}
            </div>
          </div>
          {/* HEX fixo no canto ao não expandir */}
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
