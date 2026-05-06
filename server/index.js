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

// Bot state
const allClients = new Set()
const waitForName = {}
const waitForReview = {}
const waitForBroadcast = {}
const selectedDay = {}
const selectedTime = {}

let bot = null
if (BOT_TOKEN && ADMIN_ID) {
  bot = new TelegramBot(BOT_TOKEN, { polling: true })

  function mainMenu(chatId) {
    bot.sendMessage(chatId, 'Обери що тебе цікавить:', {
      reply_markup: {
        keyboard: [
          ['\u{1F485} Послуги та ціни', '\u{1F4C5} Записатись'],
          ['\u{1F486} Догляд за нігтями', '\u{1F4CD} Адреса'],
          ['\u{1F4DE} Контакти', '\u{2B50} Залишити відгук']
        ],
        resize_keyboard: true
      }
    })
  }

  function adminMenu(chatId) {
    bot.sendMessage(chatId, 'Панель управління \u{1F451}', {
      reply_markup: {
        keyboard: [
          ['\u{1F4CB} Всі записи', '\u{1F4E2} Розсилка'],
          ['\u{1F3E0} Головне меню']
        ],
        resize_keyboard: true
      }
    })
  }

  // /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    allClients.add(chatId)
    if (chatId.toString() === ADMIN_ID) {
      bot.sendMessage(chatId, 'Привіт, Ярослава! \u{1F451}')
      adminMenu(chatId)
    } else {
      bot.sendMessage(chatId, 'Привіт! \u{1F485} Я бот Ярослави.')
      mainMenu(chatId)
    }
  })

  // /записи
  bot.onText(/\/записи/, (msg) => {
    if (msg.chat.id.toString() !== ADMIN_ID) return
    const bookings = getBookings()
    if (bookings.length === 0) {
      bot.sendMessage(ADMIN_ID, 'Записів поки немає.')
      return
    }
    let list = '\u{1F4CB} Всі записи:\n\n'
    bookings.forEach((b, i) => {
      const status = b.status === 'confirmed' ? '✅' : b.status === 'cancelled' ? '❌' : '⏳'
      list += `${i + 1}. ${status} ${b.name} — ${b.day} о ${b.time}\n`
    })
    bot.sendMessage(ADMIN_ID, list)
  })

  // Messages
  bot.on('message', (msg) => {
    if (!msg.text || msg.text.startsWith('/')) return
    const chatId = msg.chat.id
    const text = msg.text
    allClients.add(chatId)

    // Admin actions
    if (chatId.toString() === ADMIN_ID) {
      if (text === '\u{1F4CB} Всі записи') {
        const bookings = getBookings()
        if (bookings.length === 0) {
          bot.sendMessage(ADMIN_ID, 'Записів поки немає.')
          return
        }
        let list = '\u{1F4CB} Всі записи:\n\n'
        bookings.forEach((b, i) => {
          const status = b.status === 'confirmed' ? '✅' : b.status === 'cancelled' ? '❌' : '⏳'
          list += `${i + 1}. ${status} ${b.name} — ${b.day} о ${b.time}\n`
        })
        bot.sendMessage(ADMIN_ID, list)
        return
      }
      if (text === '\u{1F4E2} Розсилка') {
        waitForBroadcast[ADMIN_ID] = true
        bot.sendMessage(ADMIN_ID, 'Напиши повідомлення для розсилки всім клієнтам:')
        return
      }
      if (waitForBroadcast[ADMIN_ID]) {
        delete waitForBroadcast[ADMIN_ID]
        let sent = 0
        allClients.forEach(clientId => {
          if (clientId.toString() !== ADMIN_ID) {
            bot.sendMessage(clientId, '\u{1F4E2} Повідомлення від Ярослави:\n\n' + text)
            sent++
          }
        })
        bot.sendMessage(ADMIN_ID, '✅ Розсилку відправлено ' + sent + ' клієнтам!')
        adminMenu(ADMIN_ID)
        return
      }
      if (text === '\u{1F3E0} Головне меню') {
        mainMenu(chatId)
        return
      }
      return
    }

    // Review
    if (waitForReview[chatId]) {
      delete waitForReview[chatId]
      bot.sendMessage(chatId, '\u{2B50} Дякуємо за відгук! Ярослава обов\'язково прочитає.')
      bot.sendMessage(ADMIN_ID, '\u{2B50} Новий відгук:\n\n' + text)
      mainMenu(chatId)
      return
    }

    // Name for booking
    if (waitForName[chatId]) {
      const name = text
      delete waitForName[chatId]

      const bookings = getBookings()
      const booking = {
        id: Date.now(),
        name,
        phone: '',
        day: selectedDay[chatId],
        time: selectedTime[chatId],
        status: 'pending',
        chatId: chatId,
        createdAt: new Date().toISOString()
      }
      bookings.push(booking)
      saveBookings(bookings)

      bot.sendMessage(chatId, '⏳ Твою заявку відправлено! Очікуй підтвердження від Ярослави.')

      bot.sendMessage(ADMIN_ID,
        `\u{1F4C5} Новий запис!\n\u{1F464} Ім'я: ${name}\n\u{1F4C5} День: ${selectedDay[chatId]}\n\u{1F550} Час: ${selectedTime[chatId]}`,
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
      mainMenu(chatId)
      return
    }

    // Menu buttons
    if (text === '\u{1F485} Послуги та ціни') {
      bot.sendMessage(chatId, '\u{1F485} Послуги та ціни:\n\n• Манікюр — 250 грн\n• Манікюр + покриття — 350 грн\n• Педикюр — 400 грн\n• Зняття покриття — 100 грн')
    } else if (text === '\u{1F4C5} Записатись') {
      bot.sendMessage(chatId, 'Обери зручний день:', {
        reply_markup: {
          keyboard: [
            ['Понеділок', 'Вівторок', 'Середа'],
            ['Четвер', 'П\'ятниця', 'Субота'],
            ['\u{1F519} Головне меню']
          ],
          resize_keyboard: true
        }
      })
    } else if (['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'].includes(text)) {
      selectedDay[chatId] = text
      bot.sendMessage(chatId, 'Обери зручний час:', {
        reply_markup: {
          keyboard: [
            ['09:00', '10:00', '11:00'],
            ['12:00', '13:00', '14:00'],
            ['15:00', '16:00', '17:00'],
            ['\u{1F519} Головне меню']
          ],
          resize_keyboard: true
        }
      })
    } else if (['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].includes(text)) {
      selectedTime[chatId] = text
      waitForName[chatId] = true
      bot.sendMessage(chatId, 'Як тебе звати? Напиши своє ім\'я:', {
        reply_markup: { remove_keyboard: true }
      })
    } else if (text === '\u{2B50} Залишити відгук') {
      waitForReview[chatId] = true
      bot.sendMessage(chatId, 'Напиши свій відгук — Ярослава обов\'язково прочитає! \u{1F60A}', {
        reply_markup: { remove_keyboard: true }
      })
    } else if (text === '\u{1F486} Догляд за нігтями') {
      bot.sendMessage(chatId, '\u{1F486} Поради по догляду:\n\n• Не мочити нігті 2 години після покриття\n• Використовуй олію для кутикули щодня\n• Не відкривай банки нігтями \u{1F604}\n• Носи рукавички при прибиранні\n• Зволожуй руки кремом кожен вечір\n• Корекція кожні 2 тижні')
    } else if (text === '\u{1F4CD} Адреса') {
      bot.sendMessage(chatId, '\u{1F4CD} Адреса: вул. Ливарна 9, Дніпро\n\u{1F550} Години роботи: Пн-Сб 09:00 - 17:00')
    } else if (text === '\u{1F4DE} Контакти') {
      bot.sendMessage(chatId, '\u{1F4E8} Telegram: @Yaroslava_005\n\u{1F4F8} Інстаграм: @__gurova.nail__')
    } else if (text === '\u{1F519} Головне меню') {
      mainMenu(chatId)
    }
  })

  // Callback queries (confirm/cancel from site and bot)
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
        const msg = `✅ Ярослава підтвердила${booking.chatId ? ' ваш' : ''} запис!\n\u{1F4C5} ${booking.day} о ${booking.time}\n\u{1F4CD} вул. Ливарна 9, Дніпро`
        if (booking.chatId) {
          bot.sendMessage(booking.chatId, msg)
        }
        bot.answerCallbackQuery(query.id, { text: 'Підтверджено!' })
        bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
          chat_id: ADMIN_ID,
          message_id: query.message.message_id
        })
      } else if (action === 'cancel') {
        bookings[index].status = 'cancelled'
        saveBookings(bookings)
        const msg = `❌ На жаль запис скасовано. Зв'яжіться з Ярославою: @Yaroslava_005`
        if (booking.chatId) {
          bot.sendMessage(booking.chatId, msg)
        }
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

// API routes
app.post('/api/bookings', (req, res) => {
  const { name, phone, day, time } = req.body

  if (!name || !phone || !day || !time) {
    return res.status(400).json({ error: 'Заповніть всі поля' })
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
      `\u{1F4C5} Новий запис з сайту!\n\u{1F464} Ім'я: ${name}\n\u{1F4DE} Телефон: ${phone}\n\u{1F4C5} День: ${day}\n\u{1F550} Час: ${time}`,
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
