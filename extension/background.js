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

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled')

  // set default options
  chrome.storage.local.set({
    showFeed: false
  })

  // fetch Bonjour Madame picture
  toDataURL('http://giskard.aqelia.com:8888', dataUrl => {
    // store base64 image
    chrome.storage.local.set({
      imageUrl: dataUrl
    })
  })

  // loads quotes
  const quotesUrl = chrome.runtime.getURL('quotes.json')
  fetch(quotesUrl)
    .then(response => response.json())
    .then(quotes => {
      // store quotes in local storage
      chrome.storage.local.set({
        quotes: quotes
      })
    });
});