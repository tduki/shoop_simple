'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for theme settings
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  headerBg: string;
  footerBg: string;
  cardBg: string;
  buttonText: string;
  borderColor: string;
  inputBg: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ThemeLayout {
  contentWidth: 'full' | 'contained' | 'narrow';
  sidebarPosition: 'left' | 'right' | 'none';
  headerHeight: 'small' | 'medium' | 'large';
  footerSize: 'small' | 'medium' | 'large';
  gridColumns: 2 | 3 | 4;
  pageSpacing: 'compact' | 'normal' | 'spacious';
}

export interface ThemeEffects {
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  enableShadows: boolean;
  shadowDepth: 'light' | 'medium' | 'deep';
  enableHoverEffects: boolean;
  hoverStyle: 'scale' | 'lift' | 'glow' | 'none';
  roundedCorners: 'none' | 'slight' | 'medium' | 'full';
}

export interface ThemeSettings {
  colors: ThemeColors;
  font: string;
  secondaryFont: string;
  borderRadius: string;
  headerStyle: 'default' | 'centered' | 'minimal' | 'transparent' | 'colorful';
  footerStyle: 'default' | 'simple' | 'expanded' | 'minimal' | 'colorful';
  productCardStyle: 'default' | 'minimal' | 'detailed' | 'elegant' | 'bold';
  buttonsStyle: 'default' | 'rounded' | 'square' | 'pill' | 'outline' | 'text';
  layout: ThemeLayout;
  effects: ThemeEffects;
  darkMode: boolean;
}

// Default theme settings for light mode
const lightTheme: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  accent: '#f97316',
  background: '#ffffff',
  text: '#111827',
  headerBg: '#ffffff',
  footerBg: '#1f2937',
  cardBg: '#ffffff',
  buttonText: '#ffffff',
  borderColor: '#e5e7eb',
  inputBg: '#f9fafb',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6'
};

// Dark theme colors
const darkTheme: ThemeColors = {
  primary: '#60a5fa',
  secondary: '#818cf8',
  accent: '#fb923c',
  background: '#111827',
  text: '#f3f4f6',
  headerBg: '#1f2937',
  footerBg: '#111827',
  cardBg: '#1f2937',
  buttonText: '#ffffff',
  borderColor: '#374151',
  inputBg: '#374151',
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa'
};

// Default layout settings
const defaultLayout: ThemeLayout = {
  contentWidth: 'contained',
  sidebarPosition: 'none',
  headerHeight: 'medium',
  footerSize: 'medium',
  gridColumns: 3,
  pageSpacing: 'normal'
};

// Default effects settings
const defaultEffects: ThemeEffects = {
  enableAnimations: true,
  animationSpeed: 'normal',
  enableShadows: true,
  shadowDepth: 'medium',
  enableHoverEffects: true,
  hoverStyle: 'scale',
  roundedCorners: 'medium'
};

// Default theme settings
const defaultTheme: ThemeSettings = {
  colors: lightTheme,
  font: 'Inter',
  secondaryFont: 'Montserrat',
  borderRadius: '0.5rem',
  headerStyle: 'default',
  footerStyle: 'default',
  productCardStyle: 'default',
  buttonsStyle: 'default',
  layout: defaultLayout,
  effects: defaultEffects,
  darkMode: false
};

// List of preset themes
export const presetThemes: Record<string, Partial<ThemeSettings>> = {
  default: defaultTheme,
  minimal: {
    headerStyle: 'minimal',
    footerStyle: 'simple',
    productCardStyle: 'minimal',
    buttonsStyle: 'square',
    effects: {
      enableAnimations: true,
      animationSpeed: 'normal' as const,
      enableShadows: false,
      shadowDepth: 'medium' as const,
      enableHoverEffects: true,
      hoverStyle: 'none' as const,
      roundedCorners: 'none' as const
    }
  },
  elegant: {
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      text: '#1e293b',
      background: '#f8fafc',
      headerBg: '#ffffff',
      footerBg: '#1e293b',
      cardBg: '#ffffff',
      buttonText: '#ffffff',
      inputBg: '#f1f5f9',
      borderColor: '#e2e8f0',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6'
    },
    font: 'Montserrat',
    secondaryFont: 'Playfair Display',
    headerStyle: 'transparent',
    footerStyle: 'expanded',
    productCardStyle: 'elegant',
    buttonsStyle: 'pill',
    effects: {
      enableAnimations: true,
      animationSpeed: 'normal' as const,
      enableShadows: true,
      shadowDepth: 'light' as const,
      enableHoverEffects: true,
      hoverStyle: 'lift' as const,
      roundedCorners: 'medium' as const
    }
  },
  bold: {
    colors: {
      primary: '#ef4444',
      secondary: '#f59e0b',
      accent: '#10b981',
      text: '#000000',
      background: '#ffffff',
      headerBg: '#000000',
      footerBg: '#000000',
      cardBg: '#ffffff',
      buttonText: '#ffffff',
      inputBg: '#f5f5f5',
      borderColor: '#000000',
      error: '#dc2626',
      success: '#059669',
      warning: '#f97316',
      info: '#3b82f6'
    },
    font: 'Roboto',
    secondaryFont: 'Bebas Neue',
    borderRadius: '0',
    headerStyle: 'colorful',
    footerStyle: 'colorful',
    productCardStyle: 'bold',
    buttonsStyle: 'square',
    effects: {
      enableAnimations: true,
      animationSpeed: 'fast' as const,
      enableShadows: true,
      shadowDepth: 'deep' as const,
      enableHoverEffects: true,
      hoverStyle: 'glow' as const,
      roundedCorners: 'none' as const
    }
  },
  dark: {
    colors: darkTheme,
    headerStyle: 'minimal',
    footerStyle: 'minimal',
    darkMode: true
  }
};

// Context type
interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  applyThemeColor: (element: keyof ThemeColors, color: string) => void;
  toggleDarkMode: () => void;
  applyPresetTheme: (presetName: keyof typeof presetThemes) => void;
  updateLayout: (layoutSettings: Partial<ThemeLayout>) => void;
  updateEffects: (effectsSettings: Partial<ThemeEffects>) => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key
const THEME_STORAGE_KEY = 'streeter_theme_settings';

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    // S'assurer que les propriétés par défaut sont toujours définies
    return {
      ...defaultTheme,
      layout: { ...defaultLayout },
      effects: { ...defaultEffects }
    };
  });
  const [loaded, setLoaded] = useState(false);

  // Check if user prefers dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prevTheme => ({
        ...prevTheme,
        darkMode: prefersDarkMode
      }));
    }
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme);
          
          // Ensure all required properties exist with fallbacks to default
          const safeTheme = {
            ...defaultTheme, // Start with complete defaults
            ...parsedTheme,  // Override with saved values
            // Ensure nested objects are complete
            layout: { 
              ...defaultLayout, 
              ...(parsedTheme.layout || {}) 
            },
            effects: { 
              ...defaultEffects, 
              ...(parsedTheme.effects || {}) 
            },
            colors: {
              ...(theme.darkMode ? darkTheme : lightTheme),
              ...(parsedTheme.colors || {})
            }
          };
          
          setTheme(safeTheme);
        }
        setLoaded(true);
      } catch (error) {
        console.error('Error loading theme from localStorage:', error);
        // En cas d'erreur, revenir aux valeurs par défaut
        setTheme({
          ...defaultTheme,
          layout: { ...defaultLayout },
          effects: { ...defaultEffects }
        });
        setLoaded(true);
      }
    }
  }, []);

  // Fonction pour s'assurer que le thème contient toutes les propriétés requises
  const ensureCompleteTheme = (themeObj: Partial<ThemeSettings>): ThemeSettings => {
    // Déterminer si le mode sombre est activé
    const isDarkMode = themeObj.darkMode !== undefined ? themeObj.darkMode : theme.darkMode;
    
    // Sélectionner la base de couleurs appropriée en fonction du mode sombre
    const baseColors = isDarkMode ? darkTheme : lightTheme;
    
    return {
      ...defaultTheme,
      ...themeObj,
      layout: { 
        ...defaultLayout, 
        ...(themeObj.layout || {}) 
      },
      effects: { 
        ...defaultEffects, 
        ...(themeObj.effects || {}) 
      },
      colors: {
        ...baseColors,
        ...(themeObj.colors || {})
      },
      darkMode: isDarkMode
    };
  };

  // Modifier la fonction updateTheme pour utiliser ensureCompleteTheme
  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setTheme(prevTheme => {
      const updatedTheme = { ...prevTheme };
      
      // Handle nested color updates
      if (newSettings.colors) {
        updatedTheme.colors = { ...prevTheme.colors, ...newSettings.colors };
      }
      
      // Handle nested layout updates
      if (newSettings.layout) {
        const currentLayout = prevTheme.layout || { ...defaultLayout };
        updatedTheme.layout = { ...currentLayout, ...newSettings.layout };
      }
      
      // Handle nested effects updates
      if (newSettings.effects) {
        const currentEffects = prevTheme.effects || { ...defaultEffects };
        updatedTheme.effects = { ...currentEffects, ...newSettings.effects };
      }
      
      // Handle regular updates (excluding nested objects)
      Object.keys(newSettings).forEach(key => {
        if (key !== 'colors' && key !== 'layout' && key !== 'effects') {
          (updatedTheme as any)[key] = (newSettings as any)[key];
        }
      });
      
      // S'assurer que toutes les propriétés sont présentes
      return ensureCompleteTheme(updatedTheme);
    });
  };

  // Modifier la fonction resetTheme
  const resetTheme = () => {
    setTheme({
      ...defaultTheme,
      layout: { ...defaultLayout },
      effects: { ...defaultEffects }
    });
  };
  
  // Modifier la fonction applyPresetTheme
  const applyPresetTheme = (presetName: keyof typeof presetThemes) => {
    const preset = presetThemes[presetName];
    if (preset) {
      // Utiliser ensureCompleteTheme pour garantir l'intégrité
      setTheme(ensureCompleteTheme(preset));
    } else {
      console.error(`Preset theme "${presetName}" not found`);
    }
  };
  
  // Function to apply a specific color to an element (for the theme editor)
  const applyThemeColor = (element: keyof ThemeColors, color: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [element]: color
      }
    });
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setTheme(prevTheme => {
      const newDarkMode = !prevTheme.darkMode;
      // Sélectionner les couleurs de base appropriées pour le nouveau mode
      const baseColors = newDarkMode ? { ...darkTheme } : { ...lightTheme };
      
      // Conserver uniquement les personnalisations de couleurs qui ont été définies manuellement
      const customColors = {};
      
      // Identifier et préserver uniquement les couleurs personnalisées
      if (prevTheme.colors) {
        Object.entries(prevTheme.colors).forEach(([key, value]) => {
          const standardColors = prevTheme.darkMode ? lightTheme : darkTheme;
          // Si la valeur est différente de la valeur standard de l'autre thème, c'est une personnalisation
          if (value !== standardColors[key as keyof ThemeColors]) {
            (customColors as any)[key] = value;
          }
        });
      }
      
      // Appliquer le nouveau thème
      return {
        ...prevTheme,
        darkMode: newDarkMode,
        colors: {
          ...baseColors,
          ...customColors
        }
      };
    });
  };
  
  // Function to update layout settings
  const updateLayout = (layoutSettings: Partial<ThemeLayout>) => {
    updateTheme({
      layout: {
        ...(theme.layout || defaultLayout),
        ...layoutSettings
      }
    });
  };
  
  // Function to update effects settings
  const updateEffects = (effectsSettings: Partial<ThemeEffects>) => {
    updateTheme({
      effects: {
        ...(theme.effects || defaultEffects),
        ...effectsSettings
      }
    });
  };

  // Apply theme to document when theme changes
  useEffect(() => {
    if (!loaded) return;

    // Save theme to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    }

    // Apply current theme colors to CSS variables
    const currentColors = theme.darkMode ? { ...darkTheme, ...theme.colors } : theme.colors;
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', currentColors.primary);
    document.documentElement.style.setProperty('--color-secondary', currentColors.secondary);
    document.documentElement.style.setProperty('--color-accent', currentColors.accent);
    document.documentElement.style.setProperty('--color-background', currentColors.background);
    document.documentElement.style.setProperty('--color-text', currentColors.text);
    document.documentElement.style.setProperty('--color-header-bg', currentColors.headerBg);
    document.documentElement.style.setProperty('--color-footer-bg', currentColors.footerBg);
    document.documentElement.style.setProperty('--color-card-bg', currentColors.cardBg);
    document.documentElement.style.setProperty('--color-button-text', currentColors.buttonText);
    document.documentElement.style.setProperty('--color-border', currentColors.borderColor);
    document.documentElement.style.setProperty('--color-input-bg', currentColors.inputBg);
    document.documentElement.style.setProperty('--color-success', currentColors.success);
    document.documentElement.style.setProperty('--color-error', currentColors.error);
    document.documentElement.style.setProperty('--color-warning', currentColors.warning);
    document.documentElement.style.setProperty('--color-info', currentColors.info);
    
    // Apply fonts
    document.documentElement.style.setProperty('--font-main', theme.font);
    document.documentElement.style.setProperty('--font-secondary', theme.secondaryFont);
    
    // Apply border radius
    document.documentElement.style.setProperty('--border-radius', theme.borderRadius);
    
    // Ensure theme.layout exists before accessing its properties
    const layout = theme.layout || defaultLayout;
    
    // Apply layout settings
    document.documentElement.style.setProperty('--content-width', 
      layout.contentWidth === 'full' ? '100%' : 
      layout.contentWidth === 'narrow' ? '1024px' : '1280px'
    );
    document.documentElement.style.setProperty('--header-height',
      layout.headerHeight === 'small' ? '60px' :
      layout.headerHeight === 'large' ? '100px' : '80px'
    );
    document.documentElement.style.setProperty('--grid-columns', layout.gridColumns.toString());
    document.documentElement.style.setProperty('--page-spacing',
      layout.pageSpacing === 'compact' ? '1rem' :
      layout.pageSpacing === 'spacious' ? '3rem' : '2rem'
    );
    
    // Ensure theme.effects exists before accessing its properties
    const effects = theme.effects || defaultEffects;
    
    // Apply effects settings
    document.documentElement.style.setProperty('--animation-duration',
      effects.animationSpeed === 'slow' ? '0.5s' :
      effects.animationSpeed === 'fast' ? '0.2s' : '0.3s'
    );
    document.documentElement.style.setProperty('--shadow-depth',
      effects.shadowDepth === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' :
      effects.shadowDepth === 'deep' ? '0 10px 25px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)'
    );
    document.documentElement.style.setProperty('--hover-transform',
      effects.hoverStyle === 'scale' ? 'scale(1.05)' :
      effects.hoverStyle === 'lift' ? 'translateY(-5px)' :
      effects.hoverStyle === 'glow' ? 'none' : 'none'
    );
    document.documentElement.style.setProperty('--corner-radius',
      effects.roundedCorners === 'none' ? '0' :
      effects.roundedCorners === 'slight' ? '0.25rem' :
      effects.roundedCorners === 'full' ? '9999px' : '0.5rem'
    );
    
    // Apply dark mode
    if (theme.darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.dataset.theme = 'light';
    }
    
    // Apply animations toggle
    if (effects.enableAnimations) {
      document.documentElement.classList.remove('disable-animations');
    } else {
      document.documentElement.classList.add('disable-animations');
    }
    
    // Add theme styles class to body
    const headerStyleClass = `theme-${theme.headerStyle}-header`;
    const footerStyleClass = `theme-${theme.footerStyle}-footer`;
    const productCardStyleClass = `theme-${theme.productCardStyle}-product`;
    const buttonsStyleClass = `theme-${theme.buttonsStyle}-buttons`;
    const shadowClass = effects.enableShadows ? 'shadows-enabled' : 'shadows-disabled';
    const hoverClass = effects.enableHoverEffects ? 'hover-effects-enabled' : 'hover-effects-disabled';
    
    document.body.className = `${headerStyleClass} ${footerStyleClass} ${productCardStyleClass} ${buttonsStyleClass} ${shadowClass} ${hoverClass}`;
    
  }, [theme, loaded]);

  // Return provider
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      updateTheme, 
      resetTheme, 
      applyThemeColor, 
      toggleDarkMode,
      applyPresetTheme,
      updateLayout,
      updateEffects
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 