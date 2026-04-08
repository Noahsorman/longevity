export const theme = {
  colors: {
    background: '#0f172a',      // Mörkblå/svart bas
    cardBg: '#1e293b',         // Lättare blågrå för kort
    border: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#e2e8f0',    // Nästan vit
    textSecondary: '#94a3b8',  // Dämpad grå
    accent: '#3b82f6',         // Klar neon-blå (Longevity-färg)
    accentLight: '#93c5fd',    // Ljusare blå för highlights
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif", // Standard för modern webb
    h1: { fontSize: '2.5rem', fontWeight: 800 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    body: { fontSize: '0.95rem', lineHeight: '1.6' },
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  }
};