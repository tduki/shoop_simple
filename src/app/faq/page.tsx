'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "Comment passer une commande sur Streeter ?",
      answer: "Pour passer une commande, parcourez notre catalogue, choisissez vos articles, ajoutez-les à votre panier, puis suivez les étapes du processus de paiement. Vous aurez besoin de créer un compte ou de vous connecter à votre compte existant avant de finaliser votre achat."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Nous proposons plusieurs options de livraison : Standard (3-5 jours ouvrables), Express (1-2 jours ouvrables) et Premium (livraison le jour même dans certaines zones). Les délais peuvent varier en fonction de votre localisation et de la disponibilité des articles."
    },
    {
      question: "Comment puis-je suivre ma commande ?",
      answer: "Une fois votre commande expédiée, vous recevrez un e-mail de confirmation avec un numéro de suivi. Vous pouvez utiliser ce numéro sur notre site web dans la section 'Suivi de commande' ou directement sur le site du transporteur."
    },
    {
      question: "Quelle est votre politique de retour ?",
      answer: "Nous acceptons les retours dans les 30 jours suivant la réception de votre commande. Les articles doivent être dans leur état d'origine, non portés et avec toutes les étiquettes attachées. Les frais de retour sont à la charge du client, sauf en cas d'article défectueux ou d'erreur de notre part."
    },
    {
      question: "Comment fonctionnent les réductions et codes promo ?",
      answer: "Les codes promotionnels peuvent être appliqués lors du processus de paiement dans le champ 'Code promo'. Les réductions sont automatiquement appliquées aux articles éligibles. Veuillez noter que les codes promo ne peuvent généralement pas être combinés entre eux ou avec d'autres offres en cours."
    },
    {
      question: "Les tailles correspondent-elles aux standards ?",
      answer: "Nos tailles suivent les standards européens. Nous vous recommandons de consulter notre guide des tailles disponible sur chaque page produit pour trouver la taille qui vous convient le mieux. En cas de doute, optez pour la taille supérieure."
    },
    {
      question: "Comment puis-je contacter le service client ?",
      answer: "Vous pouvez nous contacter par e-mail à support@streeter.com, par téléphone au 01 23 45 67 89 du lundi au vendredi de 9h à 18h, ou via le formulaire de contact sur notre site. Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures ouvrables."
    },
    {
      question: "Est-ce que Streeter propose des articles en édition limitée ?",
      answer: "Oui, nous proposons régulièrement des collections en édition limitée et des collaborations exclusives. Inscrivez-vous à notre newsletter pour être informé des lancements à venir et ne manquez aucune opportunité d'acquérir nos pièces les plus rares."
    },
    {
      question: "Comment devenir membre VIP ?",
      answer: "Notre programme de fidélité VIP est accessible après avoir effectué 3 achats sur notre site. En tant que membre VIP, vous bénéficiez d'avantages exclusifs comme des réductions supplémentaires, un accès anticipé aux nouvelles collections et des cadeaux surprises avec vos commandes."
    },
  ];

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Foire Aux Questions</h1>
          <p className="mt-4 text-lg text-gray-500">
            Trouvez les réponses aux questions les plus fréquemment posées par nos clients.
          </p>
        </div>

        <div className="shadow-xl rounded-xl overflow-hidden bg-white divide-y divide-gray-200">
          {faqItems.map((item, index) => (
            <div key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">{item.question}</span>
                {openItem === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-indigo-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              <div
                className={`px-6 pb-5 transition-all duration-300 ease-in-out ${
                  openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 hidden'
                }`}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Vous n'avez pas trouvé la réponse à votre question ?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
} 