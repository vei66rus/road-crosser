export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function lighten(color: number): number {
  const r = Math.min(255, ((color >> 16) & 0xff) + 60);
  const g = Math.min(255, ((color >> 8) & 0xff) + 60);
  const b = Math.min(255, (color & 0xff) + 60);
  return (r << 16) | (g << 8) | b;
}

export function laneCenterX(
  index: number,
  sidewalkW: number,
  laneW: number,
): number {
  return sidewalkW + index * laneW + laneW / 2;
}
