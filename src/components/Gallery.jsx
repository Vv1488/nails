import { useState } from 'react'
import img1 from '../assets/Снимок экрана 2026-05-06 074549.png'
import img2 from '../assets/Снимок экрана 2026-05-06 074647.png'
import img3 from '../assets/Снимок экрана 2026-05-06 074711.png'
import img4 from '../assets/Снимок экрана 2026-05-06 074735.png'
import img5 from '../assets/Снимок экрана 2026-05-06 074806.png'
import img6 from '../assets/Снимок экрана 2026-05-06 074839.png'

const photos = [img1, img2, img3, img4, img5, img6]

function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="gallery" className="section">
      <h2>Галерея робіт</h2>
      <div className="gallery-grid">
        {photos.map((src, i) => (
          <div key={i} className="gallery-item" onClick={() => setSelected(src)}>
            <img src={src} alt={`Робота ${i + 1}`} />
          </div>
        ))}
      </div>
      <a
        href="https://instagram.com/__gurova.nail__"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline"
      >
        Більше в Instagram
      </a>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <img src={selected} alt="Робота" />
        </div>
      )}
    </section>
  )
}

export default Gallery
