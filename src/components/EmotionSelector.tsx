import React from 'react';

const EMOTIONS = ['Calma', 'Energética', 'Misteriosa', 'Vintage', 'Futurista'];

type EmotionSelectorProps = {
  value: string;
  onChange: (emotion: string) => void;
};

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
    <label htmlFor="emotion-select" className="font-semibold text-gray-700">
      Escolha uma emoção/estilo:
    </label>
    <select
      id="emotion-select"
      className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Selecionar emoção ou estilo"
      aria-describedby="emotion-help"
    >
      {EMOTIONS.map(emotion => (
        <option key={emotion} value={emotion}>
          {emotion}
        </option>
      ))}
    </select>
    <span id="emotion-help" className="text-xs text-gray-500">
      Escolha a emoção ou estilo desejado para influenciar a paleta de cores.
    </span>
  </div>
);
