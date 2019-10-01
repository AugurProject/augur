import { WordTrail } from 'modules/common/labels';
import React, { Component } from 'react';
import classNames from 'classnames';
import {
  BackArrow,
  ChevronDown,
  ChevronUp,
  TwoArrows,
  TwoArrowsOutline,
  LeftChevron,
} from 'modules/common/icons';
import MarkdownRenderer from 'modules/common/markdown-renderer';
import MarketHeaderBar from 'modules/market/containers/market-header-bar';
import { BigNumber } from 'bignumber.js';
import Styles from 'modules/market/components/market-header/market-header.styles.less';
import CoreProperties from 'modules/market/components/core-properties/core-properties';
import ChevronFlip from 'modules/common/chevron-flip';
import { MarketTypeLabel } from 'modules/common/labels';
import { MarketHeaderCollapsed } from 'modules/market/components/market-header/market-header-collapsed';
import makeQuery from 'modules/routes/helpers/make-query';
import {
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
  SCALAR,
  COPY_MARKET_ID,
  COPY_AUTHOR,
} from 'modules/common/constants';
import MarketHeaderReporting from 'modules/market/containers/market-header-reporting';
import { MarketTimeline } from 'modules/common/progress';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { PaperClip, Person } from 'modules/common/icons';
import { FavoritesButton } from 'modules/common/buttons';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { MarketData, QueryEndpoints } from 'modules/types';
import Clipboard from 'clipboard';
import { DotSelection } from 'modules/common/selection';

const OVERFLOW_DETAILS_LENGTH = 50; // in px, overflow limit to trigger MORE details

// TODO: add this to top left -- refactor into it's own component:
// clipboardMarketId: any = new Clipboard("#copy_marketId");
// clipboardAuthor: any = new Clipboard("#copy_author");
// {addToFavorites && (
//   <div>
//     <FavoritesButton
//       action={() => addToFavorites()}
//       isFavorite={isFavorite}
//       hideText
//       disabled={!isLogged}
//     />
//   </div>
// )}
// <DotSelection>
//   <div
//     id="copy_marketId"
//     data-clipboard-text={marketId}
//   >
//     {PaperClip} {COPY_MARKET_ID}
//   </div>
//   <div
//     id="copy_author"
//     data-clipboard-text={author}
//   >
//     {Person} {COPY_AUTHOR}
//   </div>
// </DotSelection>

interface MarketHeaderProps {
  description: string;
  details: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  market: MarketData;
  currentTime: number;
  marketType: string;
  scalarDenomination: string;
  resolutionSource: any;
  isLogged: boolean;
  toggleFavorite: Function;
  isFavorite: boolean;
  history: History;
  preview?: boolean;
  reportingBarShowing: boolean;
}

interface MarketHeaderState {
  showReadMore: boolean;
  detailsHeight: number;
  headerCollapsed: boolean;
}
export default class MarketHeader extends Component<
  MarketHeaderProps,
  MarketHeaderState
> {
  static defaultProps = {
    scalarDenomination: null,
    resolutionSource: 'General knowledge',
    marketType: null,
    currentTime: 0,
    isFavorite: false,
    isLogged: false,
    toggleFavorite: () => {},
  };
  detailsContainer: any;

  constructor(props) {
    super(props);
    this.state = {
      showReadMore: false,
      detailsHeight: 0,
      headerCollapsed: false,
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
        detailsHeight: this.detailsContainer.scrollHeight,
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
      type === 'category'
        ? {
            [CATEGORY_PARAM_NAME]: value,
          }
        : {
            [TAGS_PARAM_NAME]: value,
          };

    history.push({
      pathname: 'markets',
      search: makeQuery(query),
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
      history,
      preview,
      reportingBarShowing
    } = this.props;
    let { details } = this.props;
    const { headerCollapsed } = this.state;
    const detailsTooLong =
      market.details && this.state.detailsHeight > OVERFLOW_DETAILS_LENGTH;

    if (marketType === SCALAR) {
      const denomination = scalarDenomination ? ` ${scalarDenomination}` : '';
      const warningText =
        (details.length > 0 ? `\n\n` : ``) +
        `If the real-world outcome for this market is above this market's maximum value, the maximum value (${maxPrice.toString()}${denomination}) should be reported. If the real-world outcome for this market is below this market's minimum value, the minimum value (${minPrice.toString()}${denomination}) should be reported.`;
      details += warningText;
    }

    const process = arr =>
      arr.filter(Boolean).map(label => ({
        label,
        onClick: () => {
          this.gotoFilter('category', label);
        },
      }));

    const categoriesWithClick = process(market.categories) || [];

    return (
      <section
        className={classNames(
          Styles.MarketHeader,
          ToggleHeightStyles.target,
          ToggleHeightStyles.open,
          ToggleHeightStyles.quick,
          {
            [Styles.Collapsed]: headerCollapsed,
            [ToggleHeightStyles.open]: !headerCollapsed,
          }
        )}
      >
        {!headerCollapsed && (
          <>
            <div>
              <WordTrail items={[...categoriesWithClick]}>
                <button
                  className={Styles.BackButton}
                  onClick={() => history.goBack()}
                >
                  {LeftChevron} Back
                </button>
                <MarketTypeLabel marketType={marketType} />
              </WordTrail>
              <div className={Styles.Properties}>
                {(market.id || preview) && (
                  <MarketHeaderBar
                    marketStatus={market.marketStatus}
                    reportingState={market.reportingState}
                    disputeInfo={market.disputeInfo}
                    endTimeFormatted={market.endTimeFormatted}
                  />
                )}
              </div>
            </div>
            <div className={Styles.MainValues}>
              <div>
                <h1>{description}</h1>
                <div className={Styles.Details}>
                  <h4>Resolution Source</h4>
                  <span>{resolutionSource}</span>
                </div>
                {details.length > 0 && (
                  <div className={Styles.Details}>
                    <h4>Additional Details</h4>
                    <div>
                      <label
                        ref={detailsContainer => {
                          this.detailsContainer = detailsContainer;
                        }}
                        className={classNames(Styles.AdditionalDetails, {
                          [Styles.Tall]:
                            detailsTooLong && this.state.showReadMore,
                        })}
                      >
                        <MarkdownRenderer text={details} hideLabel />
                      </label>

                      {detailsTooLong && (
                        <button
                          className={classNames({
                            [Styles.Less]: this.state.showReadMore,
                          })}
                          onClick={this.toggleReadMore}
                        >
                          {!this.state.showReadMore
                            ? ChevronDown({ stroke: '#FFFFFF' })
                            : ChevronUp()}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={Styles.Properties}>
                {(market.id || preview) && (
                  <MarketHeaderBar
                    marketStatus={market.marketStatus}
                    reportingState={market.reportingState}
                    disputeInfo={market.disputeInfo}
                    endTimeFormatted={market.endTimeFormatted}
                  />
                )}
                <MarketHeaderReporting
                  marketId={market.id}
                  preview={preview}
                  market={preview && market}
                />
                {(market.id || preview) && <CoreProperties market={market} alternateView reportingBarShowing={reportingBarShowing}/>}
              </div>
            </div>
          </>
        )}
        <div
          className={classNames(Styles.Toggle, {
            [Styles.CollapsedToggle]: headerCollapsed,
          })}
        >
          {headerCollapsed && (
            <>
              <button
                className={Styles.BackButton}
                onClick={() => history.goBack()}
              >
                {LeftChevron} Back
              </button>
              <h1>{description}</h1>
            </>
          )}
          <button
            onClick={() => this.setState({ headerCollapsed: !headerCollapsed })}
          >
            {TwoArrowsOutline}
          </button>
        </div>
      </section>
    );
  }
}
