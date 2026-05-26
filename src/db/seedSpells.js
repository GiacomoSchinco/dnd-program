export const seedSpells = [
  // ── Trucchi (Livello 0) ──────────────────────────────────────────────────
  {
    name: 'Prestidigitazione',
    level: 0,
    school: 'Trasmutazione',
    castingTime: '1 azione',
    range: '3 metri',
    components: 'V, S',
    duration: 'Fino a 1 ora',
    description:
      'Crei effetti magici minori: piccole fiamme, note musicali, odori, immagini illusorie, pulizia o sporcizia di oggetti, riscaldamento o raffreddamento di oggetti non magici.',
  },
  {
    name: 'Raggio di Gelo',
    level: 0,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '18 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Un raggio di luce gelida scaturisce dalle dita. Attacco magico a distanza: 1d8 danni da freddo, e la velocità del bersaglio si riduce di 3 metri fino all\'inizio del tuo prossimo turno.',
  },
  {
    name: 'Sacra Fiamma',
    level: 0,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '18 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Luce fiammeggiante discende su una creatura. Tiro salvezza su Destrezza (CD del tuo incantatore): 1d8 danni radiosi in caso di fallimento. Nessun bonus da copertura.',
  },
  {
    name: 'Colpo del Tuono',
    level: 0,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '1,5 metri',
    components: 'V',
    duration: 'Istantaneo',
    description:
      'Tocci un\'altra creatura con la mano carica di energia tuonante. Attacco magico in mischia: 1d8 danni da tuono e il bersaglio viene spinto di 3 metri.',
  },
  {
    name: 'Taumaturgia',
    level: 0,
    school: 'Trasmutazione',
    castingTime: '1 azione',
    range: '9 metri',
    components: 'V',
    duration: 'Fino a 1 minuto',
    description:
      'Manifesti un piccolo prodigio: suoni, fiamme tremolanti, terremoto lieve, occhi che cambiano colore, voce tonante. Crei uno di questi effetti a scelta.',
  },

  // ── Livello 1 ────────────────────────────────────────────────────────────
  {
    name: 'Dardo Incantato',
    level: 1,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '27 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Crei tre dardi di forza magica. Ogni dardo colpisce automaticamente una creatura a scelta nel raggio. Ogni dardo infligge 1d4+1 danni da forza. I dardi colpiscono simultaneamente. A livelli superiori: +1 dardo per slot di livello superiore al 1°.',
  },
  {
    name: 'Mano Bruciante',
    level: 1,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: 'Sé stesso (cono da 4,5m)',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Fiamme fuoriescono dalle dita. Ogni creatura nel cono fa un TS su Destrezza: 3d6 danni da fuoco (fallimento) o metà (successo). A livelli superiori: +1d6 per slot superiore al 1°.',
  },
  {
    name: 'Cura Ferite',
    level: 1,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: 'Contatto',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Una creatura che tocchi recupera 1d8 + modificatore di incantesimo punti ferita. Nessun effetto su non morti o costrutti. A livelli superiori: +1d8 per slot superiore al 1°.',
  },
  {
    name: 'Scudo',
    level: 1,
    school: 'Abiurazione',
    castingTime: '1 reazione',
    range: 'Sé stesso',
    components: 'V, S',
    duration: '1 round',
    description:
      'Reazione quando sei colpito da un attacco o preso di mira da dardo incantato. Ottieni +5 alla CA fino all\'inizio del tuo prossimo turno, e sei immune a dardo incantato.',
  },
  {
    name: 'Colpo Guidato',
    level: 1,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '27 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Attacco magico a distanza: 4d6 danni radiosi. Se colpisce, il prossimo attacco contro il bersaglio prima della fine del tuo prossimo turno ottiene vantaggio. A livelli superiori: +1d6 per slot superiore al 1°.',
  },
  {
    name: 'Sonno',
    level: 1,
    school: 'Ammaliamento',
    castingTime: '1 azione',
    range: '27 metri',
    components: 'V, S, M (petali di rosa)',
    duration: '1 minuto',
    description:
      'Manda in sonno magico le creature. Tira 5d8: il totale indica i PF di creature che puoi addormentare, partendo dalla più debole. Queste creature sono incapacitate. Danni le svegliano. A livelli superiori: +2d8 per slot superiore al 1°.',
  },

  // ── Livello 2 ────────────────────────────────────────────────────────────
  {
    name: 'Dardi Fiammeggianti',
    level: 2,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '27 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Scaglia tre dardi di fuoco. Puoi distribuirli liberamente. Ogni dardo: attacco magico a distanza, 2d6 danni da fuoco. A livelli superiori: +1 dardo per slot superiore al 2°.',
  },
  {
    name: 'Invisibilità',
    level: 2,
    school: 'Illusione',
    castingTime: '1 azione',
    range: 'Contatto',
    components: 'V, S, M (ciglio di occhio)',
    duration: 'Concentrazione, fino a 1 ora',
    description:
      'Una creatura che tocchi diventa invisibile fino al termine dell\'incantesimo. L\'incantesimo termina se la creatura attacca o lancia un incantesimo. A livelli superiori: +1 creatura per slot superiore al 2°.',
  },
  {
    name: 'Ragnatela',
    level: 2,
    school: 'Invocazione',
    castingTime: '1 azione',
    range: '18 metri',
    components: 'V, S, M (bit di ragnatela)',
    duration: 'Concentrazione, fino a 1 ora',
    description:
      'Riempi un cubo da 6 metri di ragnatele appiccicose. Le creature nell\'area fanno un TS su Destrezza o restano trattenute. Le ragnatele sono difficile terreno e possono bruciare.',
  },
  {
    name: 'Cecità/Sordità',
    level: 2,
    school: 'Necromanzia',
    castingTime: '1 azione',
    range: '27 metri',
    components: 'V',
    duration: '1 minuto',
    description:
      'Puoi accecare o assordire un nemico. Tiro salvezza su Costituzione: se fallisce, è cieco o sordo. Può ripetere il TS alla fine di ogni suo turno. A livelli superiori: +1 creatura per slot superiore al 2°.',
  },

  // ── Livello 3 ────────────────────────────────────────────────────────────
  {
    name: 'Palla di Fuoco',
    level: 3,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '45 metri',
    components: 'V, S, M (pallina di pipistrello e zolfo)',
    duration: 'Istantaneo',
    description:
      'Esplosione di fuoco in una sfera di 6 metri. Ogni creatura nella zona fa un TS su Destrezza: 8d6 danni da fuoco (fallimento) o metà (successo). Il fuoco si espande attorno agli angoli. A livelli superiori: +1d6 per slot superiore al 3°.',
  },
  {
    name: 'Fulmine',
    level: 3,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: 'Sé stesso (linea da 30m)',
    components: 'V, S, M (pelo di pelliccia e cristallo)',
    duration: 'Istantaneo',
    description:
      'Un raggio di fulmine da 30 m x 1,5 m. Ogni creatura nella linea fa un TS su Destrezza: 8d6 danni da fulmine (fallimento) o metà (successo). A livelli superiori: +1d6 per slot superiore al 3°.',
  },
  {
    name: 'Revivifica',
    level: 3,
    school: 'Necromanzia',
    castingTime: '1 azione',
    range: 'Contatto',
    components: 'V, S, M (diamante del valore di 300 mo)',
    duration: 'Istantaneo',
    description:
      'Riporti in vita una creatura morta da non più di 1 minuto. La creatura ritorna con 1 PF. Non funziona su creature che sono morte di vecchiaia.',
  },

  // ── Livello 4 ────────────────────────────────────────────────────────────
  {
    name: 'Banimento',
    level: 4,
    school: 'Abiurazione',
    castingTime: '1 azione',
    range: '18 metri',
    components: 'V, S, M (un oggetto odioso al bersaglio)',
    duration: 'Concentrazione, fino a 1 minuto',
    description:
      'Tenti di inviare una creatura in un altro piano. Tiro salvezza su Carisma: se fallisce, una creatura nativa del piano attuale svanisce temporaneamente; una creatura non nativa viene esiliata nel suo piano d\'origine.',
  },
  {
    name: 'Portale Dimensionale',
    level: 4,
    school: 'Invocazione',
    castingTime: '1 azione',
    range: '150 metri',
    components: 'V',
    duration: 'Istantaneo',
    description:
      'Ti teletrasporti in un punto visibile o che conosci entro 150 metri. Puoi portare con te oggetti e fino a una creatura di taglia Media o inferiore.',
  },

  // ── Livello 5 ────────────────────────────────────────────────────────────
  {
    name: 'Cono di Gelo',
    level: 5,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: 'Sé stesso (cono da 18m)',
    components: 'V, S, M (piccolo cono di cristallo)',
    duration: 'Istantaneo',
    description:
      'Aria gelida spira in un cono. Ogni creatura fa un TS su Costituzione: 8d8 danni da freddo (fallimento) o metà (successo). Creature che falliscono sono paralizzate fino alla fine del tuo prossimo turno. A livelli superiori: +1d8 per slot superiore al 5°.',
  },
  {
    name: 'Resurrezione Minore',
    level: 5,
    school: 'Necromanzia',
    castingTime: '1 ora',
    range: 'Contatto',
    components: 'V, S, M (diamante del valore di 500 mo)',
    duration: 'Istantaneo',
    description:
      'Riporti in vita una creatura morta da non più di 10 giorni. La creatura ritorna con 1 PF e libera da malattie e veleni. Non funziona su non morti o creature senza anima.',
  },

  // ── Livello 7 ────────────────────────────────────────────────────────────
  {
    name: 'Tempesta di Fuoco',
    level: 7,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '90 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Crei una tempesta infuocata in un\'area composta da dieci cubi da 3 m. Ogni creatura nell\'area fa un TS su Destrezza: 7d10 danni da fuoco (fallimento) o metà (successo).',
  },

  // ── Livello 9 ────────────────────────────────────────────────────────────
  {
    name: 'Sciame di Meteore',
    level: 9,
    school: 'Evocazione',
    castingTime: '1 azione',
    range: '1.600 metri',
    components: 'V, S',
    duration: 'Istantaneo',
    description:
      'Quattro palle di fuoco piovono dal cielo su quattro punti a scelta entro gittata. Ogni sfera esplode in una zona di 12 m: 20d6 danni da fuoco e 20d6 danni da impatto (TS Destrezza dimezza entrambi).',
  },
  {
    name: 'Desiderio',
    level: 9,
    school: 'Invocazione',
    castingTime: '1 azione',
    range: 'Sé stesso',
    components: 'V',
    duration: 'Istantaneo',
    description:
      'L\'incantesimo più potente. Puoi duplicare qualsiasi incantesimo di livello 8 o inferiore, o creare un effetto a tua scelta. Usarlo per effetti diversi dalla duplicazione causa 1d10 danni da stress e rischio di non poterlo più lanciare.',
  },
]
