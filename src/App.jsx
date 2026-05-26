import { HashRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { CombatPage } from './pages/CombatPage'
import { HomePage } from './pages/HomePage'
import { MonstersPage } from './pages/MonstersPage'
import { PartyPage } from './pages/PartyPage'
import { SpellsPage } from './pages/SpellsPage'
import styles from './App.module.css'

function App() {
  return (
    <HashRouter>
      <div className={styles.app}>
        <aside className={styles.sidebar}>
          <Navbar />
        </aside>
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/combat" element={<CombatPage />} />
            <Route path="/party" element={<PartyPage />} />
            <Route path="/monsters" element={<MonstersPage />} />
            <Route path="/spells" element={<SpellsPage />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
