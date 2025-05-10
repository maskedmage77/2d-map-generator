import { create } from 'zustand';

interface MapStore {
  controlsDrawerOpen: boolean;
  toggleControlsDrawer: () => void;
  mapWidth: number;
  mapHeight: number;
  setMapWidth: (width: number) => void;
  setMapHeight: (height: number) => void;
  detailLevel: number;
  setDetailLevel: (level: number) => void;
}

const useMapStore = create<MapStore>((set) => ({
  controlsDrawerOpen: false,
  toggleControlsDrawer: () => set((state) => ({ controlsDrawerOpen: !state.controlsDrawerOpen })),
  mapWidth: 1280,
  mapHeight: 720,
  setMapWidth: (width: number) => set(() => ({ mapWidth: width })),
  setMapHeight: (height: number) => set(() => ({ mapHeight: height })),
  detailLevel: 1,
  setDetailLevel: (level: number) => set(() => ({ detailLevel: level })),
}));

export default useMapStore;