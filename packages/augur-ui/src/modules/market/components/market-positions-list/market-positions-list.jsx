/* eslint-disable react/no-array-index-key */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketPositionsListOrphanedOrder from "modules/market/components/market-positions-list--orphaned-order/market-positions-list--orphaned-order";
import MarketPositionsListPosition from "modules/market/components/market-positions-list--position/market-positions-list--position";
import MarketPositionsListOrder from "modules/market/components/market-positions-list--order/market-positions-list--order";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import toggleHeight from "utils/toggle-height/toggle-height";

import Styles from "modules/market/components/market-positions-list/market-positions-list.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class MarketPositionsList extends Component {
  static propTypes = {
    openOrders: PropTypes.array,
    positions: PropTypes.array.isRequired,
    numCompleteSets: PropTypes.object,
    sellCompleteSets: PropTypes.func.isRequired,
    marketId: PropTypes.string.isRequired,
    orphanedOrders: PropTypes.array.isRequired,
    cancelOrphanedOrder: PropTypes.func.isRequired
  };

  static defaultProps = {
    openOrders: [],
    numCompleteSets: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      completeSetsSalePending: false
    };
  }

  render() {
    const {
      openOrders,
      positions,
      numCompleteSets,
      sellCompleteSets,
      marketId,
      orphanedOrders,
      cancelOrphanedOrder
    } = this.props;
    const s = this.state;

    const hasOrders = openOrders.length > 0 || orphanedOrders.length > 0;

    return (
      <section className={Styles.MarketPositionsList}>
        <button
          className={Styles.MarketPositionsList__heading}
          onClick={() => {
            toggleHeight(this.outcomeList, s.isOpen, () => {
              this.setState({ isOpen: !s.isOpen });
            });
          }}
        >
          <h2>My Positions</h2>
          <ChevronFlip big pointDown={!s.isOpen} />
        </button>
        <div
          ref={outcomeList => {
            this.outcomeList = outcomeList;
          }}
          className={classNames(
            ToggleHeightStyles["open-on-mobile"],
            ToggleHeightStyles["toggle-height-target"],
            ToggleHeightStyles["start-open"]
          )}
        >
          <div className={Styles.MarketPositionsList__table}>
            {positions.length > 0 && (
              <ul className={Styles["MarketPositionsList__table-header"]}>
                <li>Position</li>
                {hasOrders && <li />}
                <li>
                  <span>Net Position</span>
                </li>
                <li>
                  <span>Quantity</span>
                </li>
                <li>
                  <span>Price</span>
                </li>
                <li>
                  <span>
                    Unrealized <span />
                    P/L
                  </span>
                </li>
                <li>
                  <span>
                    Realized <span />
                    P/L
                  </span>
                </li>
              </ul>
            )}
            {positions.length > 0 && (
              <div className={Styles["MarketPositionsList__table-body"]}>
                {positions &&
                  positions.map((position, i) => (
                    <MarketPositionsListPosition
                      key={i}
                      outcomeName={position.name}
                      position={position}
                      openOrders={openOrders.filter(
                        order =>
                          order.id === position.id && order.pending === true
                      )}
                      isExtendedDisplay={false}
                      isMobile={false}
                      marketId={marketId}
                      hasOrders={hasOrders}
                    />
                  ))}
              </div>
            )}
            {(openOrders.length > 0 || orphanedOrders.length > 0) && (
              <ul className={Styles["MarketPositionsList__table-header"]}>
                <li>Open Orders</li>
                <li />
                <li>
                  <span>Quantity</span>
                </li>
                <li>
                  <span>
                    Average <span />
                    Price
                  </span>
                </li>
                <li>Escrowed ETH</li>
                <li>Escrowed Shares</li>
                <li>
                  <span>Action</span>
                </li>
              </ul>
            )}
            {(openOrders.length > 0 || orphanedOrders.length > 0) && (
              <div className={Styles["MarketPositionsList__table-body"]}>
                {openOrders.map((order, i) => (
                  <MarketPositionsListOrder
                    key={i}
                    outcomeName={order.name}
                    order={order}
                    pending={order.pending}
                    isExtendedDisplay={false}
                    isMobile={false}
                  />
                ))}
                {(orphanedOrders || []).map(order => (
                  <MarketPositionsListOrphanedOrder
                    key={order.orderId}
                    outcomeName={order.outcomeName || order.outcome}
                    order={order}
                    pending={false}
                    isExtendedDisplay={false}
                    outcome={order}
                    cancelOrphanedOrder={cancelOrphanedOrder}
                  />
                ))}
              </div>
            )}
          </div>
          {positions.length === 0 &&
            openOrders.length === 0 &&
            orphanedOrders.length === 0 && (
              <NullStateMessage
                className={Styles["MarketPositionsList__null-state"]}
                message="No positions or open orders"
              />
            )}
          {numCompleteSets &&
            numCompleteSets.value > 0 && (
              <div className={Styles.MarketPositionsList__completeSets}>
                <span>{`You currently have ${
                  numCompleteSets.full
                } of all outcomes.`}</span>
                <button
                  onClick={e => {
                    this.setState({ completeSetsSalePending: true });
                    sellCompleteSets(marketId, numCompleteSets, (err, res) => {
                      if (err) {
                        this.setState({ completeSetsSalePending: false });
                      }
                    });
                  }}
                  disabled={s.completeSetsSalePending}
                >
                  Sell Complete Sets
                </button>
              </div>
            )}
        </div>
      </section>
    );
  }
}
