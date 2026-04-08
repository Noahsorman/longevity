import React, { useMemo, useState } from 'react';
import FOOD_DATABASE_IMP from '../assets/ingredients.json';
import { theme } from '../assets/themes';
// --- Types ---
interface Ingredient {
  id: string;
  name: string;
  image: string;
  portion?: string | number; // Added portion
  pantry?: boolean; // Indicates if the ingredient is in the pantry
  stats?: {
    kcal?: number;
    protein?: number;
    fiber?: number;
    fat?: number;
    carbs?: number;
  }
  rdi?: Record<string, number | undefined>;
  info?: string;
  ingredients?: string;
  howTo?: string;
}

interface SelectedItem extends Ingredient {
  category: string;
}

type FoodDatabase = Record<string, Ingredient[]>;

const FOOD_DATABASE: FoodDatabase = FOOD_DATABASE_IMP as FoodDatabase;

// --- Helper: Scale Portion Numbers ---
const scalePortion = (portion: string | number | undefined, multiplier: number): React.ReactNode => {
  if (portion === undefined) return undefined;
  if (typeof portion === 'number') return <span style={styles.badge}>{(portion * multiplier).toString()}</span>;

  // Map for Unicode fractions
  const fracMap: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75 };
  const revFracMap: Record<number, string> = { 0.5: '½', 0.25: '¼', 0.75: '¾' };

  // Regex to find digits/decimals OR the special fraction characters
  const numRegex = /(\d+(\.\d+)?|[½¼¾])/g;

  return <span style={styles.badge}>{portion.replace(numRegex, (match) => {
    let val = fracMap[match] !== undefined ? fracMap[match] : parseFloat(match);
    let result = val * multiplier;

    // Optional: convert back to fraction if it ends in .5, .25, .75
    const decimal = result % 1;
    const whole = Math.floor(result);
    if (revFracMap[decimal]) {
      return (whole > 0 ? whole : '') + revFracMap[decimal];
    }

    return result.toString();
  })}</span>;
};

const MealRandomizer: React.FC = () => {
  const [meals, setMeals] = useState<SelectedItem[][]>(
    localStorage.getItem('longevity-weeklyMeals')
      ? JSON.parse(localStorage.getItem('longevity-weeklyMeals') as string)
      : []
  );
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const generateMeals = () => {
    if (localStorage.getItem('longevity-weeklyMeals')) {
      if (!confirm("You already have a meal plan saved. Do you want to overwrite it?"))
        return;
    }

    const newMeals = Array.from({ length: 3 }, () => {
      return Object.keys(FOOD_DATABASE).map(category => {
        const list = FOOD_DATABASE[category];
        const randomItem = list[Math.floor(Math.random() * list.length)];
        return { ...randomItem, category };
      });
    });
    setMeals(newMeals);
    localStorage.setItem('longevity-weeklyMeals', JSON.stringify(meals));
  };

  const shoppingList = useMemo(() => {
    const summary: Record<string, {
      count: number;
      portion?: string | number;
      category: string;
      pantry?: boolean
    }> = {};

    // 1. Flatten meals and aggregate data
    meals.flat().forEach(item => {
      if (!summary[item.name]) {
        summary[item.name] = {
          count: 0,
          portion: item.portion,
          category: item.category,
          pantry: item.pantry
        };
      }
      summary[item.name].count += 1;
    });

    // 2. Define Category Priority
    const priority = ["Greens", "Colored Greens", "Toppings", "Core Protein"];

    // 3. Sort logic
    return Object.entries(summary).sort((a, b) => {
      const itemA = a[1];
      const itemB = b[1];

      // Priority 1: Pantry items always go to the absolute bottom
      if (itemA.pantry !== itemB.pantry) {
        return itemA.pantry ? 1 : -1;
      }

      // Priority 2: Check defined category order
      const idxA = priority.indexOf(itemA.category);
      const idxB = priority.indexOf(itemB.category);

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;

      // Priority 3: Alphabetical by category for everything else
      if (itemA.category !== itemB.category) {
        return itemA.category.localeCompare(itemB.category);
      }

      // Priority 4: Alphabetical by ingredient name
      return a[0].localeCompare(b[0]);
    });
  }, [meals]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Weekly Lunch Planner</h1>
          <button style={styles.button} onClick={generateMeals}>
            Generate Lunch Boxes
          </button>
        </header>

        {meals.length > 0 && (
          <>
            <div style={styles.mealGrid}>
              {meals.map((meal, idx) => (
                <div key={idx} style={styles.mealCard}>
                  <h2 style={styles.mealTitle}>Box #{idx + 1}</h2>
                  <div style={styles.ingredientList}>
                    {meal.map((item) => (
                      <div key={item.category} style={styles.ingredientRow}
                        onClick={_ => setSelectedItem(item)}
                      >
                        <img src={item.image} alt={item.name} style={styles.img} />
                        <div>
                          {/* <div style={styles.categoryLabel}>{item.category}</div> */}
                          <div style={styles.itemName}>{item.name}</div>
                          {item.portion && <div style={styles.portionLabel}>{item.portion}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <section style={styles.shoppingSection}>
              <h2 style={styles.shoppingTitle}>🛒 Shopping List</h2>
              <div style={{ position: "absolute", top: "1rem", right: "2rem" }}
                onClick={e => {
                  let text = "";
                  const nextEl = e.currentTarget.nextElementSibling;
                  nextEl?.querySelectorAll("div").forEach(div => {
                    const name = div.firstChild?.textContent || "";
                    const portion = div.lastChild?.textContent || "";
                    if (!portion || portion === name) return;
                    text += `${name} (${portion})\n`;
                  });

                  navigator.clipboard.writeText(text);
                }}
              >
                <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#cecece" fillRule="evenodd" clipRule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19. five L6 19. five L6 9Z" />
                </svg>
              </div>
              <div style={styles.shoppingGrid}>
                {shoppingList.map(([name, data]) => (
                  <div key={name} style={styles.shoppingItem}>
                    <span>{name}</span>
                    {scalePortion(data.portion, data.count)}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      {/* Modal / Popup */}
      {selectedItem && (
        <div style={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
            <h2 style={styles.modalTitle}>{selectedItem.name}</h2>
            {
              selectedItem.stats &&
              <div style={styles.statsRow}>
                <Stat label="Kcal" val={selectedItem.stats.kcal} />
                <Stat label="Protein" val={selectedItem.stats.protein} unit="g" />
                <Stat label="Fiber" val={selectedItem.stats.fiber} unit="g" />
                <Stat label="Fat" val={selectedItem.stats.fat} unit="g" />
              </div>
            }
            {
              selectedItem.rdi &&
              <>
                <div style={styles.rdiText}><strong>RDI</strong></div>
                <div style={styles.statsRow}>
                  {
                    Object.keys(selectedItem.rdi).map(key => (
                      <Stat key={key} label={key} val={selectedItem.rdi ? selectedItem.rdi[key] : 0} unit="%" />
                    ))
                  }
                </div>
              </>
            }
            <div style={styles.modalBody}>
              <p style={styles.fullInfo}>{selectedItem.info}</p>
              {
                selectedItem.portion &&
                <p style={styles.portionInfo}><strong>Standard Portion:</strong> {selectedItem.portion}</p>
              }
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

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textPrimary
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    marginBottom: '20px',
    color: '#ffffff',
    letterSpacing: '-0.025em',
    lineHeight: "normal"
  },
  button: {
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    border: 'none',
    padding: '12px 32px',
    borderRadius: theme.borderRadius.md,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: `0 4px 14px 0 rgba(59, 130, 246, 0.39)`, // Matchar accent
    transition: 'all 0.2s ease'
  },
  mealGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '48px'
  },
  mealCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.xl,
    padding: '24px',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.card
  },
  mealTitle: {
    fontSize: '1.25rem',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: '20px',
    color: theme.colors.accentLight,
    borderBottom: `1px solid ${theme.colors.border}`,
    paddingBottom: '12px',
    fontWeight: 700
  },
  ingredientList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  ingredientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  img: {
    width: '54px',
    height: '54px',
    borderRadius: theme.borderRadius.sm,
    objectFit: 'cover',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${theme.colors.border}`
  },
  categoryLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: theme.colors.textSecondary
  },
  itemName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 600,
    color: theme.colors.textPrimary
  },
  portionLabel: {
    fontSize: '0.8rem',
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: '2px'
  },
  shoppingSection: {
    backgroundColor: theme.colors.cardBg,
    padding: '32px',
    borderRadius: theme.borderRadius.xl,
    borderLeft: `6px solid ${theme.colors.accent}`,
    boxShadow: theme.shadows.modal,
    position: 'relative',
  },
  shoppingTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '24px',
    color: '#ffffff'
  },
  shoppingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  shoppingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`
  },
  categorySubLabel: {
    fontSize: '0.6rem',
    color: theme.colors.accentLight,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Subtil blå overlay
    color: theme.colors.accentLight,
    padding: '4px 12px',
    borderRadius: theme.borderRadius.sm,
    fontSize: '0.85rem',
    fontWeight: 700,
    border: `1px solid ${theme.colors.accent}`
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
  },
  rdiText: {
    padding: '2px',
    //background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.accentLight,
    fontSize: '0.7rem',
    fontStyle: 'italic',
    borderTop: `1px solid rgba(59, 130, 246, 0.2)`
  }
};

export default MealRandomizer;