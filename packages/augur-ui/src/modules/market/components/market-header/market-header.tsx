import { WordTrail } from "modules/common/labels";
import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BackArrow, ChevronDown, ChevronUp } from "modules/common/icons";
import MarkdownRenderer from "modules/common/markdown-renderer";
import MarketHeaderBar from "modules/market/containers/market-header-bar";
import { BigNumber } from "bignumber.js";
import Styles from "modules/market/components/market-header/market-header.styles.less";
import CoreProperties from "modules/market/components/core-properties/core-properties";
import ChevronFlip from "modules/common/chevron-flip";
import { MarketTypeLabel } from "modules/common/labels";
import { MarketHeaderCollapsed } from "modules/market/components/market-header/market-header-collapsed";
import makeQuery from "modules/routes/helpers/make-query";
import {
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
  SCALAR
} from "modules/common/constants";
import MarketHeaderReporting from "modules/market/containers/market-header-reporting";
import { MarketTimeline } from "modules/common/progress";

import ToggleHeightStyles from "utils/toggle-height.styles.less";
import { MarketData, QueryEndpoints } from "modules/types";
import { MarketType } from "@augurproject/sdk/build/state/logs/types";

const OVERFLOW_DETAILS_LENGTH = 89; // in px, overflow limit to trigger MORE details

interface MarketHeaderProps {
  description: string;
  details: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  market: MarketData;
  currentTime: number;
  marketType: MarketType;
  scalarDenomination: string;
  resolutionSource: any;
  isLogged: boolean;
  toggleFavorite: Function;
  isFavorite: boolean;
  history: History;
}

interface MarketHeaderState {
  showReadMore: boolean;
  detailsHeight: number;
  headerCollapsed: boolean;
}
export default class MarketHeader extends Component<MarketHeaderProps, MarketHeaderState> {
  static defaultProps = {
    scalarDenomination: null,
    resolutionSource: "General knowledge",
    marketType: null,
    currentTime: 0,
    isFavorite: false,
    isLogged: false,
    toggleFavorite: () => {}
  };
  detailsContainer: any;

  constructor(props) {
    super(props);
    this.state = {
      showReadMore: false,
      detailsHeight: 0,
      headerCollapsed: false
    };

    this.gotoFilter = this.gotoFilter.bind(this);
    this.toggleReadMore = this.toggleReadMore.bind(this);
    this.updateDetailsHeight = this.updateDetailsHeight.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
  }

  componentDidMount() {
    this.updateDetailsHeight();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) this.updateDetailsHeight();
  }

  updateDetailsHeight() {
    if (this.detailsContainer) {
      this.setState({
        detailsHeight: this.detailsContainer.scrollHeight
      });
    }
  }

  toggleReadMore() {
    this.setState({ showReadMore: !this.state.showReadMore });
  }

  addToFavorites() {
    this.props.toggleFavorite(this.props.market.id);
  }

  gotoFilter(type, value) {
    const { history } = this.props;
    const query: QueryEndpoints =
      type === "category"
        ? {
            [CATEGORY_PARAM_NAME]: value
          }
        : {
            [TAGS_PARAM_NAME]: value
          };

    history.push({
      pathname: "markets",
      search: makeQuery(query)
    });
  }

  render() {
    const {
      description,
      marketType,
      resolutionSource,
      minPrice,
      maxPrice,
      scalarDenomination,
      market,
      currentTime,
      isLogged,
      isFavorite,
      history
    } = this.props;
    let { details } = this.props;
    const { headerCollapsed } = this.state;
    const detailsTooLong =
      market.details && this.state.detailsHeight > OVERFLOW_DETAILS_LENGTH;

    if (marketType === MarketType.Scalar) {
      const denomination = scalarDenomination ? ` ${scalarDenomination}` : "";
      const warningText =
        (details.length > 0 ? `\n\n` : ``) +
        `If the real-world outcome for this market is above this market's maximum value, the maximum value (${maxPrice.toNumber()}${denomination}) should be reported. If the real-world outcome for this market is below this market's minimum value, the minimum value (${minPrice.toNumber()}${denomination}) should be reported.`;
      details += warningText;
    }

    const process = (...arr) =>
      arr.filter(Boolean).map(label => ({
        label,
        onClick: () => {
          this.gotoFilter("category", label);
        }
      }));

    const categoriesWithClick = process(market.category) || [];
    const tagsWithClick = market.id && market.tags.filter(Boolean).map(tag => ({
      label: tag,
      onClick: () => {
        this.gotoFilter("tag", tag);
      }
    })) || [];

    return (
      <section
        className={classNames(
          Styles.MarketHeader,
          ToggleHeightStyles.target,
          ToggleHeightStyles.open,
          ToggleHeightStyles.quick,
          {
            [Styles.Collapsed]: headerCollapsed,
            [ToggleHeightStyles.open]: !headerCollapsed
          }
        )}
      >
        <h1>{description}</h1>
        <div>
          <WordTrail items={[...categoriesWithClick, ...tagsWithClick]}>
            <button
              className={Styles.BackButton}
              onClick={() => history.back()}
            >
              {BackArrow}
            </button>

            <MarketTypeLabel marketType={marketType} />
          </WordTrail>
          <div className={Styles.Properties}>
            {market.id && (
              <MarketHeaderBar
                marketId={market.id}
                author={market.author}
                marketStatus={market.marketStatus}
                addToFavorites={this.addToFavorites}
                isFavorite={isFavorite}
                reportingState={market.reportingState}
                disputeInfo={market.disputeInfo}
                endTime={market.endTime}
                isLogged={isLogged}
              />
            )}
          </div>
        </div>

        {headerCollapsed && (
          <MarketHeaderCollapsed description={description} market={market} />
        )}

        {!headerCollapsed && (
          <div className={Styles.MainValues}>
            <div
              className={classNames({
                [Styles.Collapsed]: headerCollapsed
              })}
            >
              <h1>{description}</h1>
              <div className={Styles.Details}>
                <h4>Resolution Source</h4>
                <span>{resolutionSource}</span>
              </div>
              {details.length > 0 && (
                <div className={Styles.Details}>
                  <h4>Additional Details</h4>
                  <label
                    ref={detailsContainer => {
                      this.detailsContainer = detailsContainer;
                    }}
                    className={classNames(Styles.AdditionalDetails, {
                      [Styles.Tall]: detailsTooLong && this.state.showReadMore
                    })}
                  >
                    <MarkdownRenderer text={details} hideLabel />
                  </label>

                  {detailsTooLong && (
                    <button
                      className={classNames({
                        [Styles.Less]: this.state.showReadMore
                      })}
                      onClick={this.toggleReadMore}
                    >
                      {!this.state.showReadMore
                        ? ChevronDown({ stroke: "#FFFFFF" })
                        : ChevronUp()}
                      <span>{!this.state.showReadMore ? "More" : "Less"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={Styles.Properties}>
              {market.id && (
                <MarketHeaderBar
                  marketId={market.id}
                  author={market.author}
                  marketStatus={market.marketStatus}
                  addToFavorites={this.addToFavorites}
                  isFavorite={isFavorite}
                  reportingState={market.reportingState}
                  disputeInfo={market.disputeInfo}
                  endTime={market.endTime}
                  isLogged={isLogged}
                />
              )}
              <MarketHeaderReporting marketId={market.id} />
              <div className={Styles.Core}>
                {market.id && <CoreProperties market={market} />}
                <div className={Styles.Time}>
                  <MarketTimeline
                    startTime={market.creationTime || 0}
                    currentTime={currentTime || 0}
                    endTime={market.endTime || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className={classNames(Styles.Toggle, {
            [Styles.Collapsed]: headerCollapsed
          })}
        >
          <button
            onClick={() => this.setState({ headerCollapsed: !headerCollapsed })}
          >
            <ChevronFlip
              stroke="#999999"
              quick
              filledInIcon
              pointDown={!headerCollapsed}
            />
          </button>
        </div>
      </section>
    );
  }
}
