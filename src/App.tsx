import Navbar from './navigation/navbar'
import { BreakfastPage, DressingsPage, IngredientsPage, MealGenerator, RecipesPage, WorkoutPage, WorkoutTrackerPage } from './pages'
import { Routes, Route } from 'react-router-dom'
import SnacksPage from './pages/Snacks';

const navConfig = {
  "Food": {
    "Week Planner": "/meal-generator",
    "Ingredients": "/ingredients",
    "Dressings": "/dressings",
    "Breakfasts": "/breakfasts",
    "Snacks": "/snacks",
    "Recipes": "/recipes"
  },
  "Exercise": {
    "Workouts": "/workouts",
    "Tracker": "/workout-tracker"
  },
  "Launchpad": "https://noahsorman.github.io"
};

function App() {
  return (
    <div className="app-container">
      <Navbar items={navConfig} />
      <main style={{ padding: '0px' }}>
        <Routes>
          {/* This matches the root "/" and shows your MealGenerator */}
          <Route path="/" element={<WorkoutTrackerPage />} />
          
          {/* You can add more pages here later */}
          <Route path="/meal-generator" element={<MealGenerator />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/dressings" element={<DressingsPage />} />
          <Route path="/breakfasts" element={<BreakfastPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/snacks" element={<SnacksPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/workout-tracker" element={<WorkoutTrackerPage />} />
          
          {/* Fallback - redirects unknown paths back to Home */}
          <Route path="*" element={<MealGenerator />} />
        </Routes>
      </main>
    </div>
  )
}

export default App