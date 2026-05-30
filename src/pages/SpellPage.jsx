import { useState } from 'react';
import { useSpellsDB } from '../hooks/useSpellsDB';
import { SpellSchools } from '../db/database';
import { toast } from 'sonner';

export function SpellsPage() {
  const { spells, addSpell, updateSpell, deleteSpell } = useSpellsDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    level: 1,
    school: 'Evocazione',
    damage: '',
    healing: '',
    range: '',
    duration: '',
    effect: ''
  });

  const filteredSpells = spells?.filter(spell => {
    if (filterLevel !== 'all' && spell.level !== parseInt(filterLevel)) return false;
    if (filterSchool !== 'all' && spell.school !== filterSchool) return false;
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingSpell) {
      await updateSpell(editingSpell.id, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addSpell(formData);
      toast.success(`${formData.name} aggiunto al grimorio!`);
    }
    setIsModalOpen(false);
    setEditingSpell(null);
    setFormData({ name: '', level: 1, school: 'Evocazione', damage: '', healing: '', range: '', duration: '', effect: '' });
  };

  const handleEdit = (spell) => {
    setEditingSpell(spell);
    setFormData(spell);
    setIsModalOpen(true);
  };

  const handleDelete = async (spell) => {
    if (confirm(`Eliminare ${spell.name} dal grimorio?`)) {
      await deleteSpell(spell.id);
      toast.info(`${spell.name} rimosso`);
    }
  };

  const levelOptions = ['all', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">✨ Grimorio degli Incantesimi</h1>
          <p className="text-base-content/60">Consulta e gestisci gli incantesimi</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          ➕ Nuovo Incantesimo
        </button>
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap gap-4">
        <div className="form-control">
          <label className="label text-sm">Livello</label>
          <select
            className="select select-bordered select-sm"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            {levelOptions.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'Tutti' : `Livello ${level}`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label text-sm">Scuola</label>
          <select
            className="select select-bordered select-sm"
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
          >
            <option value="all">Tutte</option>
            {Object.values(SpellSchools).map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Incantesimi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpells?.map((spell) => (
          <div key={spell.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="card-title text-lg">{spell.name}</h3>
                    <span className="badge badge-primary badge-sm">
                      Livello {spell.level}
                    </span>
                    <span className="badge badge-secondary badge-sm">
                      {spell.school}
                    </span>
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-xs">⋮</button>
                  <ul className="dropdown-menu dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-32">
                    <li><button onClick={() => handleEdit(spell)}>✏️ Modifica</button></li>
                    <li><button onClick={() => handleDelete(spell)}>🗑️ Elimina</button></li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-1 mt-2 text-sm">
                {spell.damage && (
                  <div className="flex justify-between">
                    <span className="opacity-70">🎲 Danno:</span>
                    <span className="font-mono">{spell.damage}</span>
                  </div>
                )}
                {spell.healing && (
                  <div className="flex justify-between">
                    <span className="opacity-70">💚 Cura:</span>
                    <span className="font-mono">{spell.healing}</span>
                  </div>
                )}
                {spell.range && (
                  <div className="flex justify-between">
                    <span className="opacity-70">📏 Gittata:</span>
                    <span>{spell.range}</span>
                  </div>
                )}
                {spell.duration && (
                  <div className="flex justify-between">
                    <span className="opacity-70">⏱️ Durata:</span>
                    <span>{spell.duration}</span>
                  </div>
                )}
                {spell.effect && (
                  <div className="mt-2 pt-2 border-t border-base-300">
                    <p className="text-xs italic opacity-70">{spell.effect}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSpells?.length === 0 && (
        <div className="alert alert-info">
          <span>Nessun incantesimo trovato con questi filtri</span>
        </div>
      )}

      {/* Modal Aggiungi/Modifica */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">
              {editingSpell ? 'Modifica Incantesimo' : 'Nuovo Incantesimo'}
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
                  <label className="label">Livello</label>
                  <select
                    className="select select-bordered"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  >
                    {[0,1,2,3,4,5,6,7,8,9].map(l => (
                      <option key={l} value={l}>{l === 0 ? 'Trucchetto' : `Livello ${l}`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">Scuola</label>
                  <select
                    className="select select-bordered"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  >
                    {Object.values(SpellSchools).map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Danno (es. 8d6)</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.damage}
                    onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
                    placeholder="es. 8d6"
                  />
                </div>
                <div className="form-control">
                  <label className="label">Cura (es. 2d8+mod)</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.healing}
                    onChange={(e) => setFormData({ ...formData, healing: e.target.value })}
                    placeholder="es. 2d8+mod"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Gittata</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.range}
                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                    placeholder="es. 120 ft"
                  />
                </div>
                <div className="form-control">
                  <label className="label">Durata</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="es. Concentrazione, 1 ora"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">Effetto/Descrizione</label>
                <textarea
                  className="textarea textarea-bordered"
                  rows="3"
                  value={formData.effect}
                  onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
                  placeholder="Descrizione dell'incantesimo..."
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSpell ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </dialog>
      )}
    </div>
  );
}