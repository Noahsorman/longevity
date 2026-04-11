import React from 'react';
import { theme } from '../assets/themes';
import handStandPushuplvl0 from '../assets/images/HandstandPushupLvl0.png';

interface WorkoutVideo {
  name: string;
  url?: string;
  time?: number;
  image?: string
}

type WorkoutDatabase = Record<string, (WorkoutVideo)[]>;

const getYouTubeThumbnail = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
};

const WORKOUT_DATA: WorkoutDatabase = {
  "Strength": [
    { name: "Core (No equipment)", url: "https://youtu.be/FEoogWnZ04A?t=56", time: 8 },
    { name: "Core (No equipment)", url: "https://youtu.be/XgI_p8bKg78?t=91", time: 20 },
    { name: "Planck (No equipment)", url: "https://youtu.be/XU7vRXk1N64?t=90", time: 8 },
    { name: "Chest (No equipment)", url: "https://youtu.be/4Me_9MEEiZU?t=82", time: 6 },
    { name: "Chest (No equipment)", url: "https://youtu.be/BkS1-El_WlE?t=120", time: 8 },
    { name: "Legs (No equipment)", url: "https://youtu.be/G5nxGTFBauM?t=70", time: 8 },
    { name: "Legs (No equipment)", url: "https://youtu.be/wB9ukMeQfjU?t=59", time: 15 },
    { name: "Legs (No equipment)", url: "https://youtu.be/q7rCeOa_m58?t=61", time: 20 },
    { name: "Arms (Dumbbells)", url: "https://youtu.be/NOGSB5PU4lo?t=110", time: 8 },
    { name: "Back (Dumbbells)", url: "https://youtu.be/ifQgmbr18kk?t=62", time: 10 },
    { name: "Back (No equipment)", url: "https://youtu.be/QqZV3JEoOlc?t=55", time: 7 },
    { name: "Full body (Dumbbells)", url: "https://youtu.be/yUs-xrcqDpk?t=93", time: 10 },
    { name: "Handstand pushup level 0 (No equipment)", image: handStandPushuplvl0, time: 12 },
    { name: "L-sit (Rack,Bar)", url: "https://youtu.be/kwOGACG2DCQ?t=172", time: 6 },
    { name: "Muscle up (Bar,½ Bar)", url: "https://youtu.be/BVnhhlKfamw?t=146", time: 5 },
    { name: "Front lever (Bar,Education)", url: "https://youtu.be/SeIfKANM8rQ?t=145" },
    { name: "Handstand pushup (No equipment,Education)", url: "https://youtu.be/VKpIoRjV8nw?t=120" },
  ]
};

const WorkoutPage: React.FC<{}> = () => {
  const sortedCategories = WORKOUT_DATA

  const [selectedItem, setSelectedItem] = React.useState<WorkoutVideo | null>(null);

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.textPrimary
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={theme.typography.h1 as React.CSSProperties}>Workout Library</h1>
        </header>

        {Object.keys(sortedCategories).map(category => (
          <section key={category} style={{ marginBottom: '48px' }}>
            <h2 style={{
              ...theme.typography.h2 as React.CSSProperties,
              color: theme.colors.accent,
              borderBottom: `1px solid ${theme.colors.border}`,
              paddingBottom: '12px',
              marginBottom: '24px'
            }}>
              {category}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '8px'
            }}>
              {sortedCategories[category].map((video, idx) => (
                <a
                  key={idx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.colors.accentLight,
                    backgroundColor: theme.colors.cardBg,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.shadows.card,
                    textDecoration: 'none',
                    overflow: 'hidden',
                    display: 'block',
                    transition: 'transform 0.2s ease',
                  }}
                  onClick={ video.url ? undefined: () => setSelectedItem(video) }
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                    <img
                      src={video.url ? getYouTubeThumbnail(video.url) : video.image}
                      alt={video.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: theme.colors.overlay,
                      color: theme.colors.textPrimary,
                      padding: '4px 8px',
                      borderRadius: theme.borderRadius.sm,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: video.time ? 'block' : 'none'
                    }}>
                      {video.time} min
                    </span>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: theme.colors.accentLight,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {/* {category} */}
                    </div>
                    <div style={{ fontSize: '1.1rem', marginTop: '4px' }}>{video.name.split("(")[0]}</div>
                    <div style={{
                      display: "flex", gap: ".2rem", flexWrap: "wrap",
                    }}>
                      {(/\((.*)\)/g).exec(video.name)?.[1]?.split(",").map(p => (
                        <div key={p} style={{
                          color: '#94a3b8',
                          fontSize: '.7rem',
                          background: theme.colors.cardBg,
                          padding: '6px',
                          borderRadius: theme.borderRadius.md,
                          textAlign: 'center',
                          border: `1px solid ${theme.colors.border}`,
                          display: p === "No equipment" ? "none" : 'inline-block'
                        }}>{p.trim()}</div>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
      {/* Modal / Popup */}
      {selectedItem && (
        <div style={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

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

export default WorkoutPage;