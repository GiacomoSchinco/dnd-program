/**
 * Icona D&D da `/public/icon/*.svg`
 *
 * Il colore segue la proprietà CSS `color` → usa classi Tailwind `text-*`
 *
 * @example
 * <DndIcon name="dice-twenty-faces-twenty" size={48} className="text-amber-500" />
 * <DndIcon name="rule-book" size={32} className="text-red-700" />
 */
export function DndIcon({ name, size = 24, className = '', 'aria-label': ariaLabel }) {
  // In Electron (file://) i path assoluti non funzionano: usa path relativo.
  // In web usa path assoluto normale.
  const iconPath = window.electron ? `./icon/${name}.svg` : `/icon/${name}.svg`;

  return (
    <span
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: 'currentColor',
        maskImage: `url('${iconPath}')`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url('${iconPath}')`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

