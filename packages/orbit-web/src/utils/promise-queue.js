export default function promiseQueue (promiseBuffer = [], resolve, reject) {
  const chain = new Promise(resolve => resolve())

  const loop = async () => {
    const current = promiseBuffer.shift()
    if (typeof current === 'function') {
      await current()
      return loop()
    } else {
      resolve()
    }
  }

  chain.then(loop).catch(reject)

  return chain
}
