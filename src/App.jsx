import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { CombatPage } from './pages/CombatPage'
import { CombatDetailPage } from './pages/CombatDetailPage'
import { HomePage } from './pages/HomePage'
import { MonstersPage } from './pages/MonstersPage'
import { PartyPage } from './pages/PartyPage'
import { SpellsPage } from './pages/SpellsPage'
import styles from './App.module.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const sidebarWidth = sidebarCollapsed ? 78 : 188

  return (
    <HashRouter>
      <div className={styles.app} style={{ '--sidebar-width': `${sidebarWidth}px` }}>
        <aside
          className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
          style={{
            width: `${sidebarWidth}px`,
            minWidth: `${sidebarWidth}px`,
            maxWidth: `${sidebarWidth}px`,
          }}
        >
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            aria-label={sidebarCollapsed ? 'Apri sidebar' : 'Chiudi sidebar'}
            title={sidebarCollapsed ? 'Apri sidebar' : 'Chiudi sidebar'}
          >
            <span className={styles.sidebarToggleInner}>
              {sidebarCollapsed ? (
                <PanelLeftOpen className={styles.sidebarToggleIcon} strokeWidth={1.9} />
              ) : (
                <PanelLeftClose className={styles.sidebarToggleIcon} strokeWidth={1.9} />
              )}
            </span>
          </button>
          <Navbar collapsed={sidebarCollapsed} />
        </aside>
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/combat" element={<CombatPage />} />
            <Route path="/combat/:combatId" element={<CombatDetailPage />} />
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
