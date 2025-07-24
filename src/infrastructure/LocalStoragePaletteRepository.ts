import type { IPalette } from '../domain/entities/IPalette';
import type { IPaletteRepository } from '../domain/services/IPaletteRepository';

const STORAGE_KEY = 'palettes';
const SIMULATED_LATENCY = 400; // ms
const ERROR_RATE = 0.1; // 10% de chance de erro

function simulateNetwork<T>(result: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < ERROR_RATE) {
        reject(new Error('Erro de rede simulado.'));
      } else {
        resolve(result);
      }
    }, SIMULATED_LATENCY);
  });
}

function getStoredPalettes(): IPalette[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function setStoredPalettes(palettes: IPalette[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
}

export class LocalStoragePaletteRepository implements IPaletteRepository {
  async getAll(): Promise<IPalette[]> {
    const palettes = getStoredPalettes();
    return simulateNetwork(palettes);
  }

  async getById(id: string): Promise<IPalette | null> {
    const palettes = getStoredPalettes();
    const found = palettes.find(p => p.id === id) || null;
    return simulateNetwork(found);
  }

  async create(input: IPalette): Promise<IPalette> {
    const palettes = getStoredPalettes();
    palettes.push(input);
    setStoredPalettes(palettes);
    return simulateNetwork(input);
  }

  async update(id: string, input: IPalette): Promise<IPalette> {
    let palettes = getStoredPalettes();
    palettes = palettes.map(p => (p.id === id ? input : p));
    setStoredPalettes(palettes);
    return simulateNetwork(input);
  }

  async delete(id: string): Promise<void> {
    let palettes = getStoredPalettes();
    palettes = palettes.filter(p => p.id !== id);
    setStoredPalettes(palettes);
    return simulateNetwork(undefined);
  }
} 