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
    detailLevel,
    octaves
  } = useMapStore();
  const appInstance = useRef<Application | null>(null);
  const containerInstance = useRef<Container | null>(null);

  function regenerateMap() {
    console.log('Regenerating map at: ' + new Date().toLocaleTimeString());
    // Reset the container position and zoom
    containerInstance.current!.position.set(0, 0);
    containerInstance.current!.scale.set(1, 1);
    // remove the previous map
    containerInstance.current?.removeChildren();
    // change the app size
    appInstance.current?.renderer.resize(mapWidth, mapHeight);
    // generate a new map
    mapGenerator({
      container: containerInstance.current as Container,
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
    };

    isInitialized.current
      ? createInitialMap()
      : (isInitialized.current = true);

    return () => {
      if (appInstance) {
        appInstance.current?.destroy(true, { children: true });
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
    regenerateMap
  }
}