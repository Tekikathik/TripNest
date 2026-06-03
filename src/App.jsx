import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import LoginRegister from './pages/LoginRegister'
import TravelForm from './pages/TravelForm'
import Recommendations from './pages/Recommendations'
import RouteMap from './pages/RouteMap'
import NearByPlaces from './pages/NearByPlaces'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/planner" element={<TravelForm />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/route-map" element={<RouteMap />} />
        <Route path="/nearby" element={<NearByPlaces />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
