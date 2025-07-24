import React from 'react';
import type { IColor } from '../domain/entities/IColor';

function getWcagLevel(contrast: number): string {
  if (contrast >= 7) return 'AAA';
  if (contrast >= 4.5) return 'AA';
  if (contrast >= 3) return 'A';
  return 'Insuficiente';
}

function isAccessible(contrast: number): boolean {
  return contrast >= 4.5;
}

interface ColorCardProps extends IColor {
  contrastWithBlack: number;
  contrastWithWhite: number;
}

export const ColorCard: React.FC<ColorCardProps> = ({ hex, rgb, luminance, contrastWithBlack, contrastWithWhite }) => (
  <div className="rounded-lg shadow-md p-4 flex flex-col items-center bg-white w-full max-w-xs mx-auto">
    <div
      className="w-20 h-20 rounded mb-2 border"
      style={{ backgroundColor: hex }}
      aria-label={`Cor ${hex}, contraste com preto: ${typeof contrastWithBlack === 'number' ? contrastWithBlack.toFixed(2) : '--'}, contraste com branco: ${typeof contrastWithWhite === 'number' ? contrastWithWhite.toFixed(2) : '--'}`}
      role="img"
      tabIndex={0}
    ></div>
    <div className="font-mono text-lg mb-1">{hex.toUpperCase()}</div>
    <div className="text-xs text-gray-500 mb-2">RGB: {rgb[0]}, {rgb[1]}, {rgb[2]}</div>
    <div className="flex gap-2 items-center" aria-live="polite">
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-5 rounded text-xs flex items-center justify-center border"
          style={{ backgroundColor: hex, color: '#000' }}
          title={`Contraste com preto: ${typeof contrastWithBlack === 'number' ? contrastWithBlack.toFixed(2) : '--'}:1`}
        >A</div>
        <span className="text-[10px]">Preto</span>
        <span className="text-[10px]">{typeof contrastWithBlack === 'number' ? contrastWithBlack.toFixed(2) : '--'}:1</span>
        <span className={`text-[10px] ${isAccessible(contrastWithBlack) ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
          {isAccessible(contrastWithBlack) ? '✔️ Acessível' : '❌ Não acessível'}
          <span className="ml-1">({getWcagLevel(typeof contrastWithBlack === 'number' ? contrastWithBlack : 0)})</span>
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-5 rounded text-xs flex items-center justify-center border"
          style={{ backgroundColor: hex, color: '#fff' }}
          title={`Contraste com branco: ${typeof contrastWithWhite === 'number' ? contrastWithWhite.toFixed(2) : '--'}:1`}
        >A</div>
        <span className="text-[10px]">Branco</span>
        <span className="text-[10px]">{typeof contrastWithWhite === 'number' ? contrastWithWhite.toFixed(2) : '--'}:1</span>
        <span className={`text-[10px] ${isAccessible(contrastWithWhite) ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
          {isAccessible(contrastWithWhite) ? '✔️ Acessível' : '❌ Não acessível'}
          <span className="ml-1">({getWcagLevel(typeof contrastWithWhite === 'number' ? contrastWithWhite : 0)})</span>
        </span>
      </div>
    </div>
    <div className="text-xs text-gray-400 mt-2">Luminância: {typeof luminance === 'number' ? luminance.toFixed(3) : '--'}</div>
  </div>
); 