import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Swords, SkipForward } from 'lucide-react';
import type { CombatParticipant } from '../../types';
import { InitiativeButton } from './InitiativeButton';
import { InitiativeParticipantRow } from './InitiativeParticipantRow';

interface InitiativePanelProps {
  participants?: CombatParticipant[];
  currentTurnIndex?: number;
  round?: number;
  onNextTurn?: () => void;
}

interface Position {
  x: number;
  y: number;
}

export function InitiativePanel({ participants = [], currentTurnIndex = 0, round = 1, onNextTurn }: InitiativePanelProps) {
  const [iconMode, setIconMode] = useState(true);
  const [pos, setPos] = useState<Position>({ x: 16, y: 100 });
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Posiziona a destra al mount
  useEffect(() => {
    setPos({ x: Math.max(0, window.innerWidth - 296), y: 80 });
  }, []);

  const startDrag = (e: MouseEvent) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    movedRef.current = false;
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      movedRef.current = true;
      setPos({ x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y });
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener('mousemove', onMove as any);
    window.addEventListener('mouseup', onUp as any);
    return () => {
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('mouseup', onUp as any);
    };
  }, []);

  // Ordina per iniziativa decrescente, mantiene l'indice originale per calcolo turni
  const sorted = [...participants]
    .map((p, i) => ({ ...p, _origIdx: i }))
    .sort((a, b) => (b.initiative ?? 0) - (a.initiative ?? 0));

  const activeId = participants[currentTurnIndex]?.id;

  // Modalità icona
  if (iconMode) {
    return (
      <div
        ref={panelRef}
        style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 1000 }}
        className="select-none cursor-grab active:cursor-grabbing relative"
        onMouseDown={startDrag}
        onMouseUp={() => { if (!movedRef.current) setIconMode(false); }}
      >
        <InitiativeButton round={round} onOpen={() => setIconMode(false)} />
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 1000, width: 340 }}
      className="card bg-base-300 shadow-2xl border border-base-content/20 select-none overflow-hidden"
    >
      {/* Barra titolo — draggabile */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-content cursor-grab active:cursor-grabbing"
        onMouseDown={startDrag}
      >
        <span className="flex items-center gap-1 flex-1 font-bold tracking-wide"><Swords size={14} /> Iniziativa</span>
        <span className="text-sm opacity-80 tabular-nums">
          Round {round} · {currentTurnIndex + 1}/{participants.length}
        </span>
        <button
          className="btn btn-xs btn-ghost text-primary-content ml-1"
          title="Riduci ad icona"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setIconMode(true)}
        >
          ─
        </button>
      </div>

      {/* Lista partecipanti */}
      <div className="flex flex-col p-2 gap-1 max-h-[460px] overflow-y-auto">
        {sorted.map((p) => (
          <InitiativeParticipantRow
            key={p.id ?? p._origIdx}
            participant={p}
            isActive={p.id === activeId}
            currentTurnIndex={currentTurnIndex}
            round={round}
          />
        ))}

        {participants.length === 0 && (
          <p className="text-sm text-base-content/50 text-center py-6">
            Nessun partecipante
          </p>
        )}
      </div>

      {/* Footer — bottone turno */}
      {onNextTurn && (
        <div className="px-3 py-2 border-t border-base-content/10">
          <button
            className="btn btn-primary btn-sm w-full gap-1"
            onClick={onNextTurn}
          >
            <SkipForward size={14} /> Turno Successivo
          </button>
        </div>
      )}
    </div>
  );
}
