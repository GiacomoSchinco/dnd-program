import { useState } from 'react';
import { ParticipantList } from './ParticipantList';

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
}) {
  const participants = activeCombat?.participants ?? [];
  const rawCurrentTurnIndex = activeCombat?.currentTurnIndex ?? 0;
  const currentTurnIndex = participants.length
    ? Math.min(Math.max(rawCurrentTurnIndex, 0), participants.length - 1)
    : 0;
  const combatStatus = activeCombat?.status ?? 'prepared';
  const isTerminated = combatStatus === 'terminated';

  // Modal iniziativa
  const [pending, setPending] = useState(null);
  const [initiative, setInitiative] = useState('');

  // Modal crea NPC al volo
  const [npcForm, setNpcForm] = useState({ isOpen: false, name: '', hp: 10, ac: 10, initiative: '' });

  const openInitiativeModal = (participant, label) => {
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

  const prepareAddPG = (characterId) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (selectedCampaignId == null) { showToast('Seleziona prima una campagna'); return; }
    if (!characterId) return;

    const char = campaignCharacters.find((c) => String(c.id) === String(characterId));
    if (!char) { showToast('Personaggio non trovato'); return; }

    const maxHp = Number(char.maxHp) || Number(char.hp) || 1;
    const currentHp = Math.max(0, Math.min(maxHp, Number(char.currentHp ?? maxHp)));

    openInitiativeModal({
      name: char.name,
      type: 'pc',
      characterId: char.id,
      campaignId: char.campaignId,
      currentHp,
      maxHp,
      ac: Number(char.ac) || 10,
      initiative: 0,
    }, `${char.name} — HP ${currentHp}/${maxHp} | CA ${char.ac || 10}`);
  };

  const prepareAddMonster = (monsterId) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (!monsterId) return;

    const monster = monsterLibrary.find((m) => String(m.id) === String(monsterId));
    if (!monster) { showToast('Mostro non trovato'); return; }

    openInitiativeModal({
      name: monster.name,
      type: 'monster',
      currentHp: Number(monster.hp) || 1,
      maxHp: Number(monster.hp) || 1,
      ac: Number(monster.ac) || 10,
      initiative: 0,
      damage: monster.damage,
    }, `${monster.name} — HP ${monster.hp} | CA ${monster.ac}`);
  };

  const prepareAddNpcFromLibrary = (npcId) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (!npcId) return;
    const npc = npcLibrary.find((n) => String(n.id) === String(npcId));
    if (!npc) { showToast('NPC non trovato'); return; }
    openInitiativeModal({
      name: npc.name,
      type: 'npc',
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
      name: npcForm.name.trim(),
      type: 'npc',
      currentHp: Number(npcForm.hp) || 1,
      maxHp: Number(npcForm.hp) || 1,
      ac: Number(npcForm.ac) || 10,
      initiative: isNaN(ini) ? 0 : ini,
    });
    showToast(`${npcForm.name} aggiunto al combattimento`);
    setNpcForm({ isOpen: false, name: '', hp: 10, ac: 10, initiative: '' });
  };

  const pcs = participants.filter((p) => p.type === 'pc' || p.type === 'player' || p.type === 'npc');
  const monsters = participants.filter((p) => p.type === 'monster');
  const currentParticipantId = participants[currentTurnIndex]?.id ?? null;

  return (
    <div className="h-full overflow-hidden flex flex-col gap-4">
      {isTerminated && (
        <div className="shrink-0">
          <span className="badge badge-error badge-lg">Battaglia Terminata</span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Colonna Alleati (PG + NPC) */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-success">🛡️ Alleati ({pcs.length})</h2>
            <div className="flex gap-2">
              {/* Dropdown PG */}
              <div className="dropdown dropdown-end">
                <button className="btn btn-sm btn-success" disabled={isTerminated}>
                  ➕ PG
                </button>
                <ul className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-64">
                  <li className="menu-title">Seleziona Personaggio</li>
                  {campaignCharacters.map((char) => (
                    <li key={char.id}>
                      <button onClick={() => prepareAddPG(char.id)}>
                        {char.name} (HP {char.currentHp ?? char.maxHp}/{char.maxHp})
                      </button>
                    </li>
                  ))}
                  {campaignCharacters.length === 0 && (
                    <li><span className="text-base-content/50">Nessun PG nella campagna</span></li>
                  )}
                </ul>
              </div>
              {/* Dropdown NPC */}
              <div className="dropdown dropdown-end">
                <button className="btn btn-sm btn-info" disabled={isTerminated}>
                  👤 NPC
                </button>
                <ul className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-64 max-h-72 overflow-y-auto">
                  <li className="menu-title">Dalla libreria</li>
                  {npcLibrary.map((npc) => (
                    <li key={npc.id}>
                      <button onClick={() => prepareAddNpcFromLibrary(npc.id)}>
                        {npc.name} (HP {npc.hp} | CA {npc.ac})
                      </button>
                    </li>
                  ))}
                  {npcLibrary.length === 0 && (
                    <li><span className="text-base-content/50">Nessun NPC in libreria</span></li>
                  )}
                  <li className="menu-title mt-1">Crea al volo</li>
                  <li>
                    <button
                      className="text-info font-semibold"
                      onClick={() => setNpcForm({ isOpen: true, name: '', hp: 10, ac: 10, initiative: '' })}
                    >
                      ✏️ Crea nuovo NPC...
                    </button>
                  </li>
                </ul>
              </div>
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
            <h2 className="text-lg font-bold text-error">👹 Mostri ({monsters.length})</h2>
            <div className="dropdown dropdown-end">
              <button className="btn btn-sm btn-error" disabled={isTerminated}>
                ➕ Aggiungi Mostro
              </button>
              <ul className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-64 max-h-64 overflow-y-auto">
                <li className="menu-title">Seleziona Mostro</li>
                {monsterLibrary.map((monster) => (
                  <li key={monster.id}>
                    <button onClick={() => prepareAddMonster(monster.id)}>
                      {monster.name} (HP {monster.hp} | CA {monster.ac})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
            <h3 className="font-bold text-lg mb-4">👤 Crea NPC</h3>
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
                    onChange={(e) => setNpcForm((s) => ({ ...s, hp: e.target.value }))}
                    min="1"
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">CA</span></label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={npcForm.ac}
                    onChange={(e) => setNpcForm((s) => ({ ...s, ac: e.target.value }))}
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
              <button className="btn btn-info" onClick={handleCreateNpc}>
                ➕ Aggiungi
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
            <h3 className="font-bold text-lg mb-1">⚔️ Inserisci Iniziativa</h3>
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
              <button className="btn btn-primary" onClick={handleConfirmAdd}>
                ➕ Aggiungi
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeInitiativeModal}></div>
        </dialog>
      )}
    </div>
  );
}