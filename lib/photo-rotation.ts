export type FileRotationDegrees = 90 | -90 | 180 | 270;

export function normalizeFileRotation(
  value: unknown,
): FileRotationDegrees | undefined {
  const rotation = Number(value);
  if (rotation === 90 || rotation === -90 || rotation === 180 || rotation === 270) {
    return rotation;
  }
  return undefined;
}
