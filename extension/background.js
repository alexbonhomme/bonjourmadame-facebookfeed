BM_PICTURE_FETCH_HOUR = '11'

/**
 * @see https://stackoverflow.com/a/20285053
 * @param {*} url
 * @param {*} callback
 */
function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

/**
 * Store today Madame in local storage
 */
function fetchPicture() {
  console.debug('fetch madame')

  toDataURL('http://giskard.aqelia.com:8888', dataUrl => {
    // store base64 image
    chrome.storage.local.set({
      imageUrl: dataUrl
    })
  })
}

/**
 * Store a random quote in local storage
 */
function fetchQuotes() {
  const quotesUrl = chrome.runtime.getURL('quotes.json')

  return fetch(quotesUrl)
    .then(response => response.json())
    .then(quotes => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

      // store today quote in local storage
      chrome.storage.local.set({
        quote: randomQuote
      })
    })
}

chrome.runtime.onInstalled.addListener(() => {
  // set default options
  chrome.storage.local.set({
    showFeed: false
  })
});

/**
 * Set daily picture/quote fecth
 */
const now = Date.now()
chrome.alarms.create('fetchMadame', {
  when: now,
  periodInMinutes: 60 // each hour
})

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name !== 'fetchMadame') {
    return
  }

  chrome.storage.local.get(['lastFetch'], ({ lastFetch }) => {
    // Bonjour Madame pictures are published at 10am
    const currentDate = new Date()
    if (currentDate.getHours() < 10) {
      return
    }

    // last fetch is less than 24h
    if (lastFetch && currentDate.getTime() - lastFetch < 1000 * 60 * 60 * 24) {
      return
    }

    // fetch Bonjour Madame picture
    fetchPicture()

    // loads Gainsbourg quotes
    fetchQuotes()

    // store fetch time
    chrome.storage.local.set({
      lastFetch: currentDate.getTime()
    })
  })
})
