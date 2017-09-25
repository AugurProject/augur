import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Identicon from 'react-blockies'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import Input from 'modules/common/components/input/input'
import AirbitzLogoIcon from 'modules/common/components/airbitz-logo-icon'

export default class AccountDetails extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    signOut: PropTypes.func.isRequired,
    updateAccountName: PropTypes.func.isRequired,
    name: PropTypes.string,
    airbitzAccount: PropTypes.object,
    manageAirbitzAccount: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      nameInputVisible: false,
      fullAccountVisible: false
    }

    this.toggleNameInputVisibility = this.toggleNameInputVisibility.bind(this)
    this.toggleFullAccountVisibility = this.toggleFullAccountVisibility.bind(this)
  }

  toggleNameInputVisibility() {
    this.setState({ nameInputVisible: !this.state.nameInputVisible })
  }

  toggleFullAccountVisibility() {
    this.setState({ fullAccountVisible: !this.state.fullAccountVisible })
  }

  updateAccountName(name) {
    if (this.props.name !== name) this.props.updateAccountName(name)
  }

  render() {
    const p = this.props
    const s = this.state

    const nameInputPlaceholder = 'Set Account Name'
    const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-fast'), 10)

    return (
      <article className="account-details">
        <div
          className="account-details-core"
        >
          <div
            className="identicon-container"
          >
            <Identicon
              seed={p.address}
              scale={8}
            />
            {p.airbitzAccount &&
              <button
                className="unstyled airbitz-logo-container"
                onClick={() => p.manageAirbitzAccount()}
              >
                <AirbitzLogoIcon />
              </button>
            }
          </div>
          <div
            className="account-details-core-values"
          >
            <div className="account-details-name">
              <CSSTransitionGroup
                transitionName="name-input"
                transitionEnterTimeout={animationSpeed}
                transitionLeaveTimeout={animationSpeed}
              >
                {s.nameInputVisible &&
                  <Input
                    autoFocus
                    className={classNames({ 'name-unset': !p.name })}
                    type="text"
                    value={p.name}
                    onChange={name => this.updateAccountName(name)}
                    onBlur={() => this.toggleNameInputVisibility()}
                    placeholder={nameInputPlaceholder}
                  />
                }
              </CSSTransitionGroup>
              <button
                className="unstyled"
                onClick={() => {
                  if (!s.nameInputVisible && !p.airbitzAccount) this.toggleNameInputVisibility()
                }}
              >
                <span
                  className={classNames('account-details-name-copy', {
                    'name-unset': !p.name,
                    'input-visible': s.nameInputVisible
                  })}
                >
                  {p.name || nameInputPlaceholder}
                </span>
              </button>
            </div>
            <div className="account-details-address">
              <span>{p.address}</span>
            </div>
            {p.airbitzAccount && p.manageAirbitzAccount &&
              <button
                className="unstyled account-details-airbitz"
                onClick={() => p.manageAirbitzAccount()}
              >
                Manage Airbitz Account
              </button>
            }
          </div>
        </div>
        <button
          className="unstyled link"
          onClick={p.signOut}
        >
          Sign Out
        </button>
      </article>
    )
  }
}
