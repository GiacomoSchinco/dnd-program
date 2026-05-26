export function calculateModifier(score: number): number {
  return Math.floor((Number(score) - 10) / 2)
}
