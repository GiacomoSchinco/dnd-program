import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Dices, Clock, Shield, FlaskConical, BookOpen, ChevronDown, ChevronUp, Timer, Gauge, Users } from 'lucide-react';
import { DndIcon } from '../ui/DndIcon';
import { getSchoolIcon, getSchoolColor, getSchoolName, getClassName } from '../../utils/icons';
import type { Spell } from '../../types';

interface SpellCardProps {
  spell: Spell;
  onEdit: (spell: Spell) => void;
  onDelete: (spell: Spell) => void;
}

// ── Stat chip ──────────────────────────────────────────────────────────────

interface StatChipProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function StatChip({ icon, label, value, mono }: StatChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-base-200 text-xs font-medium" title={label}>
      <span className="opacity-50 shrink-0">{icon}</span>
      <span className={mono ? 'font-mono' : ''}>{value}</span>
    </span>
  );
}

// ── SpellCard ──────────────────────────────────────────────────────────────

export function SpellCard({ spell, onEdit, onDelete }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false);
  const schoolColor = getSchoolColor(spell.school);
  const componentsText = spell.components
    ? `${spell.components}${spell.material ? ` (${spell.material})` : ''}`
    : null;

  const hasDesc = !!spell.description;
  const isLongDesc = hasDesc && spell.description!.length > 150;

  const levelLabel = spell.level === 0 ? 'Trucchetto' : `Liv. ${spell.level}`;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body p-4 gap-3">
        {/* ── Riga 1: icona + nome + menu ── */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 min-w-0">
            <DndIcon name={getSchoolIcon(spell.school)} size={26} className={`${schoolColor} shrink-0`} />
            <h3 className="card-title text-base sm:text-lg truncate">{spell.name}</h3>
          </div>
          <div className="dropdown dropdown-end shrink-0">
            <button className="btn btn-ghost btn-xs" tabIndex={0}><MoreVertical size={14} /></button>
            <ul className="dropdown-menu dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-32" tabIndex={0}>
              <li><button className="gap-1" onClick={() => onEdit(spell)}><Pencil size={12} /> Modifica</button></li>
              <li><button className="gap-1" onClick={() => onDelete(spell)}><Trash2 size={12} /> Elimina</button></li>
            </ul>
          </div>
        </div>

        {/* ── Riga 2: badge livello + scuola + classi + tag ── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="badge badge-primary badge-sm">{levelLabel}</span>
          <span className={`badge badge-sm ${schoolColor} border border-current/30`}>{getSchoolName(spell.school)}</span>
          {spell.classes && (
            <span className="badge badge-ghost badge-sm gap-1">
              <Users size={11} />
              {spell.classes.split(',').map((c) => c.trim()).map(getClassName).join(', ')}
            </span>
          )}
          {spell.concentration && <span className="badge badge-warning badge-sm">Concentrazione</span>}
          {spell.ritual && <span className="badge badge-info badge-sm">Rituale</span>}
        </div>

        {/* ── Riga 3: chip parametri ── */}
        <div className="flex flex-wrap gap-1.5">
          {spell.casting && (
            <StatChip icon={<Timer size={11} />} label="Tempo di lancio" value={spell.casting} />
          )}
          {spell.range && (
            <StatChip icon={<Gauge size={11} />} label="Gittata" value={spell.range} />
          )}
          {spell.duration && (
            <StatChip icon={<Clock size={11} />} label="Durata" value={spell.duration} />
          )}
          {spell.damage && (
            <StatChip icon={<Dices size={11} />} label="Danno" value={spell.damage} mono />
          )}
          {spell.save && (
            <StatChip icon={<Shield size={11} />} label="Tiro Salvezza" value={spell.save} />
          )}
        </div>

        {/* ── Riga 4: descrizione ── */}
        {hasDesc && (
          <div className="border-t border-base-300 pt-2">
            {componentsText && (
              <div className="mb-1.5 px-2.5 py-1 rounded-md bg-base-200/60 border border-base-300 text-xs inline-flex items-center gap-1.5">
                <FlaskConical size={11} className="opacity-50 shrink-0" />
                <span className="font-medium">{componentsText}</span>
              </div>
            )}

            <div className="flex items-center gap-1 mb-1">
              <BookOpen size={11} className="opacity-50" />
              <span className="text-xs font-medium opacity-60">Descrizione</span>
            </div>
            <div className={`text-xs leading-relaxed text-base-content/80 ${!expanded && isLongDesc ? 'line-clamp-3' : ''}`}>
              {spell.description}
            </div>

            {/* Pulsante Leggi tutto / Mostra meno */}
            {isLongDesc && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-primary font-medium mt-1 hover:underline"
              >
                {expanded ? (
                  <>Mostra meno <ChevronUp size={12} /></>
                ) : (
                  <>Leggi tutto <ChevronDown size={12} /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
