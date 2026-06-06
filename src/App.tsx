import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './pages/HomePage';
import { CombatPage } from './pages/CombatPage';
import { CombatHubPage } from './pages/CombatHubPage';
import { CombatHubBattlesPage } from './pages/CombatHubBattlesPage';
import { CampaignPage } from './pages/CampaignPage';
import { PartyPage } from './pages/PartyPage';
import { MonstersPage } from './pages/MonstersPage';
import { SpellsPage } from './pages/SpellsPage';
import { NpcsPage } from './pages/NpcsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/combat" element={<CombatPage />} />
        <Route path="/combat-hub" element={<CombatHubPage />} />
        <Route path="/campaigns" element={<CampaignPage />} />
        <Route path="/campaign/:campaignId/battles" element={<CombatHubBattlesPage />} />
        <Route path="/party" element={<PartyPage />} />
        <Route path="/monsters" element={<MonstersPage />} />
        <Route path="/npcs" element={<NpcsPage />} />
        <Route path="/spells" element={<SpellsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
