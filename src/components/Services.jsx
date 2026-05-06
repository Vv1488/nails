const services = [
  { name: 'Манікюр', price: '250 грн', desc: 'Обробка та forme нігтів' },
  { name: 'Манікюр + покриття', price: '350 грн', desc: 'Повний комплекс з покриттям гель-лаком' },
  { name: 'Педикюр', price: '400 грн', desc: 'Догляд за нігтями ніг' },
  { name: 'Зняття покриття', price: '100 грн', desc: 'Безпечне зняття старого покриття' },
]

function Services() {
  return (
    <section id="services" className="section">
      <h2>Послуги та ціни</h2>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={i} className="service-card">
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className="price">{s.price}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
