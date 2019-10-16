'use strict'

import { action, configure, observable, computed, runInAction } from 'mobx'

import Logger from '../utils/logger'
import * as cookies from '../utils/cookies'

configure({ enforceActions: 'observed' })

const logger = new Logger()

const cookieKey = 'orbit-chat-username'

export default class SessionStore {
  constructor (rootStore) {
    this.rootStore = rootStore

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  // Private instance variables

  @observable
  _user = null

  // Public instance variable getters

  @computed
  get username () {
    if (!this._user || !this._user.username) return null
    return this._user.username
  }

  @computed
  get isAuthenticated () {
    return !!(this._user && this._user.username)
  }

  // Private instance actions

  // Async so the API is consistend if async is needed in the future
  @action.bound
  async _setUser (user) {
    if (user && !user.username) throw new Error('"user.username" is not defined')
    runInAction(() => {
      this._user = user
    })
    this._cacheUser(user)
  }

  // Private instance methods

  _readUserFromCache () {
    const username = cookies.getCookie(cookieKey)
    return username ? { username } : null
  }

  _cacheUser (user) {
    if (user) {
      cookies.setCookie(cookieKey, user.username, 1)
    } else {
      cookies.expireCookie(cookieKey)
    }
  }

  // Public instance methods

  loadFromCache () {
    const cached = this._readUserFromCache()
    if (cached) this.login(cached)
  }

  login (user) {
    logger.info('User login')
    return this._setUser(user)
  }

  logout () {
    logger.info('User logout')
    return this._setUser(null)
  }
}
