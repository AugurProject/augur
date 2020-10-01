import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  ChevronDown,
  ChevronUp,
  TwoArrowsOutline,
  LeftChevron,
} from 'modules/common/icons';
import MarkdownRenderer from 'modules/common/markdown-renderer';
import { MarketHeaderBar } from 'modules/market/components/market-header/market-header-bar';
import Styles from 'modules/market/components/market-header/market-header.styles.less';
import CoreProperties from 'modules/market/components/core-properties/core-properties';
import {
  SCALAR,
  PROBABLE_INVALID_MARKET,
  HEADER_TYPE,
  REPORTING_STATE,
  ZERO,
  TRADING_TUTORIAL_STEPS,
} from 'modules/common/constants';
import { MarketHeaderReporting } from 'modules/market/components/market-header/market-header-reporting';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { TextObject, MarketData } from 'modules/types';
import { TutorialPopUp } from 'modules/market/components/common/tutorial-pop-up';
import MarketTitle from 'modules/market/components/common/market-title';
import PreviewMarketTitle from 'modules/market/components/common/PreviewMarketTitle';
import { HeadingBar } from '../common/common';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { isSameAddress } from 'utils/isSameAddress';
import { useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getTutorialPreview } from 'modules/market/store/market-utils';

const OVERFLOW_DETAILS_LENGTH = 48; // in px, overflow limit to trigger MORE details
const { MARKET_DETAILS, MARKET_DATA } = TRADING_TUTORIAL_STEPS;

const {
  PRE_REPORTING,
  CROWDSOURCING_DISPUTE,
  OPEN_REPORTING,
  DESIGNATED_REPORTING,
} = REPORTING_STATE;

interface MarketHeaderProps {
  market: MarketData;
  next?: Function;
  text?: TextObject;
  step?: number;
  totalSteps?: number;
}

export const MarketHeader = ({
  market,
  totalSteps = null,
  text = null,
  next = null,
  step = null,
}: MarketHeaderProps) => {
  const detailsContainer = useRef({
    current: { clientHeight: 0, scrollHeight: 0, scrollTop: 0 },
  });
  const refTitle = useRef(null);
  const refNotCollapsed = useRef(null);
  const location = useLocation();
  const history = useHistory();
  const {
    isTutorial,
    preview,
  } = getTutorialPreview(market.id, location);
  const showTutorialData = isTutorial && step === MARKET_DATA;
  const showTutorialDetails = isTutorial && step === MARKET_DETAILS;
  const {
    loginAccount: { address },
  } = useAppStatusStore();

  const {
    details: marketDetails,
    description: marketDescription,
    marketType,
    scalarDenomination,
    reportingState,
    maxPriceBigNumber,
    minPriceBigNumber,
    detailsText,
    designatedReporter,
    id,
    consensusFormatted: consensus,
    mostLikelyInvalid,
  } = market;
  const reportingBarShowing = Boolean(
    consensus ||
      reportingState === CROWDSOURCING_DISPUTE ||
      reportingState === OPEN_REPORTING ||
      (reportingState === DESIGNATED_REPORTING &&
        isSameAddress(designatedReporter, address))
  );

  const description = marketDescription || '';
  let details = marketDetails || detailsText || '';
  const maxPrice = maxPriceBigNumber || ZERO;
  const minPrice = minPriceBigNumber || ZERO;

  const [showProperties, setShowProperties] = useState(
    reportingState === PRE_REPORTING ? false : true
  );
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [clickHandler, setClickHandler] = useState(null);
  const [showReadMore, setShowReadMore] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (showCopied && isMounted) setTimeout(() => {
      if (isMounted) {
        setShowCopied(false);
      }
    }, 4000);
    return () => isMounted = false;
  }, [showCopied]);

  useEffect(() => {
    if (detailsContainer) {
      setDetailsHeight(detailsContainer.current.scrollHeight);
    }

    const clickHandlerFnc = e => {
      const ClickedOnExpandedContent =
        e &&
        e
          .composedPath()
          .find(
            ({ className }) =>
              className === 'string' &&
              className.includes('market-header-styles_ExpandedContent')
          );
      if (!ClickedOnExpandedContent && detailsContainer.current)
        setShowReadMore(false);
    };
    setClickHandler(clickHandlerFnc);
    window.addEventListener('click', clickHandlerFnc);

    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, []);

  const detailsTooLong =
    marketDetails && detailsHeight > OVERFLOW_DETAILS_LENGTH;
  if (marketType === SCALAR) {
    const denomination = scalarDenomination ? ` ${scalarDenomination}` : '';
    const warningText =
      (details.length > 0 ? `\n\n` : ``) +
      `If the real-world outcome for this market is above this market's maximum value, the maximum value (${maxPrice.toString()}${denomination}) should be reported. If the real-world outcome for this market is below this market's minimum value, the minimum value (${minPrice.toString()}${denomination}) should be reported.`;
    details += warningText;
  }

  const bigTitle = refTitle?.firstChild?.scrollHeight > 64;
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
          [Styles.Expandable]: detailsTooLong,
        }
      )}
    >
      {!headerCollapsed && (
        <div ref={refNotCollapsed}>
          <div
            className={classNames({
              [Styles.ShowTutorial]: showTutorialDetails,
            })}
          >
            <HeadingBar
              market={market}
              expandedDetails={expandedDetails}
              showCopied={showCopied}
              setShowCopied={() => setShowCopied(true)}
            />
            <div
              ref={refTitle}
              className={classNames(Styles.MarketDetails, {
                [Styles.BigTitle]: bigTitle,
                [Styles.ExpandedContent]: expandedDetails,
              })}
            >
              {preview ? (
                <PreviewMarketTitle market={market} />
              ) : (
                <MarketTitle id={id} noLink headerType={HEADER_TYPE.H1} topPadding={true} />
              )}
              {mostLikelyInvalid ? (
                <div className={Styles.ResolvingInvalid}>
                  <span>{PROBABLE_INVALID_MARKET}</span>
                </div>
              ) : null}
              {details.length > 0 && (
                <div className={Styles.Details}>
                  <h2>Resolution Details</h2>
                  <div>
                    <label
                      ref={detailsContainer}
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
                          setShowReadMore(!showReadMore);
                        }}
                      >
                        {!showReadMore ? ChevronDown : ChevronUp}
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
              {(id || preview) && <MarketHeaderBar market={market} />}
              <MarketHeaderReporting preview={preview} market={market} />
              {(id || preview) && (
                <CoreProperties
                  market={market}
                  reportingBarShowing={reportingBarShowing}
                  showExtraDetailsChevron={showProperties}
                />
              )}
              {reportingState === PRE_REPORTING && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setShowProperties(!showProperties);
                  }}
                >
                  {!showProperties ? ChevronDown : ChevronUp}
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
            {LeftChevron} <span>Back</span>
          </button>
        )}
        <button onClick={() => setHeaderCollapsed(!headerCollapsed)}>
          {headerCollapsed && (
            <>
              <h1>{description}</h1>
              <MarketHeaderBar market={market} />
            </>
          )}
          {TwoArrowsOutline}
        </button>
      </div>
    </section>
  );
};
