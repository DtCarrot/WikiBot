import { retrieveWikiPage } from './wikipedia'

const parseAndReply = (userId, wikiJSON, bot) => {
  const pageArr = wikiJSON.query.pages
  // Get the page ID
  const pageId = Object.keys(pageArr)[0]
  const title = pageArr[pageId].title
  const extract = pageArr[pageId].extract
  // define the buttons
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
  // Set parse mode to html (Allow markups as <b>, <i>, etc)
  const parse_mode = 'html'
  const text = `<b>${title}</b> - ${extract}`

  // Check whether there is any featured image in Wikipedia
  if (pageArr[pageId].thumbnail) {
    // Get the url of the image
    const url = pageArr[pageId].thumbnail.source
    const opts = {
      // Buttons
      reply_markup,
      caption: text,
      // Enable html mode
      parse_mode,
    }
    // Send photos to user
    bot.sendPhoto(userId, url, opts)
  } else {
    bot.sendMessage(userId, text, {
      // Buttons
      reply_markup,
      // Enable html mode
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
      await bot.sendMessage(msg.from.id, replyMsg)
      const wikiJSON = await retrieveWikiPage()
      parseAndReply(msg.from.id, wikiJSON, bot)
    } else {
      await bot.sendMessage(msg.from.id, 'Invalid command')
    }
  })
}

export default createBotHandler
