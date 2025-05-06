import { Drawer, Group, NumberInput, Stack, Title } from "@mantine/core";
import useMapStore from "../stores/mapStore";

export default function ControlsDrawer() {

  const { controlsDrawerOpen,
    toggleControlsDrawer,
    mapWidth,
    mapHeight,
    setMapWidth,
    setMapHeight
  } = useMapStore();

  return (
    <Drawer
      opened={controlsDrawerOpen}
      onClose={() => {
        toggleControlsDrawer();
      }}
    >

     <Stack gap="0">
      <Title order={3} m="0">Width</Title>
        <Group grow>
          <NumberInput
            label="Width"
            placeholder="Width"
            min={360}
            max={3840}
            step={20}
            value={mapWidth}
            onChange={(value) => setMapWidth(typeof value === "number" ? value : 360)}
          />
          <NumberInput
            label="Height"
            placeholder="Height"
            min={360}
            max={3840}
            step={20}
            value={mapHeight}
            onChange={(value) => setMapHeight(typeof value === "number" ? value : 360)}
          />
        </Group>
     </Stack>

    </Drawer>
  )
}
