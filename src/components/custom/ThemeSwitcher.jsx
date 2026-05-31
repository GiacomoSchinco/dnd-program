import { useTheme } from '../../hooks/useTheme';
import { Palette, Check } from 'lucide-react';

export function ThemeSwitcher({ collapsed = false }) {
  const { theme: currentTheme, setTheme: setCurrentTheme, themes } = useTheme();

  return (
    <div className="dropdown dropdown-top">
      <label
        tabIndex={0}
        className={`btn btn-ghost btn-sm ${collapsed ? 'btn-square' : 'gap-1'} ${collapsed ? 'w-10 h-10' : ''}`}
        title="Cambia tema"
      >
        <Palette size={18} />
        {!collapsed && <span className="hidden sm:inline">Tema</span>}
      </label>
      <div tabIndex={0} className="dropdown-content z-50 card card-compact w-52 p-2 shadow bg-base-200 rounded-box mt-2 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 gap-1">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setCurrentTheme(theme.value)}
              className={`btn btn-sm justify-start gap-2 ${
                currentTheme === theme.value ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              <span>{theme.icon}</span>
              <span>{theme.name}</span>
              {currentTheme === theme.value && <Check size={14} className="ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}