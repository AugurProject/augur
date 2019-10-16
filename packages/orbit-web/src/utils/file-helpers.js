'use strict'

import hljs from 'highlight.js'

export function getHumanReadableSize (size) {
  if (size < 0) return 0
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(i > 2 ? 2 : 0) * 1 +
    '\u00a0' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

const fileExtensionPattern = /(?:\.([^.]+))?$/

export function getFileExtension (filename) {
  return fileExtensionPattern.exec(filename)[1]
}

export function isAudio (filename) {
  const ext = getFileExtension(filename)
  return ext === 'mp3' || ext === 'ogg' || ext === 'wav'
}

export function isText (filename) {
  const ext = getFileExtension(filename)
  return ext === 'txt' || hljs.getLanguage(ext)
}

export function isImage (filename) {
  const ext = getFileExtension(filename)
  const supportedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']
  return supportedImageTypes.includes(ext.toLowerCase())
}

export function isVideo (filename) {
  const ext = getFileExtension(filename)
  return ext === 'mp4' || ext === 'webm' || ext === 'ogv' || ext === 'avi' || ext === 'mkv'
}

export function toArrayBuffer (buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}

export function concatUint8Arrays (a, b) {
  const tmp = new Uint8Array(a.length + b.length)
  tmp.set(a)
  tmp.set(b, a.length)
  return tmp
}
