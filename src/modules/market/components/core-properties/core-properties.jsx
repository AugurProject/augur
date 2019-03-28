/* eslint react/no-array-index-key: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { SCALAR, YES_NO } from "modules/markets/constants/market-types";

import Styles from "modules/market/components/core-properties/core-properties.styles";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";

import MarketLink from "modules/market/components/market-link/market-link";
import getValue from "utils/get-value";
import { dateHasPassed } from "utils/format-date";
import { constants } from "services/augurjs";
import { Hint } from "modules/common/components/icons";
import {
  TYPE_REPORT,
  TYPE_DISPUTE
} from "modules/markets/constants/link-types";
import MarketHeaderMessage from "modules/market/containers/market-header-message";

const Property = ({ numRow, property }) => (
  <div
    className={classNames(Styles.CoreProperties__property, {
      [Styles.CoreProperties__propertySmall]: numRow !== 0
    })}
  >
    <span className={Styles[`CoreProperties__property-name`]}>
      <div>{property.name}</div>
      {property.tooltip && (
        <div>
          <label
            className={classNames(
              TooltipStyles.TooltipHint,
              Styles["CoreProperties__property-tooltip"]
            )}
            data-tip
            data-for="tooltip--market-fees"
          >
            {Hint}
          </label>
          <ReactTooltip
            id="tooltip--market-fees"
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="bottom"
            type="light"
          >
            <h4>Trading Settlement Fee</h4>
            <p>
              The trading settlement fee is a combination of the Market Creator
              Fee (<b>{property.marketCreatorFee}</b>) and the Reporting Fee (
              <b>{property.reportingFee}</b>)
            </p>
          </ReactTooltip>
        </div>
      )}
    </span>
    <span style={property.textStyle}>{property.value}</span>
  </div>
);

Property.propTypes = {
  numRow: PropTypes.number.isRequired,
  property: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    tooltip: PropTypes.bool,
    textStyle: PropTypes.object,
    marketCreatorFee: PropTypes.string,
    reportingFee: PropTypes.string
  }).isRequired
};

export default class CoreProperties extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    tentativeWinner: PropTypes.object,
    isLogged: PropTypes.bool.isRequired,
    isDesignatedReporter: PropTypes.bool,
    location: PropTypes.object.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    isMobileSmall: PropTypes.bool
  };

  static defaultProps = {
    tentativeWinner: null,
    isDesignatedReporter: false,
    isMobileSmall: false
  };

  constructor(props) {
    super(props);

    this.state = {
      disableFinalize: false
    };
  }

  determinePhase() {
    const { reportingState } = this.props.market;
    switch (reportingState) {
      case constants.REPORTING_STATE.PRE_REPORTING:
        return "Open";

      case constants.REPORTING_STATE.DESIGNATED_REPORTING:
      case constants.REPORTING_STATE.OPEN_REPORTING:
      case constants.REPORTING_STATE.CROWDSOURCING_DISPUTE:
      case constants.REPORTING_STATE.AWAITING_NEXT_WINDOW:
        return "Reporting";

      case constants.REPORTING_STATE.AWAITING_FINALIZATION:
      case constants.REPORTING_STATE.FINALIZED:
        return "Resolved";

      case constants.REPORTING_STATE.FORKING:
        return "Forking";

      case constants.REPORTING_STATE.AWAITING_NO_REPORT_MIGRATION:
        return "Awaiting No Report Migrated";

      case constants.REPORTING_STATE.AWAITING_FORK_MIGRATION:
        return "Awaiting Fork Migration";

      default:
        return "";
    }
  }

  render() {
    const {
      market,
      currentTimestamp,
      tentativeWinner,
      isLogged,
      isDesignatedReporter,
      location,
      finalizeMarket,
      isMobileSmall
    } = this.props;

    const { id, marketType } = market;

    const marketCreatorFee = getValue(
      market,
      "marketCreatorFeeRatePercent.full"
    );
    const reportingFee = getValue(market, "reportingFeeRatePercent.full");

    const isScalar = marketType === SCALAR;
    const consensus = getValue(
      market,
      isScalar ? "consensus.winningOutcome" : "consensus.outcomeName"
    );

    const topPropertyRows = [
      [
        {
          name: "volume",
          value: getValue(market, "volume.full")
        },
        {
          name: "est. fee",
          value: getValue(market, "settlementFeePercent.full"),
          tooltip: true,
          marketCreatorFee,
          reportingFee
        },
        {
          name: "phase",
          value: this.determinePhase()
        }
      ]
    ];

    const propertyRows = [
      [
        {
          name: "created",
          value: getValue(
            market,
            isMobileSmall
              ? "creationTime.formattedLocalShortTime"
              : "creationTime.formattedLocal"
          )
        },
        {
          name: "type",
          value:
            getValue(market, "marketType") === YES_NO
              ? "Yes/No"
              : getValue(market, "marketType")
        },
        {
          name: "min",
          value:
            isScalar && !isMobileSmall
              ? getValue(market, "minPrice").toString()
              : null
        }
      ],
      [
        {
          name: dateHasPassed(
            currentTimestamp,
            getValue(market, "endTime.timestamp")
          )
            ? "Event Ended & Reporting Started"
            : "Event Ends & Reporting Starts",
          value: getValue(
            market,
            isMobileSmall
              ? "endTime.formattedLocalShortTime"
              : "endTime.formattedLocal"
          )
        },
        {
          name: "denominated in",
          value: getValue(market, "scalarDenomination"),
          textStyle: { textTransform: "none" }
        },
        {
          name: "max",
          value:
            isScalar && !isMobileSmall
              ? getValue(market, "maxPrice").toString()
              : null
        }
      ],
      [
        {
          name: "Market Author",
          value: getValue(market, "author")
        }
      ]
    ];

    if (isMobileSmall && isScalar) {
      propertyRows.push([
        {
          name: "min",
          value: getValue(market, "minPrice").toString()
        },
        {
          name: "max",
          value: getValue(market, "maxPrice").toString()
        }
      ]);
    }

    const renderedProperties = [];
    propertyRows.forEach((propertyRow, numRow) => {
      const row = [];
      propertyRow.forEach((property, numCol) => {
        if (property.value) {
          row.push(
            <Property
              key={`property${numRow}${numCol}`}
              property={property}
              numRow={numRow}
            />
          );
        }
      });
      renderedProperties.push(
        <div
          key={`row${numRow}`}
          className={classNames(Styles.CoreProperties__row, {
            [Styles.CoreProperties__rowBorder]: numRow === 0
          })}
        >
          {" "}
          {row}
        </div>
      );
    });

    const topHeaderContent = [];
    topPropertyRows.forEach((propertyRow, numRow) => {
      const row = [];
      propertyRow.forEach((property, numCol) => {
        if (property.value) {
          row.push(
            <Property
              key={`property${numRow}${numCol}`}
              property={property}
              numRow={numRow}
            />
          );
        }
      });
      topHeaderContent.push(
        <div
          key={`row${numRow}`}
          className={classNames(Styles.CoreProperties__row, {
            [Styles.CoreProperties__rowBorder]: numRow === 0
          })}
        >
          {" "}
          {row}
        </div>
      );
    });

    let headerContent = null;
    const { reportingState } = this.props.market;

    if (consensus) {
      headerContent = [
        <div key="consensus">
          <span className={Styles[`CoreProperties__property-name`]}>
            <div>Winning Outcome:</div>
          </span>
          <span className={Styles[`CoreProperties__property-winningOutcome`]}>
            <div
              className={Styles[`CoreProperties__header-firstElement`]}
              style={{ fontWeight: "700" }}
            >
              {consensus}
            </div>
            {isLogged &&
              reportingState ===
                constants.REPORTING_STATE.AWAITING_FINALIZATION && (
                <div className={Styles.CoreProperties__header__finalize}>
                  <label
                    className={classNames(
                      TooltipStyles.TooltipHint,
                      Styles.CoreProperties__header__tooltip
                    )}
                    data-tip
                    data-for="tooltip--finalize"
                  >
                    {Hint}
                  </label>
                  <ReactTooltip
                    id="tooltip--finalize"
                    className={TooltipStyles.Tooltip}
                    effect="solid"
                    place="bottom"
                    type="light"
                  >
                    <h4>Market Finalization</h4>
                    <p>
                      Finalizing a market allows users to trade in winning
                      shares for ETH.
                    </p>
                  </ReactTooltip>
                  <button
                    className={Styles[`CoreProperties__property-button`]}
                    onClick={() => {
                      this.setState({ disableFinalize: true });
                      finalizeMarket(id, err => {
                        if (err) {
                          this.setState({ disableFinalize: false });
                        }
                      });
                    }}
                    disabled={this.state.disableFinalize}
                  >
                    FINALIZE
                  </button>
                </div>
              )}
          </span>
        </div>
      ];
    } else if (
      reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE ||
      reportingState === constants.REPORTING_STATE.AWAITING_NEXT_WINDOW
    ) {
      headerContent = [
        <div key="dispute">
          <span className={Styles[`CoreProperties__property-name`]}>
            <div>Tentative Winning Outcome:</div>
          </span>
          <span
            className={
              Styles[`CoreProperties__property-tentativeWinningOutcome`]
            }
          >
            <div className={Styles[`CoreProperties__header-firstElement`]}>
              {tentativeWinner &&
                (tentativeWinner.isInvalid ? "Invalid" : tentativeWinner.name)}
            </div>
            {isLogged &&
              reportingState ===
                constants.REPORTING_STATE.CROWDSOURCING_DISPUTE && (
                <MarketLink
                  className={Styles[`CoreProperties__property-button`]}
                  id={id}
                  linkType={TYPE_DISPUTE}
                  location={location}
                >
                  DISPUTE
                </MarketLink>
              )}
          </span>
        </div>
      ];
    } else if (
      isLogged &&
      ((reportingState === constants.REPORTING_STATE.DESIGNATED_REPORTING &&
        isDesignatedReporter) ||
        reportingState === constants.REPORTING_STATE.OPEN_REPORTING)
    ) {
      headerContent = [
        <div key="report">
          <span
            className={
              Styles[`CoreProperties__property-tentativeWinningOutcome`]
            }
            style={{ marginBottom: "-0.125rem" }}
          >
            <div
              className={classNames(
                Styles[`CoreProperties__header-firstElement`],
                Styles[`CoreProperties__header-Submit`]
              )}
            >
              Submit a Report
            </div>
            <MarketLink
              className={Styles[`CoreProperties__property-button`]}
              id={id}
              linkType={TYPE_REPORT}
              location={location}
            >
              REPORT
            </MarketLink>
          </span>
        </div>
      ];
    }

    return (
      <div className={Styles.CoreProperties__coreContainer}>
        {topHeaderContent}
        {headerContent && (
          <div
            className={classNames(
              Styles.CoreProperties__row,
              Styles.CoreProperties__rowBorder
            )}
          >
            <div
              className={Styles.CoreProperties__property}
              style={{ flexGrow: "1" }}
            >
              {headerContent}
            </div>
          </div>
        )}
        <MarketHeaderMessage marketId={market.id} />
        {renderedProperties}
      </div>
    );
  }
}
