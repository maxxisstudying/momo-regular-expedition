import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SaveSlotDto, KeyBindings, ShopItemDto } from '../types';
import * as api from '../services/api';

interface GameContextType {
  // Save slots
  saveSlots: (SaveSlotDto | null)[];
  currentSlot: SaveSlotDto | null;
  loadSlots: () => Promise<void>;
  selectSlot: (slot: SaveSlotDto | null) => void;
  refreshCurrentSlot: () => Promise<void>;
  
  // Key bindings
  keyBindings: KeyBindings;
  setKeyBindings: (bindings: KeyBindings) => void;
  
  // UI State
  selectedMenuIndex: number;
  setSelectedMenuIndex: (index: number) => void;
  
  // Shop items cache
  shopItems: ShopItemDto[];
  loadShopItems: () => Promise<void>;
  
  // Dev mode
  isDevAuthenticated: boolean;
  setDevAuthenticated: (value: boolean) => void;
  
  // Playtime tracking
  startPlaytimeTracking: () => void;
  stopPlaytimeTracking: () => void;
}

const defaultKeyBindings: KeyBindings = {
  moveLeft: 'a',
  moveRight: 'd',
  moveUp: 'w',
  moveDown: 's',
  select: ' ', // spacebar
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [saveSlots, setSaveSlots] = useState<(SaveSlotDto | null)[]>([null, null, null]);
  const [currentSlot, setCurrentSlot] = useState<SaveSlotDto | null>(null);
  const [keyBindings, setKeyBindingsState] = useState<KeyBindings>(() => {
    const saved = localStorage.getItem('momo_keybindings');
    return saved ? JSON.parse(saved) : defaultKeyBindings;
  });
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [shopItems, setShopItems] = useState<ShopItemDto[]>([]);
  const [isDevAuthenticated, setDevAuthenticated] = useState(false);
  const [playtimeInterval, setPlaytimeInterval] = useState<NodeJS.Timeout | null>(null);

  const loadSlots = useCallback(async () => {
    try {
      const slots = await api.getAllSlots();
      const slotArray: (SaveSlotDto | null)[] = [null, null, null];
      slots.forEach((slot) => {
        if (slot.slotNumber >= 1 && slot.slotNumber <= 3) {
          slotArray[slot.slotNumber - 1] = slot;
        }
      });
      setSaveSlots(slotArray);
    } catch (error) {
      console.error('Failed to load slots:', error);
    }
  }, []);

  const selectSlot = (slot: SaveSlotDto | null) => {
    setCurrentSlot(slot);
  };

  const refreshCurrentSlot = useCallback(async () => {
    if (currentSlot) {
      try {
        const updated = await api.getSlotById(currentSlot.id);
        setCurrentSlot(updated);
        // Also update in saveSlots array
        setSaveSlots((prev) => {
          const newSlots = [...prev];
          newSlots[updated.slotNumber - 1] = updated;
          return newSlots;
        });
      } catch (error) {
        console.error('Failed to refresh slot:', error);
      }
    }
  }, [currentSlot]);

  const setKeyBindings = (bindings: KeyBindings) => {
    setKeyBindingsState(bindings);
    localStorage.setItem('momo_keybindings', JSON.stringify(bindings));
  };

  const loadShopItems = useCallback(async () => {
    try {
      const items = await api.getAllShopItems();
      setShopItems(items);
    } catch (error) {
      console.error('Failed to load shop items:', error);
    }
  }, []);

  const startPlaytimeTracking = useCallback(() => {
    if (playtimeInterval) return;
    
    const interval = setInterval(async () => {
      if (currentSlot) {
        try {
          await api.updatePlaytime(currentSlot.id, 1);
        } catch (error) {
          console.error('Failed to update playtime:', error);
        }
      }
    }, 1000);
    
    setPlaytimeInterval(interval);
  }, [currentSlot, playtimeInterval]);

  const stopPlaytimeTracking = useCallback(() => {
    if (playtimeInterval) {
      clearInterval(playtimeInterval);
      setPlaytimeInterval(null);
    }
  }, [playtimeInterval]);

  useEffect(() => {
    loadSlots();
    loadShopItems();
  }, [loadSlots, loadShopItems]);

  useEffect(() => {
    return () => {
      if (playtimeInterval) {
        clearInterval(playtimeInterval);
      }
    };
  }, [playtimeInterval]);

  return (
    <GameContext.Provider
      value={{
        saveSlots,
        currentSlot,
        loadSlots,
        selectSlot,
        refreshCurrentSlot,
        keyBindings,
        setKeyBindings,
        selectedMenuIndex,
        setSelectedMenuIndex,
        shopItems,
        loadShopItems,
        isDevAuthenticated,
        setDevAuthenticated,
        startPlaytimeTracking,
        stopPlaytimeTracking,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
