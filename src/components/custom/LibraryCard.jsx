import { MoreVertical, Pencil, Trash2, BookOpen } from 'lucide-react';

/**
 * Componente card riutilizzabile per le librerie (mostri, NPC, ecc.)
 *
 * Props:
 *  icon        ReactNode   Icona grande in alto a sinistra
 *  title       string      Nome principale
 *  badges      [{label, className}]  Badge inline accanto al titolo
 *  tags        [{label, className}]  Riga di tag sotto il titolo (es. Concentrazione)
 *  stats       [{icon, label, value, mono?}]  Righe statistiche
 *  description string      Testo descrittivo in fondo alla card
 *  onEdit      Function
 *  onDelete    Function
 */
export function LibraryCard({
  icon,
  title,
  badges = [],
  tags = [],
  stats = [],
  description,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body p-4">

        {/* Header: icona + titolo + badge + dropdown */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="card-title text-lg leading-tight">{title}</h3>
                {badges.map((b, i) => (
                  <span key={i} className={`badge badge-sm ${b.className}`}>{b.label}</span>
                ))}
              </div>
              {tags.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {tags.map((t, i) => (
                    <span key={i} className={`badge badge-sm ${t.className}`}>{t.label}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dropdown dropdown-end shrink-0">
            <button className="btn btn-ghost btn-xs"><MoreVertical size={14} /></button>
            <ul className="dropdown-content menu z-50 p-2 shadow bg-base-200 rounded-box w-32">
              <li><button className="gap-1" onClick={onEdit}><Pencil size={12} /> Modifica</button></li>
              <li><button className="gap-1" onClick={onDelete}><Trash2 size={12} /> Elimina</button></li>
            </ul>
          </div>
        </div>

        {/* Statistiche */}
        {stats.length > 0 && (
          <div className="space-y-1 mt-2 text-sm">
            {stats.map((s, i) =>
              s.value != null && s.value !== '' ? (
                <div key={i} className="flex justify-between">
                  <span className="opacity-70 flex items-center gap-1">{s.icon} {s.label}:</span>
                  <span className={s.mono ? 'font-mono' : 'font-semibold'}>{s.value}</span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Descrizione */}
        {description && (
          <div className="mt-2 pt-2 border-t border-base-300">
            <p className="text-xs font-medium flex items-center gap-1 opacity-60 mb-1">
              <BookOpen size={11} /> Descrizione
            </p>
            <p className="text-xs leading-relaxed">{description}</p>
          </div>
        )}

      </div>
    </div>
  );
}
