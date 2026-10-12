import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DNAMusical from './DNAMusical.jsx'
import './index.css'

function SiteRouter() {
  const [isDNA, setIsDNA] = useState(window.location.hash.startsWith('#/dna-musical'))
  useEffect(() => {
    const update = () => setIsDNA(window.location.hash.startsWith('#/dna-musical'))
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return isDNA ? <DNAMusical /> : <App />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><SiteRouter /></React.StrictMode>
)
