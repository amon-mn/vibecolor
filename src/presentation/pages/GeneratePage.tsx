import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useForm } from '../hooks/useForm';
import { useLoading } from '../hooks/useLoading';
import { GeneratePaletteUseCase } from '../../application/usecases/GeneratePaletteUseCase';
import { SavePaletteUseCase } from '../../application/usecases/SavePaletteUseCase';
import type { IPaletteInput } from '../../domain/entities/IPaletteInput';
import type { IColor } from '../../domain/entities/IColor';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { LocalStoragePaletteRepository } from '../../infrastructure/LocalStoragePaletteRepository';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Toast } from '../components/Toast';

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

const HARMONY_RULES = [
  { label: 'Complementar', value: 'complementary' },
  { label: 'Análoga', value: 'analogous' },
  { label: 'Triádica', value: 'triadic' },
];

export default function GeneratePage() {
  const [palette, setPalette] = useState<IColor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { values, handleChange, setField } = useForm({
    emotion: 'Calma',
    method: 'random',
    numberOfColors: 5,
    baseColor: '#4AFBBB',
    harmonyRule: 'complementary',
    name: '',
    description: '',
  });
  const { loading, error, run } = useLoading(async () => {
    let result;
    if (values.method === 'harmonic') {
      result = await GeneratePaletteUseCase.execute(
        values.emotion,
        values.method as any,
        {
          numberOfColors: Number(values.numberOfColors),
          baseColor: {
            hex: values.baseColor,
            rgb: [0, 0, 0],
            luminance: 0,
            contrastBlack: 0,
            contrastWhite: 0,
            isAccessibleAA: false,
            isAccessibleAAA: false,
          },
          harmonyRule: values.harmonyRule as any,
        }
      );
    } else {
      result = await GeneratePaletteUseCase.execute(
        values.emotion,
        values.method as any,
        { numberOfColors: Number(values.numberOfColors) }
      );
    }
    setPalette(result.colors);
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    run();
  };

  const handleSave = async () => {
    try {
      const now = new Date();
      const paletteObj = {
        id: uuidv4(),
        name: values.name || `Paleta ${values.emotion}`,
        description: values.description,
        colors: palette,
        emotionOrStyle: values.emotion,
        createdAt: now,
        updatedAt: now,
      };
      await SavePaletteUseCase.execute(
        paletteObj,
        undefined,
        new LocalStoragePaletteRepository()
      );
      setShowModal(false);
      setToast({
        show: true,
        message: 'Paleta salva com sucesso!',
        type: 'success',
      });
      setTimeout(() => setToast({ ...toast, show: false }), 2000);
      setTimeout(() => navigate('/paletas'), 1200);
    } catch (e) {
      setToast({
        show: true,
        message: 'Erro ao salvar paleta!',
        type: 'error',
      });
      setTimeout(() => setToast({ ...toast, show: false }), 2000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          Gerador de <span className="text-purple-500">Paletas de Cores</span>
        </h1>
        <p className="text-gray-500 mb-8 text-center max-w-xl">
          Crie paletas de cores personalizadas e harmoniosas para seus projetos,
          escolhendo estilos, emoções e número de cores.
        </p>
        <form
          className="w-full flex flex-col md:flex-row gap-4 items-end mb-8"
          onSubmit={handleGenerate}
        >
          <div className="flex-1 flex flex-col gap-2">
            <Select
              label="Emoção/Estilo"
              name="emotion"
              value={values.emotion}
              onChange={handleChange}
              options={EMOTIONS}
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Select
              label="Método"
              name="method"
              value={values.method}
              onChange={handleChange}
              options={METHODS}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2 w-32">
            <Input
              label="Nº de cores"
              name="numberOfColors"
              type="number"
              min={2}
              max={12}
              value={values.numberOfColors}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          {values.method === 'harmonic' && (
            <>
              <div className="flex flex-col gap-2 w-32">
                <label className="font-medium text-gray-700">Cor Base</label>
                <input
                  type="color"
                  name="baseColor"
                  value={values.baseColor}
                  onChange={handleChange}
                  className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  style={{ padding: 0 }}
                />
              </div>
              <div className="flex flex-col gap-2 w-40">
                <Select
                  label="Harmonia"
                  name="harmonyRule"
                  value={values.harmonyRule}
                  onChange={handleChange}
                  options={HARMONY_RULES}
                  className="w-full"
                />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2 justify-end">
            <Button
              type="submit"
              loading={loading}
              className="w-full h-[48px] rounded-full text-base px-8 py-3 bg-purple-500 hover:bg-purple-600 focus:ring-purple-400 shadow-md"
            >
              Gerar Paleta
            </Button>
          </div>
        </form>
        {error && (
          <div className="text-red-600 mb-4 w-full text-center">{error}</div>
        )}
        <section className="w-full mb-8">
          {palette.length > 0 && <PalettePreviewCard colors={palette} />}
        </section>
        {palette.length > 0 && (
          <Button
            className="mt-8 w-full md:w-auto px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 focus:ring-green-400 shadow-md"
            onClick={() => setShowModal(true)}
          >
            Salvar Paleta
          </Button>
        )}
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Salvar Paleta"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Input
            label="Nome da Paleta"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className="mb-2"
          />
          <Input
            label="Descrição"
            name="description"
            value={values.description}
            onChange={handleChange}
            className="mb-2"
          />
          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </Modal>
      <Toast message={toast.message} type={toast.type} show={toast.show} />
    </main>
  );
}
