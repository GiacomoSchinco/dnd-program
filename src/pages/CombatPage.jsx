import { useState } from 'react';
import { useCombatDB } from '../hooks/useCombatDB';
import { toast } from 'sonner';

export function CombatPage() {
  const {
    activeCombat,
    monsterLibrary,
    characters,
    newCombat,
    applyDamage,
    heal,
    nextTurn,
    sortByInitiative,
    addParticipant,
    saveToHistory,
    rollDamage
  } = useCombatDB();

  const [customDamage, setCustomDamage] = useState({});

  if (!activeCombat) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">⚔️ Nessun Combattimento</h1>
            <p className="py-6">
              Inizia un nuovo combattimento per tracciare iniziativa e danni
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => newCombat()}>
              Nuovo Combattimento
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCustomDamage = (participantId) => {
    const damage = parseInt(customDamage[participantId]);
    if (damage && damage > 0) {
      applyDamage(participantId, damage);
      toast.info(`Danno inflitto: ${damage}`);
      setCustomDamage({ ...customDamage, [participantId]: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Combattimento */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{activeCombat.name}</h1>
          <p className="text-base-content/60">
            Turno {activeCombat.currentTurn + 1} di {activeCombat.participants.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={sortByInitiative}>
            🔄 Ordina per Iniziativa
          </button>
          <button className="btn btn-primary" onClick={nextTurn}>
            ⏩ Turno Successivo
          </button>
          <button className="btn btn-success" onClick={saveToHistory}>
            💾 Salva Storico
          </button>
        </div>
      </div>

      {/* Lista Partecipanti e Libreria Mostri */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna Sinistra - Partecipanti */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>📋 Ordine di Iniziativa</span>
            <span className="badge badge-primary">
              {activeCombat.participants.length} partecipanti
            </span>
          </h2>

          {activeCombat.participants.length === 0 ? (
            <div className="alert alert-info">
              <span>Nessun partecipante. Aggiungi mostri o personaggi!</span>
            </div>
          ) : (
            activeCombat.participants.map((participant, idx) => (
              <div
                key={participant.id}
                className={`card bg-base-100 shadow-xl transition-all ${
                  idx === activeCombat.currentTurn
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200'
                    : ''
                }`}
              >
                <div className="card-body p-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg">
                          {participant.name}
                        </h3>
                        {idx === activeCombat.currentTurn && (
                          <span className="badge badge-primary">Turno Corrente</span>
                        )}
                        {participant.type === 'player' && (
                          <span className="badge badge-success">PG</span>
                        )}
                        {participant.type === 'monster' && (
                          <span className="badge badge-error">Mostro</span>
                        )}
                      </div>
                      <p className="text-sm opacity-70">CA: {participant.ac}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold">{participant.hp}</span>
                      <span className="text-sm opacity-70">/{participant.maxHp} HP</span>
                    </div>
                  </div>

                  {/* Barra HP */}
                  <progress
                    className="progress progress-primary w-full h-3"
                    value={participant.hp}
                    max={participant.maxHp}
                  ></progress>

                  {/* Bottoni Azioni */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        applyDamage(participant.id, 1);
                        toast.info(`${participant.name} subisce 1 danno`);
                      }}
                    >
                      -1
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        applyDamage(participant.id, 5);
                        toast.info(`${participant.name} subisce 5 danni`);
                      }}
                    >
                      -5
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        applyDamage(participant.id, 10);
                        toast.info(`${participant.name} subisce 10 danni`);
                      }}
                    >
                      -10
                    </button>
                    <div className="join">
                      <input
                        type="number"
                        placeholder="Danno"
                        className="input input-bordered input-sm w-24 join-item"
                        value={customDamage[participant.id] || ''}
                        onChange={(e) =>
                          setCustomDamage({
                            ...customDamage,
                            [participant.id]: e.target.value
                          })
                        }
                      />
                      <button
                        className="btn btn-error btn-sm join-item"
                        onClick={() => handleCustomDamage(participant.id)}
                      >
                        Applica
                      </button>
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        heal(participant.id, 5);
                        toast.success(`${participant.name} riceve 5 cure`);
                      }}
                    >
                      +5
                    </button>
                    {participant.damage && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          const damage = rollDamage(participant.damage);
                          applyDamage(participant.id, damage);
                          toast.info(`${participant.name} subisce ${damage} danni (${participant.damage})`);
                        }}
                      >
                        🎲 {participant.damage}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Colonna Destra - Librerie */}
        <div className="space-y-6">
          {/* Mostri */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📚 Libreria Mostri</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {monsterLibrary?.map((monster) => (
                  <div key={monster.id} className="card bg-base-200">
                    <div className="card-body p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{monster.name}</h3>
                          <p className="text-xs">HP: {monster.hp} | CA: {monster.ac}</p>
                          <p className="text-xs">Danno: {monster.damage}</p>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            addParticipant({
                              name: monster.name,
                              type: 'monster',
                              maxHp: monster.hp,
                              hp: monster.hp,
                              ac: monster.ac,
                              initiative: 0,
                              damage: monster.damage
                            });
                            toast.success(`${monster.name} aggiunto al combattimento!`);
                          }}
                        >
                          ➕ Aggiungi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personaggi */}
          {characters?.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">👥 Personaggi</h2>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {characters.map((char) => (
                    <div key={char.id} className="card bg-base-200">
                      <div className="card-body p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{char.name}</h3>
                            <p className="text-xs">{char.class} - Livello {char.level}</p>
                            <p className="text-xs">HP: {char.hp} | CA: {char.ac}</p>
                          </div>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              addParticipant({
                                name: char.name,
                                type: 'player',
                                maxHp: char.hp,
                                hp: char.hp,
                                ac: char.ac,
                                initiative: 0,
                                class: char.class
                              });
                              toast.success(`${char.name} si unisce al combattimento!`);
                            }}
                          >
                            ➕ Aggiungi
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}