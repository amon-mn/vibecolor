import { useEffect, useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

import { LocalStoragePaletteRepository } from '../../infrastructure/LocalStoragePaletteRepository';
import type { IPalette } from '../../domain/entities/IPalette';
import { GetAllPalettesUseCase } from '../../application/usecases/GetAllPalettesUseCase';

function PaletteSummaryCard({ palette, onView, onEdit, onDelete }: {
  palette: IPalette;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded shadow p-4 bg-white flex flex-col gap-2">
      <div className="font-bold text-lg">{palette.name}</div>
      <div className="text-xs text-gray-500">{palette.emotionOrStyle}</div>
      <div className="flex gap-1 mb-2">
        {palette.colors.slice(0, 6).map((c, i) => (
          <span key={c.hex + i} className="w-6 h-6 rounded" style={{ background: c.hex }} title={c.hex}></span>
        ))}
        {palette.colors.length > 6 && <span className="text-xs">+{palette.colors.length - 6}</span>}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onView}>Ver</Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>Editar</Button>
        <Button size="sm" variant="danger" onClick={onDelete}>Excluir</Button>
      </div>
    </div>
  );
}

export default function MyPalettesPage() {
  const [palettes, setPalettes] = useState<IPalette[]>([]);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const repo = new LocalStoragePaletteRepository();

  useEffect(() => {
    GetAllPalettesUseCase.execute(repo).then(setPalettes);
  }, []);

  const filtered = palettes.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.emotionOrStyle.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await repo.delete(id);
    setPalettes(palettes => palettes.filter(p => p.id !== id));
    setDeleteId(null);
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
            onView={() => window.location.href = `/paleta/${palette.id}`}
            onEdit={() => window.location.href = `/paleta/${palette.id}/editar`}
            onDelete={() => setDeleteId(palette.id)}
          />
        ))}
      </div>
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão">
        <div className="mb-4">Tem certeza que deseja excluir esta paleta?</div>
        <Button variant="danger" onClick={() => handleDelete(deleteId!)} className="mr-2">Excluir</Button>
        <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancelar</Button>
      </Modal>
    </main>
  );
} 