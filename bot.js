import TelegramBot from 'node-telegram-bot-api'

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

export default new TelegramBot(TELEGRAM_TOKEN)
