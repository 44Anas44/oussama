import type { BrandTheme } from '../types';

/** Habillage actuel de l'application (vert, menu sombre). */
export const theme: BrandTheme = {
  brand: {
    50: '#edfbf3', 100: '#d3f5e1', 200: '#a8eac6', 300: '#71d8a4', 400: '#3cbe80',
    500: '#17a063', 600: '#0c8150', 700: '#0a6742', 800: '#0b5237', 900: '#0a442f'
  },
  ink: {
    50: '#f6f7f7', 100: '#ebedec', 200: '#d7dbd9', 300: '#b3bab7', 400: '#828c88',
    500: '#5c6663', 600: '#434b49', 700: '#2f3634', 800: '#1c2120', 900: '#0e1211'
  },
  font: {
    family: "'Inter', ui-sans-serif, system-ui, sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  },
  sidebar: 'dark',
  radius: 'soft',
  center: {
    address: '',
    phone: '',
    email: '',
    taxId: '',
    receiptFooter: 'Merci de votre confiance.',
    appointmentNotes: [
    'Merci de vous présenter quelques minutes avant l’heure du rendez-vous.',
    'En cas d’empêchement, merci de nous prévenir au plus tôt.']

  }
};
