import { useState, useRef, useEffect } from 'react';
import { User, Skull, Swords, SkipForward } from 'lucide-react';

const TYPE_ICON_MAP = { pc: <User size={14} />, player: <User size={14} />, npc: <User size={14} />, monster: <Skull size={14} /> };

/**
 * Pannello flottante draggabile con lista iniziativa.
 * Props:
 *   participants       – array partecipanti combat
 *   currentTurnIndex   – indice turno attivo
 *   round              – round corrente
 */
export function InitiativePanel({ participants = [], currentTurnIndex = 0, round = 1, onNextTurn }) {
  const [iconMode, setIconMode] = useState(true);
  const [pos, setPos] = useState({ x: 16, y: 100 });
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Posiziona a destra al mount
  useEffect(() => {
    setPos({ x: Math.max(0, window.innerWidth - 296), y: 80 });
  }, []);

  const startDrag = (e) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    movedRef.current = false;
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      movedRef.current = true;
      setPos({ x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y });
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
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
        className="select-none cursor-grab active:cursor-grabbing"
        onMouseDown={startDrag}
        onMouseUp={() => { if (!movedRef.current) setIconMode(false); }}
      >
        <button
          className="btn btn-primary btn-circle shadow-xl text-lg pointer-events-none"
          title={`Apri iniziativa — Round ${round}`}
        >
          <Swords size={16} />
        </button>
        {/* Indicatore round */}
        <span className="badge badge-primary badge-xs absolute -top-1 -right-1 pointer-events-none">
          {round}
        </span>
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
        {sorted.map((p, idx) => {
          const isActive = p.id === activeId;
          // Turni completati: i partecipanti prima del turno attivo hanno già giocato questo round
          const turnsCompleted = p._origIdx < currentTurnIndex ? round : round - 1;
          const hpPct = p.maxHp > 0 ? Math.max(0, Math.min(100, (p.currentHp / p.maxHp) * 100)) : 0;
          const hpClass = hpPct > 60 ? 'progress-success' : hpPct > 30 ? 'progress-warning' : 'progress-error';
          const isDead = p.currentHp <= 0;

          return (
            <div
              key={p.id ?? idx}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${isActive ? 'bg-primary/20 ring-1 ring-primary' : isDead ? 'opacity-40' : 'hover:bg-base-200'}
              `}
            >
              {/* Freccia turno attivo */}
              <span className="w-3 shrink-0 text-xs text-primary font-bold">
                {isActive ? '▶' : ''}
              </span>

              {/* Badge iniziativa */}
              <span className="badge badge-sm font-mono tabular-nums w-10 shrink-0 justify-center">
                {p.initiative ?? 0}
              </span>

              {/* Icona tipo */}
              <span className="flex items-center shrink-0">{TYPE_ICON_MAP[p.type] ?? <User size={14} />}</span>

              {/* Nome */}
              <span className={`flex-1 text-sm truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                {p.name}
              </span>

              {/* HP */}
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-xs text-base-content/60 tabular-nums leading-none">
                  {p.currentHp}/{p.maxHp}
                </span>
                <progress
                  className={`progress ${hpClass} w-14 h-1.5`}
                  value={hpPct}
                  max={100}
                />
              </div>

              {/* Turni completati */}
              <span
                className="badge badge-ghost badge-sm shrink-0 tabular-nums"
                title="Turni completati"
              >
                {turnsCompleted}t
              </span>
            </div>
          );
        })}

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
