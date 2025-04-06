import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeProvider from '@/contexts/ThemeContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ToastProvider from '@/components/ToastProvider'
import LiveChat from '@/components/LiveChat'
import NewsletterPopup from '@/components/NewsletterPopup'
import CompareProducts from '@/components/CompareProducts'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Streeter - Boutique de streetwear en ligne',
  description: 'Découvrez les dernières tendances streetwear pour homme et femme. Livraison rapide et paiement sécurisé.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <ToastProvider />
          <Navbar />
          <main className="flex-grow pt-[70px]">{children}</main>
          <Footer />
          <LiveChat />
          <NewsletterPopup />
          <CompareProducts />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
