import mapGenerator from '../generators/mapGenerator';
import { Application, Container } from 'pixi.js';
import React from 'react'

export default async function initializeApp({
  mapContainerRef,
  mapWidth,
  mapHeight,
}: {
  mapContainerRef: React.RefObject<HTMLDivElement | null> ;
  mapWidth: number;
  mapHeight: number;
}) {
  const app = new Application();

  if (mapContainerRef.current) {
    await app.init({ 
      background: '#04223f', 
      resizeTo: mapContainerRef.current
    });
  }

  mapContainerRef.current?.appendChild(app.canvas);
  const container = new Container();
  app.stage.addChild(container);

  mapGenerator({
    container,
    width: mapWidth,
    height: mapHeight,
  });

  return { app, container };
}
