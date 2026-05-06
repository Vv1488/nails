const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')

const app = express()
app.use(cors())
app.use(express.json())

const BOOKINGS_FILE = path.join(__dirname, 'bookings.json')
const BOT_TOKEN = process.env.BOT_TOKEN || ''
const ADMIN_ID = process.env.ADMIN_ID || ''

function getBookings() {
  if (!fs.existsSync(BOOKINGS_FILE)) return []
  return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'))
}

function saveBookings(bookings) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
}

let bot = null
if (BOT_TOKEN && ADMIN_ID) {
  bot = new TelegramBot(BOT_TOKEN, { polling: true })

  bot.on('callback_query', (query) => {
    const data = query.data
    const bookings = getBookings()
    const index = parseInt(data.split('_')[1])
    const action = data.split('_')[0]

    if (index >= 0 && index < bookings.length) {
      const booking = bookings[index]

      if (action === 'confirm') {
        bookings[index].status = 'confirmed'
        saveBookings(bookings)
        bot.sendMessage(booking.chatId || ADMIN_ID,
          `✅ Ярослава підтвердила ваш запис!\n📅 ${booking.day} о ${booking.time}\n📍 вул. Ливарна 9, Дніпро`
        )
        bot.answerCallbackQuery(query.id, { text: 'Підтверджено!' })
        bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
          chat_id: ADMIN_ID,
          message_id: query.message.message_id
        })
      } else if (action === 'cancel') {
        bookings[index].status = 'cancelled'
        saveBookings(bookings)
        bot.sendMessage(booking.chatId || ADMIN_ID,
          `❌ На жаль, запис скасовано. Зв'яжіться з Ярославою: +380 97 197 73 05`
        )
        bot.answerCallbackQuery(query.id, { text: 'Скасовано!' })
        bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
          chat_id: ADMIN_ID,
          message_id: query.message.message_id
        })
      }
    }
  })

  console.log('Telegram бот запущен')
}

app.post('/api/bookings', (req, res) => {
  const { name, phone, day, time } = req.body

  if (!name || !phone || !day || !time) {
    return res.status(400).json({ error: 'Заполните все поля' })
  }

  const bookings = getBookings()
  const booking = {
    id: Date.now(),
    name,
    phone,
    day,
    time,
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  bookings.push(booking)
  saveBookings(bookings)

  if (bot && ADMIN_ID) {
    bot.sendMessage(ADMIN_ID,
      `📅 Новый запись!\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📅 День: ${day}\n🕐 Время: ${time}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Підтвердити', callback_data: `confirm_${bookings.length - 1}` },
              { text: '❌ Скасувати', callback_data: `cancel_${bookings.length - 1}` }
            ]
          ]
        }
      }
    )
  }

  res.json({ success: true, booking })
})

app.get('/api/bookings', (req, res) => {
  res.json(getBookings())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
