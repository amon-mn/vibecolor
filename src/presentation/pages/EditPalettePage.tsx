import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Slider } from '../components/Slider';
import { ColorDisplayCard } from '../components/ColorDisplayCard';
import { useForm } from '../hooks/useForm';
import { GetPaletteByIdUseCase } from '../../application/usecases/GetPaletteByIdUseCase';
import { SavePaletteUseCase } from '../../application/usecases/SavePaletteUseCase';
import { LocalStoragePaletteRepository } from '../../infrastructure/LocalStoragePaletteRepository';
import type { IPalette } from '../../domain/entities/IPalette';
import type { IColor } from '../../domain/entities/IColor';

export default function EditPalettePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [palette, setPalette] = useState<IPalette | null>(null);
  const { values, setField, handleChange } = useForm({
    name: '',
    description: '',
    colors: [] as IColor[],
  });

  useEffect(() => {
    if (id) {
      GetPaletteByIdUseCase.execute(new LocalStoragePaletteRepository(), id).then(pal => {
        if (pal) {
          setPalette(pal);
          setField('name', pal.name);
          setField('description', pal.description);
          setField('colors', pal.colors);
        }
      });
    }
  }, [id, setField]);

  const handleColorChange = (idx: number, hex: string) => {
    setField('colors', values.colors.map((c, i) => i === idx ? { ...c, hex } : c));
  };

  const handleRemoveColor = (idx: number) => {
    setField('colors', values.colors.filter((_, i) => i !== idx));
  };

  const handleAddColor = () => {
    setField('colors', [...values.colors, { ...values.colors[0] }]);
  };

  const handleSave = async () => {
    if (!id) return;
    await SavePaletteUseCase.execute({
      name: values.name,
      description: values.description,
      colors: values.colors,
      emotionOrStyle: palette?.emotionOrStyle || '',
    }, id);
    navigate(`/paleta/${id}`);
  };

  if (!palette) return <div className="p-8">Carregando...</div>;

  return (
    <main className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Editar Paleta</h1>
      <Input label="Nome" name="name" value={values.name} onChange={handleChange} className="mb-2" />
      <Input label="Descrição" name="description" value={values.description} onChange={handleChange} className="mb-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {values.colors.map((color, idx) => (
          <div key={color.hex + idx} className="relative">
            <ColorDisplayCard color={color} />
            <Input
              className="absolute top-2 left-2 w-24"
              value={color.hex}
              onChange={e => handleColorChange(idx, e.target.value)}
              aria-label="Editar hex da cor"
            />
            <Button size="sm" variant="danger" className="absolute top-2 right-2" onClick={() => handleRemoveColor(idx)}>
              Remover
            </Button>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={handleAddColor} className="mb-4">Adicionar Cor</Button>
      <Button variant="primary" onClick={handleSave} className="mr-2">Salvar</Button>
      <Button variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
    </main>
  );
} 