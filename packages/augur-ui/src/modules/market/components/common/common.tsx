import { MarketData } from 'modules/types';
import * as React from 'react';
import * as classNames from 'classnames';
import { LeftChevron, CopyAlternateIcon } from 'modules/common/icons';
import {
  MarketTypeLabel,
  RedFlag,
  WordTrail,
  InReportingLabel,
} from 'modules/common/labels';
import { TemplateShield } from 'modules/common/labels';
import SocialMediaButtons from 'modules/market/containers/social-media-buttons';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';
import { marketLinkCopied, MARKET_PAGE } from 'services/analytics/helpers';
import { FavoritesButton } from 'modules/common/buttons';
import Styles from 'modules/market/components/common/common.styles.less';
import { SCALAR } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface HeadingBarProps {
  market: MarketData;
  history: History;
  expandedDetails?: boolean;
  gotoFilter: Function;
  showCopied?: boolean;
  userAccount?: string;
  setShowCopied?: Function;
  showReportingLabel?: boolean;
}

export const HeadingBar = ({
  market,
  expandedDetails,
  history,
  gotoFilter,
  showCopied,
  userAccount,
  setShowCopied,
  showReportingLabel,
}: HeadingBarProps) => {
  const {
    marketType,
    id,
    description,
    categories,
    reportingState,
    marketStatus,
    disputeInfo
  } = market;
  const { isLogged } = useAppStatusStore();
  const isScalar = marketType === SCALAR;

  const process = arr =>
    arr.filter(Boolean).map(label => ({
      label,
      onClick: () => {
        gotoFilter('category', label);
      },
    }));

  const categoriesWithClick = process(categories) || [];

  return (
    <div
      className={classNames(Styles.HeadingBar, {
        [Styles.ExpandedHeading]: expandedDetails,
      })}
    >
      <button className={Styles.BackButton} onClick={() => history.goBack()}>
        {LeftChevron} <span>Back</span>
      </button>
      {showReportingLabel && (
        <InReportingLabel
          marketStatus={marketStatus}
          reportingState={reportingState}
          disputeInfo={disputeInfo}
        />
      )}
      {isScalar && <MarketTypeLabel marketType={marketType} />}
      <RedFlag market={market} />
      {market.isTemplate && <TemplateShield market={market} />}
      <WordTrail items={[...categoriesWithClick]} />
      <SocialMediaButtons
        listView={false}
        marketAddress={id}
        marketDescription={description}
      />
      <div
        id="copy_marketURL"
        title="Copy Market link"
        data-clipboard-text={`${window.location.href}&${AFFILIATE_NAME}=${userAccount}`}
        onClick={() => {
          marketLinkCopied(id, MARKET_PAGE);
          setShowCopied();
        }}
        className={Styles.CopyButton}
      >
        {CopyAlternateIcon}
        {showCopied && <div>Copied</div>}
      </div>
      {isLogged && (
        <FavoritesButton
          marketId={id}
          hideText
          disabled={!isLogged}
        />
      )}
    </div>
  );
};

interface InfoTicketProps {
  value: string;
  subheader: string;
  icon: JSX.Element;
}

export const InfoTicket = ({
  value,
  subheader,
  icon
}: InfoTicketProps) => {
  return (
    <div className={Styles.InfoTicket}>
      {icon}
      <span>{value}</span>
      <span>{subheader}</span>
    </div>
  );
}