'use strict'

export default function redirectToHttps (enabled = true) {
  if (enabled && window.location.href.match('http:')) {
    window.location.href = window.location.href.replace('http', 'https')
  }
}
