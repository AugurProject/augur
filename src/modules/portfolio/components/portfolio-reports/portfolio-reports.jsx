import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Styles from './portfolio-reports.styles'

export default class PortfolioReports extends Component {
  static propTypes = {
    claimableFees: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      claimableFees: {},
    }
  }

  componentWillMount() {
    this.setState({ claimableFees: this.props.claimableFees() })
  }

  render() {
    const s = this.state

    return (
      <section>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <article className={Styles.ClaimAllSection}>
          <h4 className={Styles.ClaimAllSection__heading}>Claim all available stake and fees</h4>
          <section>
            <article className={Styles.ClaimableFees}>
              <section className={Styles.ClaimableFees__fees}>
                <ul className={Styles['ClaimableFees__fees--list']}>
                  <li>
                    <div className={Styles['ClaimableFees__fees--denomination']}>REP</div>
                    <div className={Styles['ClaimableFees__fees--amount']}>{s.claimableFees.unclaimedRepStaked || 0}</div>
                  </li>
                  <li>
                    <div className={Styles['ClaimableFees__fees--denomination']}>ETH</div>
                    <div className={Styles['ClaimableFees__fees--amount']}>{s.claimableFees.unclaimedEth || 0}</div>
                  </li>
                </ul>
                <div className={Styles['CreateMarketForm__button--wrapper']}>
                  <button
                    className={Styles.ClaimableFees__button}
                  >Claim
                  </button>
                </div>
              </section>
            </article>
          </section>
        </article>
      </section>
    )
  }
}
