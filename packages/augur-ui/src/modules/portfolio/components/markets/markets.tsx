import { TXEventName } from '@augurproject/sdk-lite';
import classNames from 'classnames';
import { CancelTextButton, SubmitTextButton } from 'modules/common/buttons';
import { END_TIME } from 'modules/common/constants';
import { LinearPropertyLabel, PendingLabel } from 'modules/common/labels';
import { MarketProgress } from 'modules/common/progress';

import Styles from 'modules/portfolio/components/common/quad.styles.less';

import FilterBox from 'modules/portfolio/containers/filter-box';
import { MarketData } from 'modules/types';
import React, { Component } from 'react';

const sortByOptions = [
  {
    label: 'Creation Time',
    value: 'creationTime',
    comp(marketA, marketB) {
      return marketB.creationTime - marketA.creationTime;
    },
  },
  {
    label: 'Expiring Soonest',
    value: END_TIME,
    comp(marketA, marketB) {
      if (marketA.pending) return 1;
      if (marketB.pending) return 0;
      return marketA.endTime - marketB.endTime;
    },
  },
  {
    label: 'Most Recently Traded',
    value: 'recentlyTraded',
    comp(marketA, marketB) {
      return (
        marketB.recentlyTraded.timestamp - marketA.recentlyTraded.timestamp
      );
    },
  },
  {
    label: 'Most Recently Depleted',
    value: 'recentlyDepleted',
    comp(marketA, marketB) {
      return (
        marketB.recentlyDepleted.timestamp - marketA.recentlyDepleted.timestamp
      );
    },
  },
];

function filterComp(input, market) {
  if (!market) return false;
  return market.description
    ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0
    : true;
}

interface MyMarketsProps {
  myMarkets: MarketData[];
  currentAugurTimestamp: number;
  disputingWindowEndTime: number;
  disputingWindowStartTime: number;
  removePendingMarket: Function;
  retrySubmitMarket: Function;
  toggle: Function;
  hide: boolean;
  extend: boolean;
}

class MyMarkets extends Component<MyMarketsProps> {
  static defaultProps = {
    disputingWindowEndTime: 0,
    disputingWindowStartTime: 0,
    currentAugurTimestamp: 0,
  };

  constructor(props) {
    super(props);

    this.renderRightContent = this.renderRightContent.bind(this);
    this.renderToggleContent = this.renderToggleContent.bind(this);
  }

  renderRightContent(market) {
    const { currentAugurTimestamp, disputingWindowEndTime, disputingWindowStartTime } = this.props;

    return (
      <>
        {market.pending && <PendingLabel status={market.status} />}
        {!market.pending && (
          <MarketProgress
            reportingState={market.reportingState}
            currentTime={currentAugurTimestamp}
            endTimeFormatted={market.endTimeFormatted}
            reportingWindowEndTime={disputingWindowEndTime}
            reportingWindowStartTime={disputingWindowStartTime}
            alignRight
          />
        )}
      </>
    );
  }

  renderToggleContent(market) {
    return (
      <div
        className={classNames(Styles.InfoParent, {
          [Styles.Failure]:
            market.pending && market.status === TXEventName.Failure,
        })}
      >
        <div>
          {!market.pending && (
            <div>
              <LinearPropertyLabel
                label="Volume"
                highlightFirst
                value={`$${market.volumeFormatted &&
                  market.volumeFormatted.formatted}`}
              />
              <LinearPropertyLabel
                label="Open Interest"
                highlightFirst
                value={`$${market.openInterestFormatted &&
                  market.openInterestFormatted.formatted}`}
              />
            </div>
          )}
          {market.pending && market.status === TXEventName.Pending && (
            <span>
              You will receive an alert and notification when your market has
              been processed.{' '}
            </span>
          )}
          {market.pending && market.status === TXEventName.Failure && (
            <>
              <span>Market failed to create.</span>
              <div>
                <SubmitTextButton
                  text={'submit again'}
                  action={() => this.props.retrySubmitMarket(market)}
                />
                <CancelTextButton
                  text={'cancel'}
                  action={() =>
                    this.props.removePendingMarket(market.pendingId)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { myMarkets, toggle, hide, extend } = this.props;

    return (
      // @ts-ignore
      <FilterBox
        title="My Created Markets"
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: '10.8125rem' }}
        markets={myMarkets}
        filterComp={filterComp}
        renderRightContent={this.renderRightContent}
        renderToggleContent={this.renderToggleContent}
        filterLabel="markets"
        showPending
        toggle={toggle}
        hide={hide}
        extend={extend}
        showLiquidityDepleted
        pickVariables={[
          'id',
          'description',
          'reportingState',
          'recentlyTraded',
          'recentlyDepleted',
          'creationTime',
          'endTime',
        ]}
      />
    );
  }
}

export default MyMarkets;
