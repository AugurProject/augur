import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ForkingContent from 'modules/forking/components/forking-content/forking-content'

import Styles from 'modules/forking/components/forking-notification/forking-notification.styles'

class ForkingNotification extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isExpanded: false,
    }

    this.expand = this.expand.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({
        isExpanded: false,
      })
    }
  }

  expand() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    })
  }

  render() {
    const forkWindowActive = Number(this.props.forkEndTime) > this.props.currentTime

    return (
      <section>
        <header className={Styles.ForkingNotification}>
          <section>
            <img
              className={Styles.ForkingNotification__AlertIcon}
              alt="Alert"
              src="../../assets/images/alert-icon.svg"
            />
            {forkWindowActive &&
              <div className={Styles.ForkingNotification__message}>
                A Fork has been initiated. This universe is now locked.
              </div>
            }
            {!forkWindowActive &&
              <div className={Styles.ForkingNotification__message}>
                A Fork has occurred. This universe is now locked.
              </div>
            }
            <div className={Styles.ForkingNotification__addition_details}>
              <button
                className={Styles.ForkingNotification__addition_details_button}
                onClick={this.expand}
              >
                Additional details
                <i className={classNames(Styles.ForkingNotification__arrow, 'fa', this.state.isExpanded ? 'fa-angle-up' :'fa-angle-down')} />
              </button>
            </div>
          </section>
        </header>
        {this.state.isExpanded &&
          <ForkingContent
            forkingMarket={this.props.forkingMarket}
            forkEndTime={this.props.forkEndTime}
            currentTime={this.props.currentTime}
            expanded
          />
        }
      </section>
    )
  }
}

ForkingNotification.propTypes = {
  location: PropTypes.object.isRequired,
  forkingMarket: PropTypes.string.isRequired,
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
}

export default ForkingNotification
