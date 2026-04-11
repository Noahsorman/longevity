import React, { useState } from 'react';
import FOOD_DATABASE_IMP from '../assets/data/snacks.json';
import { theme } from '../assets/themes';

interface Ingredient {
  id: string;
  name: string;
  image: string;
  portion?: string | number; // Added portion
  stats?: {
    kcal: number;
    protein: number;
    fiber: number;
    fat: number;
    carbs: number;
  }
  info?: string;
}

type FoodDatabase = Ingredient[];

const SnacksPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const SNACKS: FoodDatabase = FOOD_DATABASE_IMP as FoodDatabase;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Snacks</h1>
      </header>

      <section style={styles.section}>
        <div style={styles.grid}>
          {SNACKS.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => setSelectedItem(item)}
            >
              <div style={styles.imagePlaceholder}>
                {item.image ? <img src={item.image} alt={item.name} style={styles.img} /> : <span>🥗</span>}
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemInfo}>{item.info}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Modal / Popup */}
    {selectedItem && (
      <div style={styles.overlay} onClick={() => setSelectedItem(null)}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
          
          <h2 style={styles.modalTitle}>{selectedItem.name}</h2>
          <p style={styles.modalInfoText}>{selectedItem.info}</p>

          {selectedItem.stats && (
            <div style={styles.statsRow}>
              <Stat label="Kcal" val={selectedItem.stats.kcal} />
              <Stat label="Protein" val={selectedItem.stats.protein} unit="g" />
              <Stat label="Fiber" val={selectedItem.stats.fiber} unit="g" />
              <Stat label="Fat" val={selectedItem.stats.fat} unit="g" />
            </div>
          )}
        </div>
      </div>
    )}
    </div>
  );
};

const Stat = ({ label, val, unit = "" }: any) => (
  <div style={styles.statBox}>
    <div style={styles.statVal}>{val}{unit}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily
  },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    marginBottom: '8px'
  },
  subtitle: { color: theme.colors.textSecondary },
  section: { marginBottom: '50px' },
  categoryTitle: {
    borderBottom: `1px solid ${theme.colors.border}`,
    paddingBottom: '10px',
    marginBottom: '20px',
    color: theme.colors.accent,
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    fontWeight: 700
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', 
    gap: '8px'
  },
  card: {
    background: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.card
  },
  imagePlaceholder: {
    height: '120px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem'
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  cardContent: { padding: '16px' },
  itemName: {
    margin: '0 0 8px 0',
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight
  },
  itemInfo: {
    color: theme.colors.textSecondary,
    fontSize: '0.85rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: theme.typography.body.lineHeight
  },

  // Modal Styles
  overlay: {
    position: 'fixed',
    inset: 0,
    background: theme.colors.overlay,
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  },
  modal: {
    background: theme.colors.background,
    width: '100%',
    maxWidth: '500px',
    borderRadius: theme.borderRadius.xl,
    padding: '32px',
    position: 'relative',
    border: `1px solid ${theme.colors.border}`,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: theme.shadows.modal
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: theme.colors.textSecondary,
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  modalTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '20px',
    color: theme.colors.textPrimary
  },
  scrollArea: { overflowY: 'auto', marginTop: '0px' },
  modalInfoText: { fontSize: '0.9rem', lineHeight: '1.5', color: theme.colors.textSecondary },
  statsRow: {
    display: 'flex', justifyContent: 'space-around',
    padding: '20px 0', borderBottom: '1px solid #eee'
  },
  statBox: { textAlign: 'center' },
  statVal: { fontSize: '1.1rem', fontWeight: 'bold' },
  statLabel: { fontSize: '0.75rem', color: theme.colors.textSecondary },
  modalSubtitle: { fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' },
  ingredientList: { paddingLeft: '20px', margin: 0, color: theme.colors.textSecondary },
  listItem: { marginBottom: '5px', fontSize: '0.95rem', textAlign:"left" },
  howToText: { fontSize: '0.95rem', lineHeight: '1.6', color: theme.colors.textSecondary },
  rdiGrid: { 
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
    fontSize: '0.85rem', padding: '10px', borderRadius: '8px', color: theme.colors.textSecondary
  },
  portionInfo: {
    padding: '12px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.accentLight,
    fontSize: '0.9rem',
    border: `1px solid rgba(59, 130, 246, 0.2)`
  }
};

export default SnacksPage;