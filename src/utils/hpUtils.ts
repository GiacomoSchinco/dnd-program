/**
 * Calcola la classe CSS DaisyUI per il colore della barra HP.
 * @param current  HP attuali
 * @param max      HP massimi
 * @param fullColor classe da usare quando gli HP sono sopra il 50% (default 'success')
 */
export function getHPColorClass(
  current: number,
  max: number,
  fullColor: 'success' | 'primary' = 'success',
): string {
  if (max <= 0) return `progress-${fullColor}`;
  const pct = (current / max) * 100;
  if (pct < 25) return 'progress-error';
  if (pct < 50) return 'progress-warning';
  return `progress-${fullColor}`;
}
