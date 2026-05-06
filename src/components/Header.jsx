import { useState, useEffect } from 'react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
  }, [dark])

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#" className="logo">Yaroslava Nails</a>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setDark(!dark)}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Послуги</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Галерея</a>
          <a href="#booking" onClick={() => setMenuOpen(false)}>Запис</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>Відгуки</a>
          <a href="#contacts" onClick={() => setMenuOpen(false)}>Контакти</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
