import { useState } from 'react';
import { AlliesColumn } from './AlliesColumn';
import { MonstersColumn } from './MonstersColumn';
import { InitiativeModal, type PendingParticipant } from './InitiativeModal';
import { CreateNpcModal } from './CreateNpcModal';
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

  const [pending, setPending] = useState<PendingParticipant | null>(null);
  const [npcModalOpen, setNpcModalOpen] = useState(false);

  const openInitiativeModal = (participant: CombatParticipant, label: string) =>
    setPending({ participant, label });

  const prepareAddPG = (characterId: string) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    if (selectedCampaignId == null) { showToast('Seleziona prima una campagna'); return; }
    const char = campaignCharacters.find((c) => String(c.id) === String(characterId));
    if (!char) { showToast('Personaggio non trovato'); return; }
    const maxHp = Number(char.maxHp) || Number(char.hp) || 1;
    const currentHp = Math.max(0, Math.min(maxHp, Number(char.currentHp ?? maxHp)));
    openInitiativeModal(
      { id: '', name: char.name, type: 'pc', characterId: char.id, campaignId: char.campaignId,
        hp: currentHp, currentHp, maxHp, ac: Number(char.ac) || 10, initiative: 0 },
      `${char.name} — HP ${currentHp}/${maxHp} | CA ${char.ac || 10}`,
    );
  };

  const prepareAddMonster = (monsterId: string) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    const monster = monsterLibrary.find((m) => String(m.id) === String(monsterId));
    if (!monster) { showToast('Mostro non trovato'); return; }
    openInitiativeModal(
      { id: '', name: monster.name, type: 'monster', hp: Number(monster.hp) || 1,
        currentHp: Number(monster.hp) || 1, maxHp: Number(monster.hp) || 1,
        ac: Number(monster.ac) || 10, initiative: 0, damage: monster.damage },
      `${monster.name} — HP ${monster.hp} | CA ${monster.ac}`,
    );
  };

  const prepareAddNpcFromLibrary = (npcId: string) => {
    if (isTerminated) { showToast('Battaglia terminata: imposta In corso per modificare'); return; }
    const npc = npcLibrary.find((n) => String(n.id) === String(npcId));
    if (!npc) { showToast('NPC non trovato'); return; }
    openInitiativeModal(
      { id: '', name: npc.name, type: 'npc', hp: Number(npc.hp) || 1,
        currentHp: Number(npc.hp) || 1, maxHp: Number(npc.hp) || 1,
        ac: Number(npc.ac) || 10, initiative: 0 },
      `${npc.name} — HP ${npc.hp} | CA ${npc.ac}`,
    );
  };

  const handleInitiativeConfirm = async (participant: CombatParticipant) => {
    await addParticipant(participant);
    showToast(`${participant.name} aggiunto al combattimento`);
  };

  const handleNpcCreate = async (participant: CombatParticipant) => {
    await addParticipant(participant);
    showToast(`${participant.name} aggiunto al combattimento`);
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
        <AlliesColumn
          participants={pcs}
          campaignCharacters={campaignCharacters}
          npcLibrary={npcLibrary}
          currentTurnIndex={currentTurnIndex}
          currentParticipantId={currentParticipantId}
          isTerminated={isTerminated}
          onAddPG={prepareAddPG}
          onAddNpcFromLibrary={prepareAddNpcFromLibrary}
          onOpenCreateNpc={() => setNpcModalOpen(true)}
          applyDamage={applyDamage}
          heal={heal}
          removeParticipant={removeParticipant}
          updateParticipantInitiative={updateParticipantInitiative}
          showToast={showToast}
        />
        <MonstersColumn
          participants={monsters}
          monsterLibrary={monsterLibrary}
          currentTurnIndex={currentTurnIndex}
          currentParticipantId={currentParticipantId}
          isTerminated={isTerminated}
          onAddMonster={prepareAddMonster}
          applyDamage={applyDamage}
          heal={heal}
          removeParticipant={removeParticipant}
          updateParticipantInitiative={updateParticipantInitiative}
          showToast={showToast}
        />
      </div>

      <InitiativeModal
        pending={pending}
        onConfirm={handleInitiativeConfirm}
        onClose={() => setPending(null)}
      />
      <CreateNpcModal
        isOpen={npcModalOpen}
        onConfirm={handleNpcCreate}
        onClose={() => setNpcModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
}