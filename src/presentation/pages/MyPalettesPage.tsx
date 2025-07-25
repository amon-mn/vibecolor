import { useEffect, useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PalettePreviewCard } from '../components/PalettePreviewCard';

import { LocalStoragePaletteRepository } from '../../infrastructure/LocalStoragePaletteRepository';
import type { IPalette } from '../../domain/entities/IPalette';
import { GetAllPalettesUseCase } from '../../application/usecases/GetAllPalettesUseCase';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function PaletteSummaryCard({
  palette,
  onView,
  onEdit,
  onDelete,
  isRemoving,
}: {
  palette: IPalette;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isRemoving?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl shadow p-4 bg-white flex flex-col gap-2 transition-all duration-300 ease-out
        opacity-0 translate-y-4 animate-fadein
        hover:scale-[1.03] hover:shadow-xl hover:z-10
        ${isRemoving ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
      style={{ animationDelay: `${Math.random() * 0.2 + 0.05}s` }}
    >
      <div className="font-bold text-lg mb-1">{palette.name}</div>
      <div className="text-xs text-gray-500 mb-2">{palette.emotionOrStyle}</div>
      <div className="mb-2">
        <PalettePreviewCard colors={palette.colors} />
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="ghost" onClick={onView}>
          Ver
        </Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          Excluir
        </Button>
      </div>
    </div>
  );
}

export default function MyPalettesPage() {
  const [palettes, setPalettes] = useState<IPalette[]>([]);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const repo = new LocalStoragePaletteRepository();
  const navigate = useNavigate();

  useEffect(() => {
    GetAllPalettesUseCase.execute(repo).then(setPalettes);
  }, []);

  const filtered = palettes.filter(
    p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.emotionOrStyle.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setRemoving(id);
    setTimeout(async () => {
      await repo.delete(id);
      setPalettes(palettes => palettes.filter(p => p.id !== id));
      setDeleteId(null);
      setRemoving(null);
    }, 350);
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Minhas Paletas</h1>
      <Input
        label="Buscar por nome ou emoção"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(palette => (
          <PaletteSummaryCard
            key={palette.id}
            palette={palette}
            onView={() => navigate(`/paleta/${palette.id}`)}
            onEdit={() => navigate(`/paleta/${palette.id}/editar`)}
            onDelete={() => setDeleteId(palette.id)}
            isRemoving={removing === palette.id}
          />
        ))}
      </div>
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirmar Exclusão"
      >
        <div className="mb-4">Tem certeza que deseja excluir esta paleta?</div>
        <Button
          variant="danger"
          onClick={() => handleDelete(deleteId!)}
          className="mr-2"
        >
          Excluir
        </Button>
        <Button variant="secondary" onClick={() => setDeleteId(null)}>
          Cancelar
        </Button>
      </Modal>
    </main>
  );
}
