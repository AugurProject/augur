/* eslint-env worker */
'use strict'

import '@babel/polyfill'

import IPFS from 'ipfs'
import Orbit from 'orbit_'

import promiseQueue from '../utils/promise-queue'
import { concatUint8Arrays } from '../utils/file-helpers'

const ORBIT_EVENTS = ['connected', 'disconnected', 'joined', 'left', 'peers']
const CHANNEL_FEED_EVENTS = ['write', 'load.progress', 'replicate.progress', 'ready', 'replicated']

async function onMessage ({ data }) {
  if (!data.action || typeof data.action !== 'string') return

  let response

  switch (data.action) {
    case 'network:start':
      response = await handleStart.call(this, data)
      break
    case 'network:stop':
      response = await handleStop.call(this, data)
      break
    case 'orbit:join-channel':
      response = await handleJoinChannel.call(this, data)
      break
    case 'orbit:leave-channel':
      response = await handleLeaveChannel.call(this, data)
      break
    case 'channel:send-text-message':
      response = await handleSendTextMessage.call(this, data)
      break
    case 'channel:send-file-message':
      response = await handleSendFileMessage.call(this, data)
      break
    case 'ipfs:get-file':
      response = await handleIpfsGetFile.call(this, data)
      break
    default:
      console.warn('Unknown action', data.action)
      break
  }

  if (!response) response = [{}]
  if (data.asyncKey) response[0].asyncKey = data.asyncKey
  this.postMessage(...response)
}

function orbitEvent (eventName, ...args) {
  if (typeof eventName !== 'string') return

  if (['joined', 'left'].indexOf(eventName) !== -1) {
    args = [args[0]]
  } else {
    args = []
  }

  this.postMessage({ action: 'orbit-event', name: eventName, args })
}

async function channelEvent (eventName, channelName, ...args) {
  if (typeof eventName !== 'string') return
  if (typeof channelName !== 'string') return

  const channel = this.orbit.channels[channelName]

  const meta = {
    channelName: channelName,
    replicationStatus: channel.replicationStatus
  }

  if (eventName === 'peer.update') {
    meta.peers = await channel.peers
  }

  this.postMessage({
    action: 'channel-event',
    name: eventName,
    meta,
    args
  })
}

async function handleStart ({ options }) {
  await startIPFS.call(this, options)
  await startOrbit.call(this, options)

  this.ipfs.version((err, { version }) => {
    if (err) {
      console.info('Unable to get js-ipfs version')
    }
    console.info(`Running js-ipfs version ${version}`)
  })
}

async function handleStop () {
  await this.orbit.disconnect()
  await this.ipfs.stop()
  delete this.orbit
  delete this.ipfs
}

async function handleJoinChannel ({ options: { channelName } }) {
  const channel = await this.orbit.join(channelName)

  channel.load(256)

  // Bind all relevant events
  CHANNEL_FEED_EVENTS.forEach(eventName => {
    channel.feed.events.on(eventName, channelEvent.bind(this, eventName, channelName))
  })
}

function handleLeaveChannel ({ options }) {
  this.orbit.leave(options.channelName)
}

function handleSendTextMessage ({ options }) {
  const channel = this.orbit.channels[options.channelName]
  const sendFunc = channel.sendMessage.bind(channel, options.message)
  queueCall.call(this, sendFunc)
}

function handleSendFileMessage ({ options }) {
  const channel = this.orbit.channels[options.channelName]
  const sendFunc = channel.sendFile.bind(channel, options.file)
  queueCall.call(this, sendFunc)
}

// Queue the calls to a promise queue
function queueCall (func) {
  // Get a reference to the buffer used by current promise queue
  this._callBuffer = this._callBuffer || []
  // Push to the buffer used by current promise queue
  this._callBuffer.push(func)

  // Either let the current queue run until it is done
  // or create a new queue
  this._promiseQueue =
    this._promiseQueue ||
    promiseQueue(this._callBuffer, () => {
      // Remove the current queue when done
      this._promiseQueue = null
    })
}

async function startIPFS (options) {
  this.ipfs = await IPFS.create(options.ipfs)
}

async function startOrbit (options) {
  this.orbit = await Orbit.create(this.ipfs, options.orbit)

  // Bind all relevant events
  ORBIT_EVENTS.forEach(eventName => {
    this.orbit.events.on(eventName, orbitEvent.bind(this, eventName))
  })

  // Fake the 'connected' event since we can not hear it with the async create API
  this.orbit.events.emit('connected', this.orbit.user)
}

function refreshChannelPeers () {
  if (this.orbit && this.orbit.channels) {
    Object.keys(this.orbit.channels).forEach(channelName => {
      channelEvent.call(this, 'peer.update', channelName)
    })
  }
}

async function handleIpfsGetFile ({ options }) {
  try {
    const array = await getFile(this.orbit, options.hash, this.postMessage, options)
    return [{ data: array }, [array.buffer]]
  } catch (error) {
    return [{ data: null, errorMsg: error.message }]
  }
}

function getFile (orbit, hash, postMessage, options = {}) {
  return new Promise((resolve, reject) => {
    const timeoutError = new Error('Timeout while fetching file')
    const timeout = options.timeout || 5 * 1000
    let timeoutTimer = setTimeout(() => {
      reject(timeoutError)
    }, timeout)
    const stream = orbit.getFile(hash)
    let array = new Uint8Array(0)
    stream.on('error', error => {
      clearTimeout(timeoutTimer)
      postMessage({ streamEvent: 'error', hash, error })
      reject(error)
    })
    stream.on('data', chunk => {
      clearTimeout(timeoutTimer)
      array = concatUint8Arrays(array, chunk)
      postMessage({ streamEvent: 'data', hash, chunk }, [chunk.buffer])
      timeoutTimer = setTimeout(() => {
        reject(timeoutError)
      }, timeout)
    })
    stream.on('end', () => {
      clearTimeout(timeoutTimer)
      postMessage({ streamEvent: 'end', hash })
      resolve(array)
    })
  })
}

// Get a reference just so we can bind onmessage and use 'call' on setinterval
const worker = self || {}
worker.writableStream = ''
onmessage = onMessage.bind(worker)

setInterval(() => {
  refreshChannelPeers.call(worker)
}, 1000)
