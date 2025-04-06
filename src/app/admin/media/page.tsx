'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  PhotoIcon,
  DocumentIcon, 
  FilmIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

// Types pour les médias
type MediaType = 'image' | 'video' | 'document';

type Media = {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  size: number;
  createdAt: string;
  dimensions?: {
    width: number;
    height: number;
  };
};

// Fonction utilitaire pour obtenir l'URL de l'API (à adapter selon votre configuration)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.streeter.com';

export default function MediaLibrary() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États
  const [isLoading, setIsLoading] = useState(true);
  const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [previewFile, setPreviewFile] = useState<Media | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [libraryStats, setLibraryStats] = useState({
    total: 0,
    images: 0,
    videos: 0,
    documents: 0,
    lastUpload: ''
  });

  // Récupérer les fichiers médias
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await isAuthenticated();
        if (!authResult) {
          router.push('/auth/login?returnUrl=/admin/media');
          return;
        }
        
        fetchMediaFiles();
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        showToast("Erreur d'authentification, veuillez vous reconnecter.", 'error');
        router.push('/auth/login?returnUrl=/admin/media');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Afficher un message toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };
  
  const fetchMediaFiles = () => {
    setIsLoading(true);
    setImageErrors({});
    
    // Simulation d'une requête API
    // En production, remplacer par un vrai appel API
    // fetchData(`${API_URL}/media`)
    setTimeout(() => {
      try {
        const mockMediaFiles: Media[] = [];
        const mediaTypes: MediaType[] = ['image', 'video', 'document'];
        
        // Générer des fichiers médias fictifs
        for (let i = 1; i <= 16; i++) {
          const type = mediaTypes[Math.floor(Math.random() * (i % 5 === 0 ? 3 : 1))]; // Plus d'images que d'autres types
          let url = '';
          
          if (type === 'image') {
            // Utiliser des images qui existent réellement dans le dossier public
            const index = i % 2 === 0 ? 1 : 2;
            url = `/images/placeholder/image_${index}.jpg`;
          } else if (type === 'video') {
            url = `/images/placeholder/video_1.jpg`;
          } else {
            url = `/images/placeholder/document_1.jpg`;
          }
          
          mockMediaFiles.push({
            id: `file-${i}`,
            name: `${type === 'image' ? 'image' : type === 'video' ? 'video' : 'document'}_${i}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`,
            type,
            url,
            size: Math.floor(Math.random() * 5 * 1024 * 1024) + 100 * 1024, // Taille entre 100KB et 5MB
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            dimensions: {
              width: 800,
              height: 600
            }
          });
        }
        
        setMediaFiles(mockMediaFiles);
        setFilteredFiles(mockMediaFiles);
        
        // Calculer les statistiques
        const images = mockMediaFiles.filter(file => file.type === 'image').length;
        const videos = mockMediaFiles.filter(file => file.type === 'video').length;
        const documents = mockMediaFiles.filter(file => file.type === 'document').length;
        const lastUpload = new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        setLibraryStats({
          total: mockMediaFiles.length,
          images,
          videos,
          documents,
          lastUpload
        });
        
        showToast("Médiathèque chargée avec succès", 'success');
      } catch (error) {
        console.error("Erreur lors du chargement des fichiers:", error);
        showToast("Erreur lors du chargement des fichiers", 'error');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };
  
  // Filtrer les fichiers en fonction de la recherche et du type
  useEffect(() => {
    let filtered = [...mediaFiles];
    
    // Filtrer par type
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.type === filterType);
    }
    
    // Filtrer par requête de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredFiles(filtered);
  }, [mediaFiles, searchQuery, filterType]);
  
  // Gérer la sélection de tous les fichiers
  useEffect(() => {
    if (selectAll) {
      setSelectedFiles(filteredFiles.map(file => file.id));
    } else {
      setSelectedFiles([]);
    }
  }, [selectAll, filteredFiles]);
  
  const toggleFileSelection = (id: string) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Vérifier les types et tailles de fichiers
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                          file.type.startsWith('video/') || 
                          file.type.startsWith('application/pdf') ||
                          file.type.startsWith('application/msword') ||
                          file.type.startsWith('application/vnd.openxmlformats-officedocument');
      
      const isValidSize = file.size <= 10 * 1024 * 1024; // Limite à 10 MB
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length === 0) {
      showToast("Aucun fichier valide n'a été sélectionné. Veuillez sélectionner des fichiers d'image, vidéo ou document de moins de 10 MB.", 'error');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simuler un téléchargement
    // En production, utilisez FormData et fetch pour un vrai téléchargement
    // const formData = new FormData();
    // validFiles.forEach(file => formData.append('files', file));
    // fetch(`${API_URL}/upload`, { method: 'POST', body: formData })
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Créer de nouveaux fichiers médias
          const newMediaFiles: Media[] = [];
          
          validFiles.forEach((file, index) => {
            const type: MediaType = file.type.startsWith('image/') 
              ? 'image' 
              : file.type.startsWith('video/') 
              ? 'video' 
              : 'document';
              
            // Pour les fichiers téléchargés, on utilise des placeholders selon leur type
            // pour éviter les problèmes avec les URL.createObjectURL qui expirent
            let url = '';
            if (type === 'image') {
              url = `/images/placeholder/image_${index % 2 === 0 ? 1 : 2}.jpg`;
            } else if (type === 'video') {
              url = `/images/placeholder/video_1.jpg`;
            } else {
              url = `/images/placeholder/document_1.jpg`;
            }
            
            newMediaFiles.push({
              id: `new-file-${Date.now()}-${index}`,
              name: file.name,
              type,
              url,
              size: file.size,
              createdAt: new Date().toISOString(),
              dimensions: {
                width: 800,
                height: 600
              }
            });
          });
          
          setMediaFiles(prev => [...newMediaFiles, ...prev]);
          
          // Mettre à jour les statistiques
          const images = newMediaFiles.filter(file => file.type === 'image').length;
          const videos = newMediaFiles.filter(file => file.type === 'video').length;
          const documents = newMediaFiles.filter(file => file.type === 'document').length;
          
          setLibraryStats(prev => ({
            total: prev.total + newMediaFiles.length,
            images: prev.images + images,
            videos: prev.videos + videos,
            documents: prev.documents + documents,
            lastUpload: new Date().toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }));
          
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          showToast(`${newMediaFiles.length} fichier(s) téléchargé(s) avec succès`, 'success');
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFiles.length} fichier(s) ?`)) {
      try {
        // En production, utilisez un appel API pour supprimer les fichiers
        // fetch(`${API_URL}/media/delete`, { 
        //   method: 'POST', 
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ids: selectedFiles }) 
        // })
        
        // Filtrer les fichiers
        const remainingFiles = mediaFiles.filter(file => !selectedFiles.includes(file.id));
        setMediaFiles(remainingFiles);
        setSelectedFiles([]);
        setSelectAll(false);
        
        // Mettre à jour les statistiques
        const images = remainingFiles.filter(file => file.type === 'image').length;
        const videos = remainingFiles.filter(file => file.type === 'video').length;
        const documents = remainingFiles.filter(file => file.type === 'document').length;
        
        setLibraryStats({
          total: remainingFiles.length,
          images,
          videos,
          documents,
          lastUpload: libraryStats.lastUpload
        });
        
        showToast(`${selectedFiles.length} fichier(s) supprimé(s) avec succès`, 'success');
      } catch (error) {
        console.error("Erreur lors de la suppression des fichiers:", error);
        showToast("Une erreur est survenue lors de la suppression des fichiers.", 'error');
      }
    }
  };
  
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-12 w-12 text-indigo-400" />;
      case 'video':
        return <FilmIcon className="h-12 w-12 text-purple-400" />;
      case 'document':
        return <DocumentIcon className="h-12 w-12 text-blue-400" />;
      default:
        return <DocumentIcon className="h-12 w-12 text-gray-400" />;
    }
  };
  
  // Gérer les erreurs d'image
  const handleImageError = (fileId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [fileId]: true
    }));
  };
  
  // Ouvrir la prévisualisation d'un fichier
  const openPreview = (file: Media) => {
    setPreviewFile(file);
  };

  // Fermer la prévisualisation
  const closePreview = () => {
    setPreviewFile(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Médiathèque</h1>
            <div className="flex space-x-2">
              <Link href="/admin">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Retour au tableau de bord
                </span>
              </Link>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                Importer des fichiers
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast notifications */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-opacity duration-500 
            ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'} 
            text-white`}
          >
            {toast.message}
          </div>
        )}
        
        {uploading && (
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Téléchargement en cours...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0 flex-grow">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Rechercher un fichier..."
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Filtres par type */}
                <div className="mr-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="all">Tous les types</option>
                    <option value="image">Images</option>
                    <option value="video">Vidéos</option>
                    <option value="document">Documents</option>
                  </select>
                </div>
                
                <button
                  onClick={fetchMediaFiles}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-1" />
                  Actualiser
                </button>
                
                {selectedFiles.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Supprimer ({selectedFiles.length})
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="select-all"
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                  Tout sélectionner
                </label>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredFiles.length} fichier(s) sur {mediaFiles.length}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-10">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun fichier</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {mediaFiles.length > 0 
                    ? "Aucun fichier ne correspond à votre recherche." 
                    : "Commencez par importer des fichiers dans votre médiathèque."}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                    Importer des fichiers
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {filteredFiles.map((file, index) => (
                  <div 
                    key={file.id} 
                    className={`relative group border rounded-lg overflow-hidden cursor-pointer ${
                      selectedFiles.includes(file.id) ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => openPreview(file)}
                  >
                    <div 
                      className="absolute top-2 left-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFileSelection(file.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleFileSelection(file.id);
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    {file.type === 'image' && !imageErrors[file.id] ? (
                      <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 h-40">
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                          priority={index < 8}
                          onError={() => handleImageError(file.id)}
                        />
                      </div>
                    ) : (
                      <div className="aspect-w-1 aspect-h-1 w-full h-40 bg-gray-100 flex items-center justify-center">
                        {getMediaIcon(file.type)}
                      </div>
                    )}
                    
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informations sur la médiathèque</h3>
          </div>
          
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <DocumentIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-indigo-800">Nombre total de fichiers</h4>
                  <p className="text-2xl font-semibold text-indigo-900">{libraryStats.total}</p>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <ArrowUpTrayIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-indigo-800">Dernier upload</h4>
                  <p className="text-sm font-semibold text-indigo-900">{libraryStats.lastUpload}</p>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">Types de fichiers</h4>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-indigo-900">{libraryStats.images}</p>
                    <p className="text-xs text-indigo-700">Images</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-indigo-900">{libraryStats.videos}</p>
                    <p className="text-xs text-indigo-700">Vidéos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-indigo-900">{libraryStats.documents}</p>
                    <p className="text-xs text-indigo-700">Documents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">{previewFile.name}</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 bg-gray-100 rounded-lg overflow-hidden">
                  {previewFile.type === 'image' && !imageErrors[previewFile.id] ? (
                    <div className="relative aspect-w-16 aspect-h-9 w-full">
                      <Image
                        src={previewFile.url}
                        alt={previewFile.name}
                        width={800}
                        height={600}
                        className="object-contain"
                        onError={() => handleImageError(previewFile.id)}
                      />
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9 w-full flex items-center justify-center p-8">
                      <div className="text-center">
                        {getMediaIcon(previewFile.type)}
                        <p className="mt-4 text-gray-600">Prévisualisation non disponible</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-1/3">
                  <h4 className="text-lg font-medium mb-4">Informations</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{previewFile.type === 'image' ? 'Image' : previewFile.type === 'video' ? 'Vidéo' : 'Document'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Taille</p>
                      <p className="font-medium">{formatFileSize(previewFile.size)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date de création</p>
                      <p className="font-medium">{new Date(previewFile.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    
                    {previewFile.dimensions && (
                      <div>
                        <p className="text-sm text-gray-500">Dimensions</p>
                        <p className="font-medium">{previewFile.dimensions.width} × {previewFile.dimensions.height}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        toggleFileSelection(previewFile.id);
                        closePreview();
                        handleDeleteSelected();
                      }}
                      className="inline-flex w-full justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Supprimer ce fichier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 