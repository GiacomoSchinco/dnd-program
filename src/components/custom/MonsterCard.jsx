import { Heart, Shield, Dices, User, Skull, Flame, Leaf, Mountain, Swords, Moon } from 'lucide-react';
import { LibraryCard } from './LibraryCard';

const TYPE_META = {
  humanoid:    { icon: User,     color: 'text-base-content',   label: 'Umanoide' },
  beast:       { icon: Leaf,     color: 'text-success',         label: 'Bestia' },
  undead:      { icon: Skull,    color: 'text-neutral-content', label: 'Non Morto' },
  dragon:      { icon: Flame,    color: 'text-error',           label: 'Drago' },
  giant:       { icon: Mountain, color: 'text-warning',         label: 'Gigante' },
  goblinoid:   { icon: Swords,   color: 'text-accent',          label: 'Goblinide' },
  lycanthrope: { icon: Moon,     color: 'text-secondary',       label: 'Licantropo' },
};

export function getMonsterTypeMeta(type) {
  return TYPE_META[type] ?? { icon: User, color: 'text-base-content', label: type ?? '—' };
}

export function MonsterCard({ monster, onEdit, onDelete }) {
  const meta = getMonsterTypeMeta(monster.type);
  const Icon = meta.icon;

  return (
    <LibraryCard
      icon={<Icon size={28} className={meta.color} />}
      title={monster.name}
      badges={[
        { label: `CR ${monster.cr}`, className: 'badge-primary' },
        { label: meta.label, className: `${meta.color} border border-current/30` },
      ]}
      stats={[
        { icon: <Heart size={12} />, label: 'HP', value: monster.hp },
        { icon: <Shield size={12} />, label: 'CA', value: monster.ac },
        { icon: <Dices size={12} />, label: 'Danno', value: monster.damage, mono: true },
      ]}
      description={monster.description}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
