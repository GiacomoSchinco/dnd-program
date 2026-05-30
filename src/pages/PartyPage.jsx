import { useState } from 'react';
import { usePartyDB } from '../hooks/usePartyDB';
import { CharacterClasses } from '../db/database';
import { toast } from 'sonner';

export function PartyPage() {
  const { characters, campaigns, addCharacter, updateCharacter, deleteCharacter, addCampaign } = usePartyDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(campaigns?.[0] || null);
  
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
    await addCampaign(campaignForm);
    toast.success(`Campagna ${campaignForm.name} creata!`);
    setIsCampaignModalOpen(false);
    setCampaignForm({ name: '', description: '' });
  };

  const handleEdit = (char) => {
    setEditingChar(char);
    setFormData(char);
    setIsModalOpen(true);
  };

  const handleDelete = async (char) => {
    if (confirm(`Rimuovere ${char.name} dal party?`)) {
      await deleteCharacter(char.id);
      toast.info(`${char.name} rimosso`);
    }
  };

  const filteredCharacters = characters?.filter(char => 
    !activeCampaign || char.campaignId === activeCampaign.id
  );

  return (
    <div className="space-y-6">
      {/* Header con selezione campagna */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">📚 Campagne & Personaggi</h1>
          <p className="text-base-content/60">Gestisci le tue campagne e i personaggi giocanti</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-primary" onClick={() => setIsCampaignModalOpen(true)}>
            📖 Nuova Campagna
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            ➕ Nuovo Personaggio
          </button>
        </div>
      </div>

      {/* Selezione Campagna Attiva */}
      {campaigns?.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Campagna Attiva:</span>
                <select
                  className="select select-bordered select-sm"
                  value={activeCampaign?.id || ''}
                  onChange={(e) => {
                    const selected = campaigns.find(c => c.id === parseInt(e.target.value));
                    setActiveCampaign(selected);
                  }}
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {activeCampaign?.description && (
                <p className="text-sm opacity-70">{activeCampaign.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid Personaggi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters?.map((char) => (
          <div key={char.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-xl">{char.name}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className="badge badge-primary">{char.class}</span>
                    <span className="badge badge-secondary">Livello {char.level}</span>
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-sm">⋮</button>
                  <ul className="dropdown-menu dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-40">
                    <li><button onClick={() => handleEdit(char)}>✏️ Modifica</button></li>
                    <li><button onClick={() => handleDelete(char)}>🗑️ Elimina</button></li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Razza</span>
                  <span className="font-semibold">{char.race || 'Non specificata'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">HP Massimi</span>
                  <span className="font-semibold text-success">{char.hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Classe Armatura</span>
                  <span className="font-semibold text-info">{char.ac}</span>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-sm btn-outline btn-success"
                  onClick={() => {
                    // Naviga alla pagina combat con questo personaggio
                    window.location.href = '/combat';
                  }}
                >
                  ⚔️ Entra in Battaglia
                </button>
              </div>
            </div>
          </div>
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
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.race}
                    onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                  />
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
    </div>
  );
}