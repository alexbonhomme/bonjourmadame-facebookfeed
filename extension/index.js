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

  // prepare Bonjour Madame image
  const imgElement = buildImgElement()
  const controlsElement = buildControlsElement()

  const feedNode = elements[0]
  const feedContentNode = feedNode.firstChild
  feedContentNode.classList.add('bm-feed')

  // insert image
  feedNode.prepend(imgElement)

  // insert controls
  feedNode.prepend(controlsElement)


  // hide feed content
  chrome.storage.local.get(['showFeed'], ({ showFeed }) => {
    if (showFeed) {
      controlsElement.classList.remove('bm-feed-hidden')
    } else {
      controlsElement.classList.add('bm-feed-hidden')
    }
  })
}())
