import { useState, useEffect } from 'react';

export const themes = [
  { name: 'Fantasy',   value: 'fantasy',   icon: '🧙' },
  { name: 'Dark',      value: 'dark',      icon: '🌙' },
  { name: 'Light',     value: 'light',     icon: '☀️' },
  { name: 'Dracula',   value: 'dracula',   icon: '🧛' },
  { name: 'Cupcake',   value: 'cupcake',   icon: '🧁' },
  { name: 'Forest',    value: 'forest',    icon: '🌲' },
  { name: 'Night',     value: 'night',     icon: '🌃' },
  { name: 'Cyberpunk', value: 'cyberpunk', icon: '🤖' },
  { name: 'Valentine', value: 'valentine', icon: '💕' },
  { name: 'Aqua',      value: 'aqua',      icon: '💧' },
  { name: 'Coffee',    value: 'coffee',    icon: '☕' },
  { name: 'Retro',     value: 'retro',     icon: '📻' },
  { name: 'Black',     value: 'black',     icon: '🖤' },
  { name: 'Business',  value: 'business',  icon: '💼' },
  { name: 'Winter',    value: 'winter',    icon: '❄️' },
  { name: 'Pastel',    value: 'pastel',    icon: '🎨' },
];

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'fantasy');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme, themes };
}
