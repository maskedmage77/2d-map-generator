import mapGenerator from "../generators/mapGenerator";
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
    // detailLevel,
    // octaves
  } = useMapStore();
  const appInstance = useRef<Application | null>(null);
  const containerInstance = useRef<Container | null>(null);

  function recenterMap() {
    if (!containerInstance.current || !appInstance.current) {
      return;
    }
    containerInstance.current.position.set(0, 0);
    containerInstance.current.scale.set(1, 1);
  }

  function regenerateMap() {
    console.log('Regenerating map at: ' + new Date().toLocaleTimeString());
    // Ensure containerInstance and appInstance are initialized
    if (!containerInstance.current || !appInstance.current) {
      return;
    }

    // Reset the container position and zoom
    containerInstance.current.position.set(0, 0);
    containerInstance.current.scale.set(1, 1);
    // Remove the previous map
    containerInstance.current.removeChildren();
    // Change the app size
    appInstance.current.renderer.resize(mapWidth, mapHeight);
    // Generate a new map
    mapGenerator({
      container: containerInstance.current,
      width: mapWidth,
      height: mapHeight,
    });
  }

  useEffect(() => {
    async function createInitialMap() {
      const { app, container } = await initializeApp({
        mapContainerRef,
        mapWidth,
        mapHeight
      });

      appInstance.current = app;
      containerInstance.current = container;
    }

    if (!isInitialized.current) {
      isInitialized.current = true;
      createInitialMap();
    }

    return () => {
      if (appInstance.current) {
        appInstance.current.destroy(true, { children: true });
      }
    };
  }, []);

  useEffect(() => {
    if (appInstance.current) {
      regenerateMap();
    }
  }, []);

  return {
    mapContainerRef,
    regenerateMap,
    recenterMap
  }
}