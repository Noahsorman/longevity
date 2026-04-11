import React, { useState } from 'react';
import BREAKFAST_DATA_IMP from '../assets/data/breakfasts.json';
import { theme } from '../assets/themes';

interface Breakfast {
  name: string;
  ingredients: string;
  howTo: string;
  info: string;
  image: string,
  stats?: {
    kcal: number;
    protein: number;
    fiber: number;
    fat: number;
    carbs: number;
  };
  rdi?: Record<string, number | undefined>;
}

const WEEKDAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

const BreakfastPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Breakfast | null>(null);
  const breakfasts: Breakfast[] = BREAKFAST_DATA_IMP as Breakfast[];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Frukost</h1>
      </header>

      <div style={styles.verticalList}>
        {WEEKDAYS.map((day, index) => {
          // Vi roterar frukostarna om listan är kortare än 7 dagar
          const breakfast = breakfasts[
            ([2,4]).includes(index) ? 0 : 
            ([0]).includes(index) ? 1 : 
            ([1,3]).includes(index) ? 2 : 
            3
          ];
          
          return (
            <div 
              key={day} 
              style={styles.dayRow} 
              onClick={() => setSelectedItem(breakfast)}
            >
              <div style={styles.dayLabel}>
                <span style={styles.dayName}>{day}</span>
              </div>
              
              <div style={styles.card}>                
                <div style={styles.cardContent}>
                  <div style={styles.imagePlaceholder}>
                    {breakfast.image ? <img src={breakfast.image} alt={breakfast.name} style={styles.img} /> : <span>🥗</span>}
                  </div>
                  <h3 style={styles.itemName}>{breakfast.name}</h3>
                  <p style={styles.itemInfo}>{breakfast.info.substring(0, 80)}...</p>
                </div>
                <div style={styles.chevron}>→</div>
              </div>
            </div>
          );
        })}
      </div>

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

            <div style={styles.scrollArea}>
              <h3 style={styles.modalSubtitle}>Ingredienser</h3>
              <ul style={styles.ingredientList}>
                {selectedItem.ingredients.split('\n').map((line, idx) => {
                  if(line.indexOf("#") == 0)
                    return <h4 key={idx} style={{marginTop: "1.5rem", color: theme.colors.accentLight}}>{line.replace("#", "")}</h4>
                  return <li key={idx} style={styles.listItem}>{line}</li>
                })}
              </ul>

              <h3 style={styles.modalSubtitle}>Instruktioner</h3>
              <ol style={styles.ingredientList}>
                {selectedItem.howTo.split('\n').map((line, idx) => (
                  <li key={idx} style={styles.listItem}>{line}</li>
                ))}
              </ol>
              
              {selectedItem.rdi && (
                <div style={styles.rdiSection}>
                   <h3 style={styles.modalSubtitle}>Highlights (% av RDI)</h3>
                   <div style={styles.rdiGrid}>
                      {Object.entries(selectedItem.rdi).map(([key, val]) => (
                        <div key={key} style={styles.rdiItem}>
                          <strong>{key}:</strong> {val}%
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
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
    maxWidth: '800px',
    margin: '0 auto',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily
  },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2rem', marginBottom: '10px', color: theme.colors.textPrimary },
  subtitle: { color: theme.colors.textSecondary, fontSize: '1.1rem' },
  verticalList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  dayRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer'
  },
  dayLabel: {
    width: '100px',
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    fontSize: '0.9rem',
    textTransform: 'uppercase'
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: '12px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: `1px solid ${theme.colors.border || '#eee'}`
  },
  itemName: { margin: 0, fontSize: '1.1rem' },
  itemInfo: { margin: '5px 0 0', fontSize: '0.85rem', color: theme.colors.textSecondary },
  chevron: { fontSize: '1.2rem', color: theme.colors.textPrimary, marginTop: "30%" },
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
  imagePlaceholder: {
    height: '120px',
    background: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    marginBottom: "15px",
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', },
};

export default BreakfastPage;