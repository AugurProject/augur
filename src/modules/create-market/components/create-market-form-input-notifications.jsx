import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import debounce from 'utils/debounce'

export default class CreateMarketFormInputNotifications extends Component {
  constructor(props) {
    super(props)

    this.state = {
      warnings: []
    }

    this.clearWarnings = debounce(this.clearWarnings.bind(this), 3000)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.warnings && this.props.warnings !== nextProps.warnings) {
      this.setState({ warnings: nextProps.warnings })
      this.clearWarnings()
    }
  }

  clearWarnings() {
    this.setState({ warnings: [] })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={classNames('create-market-form-input-notifications', p.classNames, { hasNotifications: (p.errors && p.errors.length) || s.warnings.length })} >
        {(p.errors || []).map(error => (
          <li
            key={error}
            className="notification-error"
          >
            {error}
          </li>
        ))}
        {(p.warnings || []).map(warning => (
          <li
            key={warning}
            className="notification-warning"
          >
            {warning}
          </li>
        ))}
      </ul>
    )
  }
}

CreateMarketFormInputNotifications.propTypes = {
  classNames: PropTypes.string,
  errors: PropTypes.array,
  warnings: PropTypes.array
}

CreateMarketFormInputNotifications.defaultProps = {
  classNames: '',
  errors: [],
  warnings: []
}
