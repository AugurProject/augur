

export default function (chat) {
  assert.isDefined(chat, `chat isn't defined`)
  assert.isObject(chat, `chat isn't an object`)

  Object.keys(chat).forEach((room) => {
    assert.isDefined(chat[room], `chat.${room} isn't defined`)
    assert.isObject(chat[room], `chat.${room} isn't an object`)
  })

  // TODO -- flesh these test out
}
