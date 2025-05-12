import mapGenerator from "../generators/mapGenerator";
import initializeApp from "../utils/initializeMap";
import { Application, Container, RenderTexture } from "pixi.js";
import useMapStore from "../stores/mapStore";
import { useEffect, useRef } from "react";

export default function useMap() {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const {
    mapWidth,
    mapHeight,
    detailLevel,
    // octaves
  } = useMapStore();
  const appInstance = useRef<Application | null>(null);
  const containerInstance = useRef<Container | null>(null);

  function recenterMap() {
    if (!containerInstance.current || !appInstance.current) {
      return;
    }
    if (containerInstance.current.position.x !== 0
      || containerInstance.current.position.y !== 0
      || containerInstance.current.scale.x !== 1 / detailLevel
      || containerInstance.current.scale.y !== 1 / detailLevel
    ) {
      const animationDuration = 1000; // in milliseconds
      const startTime = performance.now();
      const startPosition = { x: containerInstance.current.position.x, y: containerInstance.current.position.y };
      const startScale = { x: containerInstance.current.scale.x, y: containerInstance.current.scale.y };
      const targetPosition = { x: 0, y: 0 };
      const targetScale = { x: 1 / detailLevel, y: 1 / detailLevel };

      function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }

      function animate() {
        const elapsedTime = performance.now() - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
        const easedProgress = easeInOutQuad(progress);

        if (containerInstance.current) {
          containerInstance.current.position.set(
          startPosition.x + (targetPosition.x - startPosition.x) * easedProgress,
          startPosition.y + (targetPosition.y - startPosition.y) * easedProgress
          );
          
          containerInstance.current.scale.set(
          startScale.x + (targetScale.x - startScale.x) * easedProgress,
          startScale.y + (targetScale.y - startScale.y) * easedProgress
          );
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }
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

  function saveMap() {
    if (!appInstance.current || !containerInstance.current) return;

    const resolutionMultiplier = detailLevel > 1 ? detailLevel : 1;
    const renderTexture = RenderTexture.create({
      width: mapWidth * resolutionMultiplier,
      height: mapHeight * resolutionMultiplier,
    });

    const originalScale = containerInstance.current.scale.clone();
    const originalPosition = containerInstance.current.position.clone();

    containerInstance.current.scale.set(1, 1);
    containerInstance.current.position.set(0, 0);

    appInstance.current.renderer.extract.base64(renderTexture).then((base64Data) => {
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = 'map.png';
      link.click();
    });

    // Restore original scale and clean up
    containerInstance.current.scale.set(originalScale.x, originalScale.y);
    containerInstance.current.position.set(originalPosition.x, originalPosition.y);
    renderTexture.destroy(true);
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
    recenterMap,
    saveMap
  }
}