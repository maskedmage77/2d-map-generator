import { AppShell, createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import MapControls from './components/MapControls';
import useMapStore from './stores/mapStore';
import '@mantine/notifications/styles.css';
import useMap from './hooks/useMap';
import '@mantine/core/styles.css';
import './App.css';

export default function App() {
  
  const theme = createTheme({
    fontFamily: 'Jost, sans-serif'
  });

  const {
    mapContainerRef,
    regenerateMap,
    recenterMap,
    saveMap
  } = useMap();

  const {
    mapHeight,
    mapWidth,
  } = useMapStore();

  return (
    
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
    >
      <MantineProvider>
        <AppShell
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          <div
            ref={mapContainerRef}
            style={{
              width: mapWidth,
              height: mapHeight
            }}
          />
          <MapControls 
            regenerateMap={regenerateMap}
            recenterMap={recenterMap}
            saveMap={saveMap}
          />
        </AppShell>
        <Notifications />
      </MantineProvider>
    </MantineProvider>
  );
}