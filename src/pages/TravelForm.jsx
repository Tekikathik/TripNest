import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './TravelForm.css'

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBkc0WfFg34aHOSkpbZfanpJz2O83YTHH8'

const IMAGE_URLS = [
  'https://plus.unsplash.com/premium_photo-1661885523029-fc960a2bb4f3?q=80&w=1170&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1713729991304-d0b6c328560e?q=80&w=1386&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=765&auto=format&fit=crop',
  'https://plus.unsplash.com/premium_photo-1661912874572-3195ceee2e7c?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536289444758-1a89cd14499e?q=80&w=735&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1609951586237-4c6bdb4f5133?q=80&w=1176&auto=format&fit=crop',
  'https://plus.unsplash.com/premium_photo-1661962542692-4fe7a4ad6b54?q=80&w=1171&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=627&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616388969587-8196f32388b4?q=80&w=736&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564329494258-3f72215ba175?q=80&w=1170&auto=format&fit=crop',
]

export default function TravelForm() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [days, setDays] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!from || !to || !date || !days) {
      alert('Please fill all details....')
      return
    }

    setLoading(true)
    localStorage.setItem('Image_url', JSON.stringify(IMAGE_URLS))

    const prompt = `Give me a JSON object of all tourist places (minimum 6 places mandatory) located between ${from} and ${to}, specifically along the roadway or railway route. For each place, include: image URL (generate it) and give the url, Name of the place, Location name, Location with latitude and longitude, A short description, The famous food of that place, A rating out of 5, A seasonal recommendation like "Best to visit in current monsoon". Format the response strictly like this, without any extra words: - "places": [{"OriginLocation": { "latitude": 0.0, "longitude": 0.0 }, "DestinationLocation": { "latitude": 0.0, "longitude": 0.0 }, "imageurl": "", "name": "", "location": { "name": "", "latitude": 0.0, "longitude": 0.0 }, "description": "", "famous_food": "", "rating": 0, "best_season": ""}]`

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      })

      const data = await response.json()
      const rawText = data.candidates[0].content.parts[0].text
      const jsonStart = rawText.indexOf('{')
      const jsonEnd = rawText.lastIndexOf('}') + 1
      const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd))

      parsed.places.forEach((place, i) => {
        localStorage.setItem('OriginLat', place.OriginLocation.latitude)
        localStorage.setItem('OriginLng', place.OriginLocation.longitude)
        localStorage.setItem('DestinationLat', place.DestinationLocation.latitude)
        localStorage.setItem('DestinationLng', place.DestinationLocation.longitude)
        localStorage.setItem(`Image URL${i}`, place.imageurl)
        localStorage.setItem(`Name${i}`, place.name)
        localStorage.setItem(`Location${i}`, JSON.stringify(place.location))
        localStorage.setItem(`Description${i}`, place.description)
        localStorage.setItem(`Famous food${i}`, place.famous_food)
        localStorage.setItem(`Rating${i}`, place.rating)
        localStorage.setItem(`Best Season${i}`, place.best_season)
      })
      localStorage.setItem('PlacesCount', parsed.places.length)
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      navigate('/recommendations')
    }
  }

  if (loading) {
    return (
      <div className="loader-screen">
        <video autoPlay muted loop playsInline>
          <source src="/assests/loading.mp4" type="video/mp4" />
        </video>
      </div>
    )
  }

  return (
    <div className="tf-page">
      <Navbar />
      <div className="tf-main">
        <div className="tf-center">
          <div className="tf-card">
            <div className="tf-input-section">
              <div className="tf-input-row">
                <div className="tf-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <input type="text" placeholder="From" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
            </div>

            <div className="tf-input-section">
              <div className="tf-input-row">
                <div className="tf-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <input type="text" placeholder="To" value={to} onChange={e => setTo(e.target.value)} />
              </div>
            </div>

            <div className="tf-labeled-row">
              <label htmlFor="journey-date">Journey Date:</label>
              <input type="date" id="journey-date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>

            <div className="tf-labeled-row">
              <label htmlFor="days">Days:</label>
              <input type="number" id="days" placeholder="Enter number of days" min="1" value={days} onChange={e => setDays(e.target.value)} />
            </div>

            <button className="tf-submit-btn" onClick={handleSubmit}>Start Journey</button>
          </div>
        </div>
      </div>
    </div>
  )
}
