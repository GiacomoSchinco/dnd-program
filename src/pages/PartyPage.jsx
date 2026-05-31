import { useMemo, useState } from 'react';
import { usePartyDB } from '../hooks/usePartyDB';
import { CharacterClasses, CharacterRaces } from '../db/database';
import { useCampaignContext } from '../context/CampaignContext';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { CharacterCard } from '../components/custom/CharacterCard';

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
  
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    level: 1,
    race: '',
    hp: 10,
    ac: 10,
    campaignId: null
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const charData = {
      ...formData,
      maxHp: formData.hp,
      campaignId: activeCampaign?.id || null
    };
    
    if (editingChar) {
      await updateCharacter(editingChar.id, charData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addCharacter(charData);
      toast.success(`${formData.name} aggiunto al party!`);
    }
    setIsModalOpen(false);
    setEditingChar(null);
    setFormData({ name: '', class: '', level: 1, race: '', hp: 10, ac: 10, campaignId: null });
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    const campaignId = await addCampaign(campaignForm);
    setSelectedCampaignId(campaignId);
    toast.success(`Campagna ${campaignForm.name} creata!`);
    setIsCampaignModalOpen(false);
    setCampaignForm({ name: '', description: '' });
  };

  const handleEdit = (char) => {
    setEditingChar(char);
    setFormData(char);
    setIsModalOpen(true);
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

  const filteredCharacters = characters?.filter(char => 
    !selectedCampaignId || char.campaignId === selectedCampaignId
  );

  return (
    <div className="space-y-6">
      {/* Header con selezione campagna */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">👥 Personaggi</h1>
          <p className="text-base-content/60">
            Gestisci i personaggi della campagna attiva (selezione dalla topbar)
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            ➕ Nuovo Personaggio
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
            onEdit={() => handleEdit(char)}
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

      {/* Modal Personaggio */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {editingChar ? 'Modifica Personaggio' : 'Nuovo Personaggio'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">Nome</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Classe</label>
                  <select
                    className="select select-bordered"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  >
                    <option value="">Seleziona</option>
                    {Object.values(CharacterClasses).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">Livello</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Razza</label>
                  <select
                    className="select select-bordered"
                    value={formData.race}
                    onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                  >
                    <option value="">Seleziona razza...</option>
                    {CharacterRaces.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">CA</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.ac}
                    onChange={(e) => setFormData({ ...formData, ac: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">HP Massimi</label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.hp}
                  onChange={(e) => setFormData({ ...formData, hp: parseInt(e.target.value) })}
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingChar ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </dialog>
      )}

      {/* Modal Campagna */}
      {isCampaignModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Nuova Campagna</h3>
            <form onSubmit={handleCampaignSubmit} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">Nome Campagna</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Descrizione</label>
                <textarea
                  className="textarea textarea-bordered"
                  rows="3"
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="Descrivi la tua campagna..."
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsCampaignModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Crea Campagna
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsCampaignModalOpen(false)}></div>
        </dialog>
      )}
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