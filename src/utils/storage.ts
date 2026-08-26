import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Roulette } from '../types/roulette';

const STORAGE_KEY = '@spin_and_decide/roulettes';

/**
 * Loads all roulettes from AsyncStorage.
 */
export async function loadRoulettes(): Promise<Roulette[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Roulette[];
  } catch (error) {
    console.error('Failed to load roulettes:', error);
    return [];
  }
}

/**
 * Saves all roulettes to AsyncStorage.
 */
export async function saveRoulettes(roulettes: Roulette[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(roulettes));
  } catch (error) {
    console.error('Failed to save roulettes:', error);
  }
}

/**
 * Loads a single roulette by ID.
 */
export async function loadRouletteById(
  id: string
): Promise<Roulette | undefined> {
  const all = await loadRoulettes();
  return all.find((r) => r.id === id);
}

/**
 * Saves (creates or updates) a single roulette within the stored list.
 */
export async function saveRoulette(roulette: Roulette): Promise<void> {
  const all = await loadRoulettes();
  const index = all.findIndex((r) => r.id === roulette.id);
  if (index >= 0) {
    all[index] = roulette;
  } else {
    all.push(roulette);
  }
  await saveRoulettes(all);
}

/**
 * Deletes a roulette by ID.
 */
export async function deleteRoulette(id: string): Promise<void> {
  const all = await loadRoulettes();
  const filtered = all.filter((r) => r.id !== id);
  await saveRoulettes(filtered);
}
