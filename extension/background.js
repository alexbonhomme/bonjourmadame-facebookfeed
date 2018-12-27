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
 *
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
 *
 */
function fetchQuotes() {
  const quotesUrl = chrome.runtime.getURL('quotes.json')

  return fetch(quotesUrl)
    .then(response => response.json())
    .then(quotes => {
      // store quotes in local storage
      chrome.storage.local.set({
        quotes: quotes
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
let todayFetch = new Date()
todayFetch.setHours(BM_PICTURE_FETCH_HOUR)
todayFetch.setMinutes(0)

chrome.alarms.create('fetchMadame', {
  when: todayFetch.getTime(),
  periodInMinutes: 24*60 // every day
})

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === 'fetchMadame') {
    fetchPicture();
  }
})
