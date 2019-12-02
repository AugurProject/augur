'use strict'

import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import PreviewTextFile from './PreviewTextFile'

import CustomSuspense from '../Suspense'

import Logger from '../../utils/logger'
import { isAudio, isImage, isVideo } from '../../utils/file-helpers'

const logger = new Logger()

async function loadPreviewContent (loadFunc, hash, name, mimeType, onLoad) {
  const fileIsAudio = isAudio(name)
  const fileIsImage = isImage(name)
  const fileIsVideo = isVideo(name)

  const buffer = await loadFunc(hash)
  const blob = new Blob([buffer], { type: mimeType })
  const url = window.URL.createObjectURL(blob)

  if (fileIsAudio) {
    return <audio src={url} controls autoPlay onLoad={onLoad} />
  } else if (fileIsImage) {
    return <img src={url} onLoad={onLoad} />
  } else if (fileIsVideo) {
    return <video src={url} controls autoPlay onLoad={onLoad} />
  } else {
    return <PreviewTextFile blob={blob} filename={name} onLoad={onLoad} />
  }
}

function FilePreview ({ hash, loadFile, name, mimeType, onSizeUpdate, onFilePreviewLoaded }) {
  const [t] = useTranslation()
  const [previewContent, setPreviewContent] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(true)
  const isMounted = useRef() // track whether component is mounted

  const _onLoad = useCallback(() => {
    if (isMounted.current && typeof onFilePreviewLoaded === 'function') onFilePreviewLoaded()
  }, [isMounted.current, onFilePreviewLoaded])

  const _onSizeUpdate = useCallback(() => {
    if (isMounted.current && typeof onSizeUpdate === 'function') onSizeUpdate()
  }, [isMounted.current, onSizeUpdate])

  useEffect(
    () => {
      isMounted.current = true
      setPreviewLoading(true)

      loadPreviewContent(loadFile, hash, name, mimeType, _onLoad)
        .then(html => {
          if (isMounted.current) {
            setPreviewContent(html)
            setPreviewLoading(false)
          }
        })
        .catch(e => {
          logger.error(e)
          if (isMounted.current) {
            setPreviewLoading(false)
            _onSizeUpdate()
          }
        })

      return () => {
        // clean up, called when react dismounts this component
        isMounted.current = false
      }
    },
    [hash] // Only run effect if 'hash' changes
  )

  const loadingElement = (
    <div className='FilePreview fadeInAnimation'>
      <span className='previewStatus smallText'>{t('channel.file.previewLoading')}</span>
    </div>
  )

  const errorElement = (
    <div className='FilePreview fadeInAnimation'>
      <span className='previewStatus smallText'>{t('channel.file.unableToDisplay')}</span>
    </div>
  )

  const previewElement = (
    <div className='FilePreview fadeInAnimation'>
      <span className='preview smallText'>{previewContent}</span>
    </div>
  )

  return (
    <CustomSuspense
      fallback={loadingElement}
      callback={_onSizeUpdate}
      delay={250}
      loading={previewLoading}
    >
      {previewContent ? previewElement : errorElement}
    </CustomSuspense>
  )
}

FilePreview.propTypes = {
  hash: PropTypes.string.isRequired,
  loadFile: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  onSizeUpdate: PropTypes.func,
  onFilePreviewLoaded: PropTypes.func
}

export default FilePreview
