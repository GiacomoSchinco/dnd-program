import { Heart } from 'lucide-react';
import { getHPColorClass } from '../../utils/hpUtils';

interface HPBarProps {
  current: number;
  max: number;
  /** HP temporanei (visualizzati come +N in blu) */
  temp?: number;
  /** Altezza della barra: 'xs'=h-1.5, 'sm'=h-2, 'md'=h-3 */
  size?: 'xs' | 'sm' | 'md';
  /** Mostra label "HP" e valore numerico sopra la barra */
  showLabel?: boolean;
  /** Colore quando gli HP sono sopra il 50% */
  fullColor?: 'success' | 'primary';
}

const SIZE_CLASS: Record<NonNullable<HPBarProps['size']>, string> = {
  xs: 'h-1.5',
  sm: 'h-2',
  md: 'h-3',
};

export function HPBar({
  current,
  max,
  temp = 0,
  size = 'sm',
  showLabel = true,
  fullColor = 'success',
}: HPBarProps) {
  const colorClass = getHPColorClass(current, max, fullColor);

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-xs text-base-content/60 mb-1">
          <span className="flex items-center gap-1">
            <Heart size={12} /> HP
          </span>
          <span className="font-semibold text-base-content">
            {current} / {max}
            {temp > 0 && <span className="text-info ml-1">+{temp}</span>}
          </span>
        </div>
      )}
      <progress
        className={`progress ${colorClass} w-full ${SIZE_CLASS[size]}`}
        value={current}
        max={max}
      />
    </div>
  );
}
