import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'

const touristPlaces = [
  {
    img: '/assests/Rectangle 103.png',
    alt: 'Golden Bridge, Vietnam',
    title: 'Golden Bridge, Vietnam',
    facts: ['Iconic hand-supported bridge', 'Offers stunning panoramic views'],
  },
  {
    img: '/assests/sheikh-zayed-mosque-credit-getty-images 1.png',
    alt: 'Sheikh Zayed Grand Mosque, UAE',
    title: 'Sheikh Zayed Grand Mosque, UAE',
    facts: ['Architectural marvel with intricate designs', "One of the world's largest mosques"],
  },
  {
    img: '/assests/3-eiffel-tower-getty 1.png',
    alt: 'Eiffel Tower, France',
    title: 'Eiffel Tower, France',
    facts: ['Parisian icon and engineering feat', 'Breathtaking city views from the top'],
  },
  {
    img: '/assests/sheikh-zayed-mosque-credit-getty-images 1.png',
    alt: 'Sheikh Zayed Grand Mosque, UAE',
    title: 'Sheikh Zayed Grand Mosque, UAE',
    facts: ['Architectural marvel with intricate designs', "One of the world's largest mosques"],
  },
]

const reviews = [
  { title: 'Must-Have App!', text: '"The route-based recommendations were spot on. Discovered hidden gems and saved much time planning. Love it!"', name: 'Tiana Philips', role: 'Photographer' },
  { title: 'Must-Have App!', text: '"The route-based recommendations were spot on. Discovered hidden gems and saved much time planning. Love it!"', name: 'Tiana Philips', role: 'Photographer' },
  { title: 'Seamless Planning!', text: '"Finally, a tool that helps me explore more and plan less. Spontaneous detours were a breeze. Thank you, TripNest!"', name: 'Talan Westervelt', role: 'Businessman' },
  { title: 'Incredible Journeys!', text: '"Every trip has been fantastic with TripNest. The suggestions are unique and perfectly tailored to my route. Amazing!"', name: 'Sarah Miller', role: 'Travel Blogger' },
  { title: 'Fantastic Experience!', text: '"TripNest truly simplifies travel planning. Found amazing spots I wouldn\'t have otherwise! Highly recommended for road trips."', name: 'James Gouse', role: 'Graphic Designer' },
  { title: 'A Must-Have App!', text: '"The route-based recommendations were spot on. Discovered hidden gems and saved much time planning. Love it!"', name: 'Tiana Philips', role: 'Photographer' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Video Section */}
      <section className="hero-video">
        <video autoPlay loop muted playsInline src="/assests/2871918-hd_1920_1080_30fps.mp4" />
        <div className="hero-content">
          <h1>Pack Your Bags, Find Yourself</h1>
          <p>Sometimes, the best way to discover who you are is to get lost</p>
          <button onClick={() => navigate('/planner')}>Explore</button>
        </div>
      </section>

      {/* Top Tourist Places */}
      <div className="top-tourist-places">
        <div className="section-title-box">
          <span className="section-title">Top Tourist Places</span>
        </div>
        <div className="tourist-grid">
          {touristPlaces.map((place, i) => (
            <div className="tourist-card" key={i}>
              <img src={place.img} alt={place.alt} />
              <div className="card-details">
                <h4>{place.title}</h4>
                <ul>{place.facts.map((f, j) => <li key={j}>{f}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-headline">The World Is Waiting <br /> Start Planning</h2>
          <p className="cta-subtext">Let's turn your travel dreams into reality. Tell us your destination, and we'll handle the rest.</p>
          <button className="cta-button" onClick={() => navigate('/planner')}>Get Started</button>
        </div>
      </section>

      {/* About Us */}
      <section className="about-section" id="about-section">
        <div className="about-container">
          <div className="logo-heading-wrapper">
            <div className="about-logo">
              <img src="/assests/logo (2).png" alt="TripNest Icon" className="about-icon" />
              <img src="/assests/TripNest.png" alt="TripNest" className="about-text-logo" />
            </div>
            <div className="about-heading-wrap">
              <h2 className="about-heading">About Us</h2>
            </div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <ul className="about-list">
                {[
                  'Find tourist spots between two locations',
                  'Get smart, route-based travel recommendations',
                  'Discover hidden gems & scenic stops',
                  'Plan less, explore more',
                  'Perfect for road trips & spontaneous detours',
                ].map((item, i) => (
                  <li className="about-list-item" key={i}>
                    <span className="arrow">&gt;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-image">
              <img
                src="https://blog.erasmusgeneration.org/sites/default/files/articles/2022-03/travelling_alone_all_across_the_globe.jpg"
                alt="Global Travel"
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">
        <div className="reviews-container">
          <h1 className="reviews-headline">Reviews</h1>
          <p className="reviews-subtext">
            Hear from our adventurers about their seamless travel planning and unforgettable journeys with TripNest.
          </p>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="stars"></div>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <div className="reviewer">
                  <div className="profile-name">
                    <h3>{r.name}</h3>
                    <p>{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
