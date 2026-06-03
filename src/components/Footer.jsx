import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="foot">
        <div className="foot-logo">
          <img src="/assests/logo (2).png" alt="TripNest Logo" width="100" height="60" />
          <img src="/assests/TripNest.png" alt="TripNest" width="100" height="25" />
        </div>

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/planner">Planner</a></li>
            <li><a href="#">Currency Converter</a></li>
            <li><a href="#">Language Translator</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Reviews</a></li>
          </ul>
        </div>

        <div className="contact-us">
          <h2>Contact Us</h2>
          <div className="contact-row">
            <i className="fa-solid fa-phone"></i>
            <span>+91 99********</span>
          </div>
          <div className="contact-row">
            <i className="fa-solid fa-envelope"></i>
            <span>tripNest@gmail.com</span>
          </div>
          <div className="social">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </div>
      </div>

      <div className="foot-copy">
        &copy;&nbsp;Copyright 2025 <span>TripNest</span>. All Rights Reserved
      </div>
    </footer>
  )
}
