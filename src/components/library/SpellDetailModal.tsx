import { useEffect, useRef } from 'react';
import { DndIcon } from '../ui/DndIcon';
import { getSchoolIcon, getSchoolColor, getSchoolName, getClassName } from '../../utils/icons';
import { Clock, Dices, FlaskConical, Gauge, Shield, Timer, Users, X, BookOpen, Wand2 } from 'lucide-react';
import type { Spell } from '../../types';

interface SpellDetailModalProps {
  isOpen: boolean;
  spell: Spell | null;
  onClose: () => void;
}

function StatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-200 text-sm font-medium" title={label}>
      <span className="opacity-50 shrink-0">{icon}</span>
      <span>{value}</span>
    </span>
  );
}

export function SpellDetailModal({ isOpen, spell, onClose }: SpellDetailModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close();
    }
  }, [isOpen]);

  if (!spell) return null;

  const schoolColor = getSchoolColor(spell.school);
  const levelLabel = spell.level === 0 ? 'Trucchetto' : `Livello ${spell.level}`;
  const componentsText = spell.components
    ? `${spell.components}${spell.material ? ` (${spell.material})` : ''}`
    : null;

  return (
    <dialog ref={modalRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-br from-base-300 to-base-200 px-6 pt-6 pb-4">
          <button
            className="btn btn-ghost btn-sm btn-square absolute top-3 right-3"
            onClick={onClose}
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className={`${schoolColor} p-3 rounded-xl bg-base-100/80`}>
              <DndIcon name={getSchoolIcon(spell.school)} size={36} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold">{spell.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 ${schoolColor} font-medium`}>
                  <DndIcon name={getSchoolIcon(spell.school)} size={16} />
                  <span>{getSchoolName(spell.school)}</span>
                </span>
                <span className="text-base-content/40">·</span>
                <span className="badge badge-primary badge-sm">{levelLabel}</span>
                {spell.concentration && <span className="badge badge-warning badge-sm">Concentrazione</span>}
                {spell.ritual && <span className="badge badge-info badge-sm">Rituale</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="px-6 py-4 space-y-5">
          {/* Statistiche */}
          <div className="flex flex-wrap gap-2">
            {spell.casting && (
              <StatBadge icon={<Timer size={14} />} label="Tempo di lancio" value={spell.casting} />
            )}
            {spell.range && (
              <StatBadge icon={<Gauge size={14} />} label="Gittata" value={spell.range} />
            )}
            {spell.duration && (
              <StatBadge icon={<Clock size={14} />} label="Durata" value={spell.duration} />
            )}
            {spell.damage && (
              <StatBadge icon={<Dices size={14} />} label="Danno" value={spell.damage} />
            )}
            {spell.save && (
              <StatBadge icon={<Shield size={14} />} label="Tiro Salvezza" value={spell.save} />
            )}
          </div>

          {/* Componenti */}
          {componentsText && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-base-200/60 border border-base-300 text-sm">
              <FlaskConical size={14} className="opacity-50 shrink-0" />
              <span className="font-medium">{componentsText}</span>
            </div>
          )}

          {/* Classi */}
          {spell.classes && (
            <div className="flex items-center gap-2 text-sm">
              <Users size={14} className="opacity-50 shrink-0" />
              <span>
                {spell.classes.split(',').map((c) => c.trim()).map(getClassName).join(', ')}
              </span>
            </div>
          )}

          {/* Descrizione */}
          {spell.description && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm font-medium opacity-60">
                <BookOpen size={14} />
                <span>Descrizione</span>
              </div>
              <p className="text-sm leading-relaxed text-base-content/80 whitespace-pre-line">
                {spell.description}
              </p>
            </div>
          )}

          {/* Upgrade */}
          {spell.upgrade && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm font-medium opacity-60">
                <Wand2 size={14} />
                <span>Ai livelli superiori</span>
              </div>
              <p className="text-sm leading-relaxed text-base-content/80 whitespace-pre-line">
                {spell.upgrade}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 bg-base-200/50 border-t border-base-300 flex justify-end">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
