import { MoreVertical, Pencil, Trash2, Dices, HeartHandshake, Ruler, Clock, BookOpen, Shield, FlaskConical } from 'lucide-react';
import { DndIcon } from './DndIcon';

function getSchoolIconName(school) {
  const map = {
    'Abiurazione': 'abjuration',
    'Ammaestramento': 'enchantment',
    'Divinazione': 'divination',
    'Evocazione': 'evocation',
    'Illusione': 'illusion',
    'Invocazione': 'conjuration',
    'Necromanzia': 'necromancy',
    'Trasmutazione': 'transmutation',
  };
  return map[school] ?? 'universal';
}

function getSchoolColor(school) {
  const map = {
    'Abiurazione': 'text-info',
    'Ammaestramento': 'text-secondary',
    'Divinazione': 'text-warning',
    'Evocazione': 'text-error',
    'Illusione': 'text-accent',
    'Invocazione': 'text-success',
    'Necromanzia': 'text-neutral-content',
    'Trasmutazione': 'text-primary',
  };
  return map[school] ?? 'text-base-content/60';
}

export function SpellCard({ spell, onEdit, onDelete }) {
  const schoolColor = getSchoolColor(spell.school);
  const componentsText = spell.components
    ? `${spell.components}${spell.material ? ` (${spell.material})` : ''}`
    : null;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2 flex-1">
            <DndIcon name={getSchoolIconName(spell.school)} size={28} className={schoolColor} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="card-title text-lg">{spell.name}</h3>
                <span className="badge badge-primary badge-sm">Livello {spell.level}</span>
                <span className={`badge badge-sm ${schoolColor} border border-current/30`}>
                  {spell.school}
                </span>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-xs"><MoreVertical size={14} /></button>
            <ul className="dropdown-menu dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-32">
              <li><button className="gap-1" onClick={() => onEdit(spell)}><Pencil size={12} /> Modifica</button></li>
              <li><button className="gap-1" onClick={() => onDelete(spell)}><Trash2 size={12} /> Elimina</button></li>
            </ul>
          </div>
        </div>

        {/* Tags */}
        {(spell.concentration || spell.ritual) && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {spell.concentration && <span className="badge badge-warning badge-sm">Concentrazione</span>}
            {spell.ritual && <span className="badge badge-info badge-sm">Rituale</span>}
          </div>
        )}

        {/* Stats */}
        <div className="space-y-1 mt-2 text-sm">
          {spell.castingTime && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><Clock size={12} /> Lancio:</span>
              <span>{spell.castingTime}</span>
            </div>
          )}
          {componentsText && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><FlaskConical size={12} /> Componenti:</span>
              <span>{componentsText}</span>
            </div>
          )}
          {spell.saveType && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><Shield size={12} /> TS:</span>
              <span>{spell.saveType}</span>
            </div>
          )}
          {spell.damage && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><Dices size={12} /> Danno:</span>
              <span className="font-mono">{spell.damage}</span>
            </div>
          )}
          {spell.healing && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><HeartHandshake size={12} /> Cura:</span>
              <span className="font-mono">{spell.healing}</span>
            </div>
          )}
          {spell.range && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><Ruler size={12} /> Gittata:</span>
              <span>{spell.range}</span>
            </div>
          )}
          {spell.duration && (
            <div className="flex justify-between">
              <span className="opacity-70 flex items-center gap-1"><Clock size={12} /> Durata:</span>
              <span>{spell.duration}</span>
            </div>
          )}
          {spell.effect && (
            <div className="mt-2 pt-2 border-t border-base-300">
              <p className="text-xs font-medium flex items-center gap-1 opacity-60 mb-1">
                <BookOpen size={11} /> Descrizione
              </p>
              <p className="text-xs leading-relaxed">{spell.effect}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
