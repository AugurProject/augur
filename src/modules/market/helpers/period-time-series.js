export default function test(messageToProcess) {
  console.log('messageToProcess -- ', messageToProcess)
  const worker = new Worker(functionToWorkerURL(sendMessageBack))

  worker.postMessage('TESTING')

  worker.onmessage = (e) => {
    console.log('got dat message back -- ', e.data)
  }
}

function sendMessageBack() {
  onmessage = (workerMessage) => {
    console.log('worker -- ', workerMessage)
    postMessage(`got it! -- ${workerMessage.data}`)
  }
}

function functionToWorkerURL(func) {
  const blob = new Blob(['('+func.toString()+')()'], { type: 'application/javascript' })
  return URL.createObjectURL(blob)
}
