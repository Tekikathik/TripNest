import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src="/assests/logo (2).png" alt="TripNest Icon" className="nav-icon" />
        <img src="/assests/TripNest.png" alt="TripNest" className="nav-text-logo" />
      </div>

      <div className="nav-sidebar">
        <div className="nav-item home-item">
          <button onClick={() => navigate('/')}>Home</button>
        </div>
        <div className="nav-item planner-item">
          <button onClick={() => navigate('/planner')}>Planner</button>
        </div>
        <div className="nav-item aboutus-item">
          <button onClick={() => { const el = document.getElementById('about-section'); if(el) el.scrollIntoView({behavior:'smooth'}); else navigate('/') }}>AboutUs</button>
        </div>
        <div className="nav-item signin-item">
          <button onClick={() => navigate('/login')}>SignIn</button>
        </div>
      </div>

      <div className="three-dot" onClick={() => setMobileOpen(true)}>&#9776;</div>

      {mobileOpen && (
        <div className="mobile-menu">
          <span className="cross" onClick={() => setMobileOpen(false)}>&times;</span>
          <div className="mob-item" onClick={() => { navigate('/'); setMobileOpen(false) }}>
            <img src="/assests/home_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png" alt="" />
            <button>Home</button>
          </div>
          <div className="mob-item" onClick={() => { navigate('/planner'); setMobileOpen(false) }}>
            <img src="/assests/map_pin_review_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png" alt="" />
            <button>Planner</button>
          </div>
          <div className="mob-item" onClick={() => setMobileOpen(false)}>
            <img src="/assests/page_footer_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png" alt="" />
            <button>AboutUs</button>
          </div>
          <div className="mob-item services" onClick={() => { navigate('/login'); setMobileOpen(false) }}>
            <img src="/assests/login_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png" alt="" />
            <button>SignIn</button>
          </div>
        </div>
      )}
    </nav>
  )
}
