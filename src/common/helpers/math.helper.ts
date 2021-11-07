export const normalizeDirectionVector = (x: number, y: number): [number, number] => {
  const length = Math.sqrt(x * x + y * y);

  return length === 0 ? [0, 0] : [x / length, y / length];
};

export const addAngles = (angle1: number, angle2: number): number => {
  return ((angle1 + angle2 + 180) % 360) - 180;
};

export const averageAngles = (angle1: number, angle2: number): number => {
  return addAngles(angle1, addAngles(-angle1, angle2) / 2);
};
