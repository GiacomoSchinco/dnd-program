import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './pages/HomePage';
import { CombatPage } from './pages/CombatPage';
import { PartyPage } from './pages/PartyPage';
import { MonstersPage } from './pages/MonsterPage';
import { SpellsPage } from './pages/SpellPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/combat" element={<CombatPage />} />
        <Route path="/party" element={<PartyPage />} />
        <Route path="/monsters" element={<MonstersPage />} />
        <Route path="/spells" element={<SpellsPage />} />
      </Route>
    </Routes>
  );
}

export default App;