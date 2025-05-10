import { Drawer, Group, NumberInput, Stack, Title, Text } from "@mantine/core";
import { useWindowSize } from "@uidotdev/usehooks";
import useMapStore from "../stores/mapStore";

export default function ControlsDrawer() {

  const { controlsDrawerOpen,
    toggleControlsDrawer,
    mapWidth,
    mapHeight,
    setMapWidth,
    setMapHeight
  } = useMapStore();

  const { width: maxWidth, height: maxHeight } = useWindowSize();

  return (
    <Drawer
      opened={controlsDrawerOpen}
      onClose={() => {
        toggleControlsDrawer();
      }}
    >

     <Stack gap="0">
      <Text mb="md">
        Warning! Changing map settings will trigger the map to be regenerated.
      </Text>
      <Title order={3} m="0">Width</Title>
        <Group grow>
          <NumberInput
            label="Width"
            placeholder="Width"
            min={360}
            max={maxWidth ?? 3840}
            step={20}
            value={mapWidth}
            onChange={(value) => setMapWidth(typeof value === "number" ? Math.min(value, maxWidth ?? 3840) : 360)}
          />
          <NumberInput
            label="Height"
            placeholder="Height"
            min={360}
            max={3840}
            step={20}
            value={maxHeight ?? 3840}
            onChange={(value) => setMapHeight(typeof value === "number" ? Math.min(value, maxHeight ?? 3840) : 360)}
          />
        </Group>
     </Stack>

    </Drawer>
  )
}
