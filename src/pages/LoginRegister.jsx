import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginRegister.css'

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

export default function LoginRegister() {
  const [isRightActive, setIsRightActive] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const { name, email, password } = e.target
    const n = name.value.trim(), em = email.value.trim(), pw = password.value.trim()

    if (!n || !em || !pw) return showMessage('Please fill in all fields.', 'error')
    if (!/^[a-zA-Z\s]+$/.test(n)) return showMessage('Name should only contain letters and spaces.', 'error')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return showMessage('Please enter a valid email address.', 'error')
    if (pw.length < 8) return showMessage('Password must be at least 8 characters.', 'error')

    const users = getUsers()
    if (users.some(u => u.email === em)) return showMessage('This email is already registered.', 'error')

    users.push({ name: n, email: em, password: pw })
    saveUsers(users)
    showMessage('Registration successful! Please sign in.', 'success')
    setIsRightActive(false)
    e.target.reset()
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const { email, password } = e.target
    const em = email.value.trim(), pw = password.value.trim()

    if (!em || !pw) return showMessage('Please enter your email and password.', 'error')

    const users = getUsers()
    const found = users.find(u => u.email === em && u.password === pw)
    if (found) {
      showMessage(`Welcome, ${found.name}! You are logged in.`, 'success')
      e.target.reset()
      setTimeout(() => navigate('/planner'), 1000)
    } else {
      showMessage('Invalid email or password.', 'error')
    }
  }

  return (
    <div className="lr-page">
      <div className={`lr-container ${isRightActive ? 'right-panel-active' : ''}`}>

        {/* Sign Up */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" name="name" required />
            <input type="email" placeholder="Email" name="email" required />
            <input type="password" placeholder="Password" name="password" required />
            <button type="submit">Sign Up</button>
            <p className="social-label">or sign up with social accounts</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/color/32/google-logo.png" alt="Google" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/32/000000/facebook-new.png" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-glyphs/32/github.png" alt="GitHub" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/32/0077B5/linkedin.png" alt="LinkedIn" /></a>
            </div>
            <div className="mobile-toggle" onClick={() => setIsRightActive(false)}>
              Already have an account? Sign In
            </div>
          </form>
        </div>

        {/* Sign In */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <input type="email" placeholder="Email" name="email" required />
            <input type="password" placeholder="Password" name="password" required />
            <a href="#" className="forgot-link">Forgot your password?</a>
            <button type="submit">Sign In</button>
            <p className="social-label">or sign in with social accounts</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/color/32/google-logo.png" alt="Google" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/32/000000/facebook-new.png" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-glyphs/32/github.png" alt="GitHub" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/32/0077B5/linkedin.png" alt="LinkedIn" /></a>
            </div>
            <div className="mobile-toggle" onClick={() => setIsRightActive(true)}>
              Don't have an account? Sign Up
            </div>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsRightActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => setIsRightActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message-box show ${message.type}`}>
          <span className="icon">{message.type === 'success' ? '✅' : '❌'}</span>
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}
