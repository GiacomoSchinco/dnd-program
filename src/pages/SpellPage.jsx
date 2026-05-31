import { useState } from 'react';
import { useSpellsDB } from '../hooks/useSpellsDB';
import { useConfirm } from '../hooks/useConfirm';
import { SpellSchools } from '../db/database';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { PageHeader } from '../components/custom/PageHeader';
import { SearchInput } from '../components/custom/SearchInput';
import { exportCSV, rowToSpell, SPELL_COLUMNS } from '../utils/csvIO';
import { FormModal, Field, FieldRow } from '../components/custom/FormModal';
import { Sparkles, Plus, MoreVertical, Pencil, Trash2, Dices, HeartHandshake, Ruler, Clock, BookOpen, Shield, FlaskConical } from 'lucide-react';
import { DndIcon } from '../components/custom/DndIcon';

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

export function SpellsPage() {
  const { spells, addSpell, updateSpell, deleteSpell, importSpells } = useSpellsDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [filterSchool, setFilterSchool] = useState('all');
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    level: 1,
    school: 'Evocazione',
    damage: '',
    healing: '',
    range: '',
    duration: '',
    castingTime: '',
    components: '',
    material: '',
    concentration: false,
    ritual: false,
    saveType: '',
    effect: ''
  });

  const filteredSpells = spells?.filter(spell => {
    if (filterLevel !== 'all' && spell.level !== parseInt(filterLevel)) return false;
    if (filterSchool !== 'all' && spell.school !== filterSchool) return false;
    if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    if (!spells?.length) { toast.info('Nessun incantesimo da esportare'); return; }
    exportCSV(spells, SPELL_COLUMNS, 'incantesimi.csv');
    toast.success(`${spells.length} incantesimi esportati`);
  };

  const handleImport = async (rows) => {
    const valid = rows.map(rowToSpell).filter((s) => s.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importSpells(valid);
    toast.success(`${valid.length} incantesimi importati!`);
  };

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
    setFormData({ name: '', level: 1, school: 'Evocazione', damage: '', healing: '', range: '', duration: '', castingTime: '', components: '', material: '', concentration: false, ritual: false, saveType: '', effect: '' });
  };

  const handleEdit = (spell) => {
    setEditingSpell(spell);
    setFormData(spell);
    setIsModalOpen(true);
  };

  const handleDelete = (spell) => {
    confirm({
      title: 'Elimina Incantesimo',
      message: `Vuoi eliminare ${spell.name} dal grimorio?`,
      onConfirm: async () => {
        await deleteSpell(spell.id);
        toast.info(`${spell.name} rimosso`);
      },
    });
  };

  const levelOptions = ['all', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Sparkles size={28} />}
        title="Grimorio degli Incantesimi"
        subtitle="Consulta e gestisci gli incantesimi"
        actions={<>
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary gap-1" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Nuovo Incantesimo
          </button>
        </>}
      />

      {/* Filtri */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="form-control">
          <label className="label text-sm">Cerca</label>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Nome incantesimo..."
          />
        </div>
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
                <div className="flex items-start gap-2 flex-1">
                  <DndIcon name={getSchoolIconName(spell.school)} size={28} className={getSchoolColor(spell.school)} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="card-title text-lg">{spell.name}</h3>
                      <span className="badge badge-primary badge-sm">
                        Livello {spell.level}
                      </span>
                      <span className={`badge badge-sm ${getSchoolColor(spell.school)} border border-current/30`}>
                        {spell.school}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-xs"><MoreVertical size={14} /></button>
                  <ul className="dropdown-menu dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-32">
                    <li><button className="gap-1" onClick={() => handleEdit(spell)}><Pencil size={12} /> Modifica</button></li>
                    <li><button className="gap-1" onClick={() => handleDelete(spell)}><Trash2 size={12} /> Elimina</button></li>
                  </ul>
                </div>
              </div>
              
              {/* Tags: concentrazione / rituale */}
              {(spell.concentration || spell.ritual) && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {spell.concentration && <span className="badge badge-warning badge-sm">Concentrazione</span>}
                  {spell.ritual && <span className="badge badge-info badge-sm">Rituale</span>}
                </div>
              )}

              <div className="space-y-1 mt-2 text-sm">
                {spell.castingTime && (
                  <div className="flex justify-between">
                    <span className="opacity-70 flex items-center gap-1"><Clock size={12} /> Lancio:</span>
                    <span>{spell.castingTime}</span>
                  </div>
                )}
                {spell.components && (
                  <div className="flex justify-between">
                    <span className="opacity-70 flex items-center gap-1"><FlaskConical size={12} /> Componenti:</span>
                    <span>{spell.components}{spell.material ? ` (${spell.material})` : ''}</span>
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
                    <p className="text-xs font-medium flex items-center gap-1 opacity-60 mb-1"><BookOpen size={11} /> Descrizione</p>
                    <p className="text-xs leading-relaxed">{spell.effect}</p>
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
      <FormModal
        isOpen={isModalOpen}
        title={editingSpell ? 'Modifica Incantesimo' : 'Nuovo Incantesimo'}
        confirmText={editingSpell ? 'Aggiorna' : 'Crea'}
        wide
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Field label="Nome" required>
          <input type="text" className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required autoFocus />
        </Field>

        <FieldRow>
          <Field label="Livello">
            <select className="select select-bordered w-full"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}>
              {[0,1,2,3,4,5,6,7,8,9].map(l => (
                <option key={l} value={l}>{l === 0 ? 'Trucchetto' : `Livello ${l}`}</option>
              ))}
            </select>
          </Field>
          <Field label="Scuola">
            <select className="select select-bordered w-full"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}>
              {Object.values(SpellSchools).map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="Danno" hint="es. 8d6">
            <input type="text" className="input input-bordered w-full"
              value={formData.damage}
              onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
              placeholder="es. 8d6" />
          </Field>
          <Field label="Cura" hint="es. 2d8+mod">
            <input type="text" className="input input-bordered w-full"
              value={formData.healing}
              onChange={(e) => setFormData({ ...formData, healing: e.target.value })}
              placeholder="es. 2d8+mod" />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="Gittata">
            <input type="text" className="input input-bordered w-full"
              value={formData.range}
              onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              placeholder="es. 120 ft" />
          </Field>
          <Field label="Durata">
            <input type="text" className="input input-bordered w-full"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="es. 1 ora" />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="Tempo di lancio">
            <input type="text" className="input input-bordered w-full"
              value={formData.castingTime}
              onChange={(e) => setFormData({ ...formData, castingTime: e.target.value })}
              placeholder="es. 1 azione, 1 azione bonus" />
          </Field>
          <Field label="Tiro Salvezza">
            <input type="text" className="input input-bordered w-full"
              value={formData.saveType}
              onChange={(e) => setFormData({ ...formData, saveType: e.target.value })}
              placeholder="es. Destrezza, Costituzione" />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="Componenti">
            <input type="text" className="input input-bordered w-full"
              value={formData.components}
              onChange={(e) => setFormData({ ...formData, components: e.target.value })}
              placeholder="es. V, S, M" />
          </Field>
          <Field label="Materiale">
            <input type="text" className="input input-bordered w-full"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="es. una piuma d'oca" />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="Concentrazione">
            <div className="flex items-center h-10">
              <input type="checkbox" className="checkbox checkbox-warning"
                checked={!!formData.concentration}
                onChange={(e) => setFormData({ ...formData, concentration: e.target.checked })} />
              <span className="ml-2 text-sm">Richiede concentrazione</span>
            </div>
          </Field>
          <Field label="Rituale">
            <div className="flex items-center h-10">
              <input type="checkbox" className="checkbox checkbox-info"
                checked={!!formData.ritual}
                onChange={(e) => setFormData({ ...formData, ritual: e.target.checked })} />
              <span className="ml-2 text-sm">Può essere lanciato come rituale</span>
            </div>
          </Field>
        </FieldRow>

        <Field label="Descrizione">
          <textarea className="textarea textarea-bordered w-full" rows="4"
            value={formData.effect}
            onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
            placeholder="Descrizione completa dell'effetto dell'incantesimo..." />
        </Field>
      </FormModal>
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        icon={confirmState.icon}
        confirmText="Elimina"
        confirmVariant="error"
      />
    </div>
  );
}