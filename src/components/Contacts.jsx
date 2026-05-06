function Contacts() {
  return (
    <section id="contacts" className="section">
      <h2>Контакти</h2>
      <div className="contacts-grid">
        <div className="contact-item">
          <span className="contact-icon">📍</span>
          <p>вул. Ливарна 9, Дніпро</p>
        </div>
        <div className="contact-item">
          <span className="contact-icon">🕐</span>
          <p>Пн-Сб 10:00 - 20:00</p>
        </div>
        <div className="contact-item">
          <span className="contact-icon">📞</span>
          <a href="tel:+380971977305">+380 97 197 73 05</a>
        </div>
        <div className="contact-item">
          <span className="contact-icon">📸</span>
          <a href="https://instagram.com/__gurova.nail__" target="_blank" rel="noopener noreferrer">
            @__gurova.nail__
          </a>
        </div>
      </div>
      <div className="contact-buttons">
        <a href="https://t.me/Yaroslava_005" target="_blank" rel="noopener noreferrer" className="contact-btn telegram">
          Telegram
        </a>
        <a href="https://instagram.com/__gurova.nail__" target="_blank" rel="noopener noreferrer" className="contact-btn instagram">
          Instagram
        </a>
      </div>
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1327!2d35.0593051!3d48.4659031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dbe3892e8633ed%3A0xbeb8f0f8213c7206!2sHOPE%20Coffeebar!5e0!3m2!1suk!2sua!4v1"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '16px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Карта"
        ></iframe>
      </div>
    </section>
  )
}

export default Contacts
