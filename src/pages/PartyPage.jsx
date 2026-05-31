import { useMemo, useState } from 'react';
import { usePartyDB } from '../hooks/usePartyDB';
import { useCampaignContext } from '../context/CampaignContext';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { CharacterCard } from '../components/custom/CharacterCard';
import { CharacterFormModal } from '../components/custom/CharacterFormModal';
import { CampaignFormModal } from '../components/custom/CampaignFormModal';
import { Users, Plus } from 'lucide-react';

export function PartyPage() {
  const { characters, campaigns, addCharacter, updateCharacter, deleteCharacter, addCampaign } = usePartyDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });

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
    setConfirmState({
      isOpen: true,
      title: 'Rimuovi Personaggio',
      message: `Vuoi rimuovere ${char.name} dal party?`,
      icon: '🗑️',
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
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Users size={28} /> Personaggi</h1>
          <p className="text-base-content/60">
            Gestisci i personaggi della campagna attiva (selezione dalla topbar)
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary gap-1" onClick={openCreate}>
            <Plus size={16} /> Nuovo Personaggio
          </button>
        </div>
      </div>

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
        <div className="alert alert-info">
          <span>
            {activeCampaign
              ? 'Nessun personaggio in questa campagna. Creane uno nuovo!'
              : 'Nessuna campagna attiva. Crea una campagna per iniziare!'}
          </span>
        </div>
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

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        icon={confirmState.icon}
        confirmText="Rimuovi"
        confirmVariant="error"
      />
    </div>
  );
}