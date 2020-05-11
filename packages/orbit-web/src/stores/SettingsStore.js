'use strict'

import { action, configure, observable, reaction, values, computed } from 'mobx'

import defaulNetworkSettings from '../config/network.default.json'
import defaultUiSettings from '../config/ui.default.json'

import { version } from '../../package.json'

configure({ enforceActions: 'observed' })

export default class SettingsStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.sessionStore = rootStore.sessionStore

    this._saveNetworkSettings = this._saveNetworkSettings.bind(this)
    this._saveUiSettings = this._saveUiSettings.bind(this)
    this._updateLanguage = this._updateLanguage.bind(this)

    // Reload settings when user changes
    reaction(() => this.sessionStore.username, this.load)

    // Need to react to language changes
    // since we need to call 'i18n.changeLanguage'
    reaction(() => this.uiSettings.language, this._updateLanguage)

    // Save network settings when they change
    reaction(() => values(this.networkSettings), this._saveNetworkSettings)

    // Save ui settings when they change
    reaction(() => values(this.uiSettings), this._saveUiSettings)
  }

  // Public instance variables

  @observable
  networkSettings = {}

  @observable
  uiSettings = {}

  // Private instance getters

  @computed
  get _settingsKeys () {
    const username = this.sessionStore.username
    if (!username) throw new Error('No logged in user')
    return {
      networkKey: `orbit-chat.${username}.network-settings`,
      uiKey: `orbit-chat.${username}.ui-settings`
    }
  }

  // Private instance methods

  _saveNetworkSettings () {
    try {
      const { networkKey } = this._settingsKeys
      localStorage.setItem(networkKey, JSON.stringify(this.networkSettings))
    } catch (err) {}
  }

  _saveUiSettings () {
    try {
      const { uiKey } = this._settingsKeys
      localStorage.setItem(uiKey, JSON.stringify(this.uiSettings))
    } catch (err) {}
  }

  _updateLanguage (lng) {
    this.rootStore.i18n.changeLanguage(lng)
  }

  // Public instance actions

  @action.bound
  load () {
    let networkSettings = {}
    let uiSettings = {}

    // Create a copy so we can alter the values without affecting the original
    const defaulNetworkSettingsCopy = JSON.parse(JSON.stringify(defaulNetworkSettings))
    const defaultUiSettingsCopy = JSON.parse(JSON.stringify(defaultUiSettings))

    // Get user defined settings from local storage
    try {
      const { networkKey, uiKey } = this._settingsKeys
      networkSettings = JSON.parse(localStorage.getItem(networkKey)) || {}
      uiSettings = JSON.parse(localStorage.getItem(uiKey)) || {}
    } catch (err) {}

    // Merge default settings with user defined settings
    Object.assign(this.networkSettings, defaulNetworkSettingsCopy, networkSettings)
    Object.assign(this.uiSettings, defaultUiSettingsCopy, uiSettings)

    this.rootStore.isNewAppVersion = this.uiSettings.appVersion !== version
    this.uiSettings.appVersion = version
  }
}
