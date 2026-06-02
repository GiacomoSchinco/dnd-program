import { useMemo, useState } from 'react';
import { usePartyDB } from '../hooks/usePartyDB';
import { useCampaignContext } from '../context/CampaignContext';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '../components/custom/DeleteConfirmModal';
import { EmptyState } from '../components/custom/EmptyState';
import { CharacterCard } from '../components/custom/CharacterCard';
import { CharacterFormModal } from '../components/custom/CharacterFormModal';
import { CampaignFormModal } from '../components/custom/CampaignFormModal';
import { PageHeader } from '../components/custom/PageHeader';
import { Users, Plus } from 'lucide-react';

export function PartyPage() {
  const { characters, campaigns, addCharacter, updateCharacter, deleteCharacter, addCampaign } = usePartyDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const activeCampaign = useMemo(
    () => campaigns?.find((campaign) => campaign.id === selectedCampaignId) || null,
    [campaigns, selectedCampaignId],
  );

  const openCreate = () => { setEditingChar(null); setIsModalOpen(true); };
  const openEdit = (char) => { setEditingChar(char); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleCharSubmit = async (formData) => {
    const charData = { ...formData, maxHp: formData.hp, campaignId: activeCampaign?.id || null };
    if (editingChar) {
      await updateCharacter(editingChar.id, charData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addCharacter(charData);
      toast.success(`${formData.name} aggiunto al party!`);
    }
    closeModal();
    setEditingChar(null);
  };

  const handleCampaignSubmit = async (formData) => {
    const campaignId = await addCampaign(formData);
    setSelectedCampaignId(campaignId);
    toast.success(`Campagna ${formData.name} creata!`);
    setIsCampaignModalOpen(false);
  };

  const handleDelete = (char) => {
    confirm({
      title: 'Rimuovi Personaggio',
      message: `Vuoi rimuovere ${char.name} dal party?`,
      onConfirm: async () => {
        await deleteCharacter(char.id);
        toast.info(`${char.name} rimosso`);
      },
    });
  };

  const filteredCharacters = characters?.filter(
    (char) => !selectedCampaignId || char.campaignId === selectedCampaignId,
  );

  return (
    <div className="space-y-6">
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
    </div>
  );
}