import Navbar from './navigation/navbar'
import { BreakfastPage, DressingsPage, IngredientsPage, MealGenerator, WorkoutPage } from './pages'
import { Routes, Route } from 'react-router-dom'
import SnacksPage from './pages/Snacks';

const navConfig = {
  "Food": {
    "Week Planner": "/",
    "Ingredients": "/ingredients",
    "Dressings": "/dressings",
    "Breakfasts": "/breakfasts",
    "Snacks": "/snacks",
  },
  "Exercise": {
    "Workouts": "/workouts"
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
          <Route path="/" element={<MealGenerator />} />
          
          {/* You can add more pages here later */}
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/dressings" element={<DressingsPage />} />
          <Route path="/breakfasts" element={<BreakfastPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/snacks" element={<SnacksPage />} />
          
          {/* Fallback - redirects unknown paths back to Home */}
          <Route path="*" element={<MealGenerator />} />
        </Routes>
      </main>
    </div>
  )
}

export default App