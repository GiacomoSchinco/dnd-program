import { useState, useEffect } from 'react';

const themes = [
  { name: 'Fantasy', value: 'fantasy', icon: '🧙' },
  { name: 'Dark', value: 'dark', icon: '🌙' },
  { name: 'Light', value: 'light', icon: '☀️' },
  { name: 'Dracula', value: 'dracula', icon: '🧛' },
  { name: 'Cupcake', value: 'cupcake', icon: '🧁' },
  { name: 'Forest', value: 'forest', icon: '🌲' },
  { name: 'Night', value: 'night', icon: '🌃' },
  { name: 'Cyberpunk', value: 'cyberpunk', icon: '🤖' },
  { name: 'Valentine', value: 'valentine', icon: '💕' },
  { name: 'Aqua', value: 'aqua', icon: '💧' },
  { name: 'Coffee', value: 'coffee', icon: '☕' },
  { name: 'Retro', value: 'retro', icon: '📻' },
  { name: 'Black', value: 'black', icon: '🖤' },
  { name: 'Business', value: 'business', icon: '💼' },
  { name: 'Winter', value: 'winter', icon: '❄️' },
  { name: 'Pastel', value: 'pastel', icon: '🎨' },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'fantasy';
  });

  useEffect(() => {
    // Applica il tema all'elemento html
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="dropdown dropdown-top">
      <label tabIndex={0} className="btn btn-ghost btn-sm gap-1">
        <span className="text-lg">🎨</span>
        <span className="hidden sm:inline">Tema</span>
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
              {currentTheme === theme.value && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}