import { AppShell, createTheme, MantineProvider } from '@mantine/core';
import MapControls from './components/MapControls';
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
    mapHeight,
    mapWidth,
  } = useMapStore();

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
    >
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
        <MapControls />
      </AppShell>
    </MantineProvider>
  );
}