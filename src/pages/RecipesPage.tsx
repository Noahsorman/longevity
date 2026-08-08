import React, { useState, useMemo } from 'react';
import { theme } from '../assets/themes';
import rawRecipes from '../assets/data/recipes.json';

// --- Types & Interfaces ---
type ProteinSourceType = 'Chicken' | 'Fish' | 'Beef' | 'Vegetarian';
type DishType = 'Batch' | 'Main' | 'Breakfast' | 'Snack' | 'Soup' | 'One-plate oven';

interface Recipe {
  id: string;
  title: string;
  image: string;
  proteinSource?: ProteinSourceType;
  dishType?: DishType[];
  prepTime?: string;
  servings: number;
  kcal?: number;
  ingredients: { name: string; amount: number; unit: string, title?:string }[];
  instructions: string[];
}

const recipes = rawRecipes as unknown as Recipe[];

export const RecipesPage: React.FC = () => {
  // --- Filter State ---
  const [selectedProteins, setSelectedProteins] = useState<ProteinSourceType[]>([]);
  const [selectedDishTypes, setSelectedDishTypes] = useState<DishType[]>([]);

  // --- Selected Recipe Modal State ---
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [addedRecipes, setAddedRecipes] = useState<string[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const toggleFilter = <T extends string>(
    item: T,
    selectedList: T[],
    setSelectedList: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (selectedList.includes(item)) {
      setSelectedList(selectedList.filter((i) => i !== item));
    } else {
      setSelectedList([...selectedList, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedProteins([]);
    setSelectedDishTypes([]);
  };

  // --- Filtering Logic ---
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesProtein =
        selectedProteins.length === 0 || (recipe.proteinSource && selectedProteins.includes(recipe.proteinSource));

      const matchesDishType =
        selectedDishTypes.length === 0 ||
        (recipe.dishType && selectedDishTypes.some(d => recipe.dishType?.includes(d)));

      return matchesProtein && matchesDishType;
    });
  }, [selectedProteins, selectedDishTypes]);

  const hasActiveFilters =
    selectedProteins.length > 0 ||
    selectedDishTypes.length > 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>Explore Recipes</h1>
        {hasActiveFilters && (
          <button style={styles.clearBtn} onClick={clearAllFilters}>
            Clear all filters
          </button>
        )}
      </header>

      {/* --- Filter Section --- */}
      <section style={styles.filterContainer}>
        {/* Protein Filter */}
        <div style={styles.filterGroup}>
          <h3 style={styles.filterGroupTitle}>Diet & Protein</h3>
          <div style={styles.checkboxList}>
            {(['Chicken', 'Fish', 'Beef', 'Vegetarian'] as ProteinSourceType[]).map((protein) => (
              <label key={protein} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedProteins.includes(protein)}
                  onChange={() => toggleFilter(protein, selectedProteins, setSelectedProteins)}
                  style={styles.checkbox}
                />
                {protein}
              </label>
            ))}
          </div>
        </div>

        {/* Dish Type Filter */}
        <div style={styles.filterGroup}>
          <h3 style={styles.filterGroupTitle}>Dish Type</h3>
          <div style={styles.checkboxList}>
            {(['Batch', 'Main', 'Breakfast', 'Snack', 'Soup', 'One-plate oven'] as DishType[]).map((type) => (
              <label key={type} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedDishTypes.includes(type)}
                  onChange={() => toggleFilter(type, selectedDishTypes, setSelectedDishTypes)}
                  style={styles.checkbox}
                />
                {type === 'One-plate oven' ? 'One-plate Oven' : type}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          Chosen recipes: {addedRecipes.length}
        </div>
        <button
          style={{ padding: '8px 16px', marginTop: '12px', backgroundColor: theme.colors.accent, color: 'white', border: 'none', borderRadius: theme.borderRadius.sm, cursor: 'pointer' }}
          onClick={() => {
            setShowShoppingList(true);
          }}>Shopping list </button>
      </section>

      {/* --- Recipes Grid --- */}
      {filteredRecipes.length > 0 ? (
        <div style={styles.recipeGrid}>
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.title}
              style={styles.card}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div style={styles.imageContainer}>
                <img src={(/^(http|data:)/g).test(recipe.image) ? recipe.image : `src/assets/images/${recipe.image}`} alt={recipe.title} style={styles.image} />
                <div style={{
                  position: 'absolute', bottom: '10px', right: '10px'
                  , backgroundColor: addedRecipes.includes(recipe.title) ? 'hsla(0,100%,50%,0.7)' : 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px'
                }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (addedRecipes.includes(recipe.title)) {
                      setAddedRecipes(addedRecipes.filter(title => title !== recipe.title));
                    } else {
                      setAddedRecipes([...addedRecipes, recipe.title]);
                    }
                  }}
                >{addedRecipes.includes(recipe.title) ? 'Remove' : '+'}</div>
              </div>
              <div style={styles.cardContent}>
                <h2 style={styles.cardTitle}>{recipe.title}</h2>
                <div style={styles.tagGroup}>
                  {recipe.proteinSource &&
                    <span style={styles.tag}>{recipe.proteinSource}</span>
                  }
                  {recipe.dishType &&
                    recipe.dishType.map(d => (
                      <span style={styles.tag}>{d}</span>
                    ))
                  }
                </div>
                <div style={styles.cardMeta}>
                  {recipe.prepTime && <span>⏱️ {recipe.prepTime}</span>}
                  {recipe.kcal && <span>🔥 {recipe.kcal} kcal</span>}
                  {recipe.servings && <span>🍽 {recipe.servings}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>No recipes match your selected filters.</p>
          <button style={styles.clearBtn} onClick={clearAllFilters}>
            Reset filters
          </button>
        </div>
      )}

      {/* --- Recipe Detail Modal --- */}
      {selectedRecipe && (
        <div style={styles.modalOverlay} onClick={() => setSelectedRecipe(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeBtn}
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close recipe details"
            >
              ✕
            </button>

            <div style={styles.modalHero}>
              <img src={selectedRecipe.image} alt={selectedRecipe.title} style={styles.modalImage} />
            </div>

            <div style={styles.modalBody}>
              <h2 style={styles.modalTitle}>{selectedRecipe.title}</h2>

              <div style={styles.tagGroup}>
                {selectedRecipe.proteinSource &&
                  <span style={styles.tag}>{selectedRecipe.proteinSource}</span>
                }

                {selectedRecipe.dishType && <span style={styles.tag}>{selectedRecipe.dishType}</span>}
              </div>

              <div style={styles.modalMetaRow}>
                {selectedRecipe.prepTime && <div><strong>Prep:</strong> {selectedRecipe.prepTime}</div>}
                {selectedRecipe.kcal && <div><strong>Energy:</strong> {selectedRecipe.kcal} kcal</div>}
                {selectedRecipe.servings && <div><strong>Servings:</strong> {selectedRecipe.servings}</div>}
              </div>

              <hr style={styles.divider} />

              {/* Ingredients */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>Ingredients</h3>
                <ul style={styles.ingredientList}>
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    if(ing.title) return <h2>{ing.title}</h2>
                    return <li key={idx} style={styles.ingredientItem}>
                      <span style={styles.bullet}>•</span> {ing.amount} {ing.unit} {ing.name}
                    </li>
                  })}
                </ul>
              </div>

              {/* Instructions */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>Instructions</h3>
                <ol style={styles.instructionList}>
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} style={styles.instructionItem}>
                      <span style={styles.stepNumber}>{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        showShoppingList &&
        <div style={{ ...styles.modalOverlay, padding: '0', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div style={{ ...styles.modalContent, maxWidth: '500px', width: '90%', padding: "25px" }}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowShoppingList(false)}
              aria-label="Close shopping list"
            >
              ✕
            </button>
            <div style={{ padding: '24px' }}></div>
            <h2 style={styles.modalTitle}>Shopping List</h2>
            <ul style={styles.ingredientList}>
              {recipes.filter(r => addedRecipes.includes(r.title)).flatMap(r => r.ingredients).map((ing, idx) => (
                <li key={idx} style={styles.ingredientItem}>
                  <span style={styles.bullet}>•</span> {ing.amount} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    </div>
  );
};

// --- Styling with theme mapping ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 20px',
    minHeight: '100vh',
    textAlign: 'left',
    position: 'relative',
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  pageTitle: {
    ...theme.typography.h1,
    margin: 0,
    color: theme.colors.textPrimary,
  },
  clearBtn: {
    background: 'transparent',
    border: `1px solid ${theme.colors.border}`,
    padding: '8px 16px',
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    padding: '24px',
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    marginBottom: '32px',
    boxShadow: theme.shadows.card,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  filterGroupTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    margin: 0,
    color: theme.colors.accentLight,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: theme.typography.body.fontSize,
    cursor: 'pointer',
    userSelect: 'none',
    color: theme.colors.textPrimary,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: theme.colors.accent,
    cursor: 'pointer',
  },
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadows.card,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: theme.colors.overlay,
    color: theme.colors.textPrimary,
    padding: '4px 10px',
    borderRadius: theme.borderRadius.sm,
    fontSize: '0.75rem',
    fontWeight: 600,
    border: `1px solid ${theme.colors.border}`,
    backdropFilter: 'blur(4px)',
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardTitle: {
    ...theme.typography.h2,
    margin: '0 0 12px 0',
    color: theme.colors.textPrimary,
  },
  tagGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  tag: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: theme.colors.accentLight,
    border: `1px solid rgba(59, 130, 246, 0.3)`,
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: theme.borderRadius.sm,
    fontWeight: 500,
  },
  cardMeta: {
    marginTop: 'auto',
    display: 'flex',
    gap: "1.5em",
    fontSize: '0.85rem',
    color: theme.colors.textSecondary,
    borderTop: `1px solid ${theme.colors.border}`,
    paddingTop: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 0',
    color: theme.colors.textSecondary,
  },

  // --- Modal Specific Styles ---
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
    backdropFilter: 'blur(6px)',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.xl,
    maxWidth: '650px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: theme.shadows.modal,
    color: theme.colors.textPrimary,
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 10,
    background: theme.colors.overlay,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textPrimary,
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  modalHero: {
    position: 'relative',
    width: '100%',
    height: '260px',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalCategoryBadge: {
    position: 'absolute',
    bottom: '16px',
    left: '24px',
    backgroundColor: theme.colors.overlay,
    color: theme.colors.textPrimary,
    padding: '6px 14px',
    borderRadius: theme.borderRadius.sm,
    fontSize: '0.85rem',
    fontWeight: 600,
    border: `1px solid ${theme.colors.border}`,
  },
  modalBody: {
    padding: '28px 24px',
  },
  modalTitle: {
    ...theme.typography.h1,
    fontSize: '1.8rem',
    margin: '0 0 12px 0',
    color: theme.colors.textPrimary,
  },
  modalMetaRow: {
    display: 'flex',
    gap: '24px',
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: '20px',
  },
  divider: {
    border: 'none',
    borderTop: `1px solid ${theme.colors.border}`,
    margin: '20px 0',
  },
  modalSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: theme.colors.accentLight,
    marginBottom: '12px',
  },
  ingredientList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ingredientItem: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  bullet: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  instructionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  instructionItem: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
    display: 'flex',
    gap: '12px',
    lineHeight: '1.5',
  },
  stepNumber: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    color: theme.colors.accent,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
};