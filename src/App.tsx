import { useState } from 'react';
import { EmotionSelector } from './components/EmotionSelector';
import { ColorCard } from './components/ColorCard';
import { GeneratePaletteUseCase } from './application/usecases/GeneratePaletteUseCase';
import type { IPalette } from './domain/entities/IPalette';

export default function App() {
  const [emotion, setEmotion] = useState('Calma');
  const [numberOfColors, setNumberOfColors] = useState(5);
  const [palette, setPalette] = useState<IPalette | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPalette(null);
    try {
      // Simular delay para UX/loading
      await new Promise(res => setTimeout(res, 500));
      // @ts-ignore: contrast extras não estão no tipo base
      const generated = await GeneratePaletteUseCase.execute(
        emotion,
        'random', // ou 'harmonic'
        { numberOfColors }
      );
      setPalette(generated);
    } catch (e) {
      console.error('Erro ao gerar paleta:', e);
      setError('Erro ao gerar a paleta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1200);
    } catch {
      setError('Não foi possível copiar o código hexadecimal.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl font-bold mb-4 text-center">Gerador de Paleta de Cores</h1>
      <form
        className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full max-w-2xl"
        onSubmit={e => { e.preventDefault(); handleGenerate(); }}
        aria-label="Formulário de geração de paleta"
      >
        <EmotionSelector value={emotion} onChange={setEmotion} />
        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
          <label htmlFor="num-colors" className="font-semibold text-gray-700">Nº de cores:</label>
          <input
            id="num-colors"
            type="number"
            min={2}
            max={12}
            value={numberOfColors}
            onChange={e => setNumberOfColors(Number(e.target.value))}
            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Número de cores"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 md:mt-8 md:ml-4 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Gerando...' : 'Gerar Paleta'}
        </button>
      </form>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-full max-w-md text-center" role="alert">
          {error}
        </div>
      )}
      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {palette && palette.colors.map((color: any, idx: number) => (
          <div
            key={color.hex + idx}
            className="relative group cursor-pointer"
            tabIndex={0}
            aria-label={`Copiar código ${color.hex}`}
            onClick={() => handleCopyHex(color.hex)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCopyHex(color.hex)}
            role="button"
          >
            <ColorCard {...color} />
            {copiedHex === color.hex && (
              <span
                className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow animate-bounce z-10"
                aria-live="assertive"
                role="status"
              >
                Copiado!
              </span>
            )}
          </div>
        ))}
      </section>
      {!palette && !loading && !error && (
        <p className="text-gray-500 mt-8 text-center">Selecione uma emoção/estilo e gere sua paleta personalizada!</p>
      )}
      {loading && (
        <div className="flex flex-col items-center mt-8">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-blue-600">Gerando paleta...</span>
        </div>
      )}
    </div>
  );
}
