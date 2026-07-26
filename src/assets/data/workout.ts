import handStandPushuplvl0 from '../images/HandstandPushupLvl0.png';

export type MuscleGroup = "Core" | "Chest" | "Back" | "Legs" | "Arms" | "Shoulders" | "Cardio" | "Stretch";
export type Equipment = "Dumbbells" | "Bar" | "Rack" | "½ Bar";

export type WorkoutVideo = {
  name: string;
  url?: string;
  time?: number;
  image?: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  education?: boolean;
}

type WorkoutDatabase = Record<string, (WorkoutVideo)[]>;

const WORKOUT_DATA: WorkoutDatabase = {
  "Strength": [
    { name: "Core", url: "https://youtu.be/FEoogWnZ04A?t=56", time: 8, muscleGroups: ["Core"], equipment: [] },
    { name: "Core", url: "https://youtu.be/XgI_p8bKg78?t=91", time: 20, muscleGroups: ["Core"], equipment: [] },
    { name: "Planck", url: "https://youtu.be/XU7vRXk1N64?t=90", time: 8, muscleGroups: ["Core"], equipment: [] },
    { name: "Chest", url: "https://youtu.be/4Me_9MEEiZU?t=82", time: 6, muscleGroups: ["Chest"], equipment: [] },
    { name: "Chest", url: "https://youtu.be/BkS1-El_WlE?t=120", time: 8, muscleGroups: ["Chest"], equipment: [] },
    { name: "Legs", url: "https://youtu.be/G5nxGTFBauM?t=70", time: 8, muscleGroups: ["Legs"], equipment: [] },
    { name: "Legs", url: "https://youtu.be/wB9ukMeQfjU?t=59", time: 15, muscleGroups: ["Legs"], equipment: [] },
    { name: "Legs", url: "https://youtu.be/q7rCeOa_m58?t=61", time: 20, muscleGroups: ["Legs"], equipment: [] },
    { name: "Arms", url: "https://youtu.be/NOGSB5PU4lo?t=110", time: 8, muscleGroups: ["Arms"], equipment: ["Dumbbells"] },
    { name: "Back", url: "https://youtu.be/ifQgmbr18kk?t=62", time: 10, muscleGroups: ["Back"], equipment: ["Dumbbells"] },
    { name: "Back", url: "https://youtu.be/QqZV3JEoOlc?t=55", time: 7, muscleGroups: ["Back"], equipment: [] },
    { name: "Full body", url: "https://youtu.be/yUs-xrcqDpk?t=93", time: 10, muscleGroups: ["Core", "Chest", "Back", "Legs", "Arms"], equipment: ["Dumbbells"] },
    { name: "Handstand pushup level 0", image: handStandPushuplvl0, time: 12, muscleGroups: ["Shoulders"], equipment: [] },
    { name: "L-sit", url: "https://youtu.be/kwOGACG2DCQ?t=172", time: 6, muscleGroups: ["Core"], equipment: ["Rack", "Bar"] },
    { name: "Muscle up", url: "https://youtu.be/BVnhhlKfamw?t=146", time: 5, muscleGroups: ["Back"], equipment: ["Bar", "½ Bar"] },
    { name: "Front lever", url: "https://youtu.be/SeIfKANM8rQ?t=145", muscleGroups: ["Back"], equipment: ["Bar"], education: true },
    { name: "Handstand pushup (No equipment,Education)", url: "https://youtu.be/VKpIoRjV8nw?t=120", muscleGroups: ["Shoulders"], equipment: [], education: true},
  ]
};

const getYouTubeThumbnail = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
};


export { WORKOUT_DATA, getYouTubeThumbnail };