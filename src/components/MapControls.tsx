import ControlsDrawer from './ControlsDrawer';
import useMapStore from '../stores/mapStore';
import { Button } from '@mantine/core';

export default function MapControls() {

  const {
    toggleControlsDrawer,
  } = useMapStore();

  return (
    <>
      <Button
        onClick={() => {
          toggleControlsDrawer();
        }}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 5,
        }}
      >
        Map Controls
      </Button>
      <ControlsDrawer />
    </>
  )
}
