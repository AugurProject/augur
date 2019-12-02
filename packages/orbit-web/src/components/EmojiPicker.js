'use strict'

import React from 'react'
import { Emoji } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css'
import '../styles/EmojiPicker.scss'

function EmojiPicker ({ emojis, emojiSize, emojiSet, onChange, ...rest }, ref) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const listRef = React.useRef()

  const handleChange = React.useCallback(
    done => {
      try {
        const emoji = emojis[selectedIndex]
        return onChange(emoji, done)
      } catch (e) {
        return onChange(null, done)
      }
    },
    [selectedIndex, emojis, onChange]
  )

  const handleClick = React.useCallback(
    index => {
      setSelectedIndex(index)
      handleChange()
    },
    [handleChange]
  )

  const handleKeyDown = React.useCallback(
    e => {
      if (selectedIndex > emojis.length) setSelectedIndex(0)

      let handled = true

      switch (e.key) {
        case 'ArrowRight':
          setSelectedIndex(calculateLeftRightIndex(true))
          break
        case 'ArrowLeft':
          setSelectedIndex(calculateLeftRightIndex(false))
          break
        case 'ArrowDown':
          setSelectedIndex(calculateUpDownIndex(true))
          break
        case 'ArrowUp':
          setSelectedIndex(calculateUpDownIndex(false))
          break
        case 'Tab':
          handleChange(true)
          break
        case 'Enter':
          handleChange(true)
          break
        default:
          handled = false
          break
      }

      if (handled) e.preventDefault()
    },
    [selectedIndex, emojis.length, handleChange]
  )

  // Allow parent component to call 'handleKeyDown'
  React.useImperativeHandle(ref, () => ({ handleKeyDown }), [handleKeyDown])

  const calculateLeftRightIndex = React.useCallback(
    right =>
      right
        ? (selectedIndex + 1) % emojis.length
        : selectedIndex > 0
          ? selectedIndex - 1
          : emojis.length - 1,
    [selectedIndex, emojis.length]
  )

  const calculateUpDownIndex = React.useCallback(
    down => {
      if (!listRef.current) return

      const actualEmojiSize = emojiSize + 2 * 1 // 1px padding
      const actualWidth = listRef.current.offsetWidth - 5 * 2 // 5px padding
      const itemsPerRow = actualWidth / actualEmojiSize

      if (down) {
        if (selectedIndex + itemsPerRow > emojis.length - 1) {
          // Going over the bottom, must flip
          return selectedIndex % itemsPerRow
        } else {
          // Normal case
          return selectedIndex + itemsPerRow
        }
      } else {
        if (selectedIndex - itemsPerRow < 0) {
          // Going over the top, must flip
          const rows = Math.floor(emojis.length / itemsPerRow)
          if (emojis.length % itemsPerRow > selectedIndex) {
            // There is an element at the same index on the last row
            return selectedIndex + itemsPerRow * rows
          } else {
            // There is NOT an element at the same index on the last row
            // Go to the second last row since it should have this index
            return selectedIndex + itemsPerRow * (rows - 1)
          }
        } else {
          // Normal case
          return selectedIndex - itemsPerRow
        }
      }
    },
    [selectedIndex, emojis.length, emojiSize]
  )

  return (
    <ul ref={listRef} className='EmojiPicker fadeUpAnimation' {...rest}>
      {emojis.map((emoji, idx) => {
        return (
          <li
            key={emoji.id}
            className={selectedIndex === idx ? 'selected' : ''}
            onClick={() => handleClick(idx)}
          >
            <Emoji emoji={emoji} size={emojiSize} set={emojiSet} />
          </li>
        )
      })}
    </ul>
  )
}

export default React.forwardRef(EmojiPicker)
