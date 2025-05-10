export default function generateFalloffMap1({
  HORIZONTAL_SIZE = 512,
  VERTICAL_SIZE = 512,
  FALL_OFF = 0.2
}: {
  HORIZONTAL_SIZE?: number;
  VERTICAL_SIZE?: number;
  FALL_OFF?: number;
}) {
  const falloffMap = Array.from({ length: HORIZONTAL_SIZE }, (_, i) => {
    return Array.from({ length: VERTICAL_SIZE }, (_, j) => {

        const edgeDistance = Math.min(
          i / (FALL_OFF * HORIZONTAL_SIZE),
          (HORIZONTAL_SIZE - i) / (FALL_OFF * HORIZONTAL_SIZE),
          j / (FALL_OFF * VERTICAL_SIZE),
          (VERTICAL_SIZE - j) / (FALL_OFF * VERTICAL_SIZE)
        );
        return Math.max(0, Math.min(1, edgeDistance));

    });
  });
  return falloffMap;
}