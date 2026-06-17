import { ReactNode } from 'react';
import { PageWrapper } from '../components/ui';
import { ScrollText, Gamepad2, Users, FileCode, BookOpen } from 'lucide-react';

// ── Section card (stesso pattern di SettingsPage) ─────────────────────────

interface SectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body gap-4">
        <h2 className="card-title text-lg">
          <span className="flex items-center">{icon}</span> {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// ── Link esterno ───────────────────────────────────────────────────────────

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link link-primary"
    >
      {children}
    </a>
  );
}

// ── Autore row ─────────────────────────────────────────────────────────────

interface AuthorRowProps {
  name: string;
  url: string;
}

function AuthorRow({ name, url }: AuthorRowProps) {
  return (
    <li className="flex items-center gap-2 py-1">
      <span className="font-medium">{name}</span>
      <span className="text-base-content/40">→</span>
      <ExternalLink href={url}>{url}</ExternalLink>
    </li>
  );
}

// ── Nota con bordo ─────────────────────────────────────────────────────────

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-primary/40 pl-4 py-1 text-sm text-base-content/70 italic">
      {children}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export function CreditsPage() {
  return (
    <PageWrapper maxWidth="2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ScrollText size={28} /> Crediti
        </h1>
        <p className="text-base-content/60">
          Riconoscimenti e licenze per le risorse utilizzate in Castle Keeper
        </p>
      </div>

      {/* ── SEZIONE 1: GAME ICONS ── */}
      <Section icon={<Gamepad2 size={18} />} title="Game Icons">
        <p>
          Tutte le icone utilizzate in questo progetto provengono da{' '}
          <ExternalLink href="https://game-icons.net/">
            game-icons.net
          </ExternalLink>
          , un archivio meraviglioso di icone gratuite per giochi.
        </p>
        <Note>
          Game icons provided by{' '}
          <ExternalLink href="https://game-icons.net/">
            https://game-icons.net
          </ExternalLink>
        </Note>
      </Section>

      {/* ── SEZIONE 2: AUTORI ── */}
      <Section icon={<Users size={18} />} title="Autori">
        <p className="text-sm text-base-content/60 mb-2">
          Le icone sono state create da:
        </p>
        <ul className="list-none space-y-1">
          <AuthorRow
            name="Lorc"
            url="http://lorcblog.blogspot.com/"
          />
          <AuthorRow
            name="Delapouite"
            url="https://delapouite.com/"
          />
          <AuthorRow
            name="John Colburn"
            url="http://ninmunanmu.com/"
          />
          <AuthorRow
            name="sbed"
            url="http://opengameart.org/"
          />
          <AuthorRow
            name="DarkZaitzev"
            url="http://darkzaitzev.deviantart.com/"
          />
          <AuthorRow
            name="Skoll"
            url="https://game-icons.net/"
          />
        </ul>
      </Section>

      {/* ── SEZIONE 3: LICENZA ── */}
      <Section icon={<FileCode size={18} />} title="Licenza">
        <p>
          Le icone sono distribuite sotto licenza Creative Commons CC BY 3.0
          salvo dove diversamente indicato.
        </p>
        <Note>
          License: Creative Commons CC BY 3.0 unless stated CC0.
        </Note>
        <p>
          Ciò significa che puoi utilizzare, condividere e modificare le icone
          purché venga dato credito agli autori originali.
        </p>
        <p>
          Per maggiori informazioni, visita{' '}
          <ExternalLink href="https://creativecommons.org/licenses/by/3.0/">
            Creative Commons CC BY 3.0
          </ExternalLink>
        </p>
      </Section>

      {/* ── SEZIONE 4: SRD — DATI DI GIOCO ── */}
      <Section icon={<BookOpen size={18} />} title="SRD — Dati di Gioco">
        <p>
          Tutti i dati di gioco presenti in questa applicazione (magie, oggetti,
          equipaggiamento, mostri, classi, razze, talenti e qualsiasi altro
          contenuto proveniente dal regolamento) sono basati sulle System
          Reference Document di Dungeons &amp; Dragons 5e e 5.5, rese
          disponibili da Wizards of the Coast.
        </p>
        <p>
          Licenza: Creative Commons Attribution 4.0 International (CC BY 4.0) —
          CC BY 3.0
        </p>
        <p>
          Ciò significa che questi contenuti sono liberamente utilizzabili,
          condivisibili e modificabili, purché venga fornito il credito
          appropriato a Wizards of the Coast.
        </p>
        <Note>
          This work includes material taken from the System Reference Document
          5.1 (&quot;SRD 5.1&quot;) and System Reference Document 5.2
          (&quot;SRD 5.2&quot;) by Wizards of the Coast LLC. Available at{' '}
          <ExternalLink href="https://dnd.wizards.com/resources/systems-reference-document">
            dnd.wizards.com
          </ExternalLink>
          . Licensed under{' '}
          <ExternalLink href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink href="https://creativecommons.org/licenses/by/3.0/">
            CC BY 3.0
          </ExternalLink>
          .
        </Note>
      </Section>
    </PageWrapper>
  );
}
