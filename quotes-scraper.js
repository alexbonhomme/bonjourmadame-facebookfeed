const fs = require('fs')
const { JSDOM } = require('jsdom')

const BASE_URL = 'http://evene.lefigaro.fr/citations/serge-gainsbourg';
const TOTAL_PAGES = 4
const OUTPUT_FILE = 'extension/quotes.json'


/**
 * Get quotes
 */
function fetchQuotes(totalPages) {
  const promises = []

  for (let i = 1; i <= totalPages; i += 1) {
    promises.push(
      JSDOM.fromURL(`${BASE_URL}?page=${i}`).then(({ window }) => {
        const { document } = window;

        const quotes = document.querySelector('.figsco__selection__list__evene__list').children;

        if (!quotes.length) {
          throw new Error('Quotes not found !')
        }

        const textQuoteCollection = Array.from(quotes).map(quote => {
          return quote.querySelector('.figsco__quote__text').children[0].textContent.substr(1).slice(0, -1)
        })

        return textQuoteCollection;
      })
    )
  }

  return Promise.all(promises).then(data => {
    return [].concat.apply([], data)
  })
}

fetchQuotes(TOTAL_PAGES).then(quoteCollection => {
  fs.writeFile(OUTPUT_FILE, JSON.stringify(quoteCollection), 'utf8', () => {
    console.log('quotes.json created !')
  })
})

