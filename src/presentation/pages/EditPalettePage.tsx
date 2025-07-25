import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useForm } from '../hooks/useForm';
import { GetPaletteByIdUseCase } from '../../application/usecases/GetPaletteByIdUseCase';
import { SavePaletteUseCase } from '../../application/usecases/SavePaletteUseCase';
import { LocalStoragePaletteRepository } from '../../infrastructure/LocalStoragePaletteRepository';
import type { IPalette } from '../../domain/entities/IPalette';
import type { IColor } from '../../domain/entities/IColor';
import { PaletteEditCard } from '../components/PaletteEditCard';
import { v4 as uuidv4 } from 'uuid';
import { Toast } from '../components/Toast';
import { ContrastCheckerService } from '../../application/services/ContrastCheckerService';
import { ColorGeneratorService } from '../../application/services/ColorGeneratorService';
import { EmotionSelector } from '../../components/EmotionSelector';

export default function EditPalettePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [palette, setPalette] = useState<IPalette | null>(null);
  const { values, setField, handleChange } = useForm({
    name: '',
    description: '',
    colors: [] as IColor[],
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [initialized, setInitialized] = useState(false);
  const [newColorEmotion, setNewColorEmotion] = useState('Calma');
  const colorGenerator = new ColorGeneratorService();

  useEffect(() => {
    if (id) {
      GetPaletteByIdUseCase.execute(
        new LocalStoragePaletteRepository(),
        id
      ).then(pal => {
        if (pal) {
          setPalette(pal);
          if (!initialized) {
            setField('name', pal.name);
            setField('description', pal.description);
            setField('colors', pal.colors);
            setInitialized(true);
          }
        }
      });
    }
  }, [id, setField, initialized]);

  const handleColorChange = (idx: number, hex: string) => {
    setField(
      'colors',
      values.colors.map((c, i) => (i === idx ? { ...c, hex } : c))
    );
  };

  const handleRemoveColor = (idx: number) => {
    setField(
      'colors',
      values.colors.filter((_, i) => i !== idx)
    );
  };

  const handleAddColor = () => {
    const hex = '#000000';
    const rgb = [0, 0, 0] as [number, number, number];
    const luminance = ContrastCheckerService.calculateLuminance(rgb);
    const contrastBlack = ContrastCheckerService.calculateContrastRatio(
      luminance,
      0
    );
    const contrastWhite = ContrastCheckerService.calculateContrastRatio(
      luminance,
      1
    );
    const isAccessibleAA = ContrastCheckerService.checkAccessibility(
      Math.max(contrastBlack, contrastWhite),
      'AA'
    );
    const isAccessibleAAA = ContrastCheckerService.checkAccessibility(
      Math.max(contrastBlack, contrastWhite),
      'AAA'
    );
    const newColor: IColor = {
      hex,
      rgb,
      luminance,
      contrastBlack,
      contrastWhite,
      isAccessibleAA,
      isAccessibleAAA,
    };
    setField('colors', [...values.colors, newColor]);
  };

  const handleGenerateColor = () => {
    // Gera uma cor baseada na emoção/estilo digitada
    const generated = colorGenerator.generatePalette(
      newColorEmotion || palette?.emotionOrStyle || '',
      1
    )[0];
    setField('colors', [...values.colors, generated]);
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const now = new Date();
      await SavePaletteUseCase.execute(
        {
          id: id,
          name: values.name,
          description: values.description,
          colors: values.colors,
          emotionOrStyle: palette?.emotionOrStyle || '',
          createdAt: palette?.createdAt || now,
          updatedAt: now,
        },
        id,
        new LocalStoragePaletteRepository()
      );
      setToast({
        show: true,
        message: 'Paleta atualizada com sucesso!',
        type: 'success',
      });
      setTimeout(() => setToast({ ...toast, show: false }), 2000);
      setTimeout(() => navigate(`/paleta/${id}`, { replace: true }), 1200);
    } catch (e) {
      setToast({
        show: true,
        message: 'Erro ao atualizar paleta!',
        type: 'error',
      });
      setTimeout(() => setToast({ ...toast, show: false }), 2000);
    }
  };

  if (!palette) return <div className="p-8">Carregando...</div>;

  return (
    <main className="max-w-3xl mx-auto py-8 px-2">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-4 text-center">
          Editar Paleta
        </h1>
        <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
          <Input
            label="Nome"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            label="Descrição"
            name="description"
            value={values.description}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="w-full mb-6">
          <PaletteEditCard
            colors={values.colors}
            onEdit={handleColorChange}
            onRemove={handleRemoveColor}
          />
        </div>
        {/* Alinhamento inferior: EmotionSelector à esquerda, botões à direita, Gerar Cor acima dos botões */}
        <div className="flex flex-row w-full mt-8 items-end justify-between">
          <div className="flex-1 flex items-end">
            <EmotionSelector
              value={newColorEmotion}
              onChange={setNewColorEmotion}
            />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="secondary"
              onClick={handleGenerateColor}
              className="rounded-full px-8 py-3"
            >
              Gerar Cor
            </Button>
            <div className="flex gap-4 mt-2">
              <Button
                variant="primary"
                onClick={handleSave}
                className="rounded-full px-8 py-3"
              >
                Salvar
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="rounded-full px-8 py-3"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} show={toast.show} />
    </main>
  );
}
