import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { formatAttoRep, formatEther } from 'utils/format-number'

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
    const { claimableFees } = this.props
    this.setState({ claimableFees: claimableFees() })
  }

  render() {
    const s = this.state
    const unclaimedRep = formatAttoRep(s.claimableFees.unclaimedRepStaked, { decimals: 4, zeroStyled: true })
    const unclaimedEth = formatEther(s.claimableFees.unclaimedEth, { decimals: 4, zeroStyled: true })

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
                    <div className={Styles['ClaimableFees__fees--amount']}>{unclaimedRep.formatted}</div>
                  </li>
                  <li>
                    <div className={Styles['ClaimableFees__fees--denomination']}>ETH</div>
                    <div className={Styles['ClaimableFees__fees--amount']}>{unclaimedEth.formatted}</div>
                  </li>
                </ul>
                <div className={Styles['CreateMarketForm__cta--wrapper']}>
                  <button
                    className={Styles.ClaimableFees__cta}
                    disabled={unclaimedEth.formatted === '-' && unclaimedRep.formatted === '-' &&
                    'disabled'
                    }
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
