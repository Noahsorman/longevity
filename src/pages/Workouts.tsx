import React from 'react';
import { theme } from '../assets/themes';

interface WorkoutVideo {
  name: string;
  url: string;
  time: string;
}

type WorkoutDatabase = Record<string, WorkoutVideo[]>;

const getYouTubeThumbnail = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
};

const WORKOUT_DATA: WorkoutDatabase = {
  "Strength": [
    { name: "Core (Short, no equipment)", url: "https://youtu.be/FEoogWnZ04A?t=56", time: "8 min" },
    { name: "Core (Long, no equipment)", url: "https://youtu.be/XgI_p8bKg78?t=91", time: "20 min" },
    { name: "Planck (Short, no equipment)", url: "https://youtu.be/XU7vRXk1N64?t=90", time: "8 min" },
    { name: "Chest (Short, no equipment)", url: "https://youtu.be/4Me_9MEEiZU?t=82", time: "6 min" },
    { name: "Chest (Short, no equipment)", url: "https://youtu.be/BkS1-El_WlE?t=120", time: "8 min" },
    { name: "Legs (Short, no equipment)", url: "https://youtu.be/G5nxGTFBauM?t=70", time: "8 min" },
    { name: "Legs (Mid, no equipment)", url: "https://youtu.be/wB9ukMeQfjU?t=59", time: "15 min" },
    { name: "Legs (Long, no equipment)", url: "https://youtu.be/q7rCeOa_m58?t=61", time: "20 min" },
    { name: "Arms (short, dumbbells)", url: "https://youtu.be/NOGSB5PU4lo?t=110", time: "8 min" },
    { name: "Back (short, dumbbells)", url: "https://youtu.be/ifQgmbr18kk?t=62", time: "10 min" },
    { name: "Back (short, no equipment)", url: "https://youtu.be/QqZV3JEoOlc?t=55", time: "7 min" },
  ]
};

const WorkoutPage: React.FC<{ }> = () => {
  const sortedCategories = WORKOUT_DATA

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
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '24px' 
            }}>
              {sortedCategories[category].map((video, idx) => (
                <a 
                  key={idx} 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    backgroundColor: theme.colors.cardBg, 
                    borderRadius: theme.borderRadius.lg, 
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.shadows.card,
                    textDecoration: 'none', 
                    overflow: 'hidden',
                    display: 'block',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                    <img 
                      src={getYouTubeThumbnail(video.url)} 
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
                      fontWeight: 700
                    }}>
                      {video.time}
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
                    <div style={{display:"flex", gap: ".4rem", flexWrap: "wrap",
                    }}>
                      {(/\((.*)\)/g).exec(video.name)?.[1]?.split(",").map(p => (
                        <div key={p} style={{ 
                          color: '#94a3b8', 
                          fontSize: '0.8rem',
                          background: theme.colors.cardBg,
                          padding: '12px',
                          borderRadius: theme.borderRadius.md,
                          textAlign: 'center',
                          border: `1px solid ${theme.colors.border}`
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
    </div>
  );
};

export default WorkoutPage;