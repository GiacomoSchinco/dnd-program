import { Heart, Shield, User } from 'lucide-react';
import { LibraryCard } from './LibraryCard';
import type { Npc } from '../../types';

interface NpcCardProps {
  npc: Npc;
  onEdit: () => void;
  onDelete: () => void;
}

export function NpcCard({ npc, onEdit, onDelete }: NpcCardProps) {
  return (
    <LibraryCard
      icon={<User size={28} className="text-primary" />}
      title={npc.name}
      stats={[
        { icon: <Heart size={12} />, label: 'HP', value: npc.hp },
        { icon: <Shield size={12} />, label: 'CA', value: npc.ac },
      ]}
      description={npc.description}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
