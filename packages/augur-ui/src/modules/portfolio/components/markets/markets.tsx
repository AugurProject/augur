import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  CREATE_MARKET
} from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import FilterBox from 'modules/portfolio/components/common/filter-box';
import { SecondaryButton } from 'modules/common/buttons';
import { THEMES } from 'modules/common/constants';
import { AddIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { LinearPropertyLabel, PendingLabel } from 'modules/common/labels';
import { MarketProgress } from 'modules/common/progress';
import { END_TIME } from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk-lite';
import { CancelTextButton, SubmitTextButton } from 'modules/common/buttons';
import { CreatedMarketsIcon } from 'modules/common/icons';
import { retrySubmitMarket } from 'modules/markets/actions/submit-new-market';
import { removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { selectAuthorOwnedMarkets } from 'modules/markets/selectors/user-markets';

import Styles from 'modules/portfolio/components/common/quad.styles.less';
import marketStyles from 'modules/portfolio/components/markets/markets.styles.less';

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
  toggle: Function;
  hide: boolean;
  extend: boolean;
}

const MyMarkets = ({
  toggle,
  hide,
  extend,
}: MyMarketsProps) => {
  const { theme, universe: { disputeWindow }, actions: { setTheme } } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;
  const disputingWindowEndTime = disputeWindow?.endTime || 0;
  const myMarkets = selectAuthorOwnedMarkets();

  function renderRightContent(market) {
    return (
      <>
        {market.pending && <PendingLabel status={market.status} />}
        {!market.pending && (
          <MarketProgress
            reportingState={market.reportingState}
            endTimeFormatted={market.endTimeFormatted}
            reportingWindowEndTime={disputingWindowEndTime}
            alignRight
          />
        )}
      </>
    );
  }

  function renderToggleContent(market) {
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
                  text='submit again'
                  action={() => retrySubmitMarket(market)}
                />
                <CancelTextButton
                  text='cancel'
                  action={() =>
                    removePendingData(market.pendingId, CREATE_MARKET)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    // @ts-ignore
    <FilterBox
      title="My Created Markets"
      customClass={marketStyles.Markets}
      sortByOptions={sortByOptions}
      sortByStyles={isTrading ? { minWidth: '10.8125rem' } : {}}
      markets={myMarkets}
      filterComp={filterComp}
      renderRightContent={renderRightContent}
      renderToggleContent={renderToggleContent}
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
      bottomContent={(myMarkets.length !== 0 && !isTrading) && (
          <div className={marketStyles.BottomContent}>
            <Link to={makePath(CREATE_MARKET)}>
              <SecondaryButton
                text="Create Market"
                action={() => setTheme(THEMES.TRADING)}
                icon={AddIcon}
              />
            </Link>
          </div>
        )
      }
      emptyDisplayTitle={isTrading ? "You didn't create any market yet" : "No markets"}
      emptyDisplayText={isTrading ? "Create your first market now!" : "To create a market you need to go to the Trading Exchange"}
      emptyDisplayIcon={CreatedMarketsIcon}
      emptyDisplayButton={
        isTrading ? (
          <Link to={makePath(CREATE_MARKET)}>
            <SecondaryButton
              text="Create Market"
              action={() => null}
            />
          </Link>
        ) : null
      }
    />
  );
};

MyMarkets.defaultProps = {
  disputingWindowEndTime: 0
};

export default MyMarkets;
