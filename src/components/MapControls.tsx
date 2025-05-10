import ControlsDrawer from './ControlsDrawer';
import useMapStore from '../stores/mapStore';
import { Button, Group } from '@mantine/core';

interface Props {
  regenerateMap: () => void;
}

export default function MapControls({
  regenerateMap
}: Props) {

  const {
    toggleControlsDrawer,
  } = useMapStore();

  return (
    <>
      <Group
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 5,
        }}
      >
        <Button
          onClick={() => {
            toggleControlsDrawer();
          }}
        >
          Map Settings
        </Button>
        <Button
          onClick={() => {
            regenerateMap();
          }}
        >
          Regenerate Map
        </Button>
      </Group>
      <ControlsDrawer />
    </>
  )
}
