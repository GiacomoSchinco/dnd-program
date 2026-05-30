import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/custom/Navbar';
import { Toaster } from 'sonner';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } flex-shrink-0 bg-base-100 border-r border-primary/20 shadow-xl`}
      >
        <Navbar collapsed={collapsed} />
      </div>
      
      {/* Bottone toggle sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="btn btn-circle btn-sm btn-ghost fixed bottom-6 left-4 z-50 shadow-lg bg-base-100/80 backdrop-blur-sm border border-primary/30 hover:bg-primary/20 transition-all duration-200"
        style={{ left: collapsed ? 'calc(5rem + 1rem)' : 'calc(16rem + 1rem)' }}
      >
        {collapsed ? (
          <span className="text-lg">→</span>
        ) : (
          <span className="text-lg">←</span>
        )}
      </button>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
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