import { useEffect, useRef } from 'react';
import { Application, Container, Graphics } from 'pixi.js';
import './App.css';
import mapGenerator from './assets/generators/mapGenerator';
import { useWindowSize } from "@uidotdev/usehooks";
import { createNoise2D } from 'simplex-noise';

function App() {
    const pixiContainerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    // const { width, height } = useWindowSize();

    useEffect(() => {
      const initializeApp = async () => {
        
        const app = new Application();

        // await app.init({ background: '#0a4b8c', resizeTo: window });
        await app.init({ background: 'grey', resizeTo: window });

        document.body.appendChild(app.canvas);

        const container = new Container();

        app.stage.addChild(container);
        

        // let obj = new Graphics();
        // obj.moveTo(points[0].x, points[0].y);

        // points.slice(1).forEach(point => {
        //   obj.lineTo(point.x, point.y);
        // });

        // obj.stroke({ color: 'black', width: 4 });


        // Add it to the stage to render
        mapGenerator({
          container,
          width: app.screen.width,
          height: app.screen.height,
          app
        });

        // Move the container to the center
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;

        // Center the bunny sprites in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;

        app.ticker.add((time) =>
          {
              // Continuously rotate the container!
              // * use delta to create frame-independent transform *
              // container.rotation -= 0.01 * time.deltaTime;
          });

      };


      if (!isInitialized.current) {
        initializeApp();
        isInitialized.current = true;
      }
    }, []);

    return <div ref={pixiContainerRef} style={{ width: '100%', height: '100%' }}></div>;
}

export default App;
