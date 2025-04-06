'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SwatchIcon, 
  PaintBrushIcon, 
  DocumentTextIcon, 
  ArrowPathIcon,
  SunIcon,
  MoonIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeSettings } from '@/contexts/ThemeContext';
import AdminDashboard from '../dashboard';

// Fonts options
const fontOptions = [
  'Inter', 
  'Roboto', 
  'Open Sans',
  'Montserrat', 
  'Poppins',
  'Raleway',
  'Source Sans Pro',
  'Lato'
];

// Border radius options
const borderRadiusOptions = [
  { label: 'Aucun', value: '0' },
  { label: 'Petit', value: '0.25rem' },
  { label: 'Moyen', value: '0.5rem' },
  { label: 'Grand', value: '1rem' },
  { label: 'Complet', value: '9999px' }
];

// Style options
const headerStyleOptions = [
  { label: 'Par défaut', value: 'default' },
  { label: 'Centré', value: 'centered' },
  { label: 'Minimal', value: 'minimal' }
];

const footerStyleOptions = [
  { label: 'Par défaut', value: 'default' },
  { label: 'Simple', value: 'simple' },
  { label: 'Étendu', value: 'expanded' }
];

const productCardStyleOptions = [
  { label: 'Par défaut', value: 'default' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Détaillé', value: 'detailed' }
];

const buttonStyleOptions = [
  { label: 'Par défaut', value: 'default' },
  { label: 'Arrondi', value: 'rounded' },
  { label: 'Carré', value: 'square' }
];

export default function ThemeSettings() {
  const router = useRouter();
  const { theme, updateTheme, resetTheme, applyThemeColor } = useTheme();
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveMessage, setSaveMessage] = useState('');
  
  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/theme');
        return;
      }
    };

    checkAuth();
  }, [router]);

  const handleColorChange = (colorName: string, color: string) => {
    applyThemeColor(colorName as any, color);
    setSaveMessage('Modifications sauvegardées');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleFontChange = (font: string) => {
    updateTheme({ font });
    setSaveMessage('Police modifiée');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleBorderRadiusChange = (radius: string) => {
    updateTheme({ borderRadius: radius });
    setSaveMessage('Bordures modifiées');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleStyleChange = (styleName: string, value: string) => {
    updateTheme({ [styleName]: value } as Partial<ThemeSettings>);
    setSaveMessage('Style modifié');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDarkModeToggle = () => {
    updateTheme({ darkMode: !theme.darkMode });
    setSaveMessage(theme.darkMode ? 'Mode clair activé' : 'Mode sombre activé');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le thème ? Toutes vos modifications seront perdues.')) {
      resetTheme();
      setSaveMessage('Thème réinitialisé');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du thème</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-2 flex items-center rounded-md ${
                activeTab === 'colors' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <SwatchIcon className="h-5 w-5 mr-2" />
              Couleurs
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`px-4 py-2 flex items-center rounded-md ${
                activeTab === 'typography' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Typographie
            </button>
            <button
              onClick={() => setActiveTab('styles')}
              className={`px-4 py-2 flex items-center rounded-md ${
                activeTab === 'styles' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <PaintBrushIcon className="h-5 w-5 mr-2" />
              Styles
            </button>
            <button
              onClick={() => setActiveTab('darkMode')}
              className={`px-4 py-2 flex items-center rounded-md ${
                activeTab === 'darkMode' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {theme.darkMode ? (
                <SunIcon className="h-5 w-5 mr-2" />
              ) : (
                <MoonIcon className="h-5 w-5 mr-2" />
              )}
              Mode {theme.darkMode ? 'Clair' : 'Sombre'}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {saveMessage && (
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md">
                <CheckIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{saveMessage}</span>
              </div>
            )}
            <button 
              onClick={handleReset}
              className="bg-white border border-gray-300 px-3 py-1 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-5 w-5 inline mr-1" />
              Réinitialiser
            </button>
            <button
              onClick={handleDarkModeToggle}
              className={`px-3 py-1 rounded-md flex items-center ${
                theme.darkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              {theme.darkMode ? (
                <>
                  <SunIcon className="h-5 w-5 inline mr-1" />
                  Mode clair
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5 inline mr-1" />
                  Mode sombre
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              {activeTab === 'colors' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Couleurs du thème</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur principale</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur secondaire</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur d'accent</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.accent}
                          onChange={(e) => handleColorChange('accent', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.accent}
                          onChange={(e) => handleColorChange('accent', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur d'arrière-plan</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.background}
                          onChange={(e) => handleColorChange('background', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.background}
                          onChange={(e) => handleColorChange('background', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur du texte</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.text}
                          onChange={(e) => handleColorChange('text', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.text}
                          onChange={(e) => handleColorChange('text', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur de l'en-tête</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.headerBg}
                          onChange={(e) => handleColorChange('headerBg', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.headerBg}
                          onChange={(e) => handleColorChange('headerBg', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur du pied de page</label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          value={theme.colors.footerBg}
                          onChange={(e) => handleColorChange('footerBg', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.colors.footerBg}
                          onChange={(e) => handleColorChange('footerBg', e.target.value)}
                          className="ml-2 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'typography' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Typographie</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Police principale</label>
                      <select
                        value={theme.font}
                        onChange={(e) => handleFontChange(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                      <div className="mt-2 p-3 border rounded-md" style={{ fontFamily: theme.font }}>
                        <p className="text-sm">Aperçu de la police {theme.font}</p>
                        <p className="text-xl mt-1">AaBbCcDdEeFfGg</p>
                        <p className="mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rayon des bordures</label>
                      <select
                        value={theme.borderRadius}
                        onChange={(e) => handleBorderRadiusChange(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {borderRadiusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <div className="mt-2 flex space-x-2">
                        {borderRadiusOptions.map(option => (
                          <div 
                            key={option.value} 
                            className="h-10 w-10 bg-indigo-600" 
                            style={{ borderRadius: option.value }}
                            title={option.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'styles' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Styles des composants</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Style de l'en-tête</label>
                      <select
                        value={theme.headerStyle}
                        onChange={(e) => handleStyleChange('headerStyle', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {headerStyleOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Style du pied de page</label>
                      <select
                        value={theme.footerStyle}
                        onChange={(e) => handleStyleChange('footerStyle', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {footerStyleOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Style des fiches produit</label>
                      <select
                        value={theme.productCardStyle}
                        onChange={(e) => handleStyleChange('productCardStyle', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {productCardStyleOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Style des boutons</label>
                      <select
                        value={theme.buttonsStyle}
                        onChange={(e) => handleStyleChange('buttonsStyle', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {buttonStyleOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <div className="mt-2 flex space-x-2">
                        <button
                          style={{ borderRadius: theme.buttonsStyle === 'rounded' ? '9999px' : (theme.buttonsStyle === 'square' ? '0' : theme.borderRadius) }}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm"
                        >
                          Bouton
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Aperçu</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 rounded-md ${
                      previewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Bureau
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 rounded-md ${
                      previewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden" style={{ 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.font
              }}>
                <div className="preview-container" style={{ 
                  maxWidth: previewMode === 'mobile' ? '375px' : '100%',
                  margin: '0 auto',
                  height: '500px',
                  overflow: 'auto'
                }}>
                  {/* En-tête */}
                  <header style={{ backgroundColor: theme.colors.headerBg }} className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-xl" style={{ color: theme.colors.text }}>Streeter</div>
                      <div className="flex space-x-4">
                        <a href="#" style={{ color: theme.colors.primary }}>Home</a>
                        <a href="#" style={{ color: theme.colors.text }}>Products</a>
                        <a href="#" style={{ color: theme.colors.text }}>About</a>
                      </div>
                    </div>
                  </header>
                  
                  {/* Contenu */}
                  <main className="p-4">
                    <h1 style={{ color: theme.colors.text }} className="text-2xl font-bold mb-4">Titre de page</h1>
                    
                    <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod auctor nisi nec finibus.</p>
                    
                    <button 
                      style={{ 
                        backgroundColor: theme.colors.primary, 
                        color: 'white',
                        borderRadius: theme.buttonsStyle === 'rounded' ? '9999px' : (theme.buttonsStyle === 'square' ? '0' : theme.borderRadius)
                      }} 
                      className="px-4 py-2 mb-6"
                    >
                      Bouton primaire
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Carte produit */}
                      <div 
                        style={{ 
                          borderRadius: theme.borderRadius,
                          border: theme.productCardStyle === 'minimal' ? 'none' : '1px solid #e5e7eb',
                          padding: theme.productCardStyle === 'detailed' ? '1rem' : '0.5rem',
                          boxShadow: theme.productCardStyle === 'minimal' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                        }} 
                        className="bg-white"
                      >
                        <div className="bg-gray-200 h-40 mb-2" style={{ borderRadius: theme.borderRadius }}></div>
                        <h3 className="font-medium">Produit exemple</h3>
                        <p style={{ color: theme.colors.secondary }} className="font-bold">99 €</p>
                        <button 
                          style={{ 
                            backgroundColor: theme.colors.accent, 
                            color: 'white',
                            borderRadius: theme.buttonsStyle === 'rounded' ? '9999px' : (theme.buttonsStyle === 'square' ? '0' : theme.borderRadius)
                          }} 
                          className="w-full mt-2 px-4 py-1 text-sm"
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </main>
                  
                  {/* Pied de page */}
                  <footer 
                    style={{ 
                      backgroundColor: theme.colors.footerBg,
                      color: 'white',
                      padding: theme.footerStyle === 'expanded' ? '3rem 1rem' : (theme.footerStyle === 'simple' ? '1rem' : '2rem 1rem')
                    }}
                  >
                    <div className={theme.footerStyle === 'simple' ? 'text-center' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
                      <div>
                        <h3 className="font-bold mb-2">Streeter</h3>
                        {theme.footerStyle !== 'simple' && (
                          <p className="text-sm opacity-80">La référence du streetwear en ligne.</p>
                        )}
                      </div>
                      
                      {theme.footerStyle !== 'simple' && (
                        <>
                          <div>
                            <h4 className="font-medium mb-2">Liens</h4>
                            <ul className="text-sm opacity-80">
                              <li>À propos</li>
                              <li>Contact</li>
                              <li>Conditions</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Contact</h4>
                            <p className="text-sm opacity-80">info@streeter.com</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20 text-center text-sm opacity-60">
                      © 2023 Streeter. Tous droits réservés.
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'darkMode' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {theme.darkMode ? "Mode sombre activé" : "Mode clair activé"}
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg border bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-2">Mode actuel : {theme.darkMode ? "Sombre" : "Clair"}</h3>
                    <p className="text-sm text-gray-500">
                      {theme.darkMode 
                        ? "Le mode sombre réduit la fatigue oculaire en diminuant la luminosité de l'écran tout en maintenant le contraste minimum requis pour la lisibilité."
                        : "Le mode clair offre un meilleur contraste et une meilleure lisibilité dans un environnement bien éclairé."
                      }
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {theme.darkMode ? (
                      <MoonIcon className="h-10 w-10 text-indigo-600" />
                    ) : (
                      <SunIcon className="h-10 w-10 text-amber-500" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleDarkModeToggle}
                  className={`px-4 py-2 rounded-md flex items-center justify-center w-full max-w-md ${
                    theme.darkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {theme.darkMode ? (
                    <>
                      <SunIcon className="h-5 w-5 mr-2" />
                      Passer au mode clair
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 mr-2" />
                      Passer au mode sombre
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Application automatique</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Votre site peut automatiquement détecter et appliquer le mode préféré de vos visiteurs en fonction des paramètres de leur système.
                </p>
                <div className="flex items-center">
                  <div className="mr-3">
                    <input 
                      type="checkbox" 
                      checked={true} 
                      readOnly
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Respecter les préférences système
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdminDashboard activeModule="theme" />
      </div>
    </div>
  );
} 