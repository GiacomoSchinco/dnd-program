import { useState, useMemo } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal, CsvToolbar, PageHeader, FilterBar, FilterSelect, PageWrapper, ContentSection, DataTable } from '../components/ui';
import { DndIcon } from '../components/ui/DndIcon';
import { SCHOOL_LABELS, getSchoolIcon, getSchoolColor, getSchoolName, getClassName } from '../utils/icons';
import { SpellFormModal, SpellDetailModal } from '../components/library';
import { exportCSV, rowToSpell, SPELL_COLUMNS } from '../utils/csvIO';
import { Sparkles, Plus, Users } from 'lucide-react';
import type { Spell } from '../types';
import type { ReactNode } from 'react';

const LEVEL_OPTIONS = ['all', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type FilterLevel = typeof LEVEL_OPTIONS[number];
type FilterSchool = 'all' | keyof typeof SCHOOL_LABELS;

interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
}

export function SpellsPage() {
  const { spells, addSpell, updateSpell, deleteSpell, importSpells } = useDB();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all');
  const [filterSchool, setFilterSchool] = useState<FilterSchool>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [search, setSearch] = useState('');

  const allClasses = useMemo(() => {
    if (!spells) return [];
    const set = new Set<string>();
    spells.forEach((s) => {
      s.classes?.split(',').forEach((c) => {
        const trimmed = c.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return Array.from(set).sort();
  }, [spells]);

  const filteredSpells = useMemo(() => {
    return spells?.filter((spell: Spell) => {
      if (filterLevel !== 'all' && spell.level !== filterLevel) return false;
      if (filterSchool !== 'all' && spell.school !== filterSchool) return false;
      if (filterClass !== 'all' && !spell.classes?.split(',').map((c) => c.trim()).includes(filterClass)) return false;
      if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }) ?? [];
  }, [spells, filterLevel, filterSchool, filterClass, search]);

  const handleExport = () => {
    if (!spells?.length) { toast.info('Nessun incantesimo da esportare'); return; }
    exportCSV(spells, SPELL_COLUMNS, 'incantesimi.csv');
    toast.success(`${spells.length} incantesimi esportati`);
  };

  const handleImport = async (rows: Record<string, string>[]) => {
    const valid = rows.map(rowToSpell).filter((s): s is Omit<Spell, "id"> => s !== null && !!s.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importSpells(valid.filter((s): s is Omit<Spell, "id"> => s !== null));
    toast.success(`${valid.length} incantesimi importati!`);
  };

  const handleSubmit = async (formData: Omit<Spell, 'id'>, editingItem?: Spell | null) => {
    if (editingItem) {
      await updateSpell(editingItem.id!, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addSpell(formData);
      toast.success(`${formData.name} aggiunto al grimorio!`);
    }
    setIsModalOpen(false);
    setEditingSpell(null);
  };

  const handleEdit = (_id: any, spell: Spell) => {
    setEditingSpell(spell);
    setIsModalOpen(true);
  };

  const handleDelete = (_id: any, spell: Spell) => {
    confirm({
      title: 'Elimina Incantesimo',
      message: `Vuoi eliminare ${spell.name} dal grimorio?`,
      onConfirm: async () => {
        await deleteSpell(spell.id!);
        toast.info(`${spell.name} rimosso`);
      },
    });
  };

  const columns: ColumnDef<Spell>[] = [
    { key: 'name', label: 'Nome' },
    {
      key: 'level',
      label: 'Liv.',
      render: (value: number) =>
        value === 0
          ? <span className="badge badge-ghost badge-sm">Trucchetto</span>
          : <span className="badge badge-primary badge-sm">{value}</span>,
    },
    {
      key: 'school',
      label: 'Scuola',
      render: (_value: string, spell: Spell) => {
        const color = getSchoolColor(spell.school);
        return (
          <span className={`inline-flex items-center gap-1.5 ${color}`}>
            <DndIcon name={getSchoolIcon(spell.school)} size={18} className="shrink-0" />
            <span>{getSchoolName(spell.school)}</span>
          </span>
        );
      },
    },
    {
      key: 'classes',
      label: 'Classi',
      render: (value: string) => (
        <span className="inline-flex items-center gap-1 text-sm">
          <Users size={12} className="opacity-50 shrink-0" />
          <span className="truncate max-w-[200px] block">
            {value?.split(',').map((c) => c.trim()).map(getClassName).join(', ')}
          </span>
        </span>
      ),
    },
  ];

  return (
    <PageWrapper>
      <PageHeader
        icon={<Sparkles size={28} />}
        title="Magie"
        subtitle="Tutti gli incantesimi disponibili per la tua avventura"
        actions={<>
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary gap-1" onClick={() => { setEditingSpell(null); setIsModalOpen(true); }}>
            <Plus size={16} /> Nuovo Incantesimo
          </button>
        </>}
      />

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Nome incantesimo...">
        <FilterSelect label="Livello" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : Number(e.target.value) as FilterLevel)}>
          {LEVEL_OPTIONS.map((level) => (
            <option key={level} value={level}>{level === 'all' ? 'Tutti' : `Livello ${level}`}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Scuola" value={filterSchool} onChange={(e) => setFilterSchool(e.target.value as FilterSchool)}>
          <option value="all">Tutte</option>
          {Object.entries(SCHOOL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Classe" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="all">Tutte</option>
          {allClasses.map((cls) => (
            <option key={cls} value={cls}>{getClassName(cls)}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      {/* Tabella Incantesimi */}
      <ContentSection>
        <DataTable
          initialData={filteredSpells}
          columns={columns}
          onView={(_id: any, spell: Spell) => setDetailSpell(spell)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination
          itemsPerPage={10}
          emptyMessage={spells?.length === 0 ? 'Nessun incantesimo in libreria. Creane uno!' : 'Nessun incantesimo trovato con questi filtri.'}
        />
      </ContentSection>

      <SpellFormModal
        isOpen={isModalOpen}
        editingSpell={editingSpell}
        onClose={() => { setIsModalOpen(false); setEditingSpell(null); }}
        onSubmit={handleSubmit}
      />

      <SpellDetailModal
        isOpen={!!detailSpell}
        spell={detailSpell}
        onClose={() => setDetailSpell(null)}
      />

      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
    </PageWrapper>
  );
}
