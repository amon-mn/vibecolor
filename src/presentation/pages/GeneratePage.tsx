import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { ColorDisplayCard } from '../components/ColorDisplayCard';
import { Modal } from '../components/Modal';
import { useForm } from '../hooks/useForm';
import { useLoading } from '../hooks/useLoading';
import { GeneratePaletteUseCase } from '../../application/usecases/GeneratePaletteUseCase';
import { SavePaletteUseCase } from '../../application/usecases/SavePaletteUseCase';
import type { IPaletteInput } from '../../domain/entities/IPaletteInput';
import type { IColor } from '../../domain/entities/IColor';

const EMOTIONS = [
  { label: 'Calma', value: 'Calma' },
  { label: 'Energética', value: 'Energética' },
  { label: 'Misteriosa', value: 'Misteriosa' },
  { label: 'Vintage', value: 'Vintage' },
  { label: 'Futurista', value: 'Futurista' },
];

const METHODS = [
  { label: 'Aleatório', value: 'random' },
  { label: 'Harmônico', value: 'harmonic' },
  // { label: 'De Imagem', value: 'fromImage' }, // pode ser ativado depois
];

export default function GeneratePage() {
  const [palette, setPalette] = useState<IColor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { values, handleChange, setField } = useForm({
    emotion: 'Calma',
    method: 'random',
    numberOfColors: 5,
    name: '',
    description: '',
  });
  const { loading, error, run } = useLoading(async () => {
    const result = await GeneratePaletteUseCase.execute(
      values.emotion,
      values.method as any,
      { numberOfColors: Number(values.numberOfColors) }
    );
    setPalette(result.colors);
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    run();
  };

  const handleSave = async () => {
    const input: IPaletteInput = {
      name: values.name || `Paleta ${values.emotion}`,
      description: values.description,
      colors: palette,
      emotionOrStyle: values.emotion,
    };
    await SavePaletteUseCase.execute(input);
    setShowModal(false);
    // feedback de sucesso pode ser adicionado
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Gerar Paleta de Cores</h1>
      <form className="flex flex-col md:flex-row gap-4 items-end mb-8" onSubmit={handleGenerate}>
        <Select label="Emoção/Estilo" name="emotion" value={values.emotion} onChange={handleChange} options={EMOTIONS} className="w-48" />
        <Select label="Método" name="method" value={values.method} onChange={handleChange} options={METHODS} className="w-48" />
        <Input label="Nº de cores" name="numberOfColors" type="number" min={2} max={12} value={values.numberOfColors} onChange={handleChange} className="w-32" />
        <Button type="submit" loading={loading} className="mt-4 md:mt-0">Gerar</Button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {palette.map((color, idx) => (
          <ColorDisplayCard key={color.hex + idx} color={color} />
        ))}
      </section>
      {palette.length > 0 && (
        <Button className="mt-8" onClick={() => setShowModal(true)}>
          Salvar Paleta
        </Button>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Salvar Paleta">
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Input label="Nome da Paleta" name="name" value={values.name} onChange={handleChange} required className="mb-2" />
          <Input label="Descrição" name="description" value={values.description} onChange={handleChange} className="mb-2" />
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </Modal>
    </main>
  );
} 