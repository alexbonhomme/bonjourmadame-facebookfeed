/**
 *
 * @param {HTMLNode} node
 * @param {string} src
 */
function appendImage(node, src) {
  var img = document.createElement('img');
  img.src = src
  img.classList.add('bonjourmadame-picture');

  node.appendChild(img);
}

/**
 *
 */
(function() {
  const elements = document.querySelectorAll('div[id^="topnews_main_stream_"]');

  if (!elements.length) {
    return console.error('Missing Faccebook feed tag !');
  }

  const feedNode = elements[0];

  // removes feed content
  feedNode.firstChild.remove();

  // insert Bonjour Madame image
  chrome.storage.local.get(['imageUrl'], ({ imageUrl }) => appendImage(feedNode, imageUrl));
}())
