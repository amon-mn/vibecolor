// Script para limpar paletas sem id e/ou todas as paletas do repositório local
import { LocalStoragePaletteRepository } from './src/infrastructure/LocalStoragePaletteRepository';

(async () => {
  const repo = new LocalStoragePaletteRepository();
  const all = await repo.getAll();
  const filtered = all.filter(p => !!p.id);
  if (filtered.length !== all.length) {
    // Remove paletas sem id
    localStorage.setItem('palettes', JSON.stringify(filtered));
    console.log('Paletas sem id removidas.');
  } else {
    await repo.clearAll();
    console.log('Todas as paletas foram removidas do repositório local.');
  }
})();
