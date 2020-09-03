import React from 'react';
import Media from 'react-media';

import classNames from 'classnames';
import { ToggleExtendButton } from 'modules/common/buttons';
import { SMALL_MOBILE } from 'modules/common/constants';
import SharedStyles
  from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';

import { MarketOutcome } from 'modules/common/table-rows';

import Styles from 'modules/market/components/market-outcomes-list/market-outcomes-list.styles.less';
import SharedStyles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import HeaderStyles from 'modules/portfolio/components/common/data-table-header.styles.less';
import { ToggleExtendButton } from 'modules/common/buttons';
import { SMALL_MOBILE } from 'modules/common/constants';
import type { Getters } from '@augurproject/sdk';
import { selectSortedMarketOutcomes } from 'modules/markets/selectors/market';
import { MarketData } from 'modules/types';

interface MarketOutcomesListProps {
  updateSelectedOutcome: Function;
  selectedOutcomeId: number;
  market: MarketData;
  popUp?: boolean;
  toggle?: Function;
  hideOutcomes?: boolean;
  preview: boolean;
  orderBook: Getters.Markets.OutcomeOrderBook;
}

const MarketOutcomesList = ({
  market,
  selectedOutcomeId,
  updateSelectedOutcome,
  popUp = false,
  toggle = null,
  hideOutcomes = false,
  preview,
  orderBook
}: MarketOutcomesListProps) => {
  const {
    scalarDenomination,
    marketType,
    outcomesFormatted,
  } = market;
 
  const outcomesFormattedSelected = selectSortedMarketOutcomes(marketType, outcomesFormatted);
  return (
    <section className={Styles.OutcomesList}>
      {!popUp && (
        <h3 className={Styles.Heading}>
          Outcomes
          {toggle && <ToggleExtendButton toggle={toggle} />}
        </h3>
      )}
      <div
        className={classNames(SharedStyles.Table, SharedStyles.Outcomes, {
          [SharedStyles.HideOutcomes]: hideOutcomes,
        })}
      >
        <ul
          className={classNames(
            HeaderStyles.DataTableHeader,
            HeaderStyles.OutcomesHeader
          )}
        >
          <Media query={SMALL_MOBILE}>
            {matches =>
              matches ? (
                <>
                  <li>Outcome</li>
                  <li>
                    Bid
                    <br />
                    Qty
                  </li>
                  <li>
                    Best
                    <br />
                    Bid
                  </li>
                  <li>
                    Best
                    <br />
                    Ask
                  </li>
                  <li>
                    Ask
                    <br />
                    Qty
                  </li>
                  <li>
                    Last
                    <br />
                    Price
                  </li>
                </>
              ) : (
                <>
                  <li>Outcome</li>
                  <li>Bid Qty</li>
                  <li>Best Bid</li>
                  <li>Best Ask</li>
                  <li>Ask Qty</li>
                  <li>Last Price</li>
                </>
              )
            }
          </Media>
        </ul>
        <div>
          {outcomesFormattedSelected
            .filter(o => o.isTradeable)
            .map(outcome => (
              <MarketOutcome
                key={outcome.id}
                orderBook={orderBook}
                marketId={market.id}
                outcome={outcome}
                selectedOutcomeId={selectedOutcomeId}
                updateSelectedOutcome={updateSelectedOutcome}
                preview={preview}
                scalarDenomination={scalarDenomination}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default MarketOutcomesList;
