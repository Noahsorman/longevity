import Navbar from './navigation/navbar'
import { DressingsPage, IngredientsPage, MealGenerator, WorkoutPage } from './pages'
import { Routes, Route } from 'react-router-dom'

const navConfig = {
  "Food": {
    "Week Planner": "/",
    "Ingredients": "/ingredients",
    "Dressings": "/dressings",
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
          <Route path="/workouts" element={<WorkoutPage />} />
          
          {/* Fallback - redirects unknown paths back to Home */}
          <Route path="*" element={<MealGenerator />} />
        </Routes>
      </main>
    </div>
  )
}

export default App