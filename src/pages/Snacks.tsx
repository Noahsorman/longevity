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
    carbs?: number;
  }
  rdi?: {
    rdi?: Record<string, number | undefined>;
  }
  info?: string;
  ingredients?: string;
  howTo?: string;
}

type FoodDatabase = Record<string, Ingredient[]>;

const SnacksPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const FOOD_DATABASE: FoodDatabase = FOOD_DATABASE_IMP as FoodDatabase;

  return (
    <div style={styles.container} id="top"
    >
      <header style={styles.header}>
        <h1 style={styles.title}>Snacks Library</h1>
        <h2 style={{ marginTop: "1.2rem" }}>Categories</h2>
        <ol>
          {Object.entries(FOOD_DATABASE).map(([category]) => (
            <li key={category} style={{ ...styles.categoryTitle, textAlign: "left", cursor: "pointer", color: theme.colors.textPrimary }}
              onClick={() => {
                document.getElementById(category)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >{category}</li>
          ))}
        </ol>
      </header>

      {Object.entries(FOOD_DATABASE).map(([category, items]) => (
        <section key={category} style={styles.section} id={category}>
          <h2 style={styles.categoryTitle}>{category}</h2>
          <div style={styles.grid}>
            {items.map((item) => (
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
      ))}

      {/* Modal / Popup */}
      {selectedItem && (
        <div style={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
            <h2 style={styles.modalTitle}>{selectedItem.name}</h2>
            {
              false && selectedItem.stats &&
              <div style={styles.statsRow}>
                <Stat label="Kcal" val={selectedItem.stats.kcal} />
                <Stat label="Protein" val={selectedItem.stats.protein} unit="g" />
                <Stat label="Fiber" val={selectedItem.stats.fiber} unit="g" />
                <Stat label="Fat" val={selectedItem.stats.fat} unit="g" />
              </div>
            }
            <div style={styles.modalBody}>
              <p style={styles.fullInfo}>{selectedItem.info}</p>
              {
                selectedItem.portion &&
                <p style={styles.portionInfo}><strong>Standard Portion:</strong> {selectedItem.portion}</p>
              }
            </div>
            {
              selectedItem.ingredients &&
              <ul style={{ textAlign: "left" }}>
                <h3 style={styles.modalSubtitle}>Ingredients</h3>
                {selectedItem.ingredients.split(/\n/).map((line, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{line}</li>
                ))
                }
              </ul>
            }
            {
              selectedItem.howTo &&
              <div>
                <p style={styles.fullInfo}>{selectedItem.howTo}</p>
              </div>
            }
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
    fontFamily: theme.typography.fontFamily,
    position: 'relative'
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
    margin: '0 0 4px 0',
    fontSize: '0.85rem', // Sänkt fontstorlek för att undvika fula radbrytningar
    fontWeight: theme.typography.h2.fontWeight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis' // Lägger till ... om namnet är för långt
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
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '24px'
  },
  statBox: {
    background: theme.colors.cardBg,
    padding: '12px',
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
    border: `1px solid ${theme.colors.border}`
  },
  statVal: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: theme.colors.accent
  },
  statLabel: {
    fontSize: '0.7rem',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase'
  },
  modalBody: {
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.textPrimary
  },
  fullInfo: { marginBottom: '20px' },
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