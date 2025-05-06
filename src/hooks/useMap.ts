import initializeApp from "../utils/initializeMap";
import { Application, Container } from "pixi.js";
import useMapStore from "../stores/mapStore";
import { useEffect, useRef } from "react";

export default function useMap() {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const {
    mapWidth,
    mapHeight,
  } = useMapStore();
  const appInstance = useRef<Application | null>(null);
  const containerInstance = useRef<Container | null>(null);

  useEffect(() => {

    async function recreateApp() {
      const { app, container } = await initializeApp({
        mapContainerRef,
        mapWidth,
        mapHeight
      });
      
      appInstance.current = app;
      containerInstance.current = container;
    };

    isInitialized.current
      ? recreateApp()
      : (isInitialized.current = true);

    return () => {
      if (appInstance) {
        appInstance.current?.destroy(true, { children: true });
      }
    };
  }, []);

  useEffect(() => {
    if (appInstance.current) {
      console.log('Resizing map');
    }
  }, [mapWidth, mapHeight]);

  return {
    mapContainerRef
  }
}