import { Container, FederatedPointerEvent } from "pixi.js";

export default function enableZoomAndPan(
  container: Container,
  mapContainerRef: React.RefObject<HTMLDivElement | null>
) {
  container.interactive = true;
  let isZooming = false;
  let isPanning = false;
  let panStart = { x: 0, y: 0 };

  // Zoom functionality
  container.on('wheel', (event: WheelEvent) => {
    event.preventDefault();

    if (isZooming) return;
    isZooming = true;

    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;

    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      const localCursorX = (cursorX - container.x) / container.scale.x;
      const localCursorY = (cursorY - container.y) / container.scale.y;

      const targetScaleX = container.scale.x * scaleFactor;
      const targetScaleY = container.scale.y * scaleFactor;

      const targetX = cursorX - localCursorX * targetScaleX;
      const targetY = cursorY - localCursorY * targetScaleY;

      const animationDuration = 5; // in milliseconds
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        container.scale.set(
          container.scale.x + (targetScaleX - container.scale.x) * progress,
          container.scale.y + (targetScaleY - container.scale.y) * progress
        );

        container.x += (targetX - container.x) * progress;
        container.y += (targetY - container.y) * progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isZooming = false;
        }
      };

      requestAnimationFrame(animate);
    }
  });

  // Pan functionality
  container.on('pointerdown', (event: FederatedPointerEvent) => {
    isPanning = true;
    panStart = { x: event.global.x - container.x, y: event.global.y - container.y };

    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'grabbing';
    }
  });

  container.on('pointermove', (event: FederatedPointerEvent) => {
    if (!isPanning) return;

    container.x = event.global.x - panStart.x;
    container.y = event.global.y - panStart.y;
  });

  container.on('pointerup', () => {
    isPanning = false;

    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'default';
    }
  });

  container.on('pointerupoutside', () => {
    isPanning = false;

    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'default';
    }
  });
}