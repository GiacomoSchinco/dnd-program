import { useState } from 'react';
import { ParticipantList } from './ParticipantList';
import { SearchSelect } from '../ui';
import { Shield, Plus, User, Pencil, Swords, Skull } from 'lucide-react';
import type { ActiveCombat, Character, Monster, Npc, CombatParticipant } from '../../types';

interface CombatTrackerProps {
  activeCombat?: ActiveCombat;
  campaignCharacters?: Character[];
  monsterLibrary?: Monster[];
  npcLibrary?: Npc[];
  selectedCampaignId?: number | null;
  applyDamage: (participantId: string, damage: number) => void;
  heal: (participantId: string, heal: number) => void;
  addParticipant: (participant: CombatParticipant) => Promise<void>;
  removeParticipant: (participantId: string) => void;
  updateParticipantInitiative: (participantId: string, initiative: number) => Promise<void>;
  showToast: (message: string) => void;
}

interface PendingParticipant {
  participant: CombatParticipant;
  label: string;
}

interface NpcForm {
  isOpen: boolean;
  name: string;
  hp: number;
  ac: number;
  initiative: string;
}

export function CombatTracker({
  activeCombat,
  campaignCharacters = [],
  monsterLibrary = [],
  npcLibrary = [],
  selectedCampaignId,
  applyDamage,
  heal,
  addParticipant,
  removeParticipant,
  updateParticipantInitiative,
  showToast,
}: CombatTrackerProps) {
  const participants = activeCombat?.participants ?? [];
  const rawCurrentTurnIndex = activeCombat?.currentTurnIndex ?? 0;
  const currentTurnIndex = participants.length
    ? Math.min(Math.max(rawCurrentTurnIndex, 0), participants.length - 1)
    : 0;
  const combatStatus = activeCombat?.status ?? 'prepared';
  const isTerminated = combatStatus === 'terminated';

  // Modal iniziativa
  const [pending, setPending] = useState<PendingParticipant | null>(null);
  const [initiative, setInitiative] = useState<string>('');

  // Modal crea NPC al volo
  const [npcForm, setNpcForm] = useState<NpcForm>({ isOpen: false, name: '', hp: 10, ac: 10, initiative: '' });

  const openInitiativeModal = (participant: CombatParticipant, label: string) => {
    setPending({ participant, label });
    setInitiative('');
  };

  const closeInitiativeModal = () => {
    setPending(null);
    setInitiative('');
  };

  const handleConfirmAdd = async () => {
    if (!pending) return;
    const ini = parseInt(initiative, 10);
    await addParticipant({ ...pending.participant, initiative: isNaN(ini) ? 0 : ini });
    showToast(`${pending.participant.name} aggiunto al combattimento`);
    closeInitiativeModal();
  };

  const prepareAddPG = (characterId: string) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (selectedCampaignId == null) { showToast('Seleziona prima una campagna'); return; }
    if (!characterId) return;

    const char = campaignCharacters.find((c) => String(c.id) === String(characterId));
    if (!char) { showToast('Personaggio non trovato'); return; }

    const maxHp = Number(char.maxHp) || Number(char.hp) || 1;
    const currentHp = Math.max(0, Math.min(maxHp, Number(char.currentHp ?? maxHp)));

    openInitiativeModal({
      id: '',
      name: char.name,
      type: 'pc',
      characterId: char.id,
      campaignId: char.campaignId,
      hp: currentHp,
      currentHp,
      maxHp,
      ac: Number(char.ac) || 10,
      initiative: 0,
    }, `${char.name} — HP ${currentHp}/${maxHp} | CA ${char.ac || 10}`);
  };

  const prepareAddMonster = (monsterId: string) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (!monsterId) return;

    const monster = monsterLibrary.find((m) => String(m.id) === String(monsterId));
    if (!monster) { showToast('Mostro non trovato'); return; }

    openInitiativeModal({
      id: '',
      name: monster.name,
      type: 'monster',
      hp: Number(monster.hp) || 1,
      currentHp: Number(monster.hp) || 1,
      maxHp: Number(monster.hp) || 1,
      ac: Number(monster.ac) || 10,
      initiative: 0,
      damage: monster.damage,
    }, `${monster.name} — HP ${monster.hp} | CA ${monster.ac}`);
  };

  const prepareAddNpcFromLibrary = (npcId: string) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (!npcId) return;
    const npc = npcLibrary.find((n) => String(n.id) === String(npcId));
    if (!npc) { showToast('NPC non trovato'); return; }
    openInitiativeModal({
      id: '',
      name: npc.name,
      type: 'npc',
      hp: Number(npc.hp) || 1,
      currentHp: Number(npc.hp) || 1,
      maxHp: Number(npc.hp) || 1,
      ac: Number(npc.ac) || 10,
      initiative: 0,
    }, `${npc.name} — HP ${npc.hp} | CA ${npc.ac}`);
  };

  const handleCreateNpc = async () => {
    if (!npcForm.name.trim()) { showToast('Inserisci un nome per l\'NPC'); return; }
    const ini = parseInt(npcForm.initiative, 10);
    await addParticipant({
      id: '',
      name: npcForm.name.trim(),
      type: 'npc',
      hp: Number(npcForm.hp) || 1,
      currentHp: Number(npcForm.hp) || 1,
      maxHp: Number(npcForm.hp) || 1,
      ac: Number(npcForm.ac) || 10,
      initiative: isNaN(ini) ? 0 : ini,
    });
    showToast(`${npcForm.name} aggiunto al combattimento`);
    setNpcForm({ isOpen: false, name: '', hp: 10, ac: 10, initiative: '' });
  };

  const pcs = participants.filter((p) => p.type === 'pc' || p.type === 'npc');
  const monsters = participants.filter((p) => p.type === 'monster');
  const currentParticipantId = participants[currentTurnIndex]?.id ?? null;

  return (
    <div className="h-full flex flex-col gap-4">
      {isTerminated && (
        <div className="shrink-0">
          <span className="badge badge-error badge-lg">Battaglia Terminata</span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Colonna Alleati (PG + NPC) */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-success flex items-center gap-1"><Shield size={16} /> Alleati ({pcs.length})</h2>
            <div className="flex gap-2">
              {/* SearchSelect PG */}
              <SearchSelect
                placeholder="Cerca personaggio..."
                disabled={isTerminated}
                buttonClassName="btn btn-sm btn-success gap-1"
                buttonContent={<><Plus size={14} /> PG</>}
                emptyText="Nessun PG nella campagna"
                options={campaignCharacters.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                  sublabel: `HP ${c.currentHp ?? c.maxHp}/${c.maxHp} · CA ${c.ac ?? 10}`,
                }))}
                onSelect={(id) => prepareAddPG(String(id))}
              />
              {/* SearchSelect NPC */}
              <SearchSelect
                placeholder="Cerca NPC..."
                disabled={isTerminated}
                buttonClassName="btn btn-sm btn-info gap-1"
                buttonContent={<><User size={14} /> NPC</>}
                emptyText="Nessun NPC in libreria"
                options={npcLibrary.map((n) => ({
                  value: String(n.id),
                  label: n.name,
                  sublabel: `HP ${n.hp} · CA ${n.ac}`,
                }))}
                onSelect={(id) => prepareAddNpcFromLibrary(String(id))}
                extraActions={
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-base-300 transition-colors flex items-center gap-2 text-info font-semibold text-sm"
                    onClick={() => setNpcForm({ isOpen: true, name: '', hp: 10, ac: 10, initiative: '' })}
                  >
                    <Pencil size={13} /> Crea nuovo NPC...
                  </button>
                }
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ParticipantList
              participants={pcs}
              currentTurnIndex={currentTurnIndex}
              currentParticipantId={currentParticipantId}
              applyDamage={applyDamage}
              heal={heal}
              removeParticipant={removeParticipant}
              updateParticipantInitiative={updateParticipantInitiative}
              showToast={showToast}
              isTerminated={isTerminated}
            />
          </div>
        </div>

        {/* Colonna Mostri */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-error flex items-center gap-1"><Skull size={16} /> Mostri ({monsters.length})</h2>
            <SearchSelect
              placeholder="Cerca mostro..."
              disabled={isTerminated}
              buttonClassName="btn btn-sm btn-error gap-1"
              buttonContent={<><Plus size={14} /> Aggiungi Mostro</>}
              emptyText="Nessun mostro in libreria"
              options={monsterLibrary.map((m) => ({
                value: String(m.id),
                label: m.name,
                sublabel: `HP ${m.hp} · CA ${m.ac} · CR ${m.cr}`,
              }))}
              onSelect={(id) => prepareAddMonster(String(id))}
            />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ParticipantList
              participants={monsters}
              currentTurnIndex={currentTurnIndex}
              currentParticipantId={currentParticipantId}
              applyDamage={applyDamage}
              heal={heal}
              removeParticipant={removeParticipant}
              updateParticipantInitiative={updateParticipantInitiative}
              showToast={showToast}
              isTerminated={isTerminated}
            />
          </div>
        </div>
      </div>

      {/* Modal Crea NPC al volo */}
      {npcForm.isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={18} /> Crea NPC</h3>
            <div className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Nome</span></label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={npcForm.name}
                  onChange={(e) => setNpcForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Nome NPC"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text">HP</span></label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={npcForm.hp}
                    onChange={(e) => setNpcForm((s) => ({ ...s, hp: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">CA</span></label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={npcForm.ac}
                    onChange={(e) => setNpcForm((s) => ({ ...s, ac: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Iniziativa</span>
                  <span className="label-text-alt text-base-content/50">d20 + mod</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered input-lg text-center text-2xl font-bold"
                  value={npcForm.initiative}
                  onChange={(e) => setNpcForm((s) => ({ ...s, initiative: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateNpc()}
                  placeholder="0"
                  min="-10"
                  max="40"
                />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setNpcForm({ isOpen: false, name: '', hp: 10, ac: 10, initiative: '' })}>
                Annulla
              </button>
              <button className="btn btn-info gap-1" onClick={handleCreateNpc}>
                <Plus size={14} /> Aggiungi
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setNpcForm({ isOpen: false, name: '', hp: 10, ac: 10, initiative: '' })}></div>
        </dialog>
      )}

      {/* Modal Iniziativa */}
      {pending && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Swords size={18} /> Inserisci Iniziativa</h3>
            <p className="text-sm text-base-content/60 mb-4">{pending.label}</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Iniziativa</span>
                <span className="label-text-alt text-base-content/50">Tiro d20 + modificatore</span>
              </label>
              <input
                type="number"
                className="input input-bordered input-lg text-center text-2xl font-bold"
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmAdd()}
                placeholder="0"
                min="-10"
                max="40"
                autoFocus
              />
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closeInitiativeModal}>Annulla</button>
              <button className="btn btn-primary gap-1" onClick={handleConfirmAdd}>
                <Plus size={14} /> Aggiungi
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeInitiativeModal}></div>
        </dialog>
      )}
    </div>
  );
}