/**
 *
 */
function buildContainerElement() {
  let imageContainerElement = document.createElement('div')

  imageContainerElement.classList.add('bm-picture-container')

  return imageContainerElement
}

/**
 *
 */
function buildImgElement() {
  let imgElement = document.createElement('img')

  imgElement.classList.add('bm-picture')

  chrome.storage.local.get(['imageUrl'], ({ imageUrl }) => {
    imgElement.src = imageUrl
  })

  return imgElement
}

/**
 *
 */
function buildQuoteElement() {
  let quoteElement = document.createElement('p')

  quoteElement.classList.add('bm-quote')

  chrome.storage.local.get(['quotes'], ({ quotes }) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

    quoteElement.innerText = randomQuote
  })

  return quoteElement
}

/**
 *
 */
function buildControlsElement() {
  let controlsElement = document.createElement('div')

  controlsElement.classList.add('bm-controls')
  controlsElement.innerHTML = `
    <button class="bm-control-button bm-madame-button">Bonjour Madame</button>
    <button class="bm-control-button bm-feed-button">Very uninteresting Facebook feed</button>
  `

  controlsElement.children[0].addEventListener('click', () => {
    controlsElement.classList.add('bm-feed-hidden')
    chrome.storage.local.set({
      showFeed: false
    })
  })

  controlsElement.children[1].addEventListener('click', () => {
    controlsElement.classList.remove('bm-feed-hidden')
    chrome.storage.local.set({
      showFeed: true
    })
  })

  return controlsElement
}

/**
 *
 */
(function () {
  const elements = document.querySelectorAll('div[id^="topnews_main_stream_"]');

  if (!elements.length) {
    return console.error('Missing Faccebook feed tag !');
  }

  // prepare elements
  const imgElement = buildImgElement()
  const controlsElement = buildControlsElement()
  const quotesElement = buildQuoteElement()

  // found and tag feed element
  const feedNode = elements[0]
  const feedContentNode = feedNode.firstChild
  feedContentNode.classList.add('bm-feed')

  // insert image & quote
  const containerElement = buildContainerElement()
  containerElement.append(imgElement)
  containerElement.append(quotesElement)

  feedNode.prepend(containerElement)

  // insert controls
  feedNode.prepend(controlsElement)

  // show/hide feed content
  chrome.storage.local.get(['showFeed'], ({ showFeed }) => {
    if (showFeed) {
      controlsElement.classList.remove('bm-feed-hidden')
    } else {
      controlsElement.classList.add('bm-feed-hidden')
    }
  })
}())
