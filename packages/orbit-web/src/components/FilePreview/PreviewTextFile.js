'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Highlight from '../Highlight'

import { getFileExtension } from '../../utils/file-helpers'

function PreviewTextFile ({ blob, filename, onLoad, ...rest }) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fileReader = new FileReader()
    fileReader.onload = ({ target: { result } }) => {
      setResult(result)
      setTimeout(onLoad, 0)
    }
    fileReader.onerror = () => {
      fileReader.abort()
      throw new Error('Unable to read file')
    }
    fileReader.readAsText(blob, 'utf-8')
  }, [blob])

  return result ? (
    <Highlight extension={getFileExtension(filename)} {...rest}>
      {result}
    </Highlight>
  ) : null
}

PreviewTextFile.propTypes = {
  blob: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
  onLoad: PropTypes.func.isRequired
}

export default PreviewTextFile
