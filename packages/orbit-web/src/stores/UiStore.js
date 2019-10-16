'use strict'

import { action, computed, configure, observable, reaction } from 'mobx'

import { throttleEvent } from '../utils/throttle'

import Themes from '../themes'

configure({ enforceActions: 'observed' })

throttleEvent('resize', 'optimizedResize', window)

/**
 * UiStore acts as an interface between SettingsStore and the user.
 * It is also reponsible for tracking different UI related variables.
 */
export default class UiStore {
  constructor (rootStore) {
    this.rootStore = rootStore
    this.sessionStore = this.rootStore.sessionStore
    this.settingsStore = this.rootStore.settingsStore
    this.networkStore = this.rootStore.networkStore

    window.addEventListener('optimizedResize', this._onWindowResize)

    reaction(
      () => this._title,
      title => {
        document.title = title
      }
    )

    reaction(
      () => this.networkStore.hasUnreadMessages,
      () => {
        const oldTitle = this._title.replace('* ', '')
        this.setTitle(oldTitle)
      }
    )

    this._windowDimensions = this._getWindowDimensions()
  }

  // Private instance variables

  @observable
  _windowDimensions = {
    width: 0,
    height: 0
  }

  @observable
  _currentChannelName = null

  @observable
  _isControlPanelOpen = false

  @observable
  _userProfilePanelPosition = null

  @observable
  _userProfilePanelUser = null

  @observable
  _title = 'Orbit'

  // Private static methods

  _getWindowDimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  // Public instance variable getters

  @computed
  get currentChannelName () {
    return this._currentChannelName
  }

  @computed
  get isControlPanelOpen () {
    return this._isControlPanelOpen
  }

  @computed
  get userProfilePanelPosition () {
    return this._userProfilePanelPosition
  }

  @computed
  get userProfilePanelUser () {
    return this._userProfilePanelUser
  }

  @computed
  get userProfilePanelIsOpen () {
    return this._userProfilePanelPosition && this._userProfilePanelUser
  }

  @computed
  get title () {
    return this._title
  }

  @computed
  get windowDimensions () {
    return this._windowDimensions
  }

  // Private instance actions

  @action.bound
  _onWindowResize () {
    this._windowDimensions = this._getWindowDimensions()
  }

  // Public instance actions

  @action.bound
  setCurrentChannelName (val) {
    this._currentChannelName = val
  }

  @action.bound
  openControlPanel () {
    if (!this.sessionStore.isAuthenticated) return
    this._isControlPanelOpen = true
  }

  @action.bound
  closeControlPanel () {
    this._isControlPanelOpen = false
  }

  @action.bound
  setTitle (val) {
    this._title = this.networkStore.hasUnreadMessages ? `* ${val}` : val
  }

  @action.bound
  openUserProfilePanel (user, position) {
    this._userProfilePanelPosition = position
    this._userProfilePanelUser = user
  }

  @action.bound
  closeUserProfilePanel () {
    this._userProfilePanelPosition = null
    this._userProfilePanelUser = null
  }

  // SettingsStore interface

  @computed
  get themeName () {
    return this.settingsStore.uiSettings.themeName
  }

  set themeName (val) {
    this.settingsStore.uiSettings.themeName = val
  }

  @computed
  get theme () {
    return Themes[this.themeName]
  }

  @computed
  get language () {
    return this.settingsStore.uiSettings.language
  }

  set language (val) {
    this.settingsStore.uiSettings.language = val
  }

  @computed
  get colorifyUsernames () {
    return this.settingsStore.uiSettings.colorifyUsernames
  }

  set colorifyUsernames (val) {
    this.settingsStore.uiSettings.colorifyUsernames = val
  }

  @computed
  get useEmojis () {
    return this.settingsStore.uiSettings.useEmojis
  }

  set useEmojis (val) {
    this.settingsStore.uiSettings.useEmojis = val
  }

  @computed
  get emojiSet () {
    return this.settingsStore.uiSettings.emojiSet
  }

  set emojiSet (val) {
    this.settingsStore.uiSettings.emojiSet = val
  }

  @computed
  get messageNotifications () {
    return this.settingsStore.uiSettings.messageNotifications
  }

  set messageNotifications (val) {
    this.settingsStore.uiSettings.messageNotifications = val
  }

  @computed
  get useLargeMessage () {
    return this.settingsStore.uiSettings.useLargeMessage
  }

  set useLargeMessage (val) {
    this.settingsStore.uiSettings.useLargeMessage = val
  }

  @computed
  get useMonospaceFont () {
    return this.settingsStore.uiSettings.useMonospaceFont
  }

  set useMonospaceFont (val) {
    this.settingsStore.uiSettings.useMonospaceFont = val
  }

  @computed
  get sidePanelPosition () {
    return this.settingsStore.uiSettings.sidePanelPosition
  }

  set sidePanelPosition (val) {
    this.settingsStore.uiSettings.sidePanelPosition = val
  }
}
