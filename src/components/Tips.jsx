const tips = [
  { icon: '💧', title: 'Не мочити 2 години', text: 'Після покриття уникайте води протягом 2 годин' },
  { icon: '🫧', title: 'Олія для кутикули', text: 'Використовуйте олію щодня для здоров\'я нігтів' },
  { icon: '🧤', title: 'Рукавички', text: 'Носіть рукавички при прибиранні та митті посуду' },
  { icon: '🚫', title: 'Не відкривайте банки', text: 'Не використовуйте нігті як інструмент' },
  { icon: '✨', title: 'Зволоження', text: 'Зволожуйте руки кремом кожен вечір' },
  { icon: '🕐', title: 'Корекція', text: 'Приходьте на корекцію кожні 2 тижні' },
]

function Tips() {
  return (
    <section id="tips" className="section">
      <h2>Догляд за нігтями</h2>
      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div key={i} className="tip-card">
            <span className="tip-icon">{tip.icon}</span>
            <h3>{tip.title}</h3>
            <p>{tip.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Tips
