// Icônes SVG intégrées (aucun fichier externe à charger).
const svg = (contenu, vb = "0 0 24 24") =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contenu}</svg>`;

export const icones = {
  telephone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-4.1-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.8a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4A11.8 11.8 0 0 0 20.4 3.6z"/></svg>`,
  instagram: svg('<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.6" cy="6.4" r=".6" fill="currentColor"/>'),
  lieu: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  horloge: svg('<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/>'),
  itineraire: svg('<path d="M3 11l18-8-8 18-2-8-8-2z"/>'),
  menu: svg('<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>'),
  // Points forts
  chef: svg('<path d="M6 13.9V20h12v-6.1A4 4 0 0 0 17 6a5 5 0 0 0-10 0 4 4 0 0 0-1 7.9z"/><path d="M6 17h12"/>'),
  famille: svg('<circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4.5 4.5 0 0 1 7-3.7"/>'),
  parking: svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>'),
  terrasse: svg('<path d="M12 3v18M4 9l8-6 8 6M7 21h10"/>'),
  livraison: svg('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  wifi: svg('<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/>'),
  coeur: svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>'),
  etoile: svg('<path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/>'),
  ornement: `<svg class="ornement" viewBox="0 0 72 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M0 6h26M46 6h26"/><path d="M36 1l5 5-5 5-5-5z"/><circle cx="29" cy="6" r="1.2" fill="currentColor"/><circle cx="43" cy="6" r="1.2" fill="currentColor"/></svg>`
};
