import React, { Component } from 'react'
import { TransitionGroup } from 'react-transition-group' // TODO -- fix up the transitions in this component

import Styles from 'modules/auth/components/help/help.styles'

const helps = [
  {
    title: 'What is Augur?',
    def: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    title: 'How does a wallet work?',
    def: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    title: 'Which wallet is best for me?',
    def: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
]

export default class Help extends Component {
  constructor() {
    super()

    this.state = {
      areQuestionsVisible: false,
      visibleDefinitions: []
    }

    this.toggleDefinition = this.toggleDefinition.bind(this)
  }

  toggleDefinition(index) {
    this.setState({
      visibleDefinitions: this.state.visibleDefinitions.indexOf(index) !== -1 ?
        this.state.visibleDefinitions.filter(item => item !== index) :
        [...this.state.visibleDefinitions, index]
    })
  }

  render() {
    const s = this.state

    return (
      <div className={Styles.Help} >
        <button
          className={Styles.Help__Header}
          onClick={() => this.setState({ areQuestionsVisible: !s.areQuestionsVisible })}
        >
          Confused? Get Help Here.
        </button>
        <TransitionGroup>
          {s.areQuestionsVisible &&
            helps.map((help, i) => (
              <div
                key={help.title}
                className={Styles.Help__Item}
              >
                <button
                  onClick={() => this.toggleDefinition(i)}
                >
                  {help.title} +
                </button>
                <TransitionGroup>
                  {s.visibleDefinitions.indexOf(i) !== -1 &&
                    <p>
                      {help.def}
                    </p>
                  }
                </TransitionGroup>
              </div>
            ))
          }
        </TransitionGroup>
      </div>
    )
  }
}
