import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './pages/HomePage';
import { CombatPage } from './pages/CombatPage';
import { CampaignSelectPage } from './pages/CampaignSelectPage';
import { BattleSelectPage } from './pages/BattleSelectPage';
import { CampaignPage } from './pages/CampaignPage';
import { PartyPage } from './pages/PartyPage';
import { MonstersPage } from './pages/MonsterPage';
import { SpellsPage } from './pages/SpellPage';
import { NpcPage } from './pages/NpcPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/combat" element={<CombatPage />} />
        <Route path="/campaigns" element={<CampaignSelectPage />} />
        <Route path="/campaign-management" element={<CampaignPage />} />
        <Route path="/campaign/:campaignId/battles" element={<BattleSelectPage />} />
        <Route path="/party" element={<PartyPage />} />
        <Route path="/monsters" element={<MonstersPage />} />
        <Route path="/npcs" element={<NpcPage />} />
        <Route path="/spells" element={<SpellsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
