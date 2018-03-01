import React, { Component } from 'react'
import classNames from 'classnames'

import toggleHeight from 'utils/toggle-height/toggle-height'

import Styles from 'modules/auth/components/help/help.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

const HELPS = [
  {
    title: 'What is Augur?',
    def: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    title: 'How does a wallet work?',
    def: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    title: 'Which wallet is best for me?',
    def: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
]

export default class Help extends Component {
  constructor() {
    super()

    this.helpItem = []

    this.state = {
      areQuestionsVisible: false,
      visibleDefinitions: [],
    }

    this.toggleDefinition = this.toggleDefinition.bind(this)
  }

  toggleDefinition(index) {
    this.setState({
      visibleDefinitions: this.state.visibleDefinitions.indexOf(index) !== -1 ?
        this.state.visibleDefinitions.filter(item => item !== index) :
        [...this.state.visibleDefinitions, index],
    })
  }

  render() {
    const s = this.state

    return (
      <div className={Styles.Help} >
        <button
          className={Styles.Help__header}
          onClick={() => toggleHeight(this.helpItems, s.areQuestionsVisible, () => this.setState({ areQuestionsVisible: !s.areQuestionsVisible }))}
        >
          Confused? Get Help Here.
        </button>
        <div
          ref={(helpItems) => { this.helpItems = helpItems }}
          className={classNames(Styles.Help__items, ToggleHeightStyles['toggle-height-target'])}
        >
          {HELPS.map((help, i) => (
            <div
              key={help.title}
              className={Styles.Help__item}
            >
              <button
                onClick={() => toggleHeight(this.helpItem[i], this.state.visibleDefinitions.indexOf(i) !== -1, () => this.toggleDefinition(i))}
              >
                {help.title} {this.state.visibleDefinitions.indexOf(i) !== -1 ? '-' : '+'}
              </button>
              <div
                ref={(helpItem) => { this.helpItem[i] = helpItem }}
                className={classNames(Styles.Help__item, ToggleHeightStyles['toggle-height-target'])}
              >
                <p>
                  {help.def}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
