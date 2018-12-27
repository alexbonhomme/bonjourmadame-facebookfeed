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

  // fetch Bonjour Madame picture
  fetchPicture()

  // loads Gainsbourg quotes
  fetchQuotes()
});

/**
 * Set daily picture fecth
 */
let fetchDate = new Date()

// fetch time is past, lets fetch tomorrow
if (fetchDate.getHours() > BM_PICTURE_FETCH_HOUR) {
  fetchDate.setDate(fetchDate.getDate() + 1)
}
fetchDate.setHours(BM_PICTURE_FETCH_HOUR)
fetchDate.setMinutes(0)

chrome.alarms.create('fetchMadame', {
  when: fetchDate.getTime(),
  periodInMinutes: 60*24 // every day
})

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name !== 'fetchMadame') {
    return
  }

  fetchPicture()
  fetchQuotes()
})
