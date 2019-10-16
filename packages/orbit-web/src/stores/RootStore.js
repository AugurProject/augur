'use strict'

import NetworkStore from './NetworkStore'
import UiStore from './UiStore'
import SessionStore from './SessionStore'
import SettingsStore from './SettingsStore'

export default class RootStore {
  constructor (i18n) {
    // The ordering matters
    this.i18n = i18n
    this.sessionStore = new SessionStore(this)
    this.settingsStore = new SettingsStore(this)
    this.networkStore = new NetworkStore(this)
    this.uiStore = new UiStore(this)
  }
}
