const reviews = [
  { name: 'Олена', emoji: '👩‍🦰', text: 'Найкращий манікюр у Дніпрі! Ярослава — майстер своєї справи.' },
  { name: 'Марія', emoji: '👩', text: 'Хожу вже пів року, завжди ідеально. Рекомендую!' },
  { name: 'Катерина', emoji: '👩‍🦱', text: 'Швидко, якісно, з душею. Покриття тримає 3 тижні!' },
  { name: 'Анна', emoji: '👱‍♀️', text: 'Зробила френч — просто восторг! Дуже акуратно і красиво.' },
  { name: 'Вікторія', emoji: '👩‍🦳', text: 'Приємна майстриня, затишна атмосфера. Повернусь ще!' },
  { name: 'Дар\'я', emoji: '🧑‍🦰', text: 'Найкращі нігтики в місті! Дякую за красоту кожного разу.' },
]

function Reviews() {
  return (
    <section id="reviews" className="section">
      <h2>Відгуки</h2>
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-header">
              <span className="review-avatar">{r.emoji}</span>
              <span className="review-name">{r.name}</span>
            </div>
            <p className="review-text">"{r.text}"</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Reviews
