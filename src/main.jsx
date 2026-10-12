import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DNAMusical from './DNAMusical.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('Erro DNA Musical:', error, info) }
  render() {
    if (this.state.error) return (
      <main style={{minHeight:'100vh',background:'#04181B',color:'#EDEEE6',padding:'48px 20px',fontFamily:'sans-serif'}}>
        <div style={{maxWidth:720,margin:'auto'}}>
          <h1 style={{color:'#EC6E1A'}}>Não foi possível abrir o DNA Musical</h1>
          <p>Ocorreu um erro nesta versão de testes. Copie a mensagem abaixo e envie para corrigirmos.</p>
          <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',background:'#102E32',padding:20,borderRadius:12}}>{String(this.state.error)}</pre>
          <button onClick={()=>location.reload()} style={{background:'#EC6E1A',color:'white',padding:'12px 20px',border:0,borderRadius:10}}>Tentar novamente</button>
        </div>
      </main>
    )
    return this.props.children
  }
}
function SiteRouter() {
  const [isDNA, setIsDNA] = useState(window.location.hash.startsWith('#/dna-musical'))
  useEffect(() => {
    const update = () => setIsDNA(window.location.hash.startsWith('#/dna-musical'))
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return <ErrorBoundary>{isDNA ? <DNAMusical /> : <App />}</ErrorBoundary>
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode><SiteRouter /></React.StrictMode>
)
