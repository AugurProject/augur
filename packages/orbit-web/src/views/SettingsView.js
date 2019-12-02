'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import { useObserver } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import settingsOptions from '../config/setting.options.json'

import locales from '../locales'
import themes from '../themes'

import RootContext from '../context/RootContext'

import '../styles/SettingsView.scss'

settingsOptions.themeName.options = Object.keys(themes)
settingsOptions.language.options = Object.keys(locales)

function SettingsView () {
  const { uiStore } = React.useContext(RootContext)

  const [t] = useTranslation()

  React.useEffect(() => {
    uiStore.setTitle(`${t('viewNames.settings')} | Orbit`)
  }, [])

  const handleChange = React.useCallback((event, field) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    uiStore[field.name] = value
  }, [])

  function renderSelectField (field) {
    return (
      <select value={uiStore[field.name]} onChange={e => handleChange(e, field)}>
        {field.options.map(o => (
          <option key={`${field.name}-${o}`} value={o}>
            {t(`settings.options.${field.name}.${o}`)}
          </option>
        ))}
      </select>
    )
  }

  function renderBooleanField (field) {
    return (
      <input
        name={field.name}
        type='checkbox'
        checked={uiStore[field.name]}
        onChange={e => handleChange(e, field)}
      />
    )
  }

  function renderField (key) {
    const field = settingsOptions[key]
    field.name = key

    let fieldEl
    switch (field.type) {
      case 'select':
        fieldEl = renderSelectField(field)
        break
      case 'boolean':
        fieldEl = renderBooleanField(field)
        break
      default:
        break
    }

    return (
      <div className='row fadeInAnimation' key={field.name}>
        <span className='key'>{t(`settings.names.${field.name}`)}</span>
        {fieldEl}
        {field.description ? (
          <span className='description'>{t(`settings.descriptions.${field.description}`)}</span>
        ) : null}
      </div>
    )
  }

  return useObserver(() => (
    <div className='SettingsView'>{Object.keys(settingsOptions).map(renderField)}</div>
  ))
}

export default hot(module)(SettingsView)
