import { useState } from 'react'

const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота']
const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const API_URL = 'https://yaroslava-nails.onrender.com/api/bookings'

function Booking() {
  const [step, setStep] = useState(1)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, day, time })
      })

      if (!res.ok) throw new Error('Помилка')
      setDone(true)
    } catch {
      setError('Не вдалося відправити. Спробуйте пізніше.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setStep(1)
    setDay('')
    setTime('')
    setName('')
    setPhone('')
    setDone(false)
    setError('')
  }

  return (
    <section id="booking" className="section">
      <h2>Записатись</h2>

      {done ? (
        <div className="booking-success">
          <p>Дякуємо, {name}!</p>
          <p>Ваш запис: {day} о {time}</p>
          <p>Ярослава зв'яжеться з вами для підтвердження.</p>
          <button className="btn" onClick={handleReset}>Записатись ще</button>
        </div>
      ) : (
        <form className="booking-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <p>Оберіть день:</p>
              <div className="options">
                {days.map((d) => (
                  <button
                    type="button"
                    key={d}
                    className={`option-btn ${day === d ? 'active' : ''}`}
                    onClick={() => { setDay(d); setStep(2) }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <p>Оберіть час:</p>
              <div className="options">
                {times.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`option-btn ${time === t ? 'active' : ''}`}
                    onClick={() => { setTime(t); setStep(3) }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button type="button" className="btn-link" onClick={() => setStep(1)}>Назад</button>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <p>Ваші дані:</p>
              <input
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {error && <p className="booking-error">{error}</p>}
              <div className="form-buttons">
                <button type="button" className="btn-outline" onClick={() => setStep(2)}>Назад</button>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Відправка...' : 'Записатись'}
                </button>
              </div>
            </div>
          )}

          <div className="steps-indicator">
            <span className={step >= 1 ? 'active' : ''}>1. День</span>
            <span className={step >= 2 ? 'active' : ''}>2. Час</span>
            <span className={step >= 3 ? 'active' : ''}>3. Дані</span>
          </div>
        </form>
      )}
    </section>
  )
}

export default Booking
