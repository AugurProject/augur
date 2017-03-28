import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';

import debounce from 'utils/debounce';

export default class PortfolioNavs extends Component {
  static propTypes = {
    activeView: PropTypes.string.isRequired,
    portfolioNavItems: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.updatePortfolioNavHeight = debounce(this.updatePortfolioNavHeight.bind(this));
  }

  componentWillMount() {
    window.addEventListener('resize', this.updatePortfolioNavHeight);
  }

  componentDidMount() {
    if (this.props.activeView === MY_POSITIONS ||
      this.props.activeView === MY_MARKETS ||
      this.props.activeView === MY_REPORTS
    ) {
      this.updatePortfolioNavHeight();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.activeView !== nextProps.activeView &&
      (nextProps.activeView === MY_POSITIONS ||
      nextProps.activeView === MY_MARKETS ||
      nextProps.activeView === MY_REPORTS)
    ) {
      this.updatePortfolioNavHeight();
    }
  }

  updatePortfolioNavHeight() {
    const newHeight = this.portfolioNavContainer && this.portfolioNavContainer.clientHeight;

    this.portfolioNav.style.height = `${newHeight}px`;
  }

  render() {
    const p = this.props;

    return (
      <article
        ref={(portfolioNav) => { this.portfolioNav = portfolioNav; }}
        className={classNames('portfolio-navs', p.className)}
      >
        <div
          ref={(portfolioNavContainer) => { this.portfolioNavContainer = portfolioNavContainer; }}
          className="portfolio-navs-container"
        >
          <div className="portfolio-navs-content">
            {(p.portfolioNavItems || []).map((navItem, i) => (
              <Link
                key={navItem.label}
                className={classNames('portfolio-nav-item', { 'active-nav-item': navItem.page === p.activeView })}
                href={navItem.link.href}
                onClick={navItem.link.onClick}
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
    );
  }
}
