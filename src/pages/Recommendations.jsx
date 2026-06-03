import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Recommendations.css'

/* ─── Language list ─── */
const languageList = [
  { name: 'English', code: 'en' }, { name: 'Hindi', code: 'hi' }, { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' }, { name: 'Spanish', code: 'es' }, { name: 'Arabic', code: 'ar' },
  { name: 'Bengali', code: 'bn' }, { name: 'Chinese (Simplified)', code: 'zh' }, { name: 'Japanese', code: 'ja' },
  { name: 'Korean', code: 'ko' }, { name: 'Portuguese', code: 'pt' }, { name: 'Russian', code: 'ru' },
  { name: 'Tamil', code: 'ta' }, { name: 'Telugu', code: 'te' }, { name: 'Urdu', code: 'ur' },
  { name: 'Italian', code: 'it' }, { name: 'Dutch', code: 'nl' }, { name: 'Turkish', code: 'tr' },
  { name: 'Vietnamese', code: 'vi' }, { name: 'Polish', code: 'pl' },
]

/* ─── Country list (subset for currency) ─── */
const countryList = {
  USD: 'US', EUR: 'FR', GBP: 'GB', INR: 'IN', JPY: 'JP', AUD: 'AU', CAD: 'CA', CHF: 'CH',
  CNY: 'CN', HKD: 'HK', SGD: 'SG', KRW: 'KR', BRL: 'BR', MXN: 'MX', ZAR: 'ZA', SEK: 'SE',
  NOK: 'NO', DKK: 'DK', NZD: 'NZ', AED: 'AE', SAR: 'SA', TRY: 'TR', RUB: 'RU', IDR: 'ID',
  MYR: 'MY', THB: 'TH', PKR: 'PK', BDT: 'BD', EGP: 'EG', NGN: 'NG',
}

/* ─── Load places from localStorage ─── */
function loadPlaces() {
  const imgUrls = JSON.parse(localStorage.getItem('Image_url') || '[]')
  const count = parseInt(localStorage.getItem('PlacesCount') || '6', 10)
  const places = []
  for (let i = 0; i < count; i++) {
    const name = localStorage.getItem(`Name${i}`)
    if (!name) continue
    const locRaw = localStorage.getItem(`Location${i}`)
    const loc = locRaw ? JSON.parse(locRaw) : {}
    places.push({
      id: `place-${i}`,
      name,
      image: imgUrls[Math.floor(Math.random() * imgUrls.length)] || 'https://placehold.co/400x200',
      description: localStorage.getItem(`Description${i}`) || '',
      locationName: loc.name || '',
      latitude: loc.latitude || '',
      longitude: loc.longitude || '',
      famousFood: localStorage.getItem(`Famous food${i}`) || '',
      rating: localStorage.getItem(`Rating${i}`) || '',
      bestSeason: localStorage.getItem(`Best Season${i}`) || '',
    })
  }
  return places
}

export default function Recommendations() {
  const navigate = useNavigate()
  const [places] = useState(loadPlaces)
  const [cart, setCart] = useState([])
  const [modal, setModal] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  /* Translator state */
  const [transOpen, setTransOpen] = useState(false)
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('hi')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')

  /* Currency state */
  const [currOpen, setCurrOpen] = useState(false)
  const [fromCurr, setFromCurr] = useState('USD')
  const [toCurr, setToCurr] = useState('INR')
  const [amount, setAmount] = useState('1')
  const [rateMsg, setRateMsg] = useState('1 USD = ... INR')

  /* ─── Cart helpers ─── */
  const addToCart = (place) => {
    if (cart.some(c => c.id === place.id)) return
    setCart(prev => [...prev, place])
    setModal(null)
    showToast(`${place.name} added to selected places!`, '#27ae60')
  }
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id))
  const isInCart = (id) => cart.some(c => c.id === id)

  const handleCheckout = () => {
    if (cart.length === 0) { showToast('Your selection is empty.', '#e74c3c'); return }
    localStorage.setItem('final_selected_places', JSON.stringify(cart))
    setCartOpen(false)
    navigate('/route-map')
  }

  /* ─── Toast ─── */
  const showToast = (msg, bg) => {
    const el = document.createElement('div')
    el.textContent = msg
    el.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${bg};color:white;padding:10px 20px;border-radius:5px;z-index:9999;opacity:0;transition:opacity .5s`
    document.body.appendChild(el)
    setTimeout(() => el.style.opacity = 1, 10)
    setTimeout(() => { el.style.opacity = 0; el.addEventListener('transitionend', () => el.remove()) }, 2500)
  }

  /* ─── Translate ─── */
  const handleTranslate = async () => {
    if (!inputText) return
    setOutputText('Translating...')
    try {
      const url = `https://free-google-translator.p.rapidapi.com/external-api/free-google-translator?from=${fromLang}&to=${toLang}&query=${encodeURIComponent(inputText)}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-rapidapi-key': 'e877beadc9msh297fea542b4d09fp10cc8ajsn376528f78c77', 'x-rapidapi-host': 'free-google-translator.p.rapidapi.com', 'Content-Type': 'application/json' },
        body: JSON.stringify({ translate: 'rapidapi' }),
      })
      const result = await res.json()
      setOutputText(result.translation || 'Translation failed.')
    } catch { setOutputText('Translation failed.') }
  }

  const swapLangs = () => {
    setFromLang(toLang); setToLang(fromLang)
    setInputText(outputText); setOutputText(inputText)
  }

  /* ─── Currency ─── */
  const fetchRate = async () => {
    try {
      const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${fromCurr}&to=${toCurr}&amount=${amount || 1}`
      const res = await fetch(url, {
        headers: { 'x-rapidapi-key': 'e3d47bc1ddmsh63e3f53ba63218ap1df25fjsncf040ccd6dd7', 'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com' },
      })
      const data = await res.json()
      const rate = (data.info?.rate || 0).toFixed(2)
      setRateMsg(`${amount || 1} ${fromCurr} = ${(parseFloat(amount || 1) * parseFloat(rate)).toFixed(2)} ${toCurr}`)
    } catch { setRateMsg('Rate fetch failed.') }
  }

  useEffect(() => { if (currOpen) fetchRate() }, [currOpen, fromCurr, toCurr])

  return (
    <div className="rec-page">
      <Navbar />

      {/* Floating tool buttons */}
      <div className="tool-box one" onClick={() => setTransOpen(true)}>
        <button className="tool-circle trans-circle"><i className="fa-solid fa-language"></i></button>
        <span>Language Translation</span>
      </div>
      <div className="tool-box two" onClick={() => setCurrOpen(true)}>
        <button className="tool-circle curr-circle"><i className="fa-solid fa-dollar-sign"></i></button>
        <span>Currency Converter</span>
      </div>

      {/* Hero */}
      <section className="rec-hero">
        <div className="rec-hero-content">
          <h1>The World Awaits Your Footsteps.</h1>
          <p className="tagline">From bustling cities to serene landscapes, uncover the most enchanting destinations.</p>
        </div>
      </section>

      {/* Cart icon */}
      <div className="cart-icon-btn" onClick={() => setCartOpen(true)}>
        <img src="/assests/shopping_cart_checkout_60dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png" alt="cart" style={{ width: 28, height: 28 }} />
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </div>

      {/* Places grid */}
      <main className="places-grid">
        {places.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: '#555' }}>
            No recommendations yet. <a href="/planner" style={{ color: '#7AB2D3' }}>Plan a trip first!</a>
          </p>
        ) : places.map(place => (
          <div className="place-box" key={place.id}>
            <img src={place.image} alt={place.name} onError={e => { e.target.src = 'https://placehold.co/400x200/CCCCCC/000000?text=Image+Not+Found' }} />
            <div className="place-content">
              <h2>{place.name}</h2>
              <p>{place.description.slice(0, 100)}...</p>
              <p><strong>Location:</strong> {place.locationName}</p>
              <p><strong>Rating:</strong> {place.rating}</p>
            </div>
            <div className="place-overlay">
              <button className="read-more-btn" onClick={() => setModal(place)}>Read More</button>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom buttons */}
      <div className="bottom-btns">
        <button className="btn btn-primary" onClick={() => navigate('/planner')}>&#8592; Back to Planner</button>
        <button className="btn btn-secondary" onClick={() => navigate('/nearby')}>Nearby Places</button>
      </div>

      {/* ─── Product Modal ─── */}
      {modal && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            <img src={modal.image} alt={modal.name} className="modal-img" onError={e => { e.target.src = 'https://placehold.co/400x200' }} />
            <h2 className="modal-title">{modal.name}</h2>
            <p className="modal-desc">{modal.description}</p>
            <p><strong>Location:</strong> {modal.locationName}</p>
            <p><strong>Latitude:</strong> {modal.latitude}</p>
            <p><strong>Longitude:</strong> {modal.longitude}</p>
            <p><strong>Famous Food:</strong> {modal.famousFood}</p>
            <p><strong>Rating:</strong> {modal.rating}</p>
            <p><strong>Best Season:</strong> {modal.bestSeason}</p>
            <button
              className="modal-add-btn"
              disabled={isInCart(modal.id)}
              onClick={() => addToCart(modal)}
            >
              {isInCart(modal.id) ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}

      {/* ─── Cart Overlay ─── */}
      {cartOpen && (
        <div className="cart-overlay active" onClick={e => e.target === e.currentTarget && setCartOpen(false)}>
          <div className="cart-modal">
            <div className="cart-header">
              <h2>Your Selected Tourist Places</h2>
              <button className="close-cart" onClick={() => setCartOpen(false)}>&times;</button>
            </div>
            <div className="cart-body">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty. Add some places!</p>
              ) : (
                <ul className="cart-list">
                  {cart.map(item => (
                    <li className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} onError={e => { e.target.src = 'https://placehold.co/60x60' }} />
                      <div className="cart-item-detail"><h3>{item.name}</h3></div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="cart-footer">
              <span className="cart-total">Total Places: {cart.length}</span>
              <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Language Translator ─── */}
      {transOpen && (
        <div className="popup-overlay" onClick={e => e.target === e.currentTarget && setTransOpen(false)}>
          <div className="translator-card">
            <button className="popup-close" onClick={() => setTransOpen(false)}>&times;</button>
            <h2>Language Translator</h2>
            <div className="lang-dropdowns">
              <select value={fromLang} onChange={e => setFromLang(e.target.value)}>
                {languageList.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
              <button className="swap-btn" onClick={swapLangs}>⇄</button>
              <select value={toLang} onChange={e => setToLang(e.target.value)}>
                {languageList.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div className="text-areas">
              <textarea placeholder="Enter text here..." value={inputText} onChange={e => setInputText(e.target.value)} />
              <textarea readOnly value={outputText} placeholder="Translation appears here..." />
            </div>
            <div className="trans-actions">
              <button onClick={() => { setInputText(''); setOutputText('') }}>Clear</button>
              <button className="translate-btn" onClick={handleTranslate}>Translate</button>
              <button onClick={() => { navigator.clipboard?.writeText(outputText) }}>Copy</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Currency Converter ─── */}
      {currOpen && (
        <div className="popup-overlay" onClick={e => e.target === e.currentTarget && setCurrOpen(false)}>
          <div className="currency-card">
            <button className="popup-close" onClick={() => setCurrOpen(false)}>&times;</button>
            <h2>Currency Converter</h2>
            <div className="curr-amount">
              <p>Enter Amount</p>
              <input type="number" value={amount} min="1" onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="curr-dropdowns">
              <div className="curr-select">
                <img src={`https://flagsapi.com/${countryList[fromCurr] || 'US'}/flat/64.png`} alt="" />
                <select value={fromCurr} onChange={e => setFromCurr(e.target.value)}>
                  {Object.keys(countryList).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <span style={{ fontSize: '1.4rem', padding: '0 10px' }}>⇄</span>
              <div className="curr-select">
                <img src={`https://flagsapi.com/${countryList[toCurr] || 'IN'}/flat/64.png`} alt="" />
                <select value={toCurr} onChange={e => setToCurr(e.target.value)}>
                  {Object.keys(countryList).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <p className="rate-msg">{rateMsg}</p>
            <button className="translate-btn" onClick={fetchRate}>Get Exchange Rate</button>
          </div>
        </div>
      )}
    </div>
  )
}
