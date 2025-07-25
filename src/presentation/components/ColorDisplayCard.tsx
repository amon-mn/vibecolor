import React, { useState } from 'react';
import type { IColor } from '../../domain/entities/IColor';
import clsx from 'clsx';

interface ColorDisplayCardProps {
  color: IColor;
}

export const ColorDisplayCard: React.FC<ColorDisplayCardProps> = ({
  color,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const contrastInfo = [
    {
      label: 'Preto',
      contrast: color.contrastBlack,
      accessibleAA: color.isAccessibleAA,
      accessibleAAA: color.isAccessibleAAA,
      textColor: '#000',
    },
    {
      label: 'Branco',
      contrast: color.contrastWhite,
      accessibleAA: color.isAccessibleAA,
      accessibleAAA: color.isAccessibleAAA,
      textColor: '#fff',
    },
  ];

  return (
    <div className="rounded-lg shadow-md p-4 flex flex-col items-center bg-white w-full max-w-xs mx-auto">
      <div
        className="w-20 h-20 rounded mb-2 border cursor-pointer flex items-center justify-center relative"
        style={{ backgroundColor: color.hex }}
        aria-label={`Cor ${color.hex}`}
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCopy()}
        role="button"
        title="Clique para copiar o código hexadecimal"
      >
        {copied && (
          <span
            className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow animate-bounce z-10"
            aria-live="assertive"
            role="status"
          >
            Copiado!
          </span>
        )}
      </div>
      <div className="font-mono text-lg mb-1">{color.hex.toUpperCase()}</div>
      <div className="text-xs text-gray-500 mb-2">
        RGB: {color.rgb.join(', ')}
      </div>
      <div className="flex flex-col gap-1 w-full">
        {contrastInfo.map(info => (
          <div key={info.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-8 h-5 rounded flex items-center justify-center border"
              style={{ backgroundColor: color.hex, color: info.textColor }}
            >
              A
            </span>
            <span>{info.label}</span>
            <span>Contraste: {info.contrast.toFixed(2)}:1</span>
            <span
              className={clsx(
                'ml-1',
                info.accessibleAA ? 'text-green-600' : 'text-red-600'
              )}
            >
              {info.accessibleAA ? '✔️ AA' : '❌ AA'}
            </span>
            <span
              className={clsx(
                'ml-1',
                info.accessibleAAA ? 'text-green-600' : 'text-red-600'
              )}
            >
              {info.accessibleAAA ? '✔️ AAA' : '❌ AAA'}
            </span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Luminância: {color.luminance.toFixed(3)}
      </div>
    </div>
  );
};
