import { useMemo, useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useCampaignContext } from '../context/CampaignContext';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal, EmptyState, PageHeader, PageWrapper } from '../components/ui';
import { CharacterCard, CharacterFormModal } from '../components/combat';
import { CampaignFormModal } from '../components/campaign';
import { Users, Plus } from 'lucide-react';
import type { Character } from '../types';
import type { CampaignFormData } from '../components/campaign/CampaignFormModal';
import type { CharFormData } from '../components/combat/CharacterFormModal';

export function PartyPage() {
  const { characters, campaigns, addCharacter, updateCharacter, deleteCharacter, addCampaign } = useDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<Character | null>(null);
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const activeCampaign = useMemo(
    () => campaigns?.find((campaign) => campaign.id === selectedCampaignId) || null,
    [campaigns, selectedCampaignId],
  );

  const openCreate = () => { setEditingChar(null); setIsModalOpen(true); };
  const openEdit = (char: Character) => { setEditingChar(char); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleCharSubmit = async (formData: CharFormData) => {
    const charData = { ...formData, maxHp: formData.hp, campaignId: activeCampaign?.id || null };
    if (editingChar) {
      await updateCharacter(editingChar.id!, charData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addCharacter(charData);
      toast.success(`${formData.name} aggiunto al party!`);
    }
    closeModal();
    setEditingChar(null);
  };

  const handleCampaignSubmit = async (formData: CampaignFormData) => {
    const campaignId = await addCampaign(formData);
    setSelectedCampaignId(campaignId);
    toast.success(`Campagna ${formData.name} creata!`);
    setIsCampaignModalOpen(false);
  };

  const handleHeal = (char: Character) => (amount: number) => {
    const currentHp = Math.min(
      (char.currentHp ?? char.hp) + amount,
      char.maxHp ?? char.hp,
    );
    updateCharacter(char.id!, { currentHp });
    toast.success(`${char.name} curato di ${amount} HP`);
  };

  const handleDamage = (char: Character) => (amount: number) => {
    const currentHp = Math.max(
      (char.currentHp ?? char.hp) - amount,
      0,
    );
    updateCharacter(char.id!, { currentHp });
    toast.error(`${char.name} subisce ${amount} danni`);
  };

  const handleDelete = (char: Character) => {
    confirm({
      title: 'Rimuovi Personaggio',
      message: `Vuoi rimuovere ${char.name} dal party?`,
      onConfirm: async () => {
        await deleteCharacter(char.id!);
        toast.info(`${char.name} rimosso`);
      },
    });
  };

  const filteredCharacters = characters?.filter(
    (char) => !selectedCampaignId || char.campaignId === selectedCampaignId,
  );

  return (
    <PageWrapper>
      {/* Header con selezione campagna */}
      <PageHeader
        icon={<Users size={28} />}
        title="Personaggi"
        subtitle="Gestisci i personaggi della campagna attiva (selezione dalla topbar)"
        actions={
          <button className="btn btn-primary gap-1" onClick={openCreate}>
            <Plus size={16} /> Nuovo Personaggio
          </button>
        }
      />

      {activeCampaign?.description && (
        <div className="alert alert-info">
          <span>
            Campagna attiva: <strong>{activeCampaign.name}</strong> - {activeCampaign.description}
          </span>
        </div>
      )}

      {/* Grid Personaggi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters?.map((char) => (
          <CharacterCard
            key={char.id}
            name={char.name}
            race={char.race}
            characterClass={char.class}
            level={char.level}
            ac={char.ac}
            currentHp={char.currentHp ?? char.hp}
            maxHp={char.maxHp ?? char.hp}
            onEdit={() => openEdit(char)}
            onDelete={() => handleDelete(char)}
            onHeal={handleHeal(char)}
            onDamage={handleDamage(char)}
          />
        ))}
      </div>

      {filteredCharacters?.length === 0 && (
        <EmptyState
          message={
            activeCampaign
              ? 'Nessun personaggio in questa campagna. Creane uno nuovo!'
              : 'Nessuna campagna attiva. Crea una campagna per iniziare!'
          }
          variant="info"
        />
      )}

      <CharacterFormModal
        isOpen={isModalOpen}
        editingChar={editingChar}
        onClose={closeModal}
        onSubmit={handleCharSubmit}
      />

      <CampaignFormModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSubmit={handleCampaignSubmit}
      />

      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} confirmText="Rimuovi" />
    </PageWrapper>
  );
}