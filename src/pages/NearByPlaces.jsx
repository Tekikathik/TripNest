import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './NearByPlaces.css'

const MAPS_API_KEY = 'AIzaSyD32qO7WIrNE_wtbYOKAnFCVJODS-e11jM'

const PLACE_TYPES = [
  { label: 'Restaurants', type: 'restaurant', icon: '🍽️' },
  { label: 'Hotels', type: 'lodging', icon: '🏨' },
  { label: 'ATMs', type: 'atm', icon: '🏧' },
  { label: 'Hospitals', type: 'hospital', icon: '🏥' },
  { label: 'Tourist Spots', type: 'tourist_attraction', icon: '🗺️' },
  { label: 'Shopping', type: 'shopping_mall', icon: '🛍️' },
]

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

export default function NearByPlaces() {
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('restaurant')
  const [nearbyList, setNearbyList] = useState([])
  const [mapCenter, setMapCenter] = useState(null)
  const mapInstanceRef = useRef(null)
  const serviceRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        await loadGoogleMapsScript(MAPS_API_KEY)
        if (!isMounted || !mapRef.current) return

        const idx = parseInt(localStorage.getItem('idx:') || '0', 10)
        const raw = localStorage.getItem('final_selected_places')
        const selected = raw ? JSON.parse(raw) : []
        const place = selected[idx]

        let center = { lat: 20.5937, lng: 78.9629 }
        if (place?.latitude && place?.longitude) {
          center = { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }
        }
        setMapCenter(center)

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        })
        mapInstanceRef.current = map

        new window.google.maps.Marker({ position: center, map, title: place?.name || 'Location', label: '📍' })

        const service = new window.google.maps.places.PlacesService(map)
        serviceRef.current = service

        searchNearby(service, map, center, selectedType, isMounted, setNearbyList)
      } catch (err) {
        console.error('NearByPlaces map error:', err)
      }
    }

    init()
    return () => { isMounted = false }
  }, [])

  const searchNearby = (service, map, center, type, isMounted, setList) => {
    if (!service) return
    service.nearbySearch({
      location: center,
      radius: 2000,
      type,
    }, (results, status) => {
      if (!isMounted) return
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setList(results.slice(0, 10))
        results.slice(0, 10).forEach(r => {
          new window.google.maps.Marker({
            position: r.geometry.location,
            map,
            title: r.name,
          })
        })
      } else {
        setList([])
      }
    })
  }

  const handleTypeChange = (type) => {
    setSelectedType(type)
    if (serviceRef.current && mapInstanceRef.current && mapCenter) {
      mapInstanceRef.current.setZoom(14)
      searchNearby(serviceRef.current, mapInstanceRef.current, mapCenter, type, true, setNearbyList)
    }
  }

  return (
    <div className="nbp-page">
      <Navbar />
      <div className="nbp-layout">
        {/* Info panel */}
        <aside className="nbp-aside">
          <div className="nbp-aside-inner">
            <h2 className="nbp-title">Nearby Places</h2>
            <div className="nbp-type-btns">
              {PLACE_TYPES.map(pt => (
                <button
                  key={pt.type}
                  className={`nbp-type-btn ${selectedType === pt.type ? 'active' : ''}`}
                  onClick={() => handleTypeChange(pt.type)}
                >
                  {pt.icon} {pt.label}
                </button>
              ))}
            </div>
            <div className="nbp-list">
              {nearbyList.length === 0 ? (
                <p className="nbp-empty">No results found for this type.</p>
              ) : nearbyList.map((place, i) => (
                <div className="nbp-list-item" key={i}>
                  <div className="nbp-list-icon">📍</div>
                  <div>
                    <h4>{place.name}</h4>
                    <p>{place.vicinity}</p>
                    {place.rating && <p>⭐ {place.rating}</p>}
                  </div>
                </div>
              ))}
            </div>
            <button className="nbp-back-btn" onClick={() => navigate('/route-map')}>
              &#8592; Back to Route Map
            </button>
          </div>
        </aside>

        {/* Map */}
        <div ref={mapRef} className="nbp-map" />
      </div>
    </div>
  )
}
