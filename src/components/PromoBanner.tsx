import React from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PromoBannerProps {
  message: string;
  link?: {
    text: string;
    url: string;
  };
  onClose?: () => void;
}

export default function PromoBanner({ message, link, onClose }: PromoBannerProps) {
  return (
    <div className="bg-indigo-600 text-white py-3 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <div className="flex items-center">
          <p className="text-sm font-medium">
            {message}
            {link && (
              <Link 
                href={link.url} 
                className="ml-2 inline-block underline font-bold hover:text-indigo-100 transition-colors"
              >
                {link.text}
              </Link>
            )}
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="mt-2 sm:mt-0 p-1 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
} 