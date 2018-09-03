import { retrieveWikiPage } from './wikipedia'

const parseAndReply = (chatId, wikiJSON, bot) => {
  const pageArr = wikiJSON.query.pages
  // Get the page ID
  const pageId = Object.keys(pageArr)[0]
  const title = pageArr[pageId].title
  const extract = pageArr[pageId].extract
  const reply_markup = JSON.stringify({
    inline_keyboard: [
      [
        {
          text: 'Open on wikipedia',
          url: pageArr[pageId].fullurl,
        },
      ],
      [
        {
          text: 'Give me one more',
          callback_data: 'answer',
        },
      ],
    ],
  })
  const parse_mode = 'html'
  const text = `<b>${title}</b> - ${extract}`

  if (pageArr[pageId].thumbnail) {
    const url = pageArr[pageId].thumbnail.source
    // bot.sendMessage(msg.chat.id, extract, { parseMode: 'html' })
    const opts = {
      reply_markup,
      caption: text,
      parse_mode,
    }
    bot.sendPhoto(chatId, url, opts)
  } else {
    bot.sendMessage(chatId, text, {
      reply_markup,
      parse_mode,
    })
  }
}

const createBotHandler = bot => {
  bot.on('callback_query', async function(callbackQuery) {
    const wikiJSON = await retrieveWikiPage()
    parseAndReply(callbackQuery.from.id, wikiJSON, bot)
    return
  })
  bot.on('message', async function(msg) {
    let replyMsg =
      'WikiBot generates random articles from wikipedia for users to learn something new'
    // If user click the start button
    if (/\/start/.test(msg.text)) {
      bot.sendMessage(msg.chat.id, replyMsg)
      const wikiJSON = await retrieveWikiPage()
      parseAndReply(msg.chat.id, wikiJSON, bot)
    } else if (/\/page/.test(msg.text)) {
      const wikiJSON = await retrieveWikiPage()
      parseAndReply(msg.chat.id, wikiJSON, bot)
    } else {
      bot.sendMessage(msg.chat.id, 'Invalid command')
    }
  })
}

export default createBotHandler
