import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GetPaletteByIdUseCase } from '../../application/usecases/GetPaletteByIdUseCase';
import { LocalStoragePaletteRepository } from '../../infrastructure/LocalStoragePaletteRepository';
import type { IPalette } from '../../domain/entities/IPalette';
import { PalettePreviewCard } from '../components/PalettePreviewCard';

export default function PaletteDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [palette, setPalette] = useState<IPalette | null>(null);

  useEffect(() => {
    if (id) {
      GetPaletteByIdUseCase.execute(
        new LocalStoragePaletteRepository(),
        id
      ).then(setPalette);
    }
  }, [id]);

  if (!palette) return <div className="p-8">Carregando...</div>;

  return (
    <main className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">{palette.name}</h1>
      <div className="mb-2 text-gray-500">{palette.description}</div>
      <div className="mb-2 text-xs text-gray-400">{palette.emotionOrStyle}</div>
      <div className="mb-6">
        <PalettePreviewCard colors={palette.colors} />
      </div>
      <Button
        variant="secondary"
        onClick={() => navigate('/paletas')}
        className="mr-2"
      >
        Voltar
      </Button>
      <Button
        variant="primary"
        onClick={() => navigate(`/paleta/${palette.id}/editar`)}
      >
        Editar
      </Button>
    </main>
  );
}
