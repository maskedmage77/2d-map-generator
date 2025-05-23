import { Drawer, Group, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core";
import { useWindowSize } from "@uidotdev/usehooks";
import useMapStore from "../stores/mapStore";
import { MapStyle } from "../types/MapStyle";

export default function ControlsDrawer() {

  const { controlsDrawerOpen,
    toggleControlsDrawer,
    mapWidth,
    mapHeight,
    setMapWidth,
    setMapHeight,
    detailLevel,
    setDetailLevel,
    octaves,
    setOctaves,
    seed,
    setSeed,
    style,
    setStyle
  } = useMapStore();

  const { width: maxWidth, height: maxHeight } = useWindowSize();

  return (
    <Drawer
      opened={controlsDrawerOpen}
      onClose={() => {
        toggleControlsDrawer();
      }}
    >

    <Stack >

     <Text >
       Warning! Changing map settings will trigger the map to be regenerated.
     </Text>

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
        max={maxHeight ?? 3840}
        step={20}
        value={mapHeight}
        onChange={(value) => setMapHeight(typeof value === "number" ? Math.min(value, maxHeight ?? 3840) : 360)}
      />
       </Group>

       <NumberInput
        label="Detail Level"
        placeholder="Detail Level"
        min={1}
        max={8}
        step={1}
        value={detailLevel}
        onChange={(value) => setDetailLevel(typeof value === "number" ? Math.min(value, 8) : 1)}
      />

       <NumberInput
        label="Octaves"
        placeholder="Octaves"
        min={1}
        max={10}
        step={1}
        value={octaves}
        onChange={(value) => setOctaves(typeof value === "number" ? Math.min(value, 10) : 1)}
      />

      <TextInput
        label="Seed"
        placeholder="Seed"
        value={seed}
        onChange={(value) => setSeed(value.target.value)}
      />

      <Select
        label="Map Style"
        placeholder="Map Style"
        data={[
          { value: "default", label: "Default" },
          { value: "paper", label: "Paper" },
          { value: "black and white", label: "Black and White (noise level)" },
          { value: "pastel", label: "Pastel" },
        ]}
        value={style}
        onChange={(value: string | null) => {
          if (value !== null) {
            setStyle(value as MapStyle);
          }
        }}
      />

    </Stack>

    </Drawer>
  )
}
