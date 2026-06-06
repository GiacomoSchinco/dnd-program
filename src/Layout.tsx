import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Navbar } from './components/ui';
import { CampaignTopbar } from './components/campaign';
import { Toaster } from 'sonner';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } flex-shrink-0 bg-base-100 border-r border-primary/20 shadow-xl relative`}
      >
        {/* Bottone toggle sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 -right-3 z-50 flex items-center justify-center w-6 h-8 rounded-r-md bg-base-100 border border-l-0 border-base-300 text-base-content/50 hover:text-base-content hover:bg-base-200 transition-all duration-200 shadow-sm"
          aria-label={collapsed ? 'Espandi sidebar' : 'Comprimi sidebar'}
          title={collapsed ? 'Espandi sidebar' : 'Comprimi sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={14} />
          ) : (
            <PanelLeftClose size={14} />
          )}
        </button>

        <Navbar collapsed={collapsed} />
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <CampaignTopbar />
          <Outlet />
        </div>
      </main>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: {
            background: 'var(--color-base-100)',
            color: 'var(--color-base-content)',
            border: '1px solid var(--color-primary/30)'
          }
        }}
      />
    </div>
  );
}
