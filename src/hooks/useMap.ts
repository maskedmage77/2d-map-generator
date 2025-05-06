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

    // let appInstance: Application | null = null;
    // let containerInstance: Container | null = null;

    async function recreateApp() {
      // Destroy the previous app instance if it exists
      if (appInstance.current && containerInstance.current) {
        console.log('Destroying previous app instance');
        appInstance.current?.stage.removeChild(containerInstance.current);
        containerInstance.current?.destroy({ children: true });
      } else {
        console.log('Creating new app instance');
      }
      // Create a new app instance
      const { app, container } = await initializeApp({
        mapContainerRef,
        mapWidth,
        mapHeight
      });
      
      // Append the new app instance to the map container
      appInstance.current = app;
      containerInstance.current = container;
    };

    isInitialized.current
      ? recreateApp()
      : (isInitialized.current = true);

    return () => {
      if (appInstance) {
        // appInstance.current?.destroy(true, { children: true });
      }
    };
  }, [mapWidth, mapHeight]);

  return {
    mapContainerRef
  }
}