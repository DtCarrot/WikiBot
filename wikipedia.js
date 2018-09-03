import fetch from 'node-fetch'

const wikiRandomUrl =
  'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=pageimages|extracts|info&format=json&inprop=url&explaintext&exchars=130'

async function retrieveWikiPage() {
  try {
    let result = await fetch(wikiRandomUrl)
    let wikiJSON = await result.json()
    return wikiJSON
  } catch (e) {
    console.log('Error in retrieving wiki pages: ', e)
  }
}

export { retrieveWikiPage }
