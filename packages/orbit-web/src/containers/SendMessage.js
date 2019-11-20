'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { emojiIndex } from 'emoji-mart'

import EmojiPicker from '../components/EmojiPicker'

import '../styles/SendMessage.scss'

function SendMessage ({ channelName, onSendMessage, theme, useEmojis, emojiSet, disabled }) {
  const [t] = useTranslation()

  const [inputValue, setInputValue] = React.useState('')
  const [emojiResults, setEmojiResults] = React.useState([])
  const [emojiPickerActive, setEmojiPickerActive] = React.useState(false)

  const inputRef = React.useRef()
  const emojiPickerRef = React.useRef()
  const submitHiddenButton = React.useRef()

  const focusInput = React.useCallback(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const handleInputSubmit = React.useCallback(
    e => {
      e.preventDefault()

      if (!inputRef.current) return

      const inputField = inputRef.current
      const text = inputField.value.trim()

      setInputValue('')
      setEmojiResults([])
      setEmojiPickerActive(false)

      focusInput()

      onSendMessage(text).catch(e => {
        // There was an error sending the message
        // Revert input value and focus the field
        setInputValue(text)
        focusInput()
      })
    },
    [onSendMessage, focusInput]
  )

  const handleInputChange = React.useCallback(() => {
    if (!inputRef.current) return
    const inputValue = inputRef.current.value
    const lastWord = inputValue.split(' ').pop()
    const emojiPickerActive = lastWord.startsWith(':') && useEmojis
    const lastEmojiIdx = emojiPickerActive ? inputValue.lastIndexOf(':') : null
    const emojiSearch = emojiPickerActive ? inputValue.slice(lastEmojiIdx) : null
    let emojiResults = emojiSearch ? emojiIndex.search(emojiSearch) : []

    if (emojiResults.length === 0) {
      // Slice the ':' prefix so we search for emojis instead of emoticons so
      // ':smile' => 'smile'
      // This is needed because we can also search for ':)' which requires the
      // ':' prefix
      emojiResults = emojiSearch ? emojiIndex.search(emojiSearch.slice(1)) : []
    }

    setInputValue(inputValue)
    setEmojiResults(emojiResults)
    setEmojiPickerActive(emojiPickerActive)
  }, [useEmojis])

  const handleInputKeyDown = (e) => {
    if(e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      submitHiddenButton.current.click();
    }
  };

  const handleEmojiChange = React.useCallback(
    (emoji, done = false) => {
      if (!emoji || !inputRef.current) return

      const i = inputValue.lastIndexOf(':')
      const text = inputValue.slice(0, i) + emoji.colons

      setInputValue(text)
      setEmojiPickerActive(!done)

      inputRef.current.focus()
    },
    [inputValue]
  )

  React.useLayoutEffect(focusInput, [channelName, disabled, focusInput])

  function getEmojiPickerStyle (emojiSize) {
    return {
      maxWidth: (emojiSize + 2) * 10, // 2 * 1px padding or border
      bottom: inputRef.current ? inputRef.current.offsetHeight + 10 : '45px'
    }
  }

  const pickerEmojiSize = 24

  return (
    <div className='SendMessage'>
      <form onSubmit={handleInputSubmit}>
        {emojiPickerActive && emojiResults.length > 0 ? (
          <EmojiPicker
            ref={emojiPickerRef}
            emojis={emojiResults}
            onChange={handleEmojiChange}
            emojiSize={pickerEmojiSize}
            emojiSet={emojiSet}
            style={getEmojiPickerStyle(pickerEmojiSize)}
          />
        ) : null}
        <textarea
          cols="30"
          rows="2"
          ref={inputRef}
          type='text'
          placeholder={t('channel.sendMessagePlaceholder')}
          style={theme}
          value={inputValue}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <input type="submit" ref={submitHiddenButton} />
      </form>
    </div>
  )
}

SendMessage.propTypes = {
  channelName: PropTypes.string.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  useEmojis: PropTypes.bool.isRequired,
  emojiSet: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

export default SendMessage
