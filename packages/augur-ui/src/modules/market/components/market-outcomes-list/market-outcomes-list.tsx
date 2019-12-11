import React, { Component } from 'react';
import classNames from 'classnames';
import Media from 'react-media';

import { SCALAR } from 'modules/common/constants';
import MarketOutcomesListOutcome from 'modules/market/containers/market-outcome';

import Styles from 'modules/market/components/market-outcomes-list/market-outcomes-list.styles.less';
import SharedStyles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import HeaderStyles from 'modules/portfolio/components/common/data-table-header.styles.less';
import { OutcomeFormatted } from 'modules/types';
import { ToggleExtendButton } from 'modules/common/buttons';
import { SMALL_MOBILE } from 'modules/common/constants';

interface MarketOutcomesListProps {
  outcomesFormatted: OutcomeFormatted[];
  updateSelectedOutcome: Function;
  selectedOutcomeId: number;
  scalarDenomination: string | undefined;
  marketType: string;
  marketId: string;
  popUp: boolean;
  toggle: Function;
  hideOutcomes?: boolean;
}

export default class MarketOutcomesList extends Component<
  MarketOutcomesListProps
> {
  static defaultProps = {
    selectedOutcomeId: 2,
    scalarDenomination: null,
    marketType: null,
    outcomesFormatted: [],
    popUp: false,
  };

  render() {
    const {
      outcomesFormatted,
      selectedOutcomeId,
      updateSelectedOutcome,
      marketType,
      scalarDenomination,
      popUp,
      marketId,
      toggle,
      hideOutcomes,
    } = this.props;

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
            {outcomesFormatted
              .filter(o => o.isTradeable)
              .map(outcome => (
                <MarketOutcomesListOutcome
                  key={outcome.id}
                  marketId={marketId}
                  outcome={outcome}
                  selectedOutcomeId={selectedOutcomeId}
                  updateSelectedOutcome={updateSelectedOutcome}
                  marketType={marketType}
                  scalarDenomination={
                    marketType === SCALAR && scalarDenomination
                  }
                />
              ))}
          </div>
        </div>
      </section>
    );
  }
}
