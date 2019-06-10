function filterFn (obj) {
  return function (linkData) {
    var item = obj.assets.find(function (item) {
      return item.name.match(linkData.searchPattern)
    })

    if (item) {
      return {
        platform: linkData.platform,
        link: item.browser_download_url
      }
    } else {
      // Can't find, won't display.
      return false
    }
  }
}

function createAndAppendElement(element, items) {
  // Clear previous contents.
  element.innerHTML = '';

  items.forEach(function(item) {
    var l = document.createElement('a')
    l.href = item.link
    l.innerText = item.platform
    l.classList.add('download-link')

    element.appendChild(l)
  })
}

function populateDownloadLinks (className) {
  return function () {
    var downloadLinkWrapper = document.getElementsByClassName(className)
    // If we are on a page without any links.
    if(!downloadLinkWrapper) return;
    fetch('https://api.github.com/repos/AugurProject/augur-app/releases/latest')
      .then(function (res) {
        return res.json()
      })
      .catch(function () {
        console.error('Unable to fetch from Github releases.')
      })
      .then(function (data) {
        var items = [{
          searchPattern: /\.exe$/,
          platform: 'Windows'
        }, {
          searchPattern: /\.dmg$/,
          platform: 'MacOS'
        }, {
          searchPattern: /\.AppImage$/,
          platform: 'Linux'
        }].map(filterFn(data))
          .filter(function (item) {
          // Filter out missing links.
          return item
        })

        for (var i = 0; i < downloadLinkWrapper.length; i++) {
          createAndAppendElement(downloadLinkWrapper[i], items)
        }
      })
  }
}

// Note: This will run on page and will populate any div with the className 'download-links'.
var fn = populateDownloadLinks('download-links')
if (document.readyState === 'loading') {
  window.addEventListener('load', fn)
} else {
  fn()
}  

// Show and Hide Mobile Nav

var headerNav = document.getElementsByClassName('Header__nav')[0]
var mobileBars = document.getElementsByClassName('Header__nav-mobile-open')[0]
var mobileTimes = document.getElementsByClassName('Header__nav-mobile-close')[0]

function showMobileNav () {
  headerNav.classList.add('nav--open')
}

function hideMobileNav () {
  headerNav.classList.remove('nav--open')
}


mobileBars.onclick = showMobileNav
mobileTimes.onclick = hideMobileNav
