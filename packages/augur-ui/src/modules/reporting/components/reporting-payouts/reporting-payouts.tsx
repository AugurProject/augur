import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ReactTooltip from "react-tooltip";
import { formatAttoRep } from "utils/format-number";
import Styles from "modules/reporting/components/reporting-payouts/reporting-payouts.styles";
import TooltipStyles from "modules/common/less/tooltip.styles";
import { ExclamationCircle } from "modules/common/components/icons";
import { MALFORMED_OUTCOME } from "modules/common-elements/constants";

const CELL_MARGIN = 12;
const INITIAL_CELL_HEIGHT = 54;
const NUM_ROWS_SMALL_MOBILE = 3;
const NUM_ROWS_MOBILE = 2;
const NUM_CELLS_SHOWN_MOBILE = 4;
const NUM_CELLS_SHOWN = 3;

const Outcome = ({ className, outcome, marketId }) => {
  const totalBondSizeCurrent = formatAttoRep(outcome.bondSizeCurrent, {
    decimals: 4,
    roundUp: true
  }).formatted;
  const currentOutcomeStake = formatAttoRep(outcome.stakeCurrent, {
    decimals: 4,
    roundUp: true
  }).formatted;
  const currentStakeRep = formatAttoRep(outcome.accountStakeCurrent, {
    decimals: 4,
    roundUp: true
  });
  const currentAccountStake =
    currentStakeRep.formatted === "-" ? "0" : currentStakeRep.formatted;
  const outcomeName =
    outcome.name === "Indeterminate" ? "Invalid" : outcome.name;

  return (
    <div className={className}>
      <div className={Styles["MarketReportingPayouts__outcome-name"]}>
        {outcome.potentialFork && (
          <span className={Styles["MarketReportingPayouts__tooltip-container"]}>
            <div
              className={classNames(Styles.MarketReportingPayouts__alert_icon)}
              data-tip
              data-for="tooltip--potential-fork"
            >
              {ExclamationCircle()}
            </div>
            <ReactTooltip
              id="tooltip--potential-fork"
              className={TooltipStyles.Tooltip}
              effect="solid"
              place="top"
              type="light"
            >
              <h4>Potential Fork</h4>
              <p>
                A fork will be initiated if the dispute bond for this outcome is
                filled.
              </p>
            </ReactTooltip>
          </span>
        )}
        <span className={Styles["MarketReportingPayouts__outcome-name-text"]}>
          {outcomeName}
        </span>
      </div>
      {outcome.tentativeWinning &&
        outcome.id === MALFORMED_OUTCOME && (
          <label className={Styles.MarketReportingPayouts__malformed}>
            Malformed Outcome
          </label>
        )}
      {outcome.tentativeWinning && (
        <div
          data-testid={"winning-" + marketId + "-" + outcome.id}
          className={Styles["MarketReportingPayouts__winning-outcome-message"]}
        >
          Tentative Winning Outcome
        </div>
      )}
      {!outcome.tentativeWinning && (
        <div>
          <div
            className={Styles["MarketReportingPayouts__progress-bar-container"]}
          >
            <div className={Styles["MarketReportingPayouts__progress-bar"]}>
              <div
                className={
                  Styles["MarketReportingPayouts__progress-bar-percentage-user"]
                }
                style={{ width: string(outcome.percentageAccount) + "%" }}
                data-tip
                data-for={"tooltip--rep-progress-" + outcome.id + marketId}
              />
              <div
                className={
                  Styles["MarketReportingPayouts__progress-bar-percentage"]
                }
                style={{ width: string(outcome.percentageComplete) + "%" }}
              />
            </div>
            <span
              data-testid={"disputeBond-" + marketId + "-" + outcome.id}
              className={
                Styles["MarketReportingPayouts__progress-bar-total-rep-text"]
              }
            >
              {currentOutcomeStake}
            </span>
            <span
              className={Styles["MarketReportingPayouts__progress-bar-break"]}
            >
              {" "}
              /{" "}
            </span>
            <span
              data-testid={"disputeBondTarget-" + marketId + "-" + outcome.id}
              className={
                Styles["MarketReportingPayouts__progress-bar-goal-text"]
              }
            >
              {totalBondSizeCurrent} REP
            </span>
          </div>
          <ReactTooltip
            id={"tooltip--rep-progress-" + outcome.id + marketId}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            offset={{ left: 0, top: 6 }}
            type="light"
          >
            <p>{currentAccountStake} REP Staked</p>
          </ReactTooltip>
        </div>
      )}
    </div>
  );
};

class MarketReportingPayouts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outcomeWrapperHeight: this.getInitialHeight(
        props.isMobile,
        props.isMobileSmall
      ),
      isOpen: false
    };

    this.showMore = this.showMore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // move to getDerivedStateFromProps in React 16.3
    if (
      nextProps.isMobile !== this.props.isMobile ||
      nextProps.isMobileSmall !== this.props.isMobileSmall
    ) {
      this.setState({
        outcomeWrapperHeight: this.getInitialHeight(
          nextProps.isMobile,
          nextProps.isMobileSmall
        ),
        isOpen: false
      });
    }
  }

  componentDidUpdate() {
    const calculatedHeight = this.getInitialHeight(
      this.props.isMobile,
      this.props.isMobileSmall
    );
    if (
      this.state.outcomeWrapperHeight !== calculatedHeight &&
      !this.state.isOpen
    ) {
      this.setStateFromComponent(calculatedHeight);
    }
  }

  setStateFromComponent(calculatedHeight) {
    this.setState({ outcomeWrapperHeight: calculatedHeight });
  }

  getInitialHeight(isMobile, isMobileSmall) {
    // + 12 accounts for margins
    const cellHeight =
      (this.outcomeTable &&
        this.outcomeTable.firstChild &&
        this.outcomeTable.firstChild.clientHeight + CELL_MARGIN) ||
      INITIAL_CELL_HEIGHT;

    if (isMobileSmall) {
      return cellHeight * NUM_ROWS_SMALL_MOBILE;
    } else if (isMobile) {
      return cellHeight * NUM_ROWS_MOBILE;
    }
    return 0;
  }

  showMore() {
    const outcomeWrapperHeight = this.state.isOpen
      ? this.getInitialHeight(this.props.isMobile, this.props.isMobileSmall)
      : `${this.outcomeTable.clientHeight}px`;

    this.setState({
      outcomeWrapperHeight,
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { outcomes, marketId, isMobile, isMobileSmall } = this.props;

    const numShown =
      isMobile && !isMobileSmall ? NUM_CELLS_SHOWN_MOBILE : NUM_CELLS_SHOWN;
    const totalOutcomes = outcomes.filter(outcome => outcome.display).length;
    const displayShowMore = totalOutcomes > numShown;
    const showMoreText = this.state.isOpen
      ? `- ${totalOutcomes - numShown} less`
      : `+ ${totalOutcomes - numShown} more`;

    const outcomeWrapperStyle = {
      minHeight: this.state.outcomeWrapperHeight
    };

    return (
      <div className={Styles.MarketReportingPayouts__container}>
        <div
          className={Styles.MarketReportingPayouts}
          style={outcomeWrapperStyle}
        >
          {outcomes.length > 0 && (
            <Outcome
              className={Styles["MarketReportingPayouts__height-sentinel"]}
              outcome={outcomes[0]}
              marketId={marketId}
            />
          )}
          <div
            className={classNames(
              Styles["MarketReportingPayouts__outcomes-container"],
              {
                [`${Styles["show-more"]}`]: displayShowMore
              }
            )}
          >
            <div
              ref={outcomeTable => {
                this.outcomeTable = outcomeTable;
              }}
              className={Styles.MarketReportingPayouts__outcomes}
            >
              {outcomes.length > 0 &&
                outcomes.map(
                  outcome =>
                    outcome.display && (
                      <Outcome
                        className={Styles.MarketReportingPayouts__outcome}
                        key={outcome.id}
                        outcome={outcome}
                        marketId={marketId}
                      />
                    )
                )}
            </div>
          </div>
        </div>
        <div
          className={classNames(
            Styles["MarketReportingPayouts__button-container"]
          )}
        >
          {displayShowMore && (
            <button
              className={Styles["MarketReportingPayouts__show-more"]}
              data-testid="showMoreButton"
              onClick={this.showMore}
            >
              {showMoreText}
            </button>
          )}
        </div>
      </div>
    );
  }
}

MarketReportingPayouts.propTypes = {
  outcomes: PropTypes.array.isRequired,
  marketId: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isMobileSmall: PropTypes.bool.isRequired
};

Outcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  marketId: PropTypes.string.isRequired
};

export default MarketReportingPayouts;
