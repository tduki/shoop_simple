'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validation simple
    if (!currentPassword) {
      setErrorMessage('Veuillez entrer votre mot de passe actuel');
      return;
    }
    
    if (newPassword.length < 8) {
      setErrorMessage('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Votre mot de passe a été mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }, 1500);
  };
  
  const handleTwoFactorToggle = () => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
    setSuccessMessage(`L'authentification à deux facteurs a été ${!isTwoFactorEnabled ? 'activée' : 'désactivée'}`);
    
    // Réinitialiser le message de succès après 5 secondes
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  
  const handleEmailNotificationToggle = () => {
    setIsEmailNotificationEnabled(!isEmailNotificationEnabled);
    setSuccessMessage(`Les notifications par e-mail pour les connexions ont été ${!isEmailNotificationEnabled ? 'activées' : 'désactivées'}`);
    
    // Réinitialiser le message de succès après 5 secondes
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Sécurité du compte</h2>
      
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Changer votre mot de passe</h3>
          <div className="mt-5">
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="current-password"
                    id="current-password"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    id="new-password"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm-password"
                    id="confirm-password"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mise à jour...
                    </>
                  ) : (
                    'Modifier le mot de passe'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Sécurité du compte</h3>
          <div className="mt-5 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="two-factor"
                  name="two-factor"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={isTwoFactorEnabled}
                  onChange={handleTwoFactorToggle}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="two-factor" className="font-medium text-gray-700">Authentification à deux facteurs</label>
                <p className="text-gray-500">Activez cette option pour renforcer la sécurité de votre compte en exigeant un code de vérification en plus de votre mot de passe lors de la connexion.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email-notifications"
                  name="email-notifications"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={isEmailNotificationEnabled}
                  onChange={handleEmailNotificationToggle}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="email-notifications" className="font-medium text-gray-700">Notifications par e-mail pour les connexions</label>
                <p className="text-gray-500">Recevez une notification par e-mail chaque fois que votre compte est utilisé sur un nouvel appareil.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Sessions actives</h3>
          <div className="mt-5">
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Cet appareil</span>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Actif
                    </span>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-900" disabled>Actuel</button>
                </div>
                <p className="mt-1 text-sm text-gray-500">Windows 10 • Chrome • Paris, France</p>
                <p className="text-xs text-gray-500">Dernière activité: il y a 1 minute</p>
              </div>
              
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Téléphone mobile</span>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-900">Déconnecter</button>
                </div>
                <p className="mt-1 text-sm text-gray-500">iOS 15 • Safari • Lyon, France</p>
                <p className="text-xs text-gray-500">Dernière activité: il y a 2 heures</p>
              </div>
              
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Ordinateur portable</span>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-900">Déconnecter</button>
                </div>
                <p className="mt-1 text-sm text-gray-500">macOS • Firefox • Paris, France</p>
                <p className="text-xs text-gray-500">Dernière activité: hier</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-900 font-medium"
                onClick={() => {
                  setSuccessMessage('Toutes les autres sessions ont été déconnectées');
                  setTimeout(() => {
                    setSuccessMessage('');
                  }, 5000);
                }}
              >
                Déconnecter toutes les autres sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 