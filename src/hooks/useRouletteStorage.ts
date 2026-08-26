import { useState, useEffect, useCallback } from 'react';
import type { Roulette, RouletteItem } from '../types/roulette';
import {
  loadRoulettes,
  saveRoulettes,
  loadRouletteById,
  saveRoulette,
  deleteRoulette as deleteRouletteFromStorage,
} from '../utils/storage';
import { generateId } from '../utils/math';
import { getSliceColor } from '../utils/colors';

/**
 * Hook for managing the list of all roulettes (Home screen).
 */
export function useRouletteList() {
  const [roulettes, setRoulettes] = useState<Roulette[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await loadRoulettes();
    setRoulettes(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createRoulette = useCallback(
    async (title: string) => {
      const now = Date.now();
      const newRoulette: Roulette = {
        id: generateId(),
        title,
        createdAt: now,
        updatedAt: now,
        items: [],
      };
      const updated = [...roulettes, newRoulette];
      setRoulettes(updated);
      await saveRoulettes(updated);
      return newRoulette;
    },
    [roulettes]
  );

  const removeRoulette = useCallback(
    async (id: string) => {
      const updated = roulettes.filter((r) => r.id !== id);
      setRoulettes(updated);
      await deleteRouletteFromStorage(id);
    },
    [roulettes]
  );

  return { roulettes, isLoading, reload: load, createRoulette, removeRoulette };
}

/**
 * Hook for managing a single roulette and its items.
 */
export function useRouletteDetail(rouletteId: string) {
  const [roulette, setRoulette] = useState<Roulette | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await loadRouletteById(rouletteId);
    setRoulette(data ?? null);
    setIsLoading(false);
  }, [rouletteId]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback(async (updated: Roulette) => {
    setRoulette(updated);
    await saveRoulette(updated);
  }, []);

  // --- Item CRUD ---

  const addItem = useCallback(
    async (label: string, weight: number = 1, color?: string) => {
      if (!roulette) return;
      const safeWeight = Math.max(1, weight);
      const newItem: RouletteItem = {
        id: generateId(),
        label,
        weight: safeWeight,
        isEnabled: true,
        isHidden: false,
        color: color ?? getSliceColor(roulette.items.length),
      };
      const updated: Roulette = {
        ...roulette,
        items: [...roulette.items, newItem],
        updatedAt: Date.now(),
      };
      await persist(updated);
    },
    [roulette, persist]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!roulette) return;
      const updated: Roulette = {
        ...roulette,
        items: roulette.items.filter((i) => i.id !== itemId),
        updatedAt: Date.now(),
      };
      await persist(updated);
    },
    [roulette, persist]
  );

  const updateItem = useCallback(
    async (itemId: string, changes: Partial<Pick<RouletteItem, 'label' | 'weight' | 'color'>>) => {
      if (!roulette) return;
      const updated: Roulette = {
        ...roulette,
        items: roulette.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                ...changes,
                weight: changes.weight !== undefined ? Math.max(1, changes.weight) : item.weight,
              }
            : item
        ),
        updatedAt: Date.now(),
      };
      await persist(updated);
    },
    [roulette, persist]
  );

  // --- State toggles ---

  const toggleEnabled = useCallback(
    async (itemId: string) => {
      if (!roulette) return;
      const updated: Roulette = {
        ...roulette,
        items: roulette.items.map((item) =>
          item.id === itemId
            ? { ...item, isEnabled: !item.isEnabled }
            : item
        ),
        updatedAt: Date.now(),
      };
      await persist(updated);
    },
    [roulette, persist]
  );

  const hideItem = useCallback(
    async (itemId: string) => {
      if (!roulette) return;
      const updated: Roulette = {
        ...roulette,
        items: roulette.items.map((item) =>
          item.id === itemId
            ? { ...item, isHidden: true }
            : item
        ),
        updatedAt: Date.now(),
      };
      await persist(updated);
    },
    [roulette, persist]
  );

  const unhideItem = useCallback(
    async (itemId: string) => {
      if (!roulette) return;
      const updated: Roulette = {
        ...roulette,
        items: roulette.items.map((item) =>
          item.id === itemId
            ? { ...item, isHidden: false }
            : item
        ),
        updatedAt: Date.now(),
      };
      await persist(updated);
    },
    [roulette, persist]
  );

  const resetAllVisibility = useCallback(async () => {
    if (!roulette) return;
    const updated: Roulette = {
      ...roulette,
      items: roulette.items.map((item) => ({
        ...item,
        isHidden: false,
        isEnabled: true,
      })),
      updatedAt: Date.now(),
    };
    await persist(updated);
  }, [roulette, persist]);

  return {
    roulette,
    isLoading,
    reload: load,
    addItem,
    removeItem,
    updateItem,
    toggleEnabled,
    hideItem,
    unhideItem,
    resetAllVisibility,
  };
}
