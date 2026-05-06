import bg from '../assets/IMG_3440.JPG'

function Hero() {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${bg})` }}>
      <div className="hero-overlay">
        <h1>Yaroslava Nails</h1>
        <p>Манікюр та покриття у Дніпрі</p>
        <a href="#booking" className="btn btn-pulse">Записатись</a>
      </div>
    </section>
  )
}

export default Hero
