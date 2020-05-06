function debugSend (networkStore, channelName, amount = 1, interval = 100, text = 'ping') {
  let timer
  try {
    const channel = networkStore.channels[channelName]
    if (channel) {
      let i = 0
      timer = setInterval(() => {
        channel.sendMessage(`${text} (${i})`)
        i++
        if (i === amount) clearInterval(timer)
      }, interval)
    } else {
      throw new Error('Channel not found')
    }
  } catch (e) {
    if (timer) clearInterval(timer)
    console.error(e)
  }
}

export function addDebug (options) {
  const { networkStore } = options.rootStore

  if (process.env.NODE_ENV === 'development') {
    if (!window.debugSend) window.debugSend = debugSend.bind(null, networkStore)
  }
}
