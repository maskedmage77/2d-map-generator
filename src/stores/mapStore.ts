import { create } from 'zustand';
import { MapStyle } from '../types/MapStyle';

interface MapStore {
  controlsDrawerOpen: boolean;
  toggleControlsDrawer: () => void;
  mapWidth: number;
  mapHeight: number;
  setMapWidth: (width: number) => void;
  setMapHeight: (height: number) => void;
  detailLevel: number;
  setDetailLevel: (level: number) => void;
  octaves: number;
  setOctaves: (octaves: number) => void;
  seed: number | string;
  setSeed: (seed: number | string) => void;
  setStyle: (style: MapStyle) => void;
  style: MapStyle;
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
  octaves: 8,
  setOctaves: (octaves: number) => set(() => ({ octaves: octaves })),
  seed: Math.floor(Math.random() * 1000000),
  setSeed: (seed: number | string) => set(() => ({ seed: seed })),
  style: 'default',
  setStyle: (style: MapStyle) => set(() => ({ style: style })),
}));

export default useMapStore;