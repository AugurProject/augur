import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views'

import debounce from 'utils/debounce'
import makePath from 'modules/app/helpers/make-path'

export default class PortfolioNavs extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    portfolioNavItems: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props)

    this.updatePortfolioNavHeight = debounce(this.updatePortfolioNavHeight.bind(this))
  }

  componentWillMount() {
    window.addEventListener('resize', this.updatePortfolioNavHeight)
  }

  componentDidMount() {
    if (this.props.location.pathname === makePath(MY_POSITIONS) ||
        this.props.location.pathname === makePath(MY_MARKETS) ||
        this.props.location.pathname === makePath(MY_REPORTS)
    ) {
      this.updatePortfolioNavHeight()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.location.pathname !== nextProps.location.pathname &&
      (nextProps.location.pathname === makePath(MY_POSITIONS) ||
      nextProps.location.pathname === makePath(MY_MARKETS) ||
      nextProps.location.pathname === makePath(MY_REPORTS))
    ) {
      this.updatePortfolioNavHeight()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePortfolioNavHeight)
  }

  updatePortfolioNavHeight() {
    if (this.portfolioNav) {
      const newHeight = this.portfolioNavContainer && this.portfolioNavContainer.clientHeight

      this.portfolioNav.style.height = `${newHeight}px`
    }
  }

  render() {
    const p = this.props

    return (
      <article
        ref={(portfolioNav) => { this.portfolioNav = portfolioNav }}
        className={classNames('portfolio-navs', p.className)}
      >
        <div
          ref={(portfolioNavContainer) => { this.portfolioNavContainer = portfolioNavContainer }}
          className="portfolio-navs-container"
        >
          <div className="portfolio-navs-content">
            {(p.portfolioNavItems || []).map((navItem, i) => (
              <Link
                to={makePath(navItem.view)}
                key={navItem.label}
                className={classNames('portfolio-nav-item', { 'active-nav-item': makePath(navItem.view) === p.location.pathname })}
              >
                <span>{navItem.label}</span>
                <div className="portfolio-nav-item-stats">
                  {navItem.leadingValue && navItem.leadingValue.value !== 0 ?
                    <ValueDenomination
                      {...navItem.leadingValue || {}}
                    /> :
                    <span className="null-portfolio-value">{navItem.leadingValueNull}</span>
                  }
                  {navItem.trailingValue && navItem.trailingValue.value !== 0 ?
                    <ValueDenomination
                      {...navItem.trailingValue || {}}
                    /> :
                    <span className="null-portfolio-value">{navItem.trailingValueNull}</span>
                  }
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    )
  }
}
