'use client';

import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  actionButton?: React.ReactNode;
  backUrl?: string;
}

export default function AdminHeader({ 
  title, 
  actionButton, 
  backUrl = '/admin' 
}: AdminHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href={backUrl} className="mr-4 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
        </div>
        {actionButton && (
          <div>
            {actionButton}
          </div>
        )}
      </div>
    </header>
  );
} 