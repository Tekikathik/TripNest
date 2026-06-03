import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './RouteMap.css'

const MAPS_API_KEY = 'AIzaSyD32qO7WIrNE_wtbYOKAnFCVJODS-e11jM'

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) { resolve(); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function RouteMap() {
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [places, setPlaces] = useState([])
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('final_selected_places')
    if (raw) setPlaces(JSON.parse(raw))
  }, [])

  useEffect(() => {
    let isMounted = true

    const initMap = async () => {
      try {
        await loadGoogleMapsScript(MAPS_API_KEY)
        if (!isMounted || !mapRef.current) return

        const originLat = parseFloat(localStorage.getItem('OriginLat') || '0')
        const originLng = parseFloat(localStorage.getItem('OriginLng') || '0')
        const destLat   = parseFloat(localStorage.getItem('DestinationLat') || '0')
        const destLng   = parseFloat(localStorage.getItem('DestinationLng') || '0')

        const center = { lat: originLat || 20.5937, lng: originLng || 78.9629 }
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 7,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        })

        if (!originLat || !destLat) return

        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer()
        directionsRenderer.setMap(map)

        const raw = localStorage.getItem('final_selected_places')
        const selected = raw ? JSON.parse(raw) : []
        const waypoints = selected
          .map(p => ({ location: { lat: parseFloat(p.latitude), lng: parseFloat(p.longitude) }, stopover: true }))
          .filter(w => !isNaN(w.location.lat) && !isNaN(w.location.lng))

        directionsService.route({
          origin: { lat: originLat, lng: originLng },
          destination: { lat: destLat, lng: destLng },
          waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result)
          }
        })
      } catch (err) {
        console.error('Map init error:', err)
        if (isMounted) setMapError('Failed to load Google Maps. Please check your API key.')
      }
    }

    initMap()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="rm-page">
      <Navbar />
      <div className="rm-layout">
        {/* Planner sidebar */}
        <aside className="rm-sidebar">
          <h2 className="rm-sidebar-title">Your Planner</h2>
          <div className="rm-planner-list">
            {places.length === 0 ? (
              <p className="rm-empty">No places selected. <button onClick={() => navigate('/recommendations')}>Go back</button></p>
            ) : places.map((place, i) => (
              <div className="rm-planner-item" key={i}>
                <img
                  src={place.image}
                  alt={place.name}
                  className="rm-planner-img"
                  onError={e => { e.target.src = 'https://placehold.co/96x64' }}
                />
                <div className="rm-planner-info">
                  <h3>{place.name}</h3>
                  <p>Rating: {place.rating}</p>
                </div>
                <button
                  className="rm-view-btn"
                  onClick={() => {
                    localStorage.setItem('idx:', i)
                    navigate('/nearby')
                  }}
                >
                  Nearby
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <main className="rm-map-col">
          <div className="rm-header">
            <button className="rm-btn" onClick={() => navigate('/recommendations')}>
              &#8592; Back
            </button>
            <span style={{ fontSize: '.9rem', color: '#555' }}>
              {places.length} place{places.length !== 1 ? 's' : ''} on route
            </span>
          </div>
          {mapError ? (
            <div className="rm-error">{mapError}</div>
          ) : (
            <div ref={mapRef} className="rm-google-map" />
          )}
        </main>
      </div>
    </div>
  )
}
