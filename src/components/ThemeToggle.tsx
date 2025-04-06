'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only show the toggle after the component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <button 
      className="theme-toggle-btn"
      onClick={toggleDarkMode}
      aria-label={theme.darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
      title={theme.darkMode ? "Mode clair" : "Mode sombre"}
    >
      {theme.darkMode ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
} 