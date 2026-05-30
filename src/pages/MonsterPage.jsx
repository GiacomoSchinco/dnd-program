import { useState } from 'react';
import { useCombatDB } from '../hooks/useCombatDB';
import { toast } from 'sonner';

export function MonstersPage() {
  const { monsterLibrary, addMonster, updateMonster, deleteMonster } = useCombatDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hp: 10,
    ac: 10,
    damage: '1d6',
    cr: '1/4',
    type: 'humanoid'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingMonster) {
      await updateMonster(editingMonster.id, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addMonster(formData);
      toast.success(`${formData.name} aggiunto alla libreria!`);
    }
    setIsModalOpen(false);
    setEditingMonster(null);
    setFormData({ name: '', hp: 10, ac: 10, damage: '1d6', cr: '1/4', type: 'humanoid' });
  };

  const handleDelete = async (monster) => {
    if (confirm(`Eliminare ${monster.name} dalla libreria?`)) {
      await deleteMonster(monster.id);
      toast.info(`${monster.name} rimosso`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">🐉 Libreria Mostri</h1>
          <p className="text-base-content/60">Gestisci i mostri del tuo bestiario</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          ➕ Nuovo Mostro
        </button>
      </div>

      {/* Grid Mostri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {monsterLibrary?.map((monster) => (
          <div key={monster.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <h3 className="card-title text-lg">{monster.name}</h3>
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-xs">⋮</button>
                  <ul className="dropdown-menu dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-32">
                    <li><button onClick={() => {
                      setEditingMonster(monster);
                      setFormData(monster);
                      setIsModalOpen(true);
                    }}>✏️ Modifica</button></li>
                    <li><button onClick={() => handleDelete(monster)}>🗑️ Elimina</button></li>
                  </ul>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-70">HP:</span>
                  <span className="font-semibold">{monster.hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">CA:</span>
                  <span className="font-semibold">{monster.ac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Danno:</span>
                  <span className="font-semibold">{monster.damage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">CR:</span>
                  <span className="badge badge-xs badge-primary">{monster.cr}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {editingMonster ? 'Modifica Mostro' : 'Nuovo Mostro'}
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
                  <label className="label">HP</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: parseInt(e.target.value) })}
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
                <label className="label">Dado Danno (es. 2d6+3)</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.damage}
                  onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
                  placeholder="2d6+3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">CR (Sfida)</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.cr}
                    onChange={(e) => setFormData({ ...formData, cr: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">Tipo</label>
                  <select
                    className="select select-bordered"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="humanoid">Umanoide</option>
                    <option value="beast">Bestia</option>
                    <option value="undead">Non Morto</option>
                    <option value="dragon">Drago</option>
                    <option value="giant">Gigante</option>
                    <option value="goblinoid">Goblinide</option>
                    <option value="lycanthrope">Lupo Mannaro</option>
                  </select>
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMonster ? 'Aggiorna' : 'Crea'}
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