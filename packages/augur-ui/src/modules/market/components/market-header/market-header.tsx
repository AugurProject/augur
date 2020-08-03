import React, { Component } from 'react';
import classNames from 'classnames';
import {
  ChevronDown,
  ChevronUp,
  TwoArrowsOutline,
  LeftChevron,
  CopyAlternateIcon,
  ExclamationCircle,
} from 'modules/common/icons';
import MarkdownRenderer from 'modules/common/markdown-renderer';
import MarketHeaderBar from 'modules/market/containers/market-header-bar';
import { BigNumber } from 'bignumber.js';
import Styles from 'modules/market/components/market-header/market-header.styles.less';
import CoreProperties from 'modules/market/components/core-properties/core-properties';
import {
  WordTrail,
  MarketTypeLabel,
  TemplateShield,
  RedFlag,
} from 'modules/common/labels';
import makeQuery from 'modules/routes/helpers/make-query';
import {
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
  SCALAR,
  PROBABLE_INVALID_MARKET,
  HEADER_TYPE,
  REPORTING_STATE,
} from 'modules/common/constants';
import MarketHeaderReporting from 'modules/market/containers/market-header-reporting';
import SocialMediaButtons from 'modules/market/containers/social-media-buttons';
import { FavoritesButton } from 'modules/common/buttons';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { MarketData, QueryEndpoints, TextObject } from 'modules/types';
import Clipboard from 'clipboard';
import { TutorialPopUp } from 'modules/market/components/common/tutorial-pop-up';
import MarketTitle from 'modules/market/containers/market-title';
import PreviewMarketTitle from 'modules/market/components/common/PreviewMarketTitle';
import { MARKET_PAGE } from 'services/analytics/helpers';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';

const OVERFLOW_DETAILS_LENGTH = 48; // in px, overflow limit to trigger MORE details

interface MarketHeaderProps {
  description: string;
  details: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  market: MarketData;
  marketType: string;
  scalarDenomination: string;
  isLogged: boolean;
  toggleFavorite: Function;
  isFavorite: boolean;
  history: History;
  preview?: boolean;
  reportingBarShowing: boolean;
  next: Function;
  showTutorialData?: boolean;
  text: TextObject;
  step: number;
  totalSteps: number;
  showTutorialDetails?: boolean;
  marketLinkCopied: Function;
  userAccount: string;
  loadAffiliateFee: Function;
}

interface MarketHeaderState {
  showReadMore: boolean;
  detailsHeight: number;
  headerCollapsed: boolean;
  showCopied: boolean;
  showProperties: boolean;
  clickHandler: EventListenerOrEventListenerObject;
}

export default class MarketHeader extends Component<
  MarketHeaderProps,
  MarketHeaderState
> {
  static defaultProps = {
    scalarDenomination: null,
    marketType: null,
    isFavorite: false,
    isLogged: false,
    toggleFavorite: () => {},
  };
  detailsContainer: any;
  clipboardMarketId: any = new Clipboard('#copy_marketURL');
  refTitle: any = null;
  refNotCollapsed: any = null;

  constructor(props) {
    super(props);
    this.state = {
      showReadMore: false,
      showProperties: props.market.reportingState === REPORTING_STATE.PRE_REPORTING ? false : true,
      detailsHeight: 0,
      headerCollapsed: false,
      showCopied: false,
      clickHandler: null,
    };

    this.gotoFilter = this.gotoFilter.bind(this);
    this.toggleReadMore = this.toggleReadMore.bind(this);
    this.updateDetailsHeight = this.updateDetailsHeight.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.toggleShowProperties = this.toggleShowProperties.bind(this);
  }

  componentDidMount() {
    this.updateDetailsHeight();

    const clickHandler = e => {
      const ClickedOnExpandedContent = e
        .composedPath()
        .find(
          ({ className }) =>
            className === 'string' &&
            className.includes('market-header-styles_ExpandedContent')
        );
      if (!ClickedOnExpandedContent) this.toggleReadMore(true);
    };
    window.addEventListener('click', clickHandler);
    this.setState({ clickHandler });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.state.clickHandler);
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

  toggleReadMore(closeOnly: boolean = false) {
    if (closeOnly) {
      this.setState({ showReadMore: false });
    } else {
      this.setState({ showReadMore: !this.state.showReadMore });
    }
  }

  toggleShowProperties() {
    this.setState({ showProperties: !this.state.showProperties });
  }

  addToFavorites() {
    const { market, toggleFavorite } = this.props;
    toggleFavorite(market.id);
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
      minPrice,
      maxPrice,
      scalarDenomination,
      market,
      isLogged,
      isFavorite,
      history,
      preview,
      reportingBarShowing,
      toggleFavorite,
      showTutorialData,
      next,
      step,
      totalSteps,
      text,
      showTutorialDetails,
      marketLinkCopied,
      userAccount,
      loadAffiliateFee,
    } = this.props;
    let { details } = this.props;
    const {
      headerCollapsed,
      showReadMore,
      showProperties,
      detailsHeight,
      showCopied,
    } = this.state;
    const detailsTooLong =
      market.details && detailsHeight > OVERFLOW_DETAILS_LENGTH;
    const isScalar = marketType === SCALAR;
    if (isScalar) {
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
    const bigTitle =
      !!this.refTitle && this.refTitle.firstChild.scrollHeight > 64;
    const expandedDetails = detailsTooLong && showReadMore;

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
          <div
            ref={notCollapsed => {
              this.refNotCollapsed = notCollapsed;
            }}
          >
            <div
              className={classNames({
                [Styles.ShowTutorial]: showTutorialDetails,
              })}
            >
              <div
                className={classNames(Styles.HeadingBar, {
                  [Styles.ExpandedHeading]: expandedDetails,
                })}
              >
                <button
                  className={Styles.BackButton}
                  onClick={() => history.goBack()}
                >
                  {LeftChevron} Back
                </button>
                {isScalar && <MarketTypeLabel marketType={marketType} />}
                <RedFlag market={market} />
                {market.isTemplate && <TemplateShield market={market} />}
                <WordTrail items={[...categoriesWithClick]} />
                <SocialMediaButtons
                  listView={false}
                  marketAddress={market.id}
                  marketDescription={description}
                />
                <div
                  id="copy_marketURL"
                  title="Copy Market link"
                  data-clipboard-text={`${window.location.href}&${AFFILIATE_NAME}=${userAccount}`}
                  onClick={() => {
                    marketLinkCopied(market.id, MARKET_PAGE);
                    this.setState({ showCopied: true }, () => {
                      setTimeout(
                        () => this.setState({ showCopied: false }),
                        4000
                      );
                    });
                  }}
                  className={Styles.CopyButton}
                >
                  {CopyAlternateIcon}
                  {showCopied && <div>Copied</div>}
                </div>
                {toggleFavorite && (
                  <FavoritesButton
                    action={() => this.addToFavorites()}
                    isFavorite={isFavorite}
                    hideText
                    disabled={!isLogged}
                  />
                )}
              </div>
              <div
                ref={title => {
                  this.refTitle = title;
                }}
                className={classNames(Styles.MarketDetails, {
                  [Styles.BigTitle]: bigTitle,
                  [Styles.ExpandedContent]: expandedDetails,
                })}
              >
                {preview ? (
                  <PreviewMarketTitle market={market} />
                ) : (
                  <MarketTitle
                    id={market.marketId}
                    noLink
                    headerType={HEADER_TYPE.H1}
                    topPadding={true}
                    showCustomLabel={true}
                  />
                )}
                {market.mostLikelyInvalid ? (
                  <div className={Styles.ResolvingInvalid}>
                    <span>{PROBABLE_INVALID_MARKET}</span>
                  </div>
                ) : null}
                {details.length > 0 && (
                  <div className={Styles.Details}>
                    <h2>Resolution Details</h2>
                    <div>
                      <label
                        ref={detailsContainer => {
                          this.detailsContainer = detailsContainer;
                        }}
                        className={classNames(Styles.AdditionalDetails, {
                          [Styles.Tall]: expandedDetails,
                        })}
                      >
                        <MarkdownRenderer text={details} hideLabel />
                      </label>
                      {detailsTooLong && (
                        <button
                          className={classNames({
                            [Styles.Less]: showReadMore,
                          })}
                          onClick={e => {
                            e.stopPropagation();
                            this.toggleReadMore();
                          }}
                        >
                          {!showReadMore
                            ? ChevronDown({ stroke: '#D7DDE0' })
                            : ChevronUp()}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className={classNames({
                [Styles.ShowTutorial]: showTutorialData,
              })}
            >
              <div
                className={classNames(Styles.Properties, {
                  [Styles.HideProperties]: !showProperties,
                })}
              >
                {(market.id || preview) && (
                  <MarketHeaderBar
                    market={market}
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
                {(market.id || preview) && (
                  <CoreProperties
                    market={market}
                    reportingBarShowing={reportingBarShowing}
                    showExtraDetailsChevron={showProperties}
                    loadAffiliateFee={loadAffiliateFee}
                  />
                )}
                {market.reportingState === REPORTING_STATE.PRE_REPORTING && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      this.toggleShowProperties();
                    }}
                  >
                    {!showProperties
                      ? ChevronDown({ stroke: '#D7DDE0' })
                      : ChevronUp()}
                  </button>
                )}
              </div>
              {showTutorialData && (
                <TutorialPopUp
                  top
                  step={step}
                  totalSteps={totalSteps}
                  text={text}
                  next={next}
                />
              )}
            </div>
          </div>
        )}
        <div
          className={classNames(Styles.Toggle, {
            [Styles.CollapsedToggle]: headerCollapsed,
          })}
        >
          {headerCollapsed && (
            <button
              className={Styles.BackButton}
              onClick={() => history.goBack()}
            >
              {LeftChevron} Back
            </button>
          )}
          <button
            onClick={() => this.setState({ headerCollapsed: !headerCollapsed })}
          >
            {headerCollapsed && (
              <>
                <h1>{description}</h1>
                <MarketHeaderBar
                  market={market}
                  reportingState={market.reportingState}
                  disputeInfo={market.disputeInfo}
                  endTimeFormatted={market.endTimeFormatted}
                />
              </>
            )}
            {TwoArrowsOutline}
          </button>
        </div>
      </section>
    );
  }
}
