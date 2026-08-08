import { theme } from "../assets/themes";

import { useState, useEffect, useMemo } from 'react';
import { WORKOUT_DATA } from '../assets/data/workout';
import type { Equipment, WorkoutVideo, MuscleGroup } from '../assets/data/workout';

interface WorkoutEntry {
  id: string;
  date: string;
  muscleGroup: string;
  duration: number;
}

const MUSCLE_GROUPS: MuscleGroup[] = ["Core" , "Chest" , "Back" , "Legs", "Shoulders" , "Cardio", "Stretch"] as const;
const DURATION_OPTIONS = [10, 15, 20, 30, 45] as const;
const EQUIPMENT_OPTIONS: Equipment[] = ['Dumbbells', 'Bar', 'Rack', '½ Bar'];

// Converts a Date object to a strictly LOCAL 'YYYY-MM-DD' string
const getLocalDateStr = (d: Date): string => {
  const offset = d.getTimezoneOffset() * 60000; // Offset in milliseconds
  return new Date(d.getTime() - offset).toISOString().split("T")[0];
};

export default function WorkoutTracker() {
  const [history, setHistory] = useState<WorkoutEntry[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [trainedGroups, setTrainedGroups] = useState<MuscleGroup[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | "custom">(20);
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(EQUIPMENT_OPTIONS);
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateStr(new Date()));

  const getDurationBucket = (timeInMinutes: number): number => {
    if (timeInMinutes <= 10) return 10;
    if (timeInMinutes <= 15) return 15;
    if (timeInMinutes <= 20) return 20;
    if (timeInMinutes <= 30) return 30;
    return 45;
  };

  const canPerformWorkout = (workout: WorkoutVideo, userEquipment: Equipment[]) => {
    return workout.equipment.every(eq => userEquipment.includes(eq));
  };

  const availableDurations = useMemo(() => {
    if (!selectedGroup) return [];

    const validWorkouts = WORKOUT_DATA["Strength"].filter(w =>
      w.muscleGroups.includes(selectedGroup as MuscleGroup) &&
      w.time !== undefined &&
      canPerformWorkout(w, selectedEquipment) // <-- Equipment filter added
    );

    console.log("Running vavailableDurations", { selectedGroup, selectedEquipment, validWorkouts, f: WORKOUT_DATA["Strength"] })

    const activeBuckets = new Set(validWorkouts.map(w => getDurationBucket(w.time!)));
    return DURATION_OPTIONS.filter(option => activeBuckets.has(option));
  }, [selectedGroup, selectedEquipment]); // <-- Re-run when equipment changes

  // 2. Safety check: If you switch muscle groups and the old selectedDuration 
  // is no longer available, automatically select the first available one.
  useEffect(() => {
    if (selectedDuration !== "custom" && availableDurations.length > 0 && !availableDurations.includes(selectedDuration as any)) {
      setSelectedDuration(availableDurations[0]);
    }
  }, [availableDurations, selectedDuration]);

  useEffect(() => {
    setTrainedGroups(selectedGroup ? [selectedGroup] : []);
  }, [selectedGroup]);

  useEffect(() => {
    // Add "selectedDuration !== 'custom'" to the condition
    if (
      selectedDuration !== 'custom' &&
      availableDurations.length > 0 &&
      !availableDurations.includes(selectedDuration as any)
    ) {
      setSelectedDuration(availableDurations[0]);
    }
  }, [availableDurations, selectedDuration]);

  // 1. Load from localStorage
  // 1. Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('longevity_workout_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }

    const savedEquipment = localStorage.getItem('longevity_user_equipment');
    if (savedEquipment) {
      try { setSelectedEquipment(JSON.parse(savedEquipment)); } catch (e) { console.error(e); }
    }

    setIsLoaded(true);
  }, []);

  // 2. Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('longevity_workout_history', JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // Generate last 7 days array
  const last14Days = useMemo(() => {
    const days: Date[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('longevity_user_equipment', JSON.stringify(selectedEquipment));
    }
  }, [selectedEquipment, isLoaded]);

  // 3. Analytics & Sorting Engine
  // 3. Analytics & Sorting Engine (4-Day Cycle)
  const sortedStats = useMemo(() => {
    const now = new Date().getTime();

    const stats = MUSCLE_GROUPS.map(group => {
      // Sort all workouts for this group from newest to oldest
      const groupWorkouts = history
        .filter(w => w.muscleGroup === group)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const lastWorkout = groupWorkouts.length > 0
        ? new Date(groupWorkouts[0].date).getTime()
        : null;

      const daysAgo = lastWorkout
        ? Math.floor((now - lastWorkout) / (1000 * 60 * 60 * 24))
        : null;

      // 1. Determine Status based on days elapsed
      let urgency: 'recovery' | 'blue' | 'yellow' | 'red' = 'red';

      if (daysAgo !== null && group === "Stretch") {
        if (daysAgo <= 0) urgency = 'recovery';      // Day 0–2: Cooldown
        else if (daysAgo <= 1) urgency = 'blue';     // Day 3–4: Sweet spot!
        else if (daysAgo <= 2) urgency = 'yellow';  // Day 5: Urgent
        else urgency = 'red';                        // Day 6+: Streak failed
      } else if (daysAgo !== null && group === "Cardio") {
        if (daysAgo <= 1) urgency = 'recovery';      // Day 0–2: Cooldown
        else if (daysAgo <= 3) urgency = 'blue';     // Day 3–4: Sweet spot!
        else if (daysAgo === 4) urgency = 'yellow';  // Day 5: Urgent
        else urgency = 'red';                        // Day 6+: Streak failed
      }else if (daysAgo !== null) {
        if (daysAgo <= 2) urgency = 'recovery';      // Day 0–2: Cooldown
        else if (daysAgo <= 4) urgency = 'blue';     // Day 3–4: Sweet spot!
        else if (daysAgo === 5) urgency = 'yellow';  // Day 5: Urgent
        else urgency = 'red';                        // Day 6+: Streak failed
      }

      // 2. Streak Calculation (Consecutive workouts with <= 5 days gap)
      let streak = 0;
      if (groupWorkouts.length > 0 && (daysAgo === null || daysAgo < 6)) {
        streak = 1; // Current streak is alive!
        for (let i = 0; i < groupWorkouts.length - 1; i++) {
          const currentWkTime = new Date(groupWorkouts[i].date).getTime();
          const prevWkTime = new Date(groupWorkouts[i + 1].date).getTime();
          const gapInDays = Math.floor((currentWkTime - prevWkTime) / (1000 * 60 * 60 * 24));

          if (gapInDays <= 5) {
            streak++; // Successfully trained within the 5-day limit
          } else {
            break; // Gap was 6+ days, older streak chain is broken
          }
        }
      }

      return {
        group,
        lastWorkout,
        urgency,
        streak,
        daysAgo
      };
    });

    // Sort: Never trained / Oldest timestamps (Urgent & Failed) come first.
    // Cooldown / Recently trained items automatically move to the bottom.
    return stats.sort((a, b) => {
      if (a.lastWorkout === null && b.lastWorkout === null) return 0;
      if (a.lastWorkout === null) return -1;
      if (b.lastWorkout === null) return 1;
      return a.lastWorkout - b.lastWorkout;
    });
  }, [history]);

  // Default selection to the #1 most urgent item in the sorted list
  useEffect(() => {
    if (sortedStats.length > 0 && !selectedGroup) {
      setSelectedGroup(sortedStats[0].group);
    }
  }, [sortedStats, selectedGroup]);

  // 4. Register Workout
  const handleRegisterWorkout = () => {
    console.log({ history })
    const newEntrys: WorkoutEntry[] = trainedGroups.map(tg => {
      return {
        id: Date.now().toString(),
        date: selectedDate,
        muscleGroup: tg,
        duration: selectedDuration !== 'custom' ? selectedDuration : customMinutes,
      } as WorkoutEntry
    }).filter(n => !history.some(h => h.date === n.date && h.muscleGroup === n.muscleGroup));
    setHistory(prev => [...newEntrys, ...prev]);
  };

  // 2. Start Workout filtered by Muscle Group, Duration Bucket AND Equipment
  const handleStartWorkout = (groupToStart: MuscleGroup) => {
    const matchingWorkouts = WORKOUT_DATA["Strength"].filter(w =>
      w.muscleGroups.includes(groupToStart as MuscleGroup) &&
      w.time &&
      getDurationBucket(w.time) === selectedDuration &&
      canPerformWorkout(w, selectedEquipment) // <-- Equipment filter added
    );

    if (matchingWorkouts.length === 0) return;

    const workout = matchingWorkouts[Math.floor(Math.random() * matchingWorkouts.length)];
    if (workout?.url) {
      window.open(workout.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleToggleEquipment = (item: Equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(item)
        ? prev.filter(eq => eq !== item)
        : [...prev, item]
    );
  };

  const handleDeleteWorkout = (id: string) => {
    setHistory(prev => prev.filter(w => w.id !== id));
  };

  // Type-safe Styles Object using "as const"
  const styles = {
    container: {
      backgroundColor: theme.colors.background,
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.fontFamily,
      minHeight: '100vh',
      padding: '2rem 1rem',
      boxSizing: 'border-box',
    },
    wrapper: {
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    card: (urgency: 'red' | 'yellow' | 'blue' | 'recovery') => ( {
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.borderRadius.lg,
      padding: '1.25rem 1.5rem',
      border: `1px solid ${theme.colors.urgency[`${urgency}`]}`,
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: urgency === "recovery" ? .6 : 1
    } as const),
    heroCard: (urgency: 'red' | 'yellow' | 'blue' | 'recovery') => ( {
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.borderRadius.xl,
      padding: '1.75rem',
      border: `2px solid ${theme.colors.urgency[`${urgency}`]}`,
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      cursor: 'default',
      transition: 'all 0.2s ease',
    } as const),
    badge: (urgency: 'red' | 'yellow' | 'blue' | 'recovery') => ({
      padding: '0.35rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: theme.colors.urgency[`${urgency}Bg`],
      color: theme.colors.urgency[urgency],
      display: 'inline-block',
    } as const),
    streakPill: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: '0.35rem 0.6rem',
      borderRadius: theme.borderRadius.sm,
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      color: theme.colors.textSecondary,
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    dayCol: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      padding: '0.75rem 0.25rem',
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
    },
    button: {
      backgroundColor: theme.colors.accent,
      color: '#ffffff',
      border: 'none',
      padding: '1rem 1.5rem',
      borderRadius: theme.borderRadius.md,
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: '100%',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      marginTop: '0.5rem',
    },
    pill: (isSelected: boolean, isDisabled?: boolean) => ({
      padding: '0.4rem 0.8rem',
      borderRadius: theme.borderRadius.sm,
      border: isDisabled ? "none" : `1px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
      backgroundColor: isDisabled ? "hsla(210, 10%, 80%, .5)" : isSelected ? theme.colors.accent : 'transparent',
      color: isSelected ? '#fff' : theme.colors.textSecondary,
      fontWeight: isSelected ? 700 : 500,
      fontSize: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    } as const)
  } as const;

  if (!isLoaded) return null;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* EQUIPMENT SELECTION BAR (Place directly above your cards list) */}
        <div style={{
          ...styles.card,
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          cursor: 'default',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available Equipment
            </span>
            <span style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
              {selectedEquipment.length} of {EQUIPMENT_OPTIONS.length} selected
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {EQUIPMENT_OPTIONS.map(eq => {
              const isChecked = selectedEquipment.includes(eq);
              return (
                <button
                  key={eq}
                  onClick={() => handleToggleEquipment(eq)}
                  style={{
                    ...styles.pill(isChecked),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    backgroundColor: isChecked ? '#fff' : 'transparent',
                    border: `1px solid ${isChecked ? '#fff' : theme.colors.border}`,
                    color: theme.colors.accent,
                    fontSize: '0.7rem',
                    lineHeight: '14px',
                    textAlign: 'center',
                    fontWeight: 900
                  }}>
                    {isChecked ? '✓' : ''}
                  </span>
                  {eq}
                </button>
              );
            })}
          </div>
        </div>

        {/* UNIFIED SORTED LIST */}
        <div style={styles.listContainer}>
          {sortedStats.map((stat, index) => {
            const isSelected = selectedGroup === stat.group;

            // If selected (by default, item #0 is selected & pops out)
            if (isSelected) {
              return (
                <div key={stat.group} style={styles.heroCard(stat.urgency)}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                          {stat.group}
                        </h2>
                        {index === 0 && (
                          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: theme.colors.accentLight, padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p style={{ color: theme.colors.textSecondary, margin: 0, fontSize: '0.9rem' }}>
                        {stat.daysAgo === null
                          ? 'No workouts logged yet'
                          : `Last trained ${stat.daysAgo} day${stat.daysAgo === 1 ? '' : 's'} ago`}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={styles.streakPill}>
                        <span>🔥</span>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{stat.streak}</span>
                      </div>
                      <div style={styles.badge(stat.urgency)}>
                        {stat.urgency === 'recovery' && `Cooldown (Day ${stat.daysAgo})`}
                        {stat.urgency === 'blue' && `Recommended (Day ${stat.daysAgo === null ? '1' : stat.daysAgo})`}
                        {stat.urgency === 'yellow' && 'Urgent! (Day 5)'}
                        {stat.urgency === 'red' && `Streak Failed (${stat.daysAgo}d ago)`}
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: `1px solid ${theme.colors.border}`, margin: '0' }} />

                  {/* Duration Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: theme.colors.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Select Duration:
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* Standard available duration badges */}
                      {availableDurations.map(mins => (
                        <button
                          key={mins}
                          onClick={() => setSelectedDuration(mins)}
                          style={styles.pill(selectedDuration === mins)}
                        >
                          {mins === 45 ? '45+ min' : `${mins} min`}
                        </button>
                      ))}

                      {/* NEW: Custom Badge appended to the end */}
                      <button
                        onClick={() => setSelectedDuration('custom')}
                        style={styles.pill(selectedDuration === 'custom')}
                      >
                        Custom
                      </button>
                    </div>

                    {/* NEW: Show input field ONLY when Custom is selected */}
                    {selectedDuration === 'custom' && (
                      <>
                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                            Custom duration (minutes):
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="300"
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: theme.borderRadius.sm,
                              color: theme.colors.textPrimary,
                              padding: '0.4rem 0.6rem',
                              width: '80px',
                              fontFamily: theme.typography.fontFamily,
                              fontSize: '0.9rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {MUSCLE_GROUPS.map(mg => {
                            const isChecked = trainedGroups.includes(mg);
                            return (
                              <button
                                key={mg}
                                disabled={mg == selectedGroup}
                                onClick={() => setTrainedGroups(prev => {
                                  if (prev.includes(mg)) {
                                    return prev.filter(g => g !== mg);
                                  } else {
                                    return [...prev, mg];
                                  }
                                })}
                                style={{
                                  ...styles.pill(isChecked, mg == selectedGroup),
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  padding: '0.4rem 0.8rem',
                                }}
                              >
                                <span style={{
                                  display: 'inline-block',
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '3px',
                                  backgroundColor: isChecked ? '#fff' : 'transparent',
                                  border: `1px solid ${isChecked ? '#fff' : theme.colors.border}`,
                                  color: theme.colors.accent,
                                  fontSize: '0.7rem',
                                  lineHeight: '14px',
                                  textAlign: 'center',
                                  fontWeight: 900
                                }}>
                                  {isChecked ? '✓' : ''}
                                </span>
                                {mg}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Start/go Button */}
                  {selectedDuration !== 'custom' &&
                    <button
                      style={{ ...styles.button, backgroundColor: "green" }}
                      onClick={() => handleStartWorkout(stat.group)}
                    >
                      ▶ Start Video
                    </button>
                  }

                  {/* Action Button */}
                  <button
                    style={styles.button}
                    onClick={() => handleRegisterWorkout()}
                  >
                    ✓ Register Workout
                  </button>
                </div>
              );
            }

            // Standard Collapsed Card (Clicking expands it)
            return (
              <div
                key={stat.group}
                style={styles.card(stat.urgency)}
                onClick={() => setSelectedGroup(stat.group)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{stat.group}</span>
                  <span style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                    {stat.daysAgo === null
                      ? 'Never trained'
                      : `${stat.daysAgo}d ago`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={styles.streakPill}>
                    <span>🔥</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{stat.streak}</span>
                  </div>
                  <div style={styles.badge(stat.urgency)}>
                    {stat.daysAgo}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 7-Day Rolling Calendar */}
        <div style={{ ...styles.card, flexDirection: 'column', alignItems: 'stretch', cursor: 'default' }}>
          <div>
            <h3 style={{ ...theme.typography.h2, fontSize: '1.1rem', margin: 0 }}>
              Rolling 14-Day Activity
            </h3>
            <p style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, margin: '0.2rem 0 0 0' }}>
              Workouts logged across the past week
            </p>
          </div>

          <div style={styles.calendarGrid}>
            {last14Days.map((day, idx) => {
              const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' });
              const dateNum = day.getDate();
              const isToday = idx === 13;

              // Use the local string helper so it doesn't jump back a day!
              const localDayStr = getLocalDateStr(day);
              const isSelected = selectedDate === localDayStr;

              const dayWorkouts = history.filter(w => {
                const wDate = new Date(w.date);
                return wDate.setHours(0, 0, 0, 0) === day.getTime();
              });

              return (
                <div key={idx} style={{
                  ...styles.dayCol,
                  borderColor: isSelected ? theme.colors.accentLight : theme.colors.border,
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                }}
                  onClick={() => setSelectedDate(localDayStr)}
                >
                  <span style={{ fontSize: '0.7rem', color: isSelected ? theme.colors.accentLight : theme.colors.textSecondary, fontWeight: isToday ? 700 : 400 }}>
                    {isToday ? 'TODAY' : dayStr}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {dateNum}
                  </span>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', minHeight: '16px' }}>
                    {dayWorkouts.map(w => (
                      <span
                        key={w.id}
                        title={`${w.muscleGroup} (${w.duration}m)`}
                        style={{
                          fontSize: '0.65rem',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          backgroundColor: theme.colors.accent,
                          color: '#fff',
                          fontWeight: 600
                        }}
                      >
                        {w.muscleGroup.slice(0, 2)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Workout History Log */}
        {history.length > 0 && (
          <div style={{ ...styles.card, flexDirection: 'column', alignItems: 'stretch', cursor: 'default' }}>
            <h3 style={{ ...theme.typography.h2, fontSize: '1.1rem', margin: '0 0 0.75rem 0' }}>
              Recent Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {history.slice(0, 5).map((item, index) => (
                <div
                  key={item.id + "_" + index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: theme.colors.accentLight, fontSize: '0.9rem' }}>
                      {item.muscleGroup}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: theme.colors.textSecondary }}>
                      {item.duration === 45 ? '45+ mins' : `${item.duration} mins`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>
                      {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkout(item.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.colors.urgency.red,
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: '0.2rem'
                      }}
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}