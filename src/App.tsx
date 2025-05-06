import { Button, createTheme, MantineProvider } from '@mantine/core';
import ControlsDrawer from './components/ControlsDrawer';
import useMapStore from './stores/mapStore';
import useMap from './hooks/useMap';
import '@mantine/core/styles.css';
import './App.css';

export default function App() {
  
    const theme = createTheme({
      fontFamily: 'Jost, sans-serif'
    });
  
    const { mapContainerRef } = useMap();

    const {
      toggleControlsDrawer,
      mapHeight,
      mapWidth,
    } = useMapStore();

    return (
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <div
          ref={mapContainerRef}
          style={{
            width: mapWidth,
            height: mapHeight
          }}
        />
        <Button onClick={() => {
          toggleControlsDrawer();
        }}>
          asdasd
        </Button>
        <ControlsDrawer />
      </MantineProvider>
    );
}