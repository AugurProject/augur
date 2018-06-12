import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Helmet from 'react-helmet'

import Styles from 'modules/auth/components/edge-create/edge-create.styles'

export default class Edge extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    edgeContext: PropTypes.object,
    edgeLoginLink: PropTypes.func.isRequired,
    edgeOnLoad: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.edgeOnLoad(this.props.history)
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.Edge}>
        <Helmet>
          <title>Edge</title>
        </Helmet>
        <button
          className={classNames(
            Styles.button,
            Styles[`button--purple`],
            Styles.Edge__button,
          )}
          disabled={p.edgeContext == null}
          onClick={() => p.edgeLoginLink(p.history)}
        >
          {p.edgeContext == null ? 'Loading...' : 'Create Account with Edge'}
        </button>
      </section>
    )
  }
}
