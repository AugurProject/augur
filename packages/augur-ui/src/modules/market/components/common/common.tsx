import { MarketData, QueryEndpoints } from 'modules/types';
import { useHistory } from 'react-router';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import Clipboard from 'clipboard';
import { CATEGORY_PARAM_NAME } from 'modules/common/constants';
import { LeftChevron, CopyAlternateIcon } from 'modules/common/icons';
import {
  MarketTypeLabel,
  RedFlag,
  WordTrail,
  InReportingLabel,
} from 'modules/common/labels';
import { TemplateShield } from 'modules/common/labels';
import SocialMediaButtons from 'modules/market/components/common/social-media-buttons';
import makeQuery from 'modules/routes/helpers/make-query';
import { AFFILIATE_NAME } from 'modules/routes/constants/param-names';
import { marketLinkCopied, MARKET_PAGE } from 'services/analytics/helpers';
import { FavoritesButton } from 'modules/common/buttons';
import Styles from 'modules/market/components/common/common.styles.less';
import { SCALAR } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface HeadingBarProps {
  market: MarketData;
  expandedDetails?: boolean;
  showCopied?: boolean;
  setShowCopied?: Function;
  showReportingLabel?: boolean;
}

export const HeadingBar = ({
  market,
  expandedDetails,
  showCopied,
  setShowCopied,
  showReportingLabel,
}: HeadingBarProps) => {
  const {
    marketType,
    id,
    description,
    categories,
    reportingState,
    disputeInfo,
  } = market;
  const {
    isLogged,
    loginAccount: { address: userAccount },
  } = useAppStatusStore();
  const history = useHistory();

  useEffect(() => {
    new Clipboard('#copy_marketURL');
  }, []);

  const isScalar = marketType === SCALAR;

  const process = arr =>
    arr.filter(Boolean).map(label => ({
      label,
      onClick: () => {
        const query: QueryEndpoints = {
          [CATEGORY_PARAM_NAME]: label,
        };

        history.push({
          pathname: 'markets',
          search: makeQuery(query),
        });
      },
    }));

  const categoriesWithClick = process(categories) || [];

  return (
    <div
      className={classNames(Styles.HeadingBar, {
        [Styles.ExpandedHeading]: expandedDetails,
      })}
    >
      <section>
        <button className={Styles.BackButton} onClick={() => history.goBack()}>
          {LeftChevron} <span>Back</span>
        </button>
        <WordTrail items={[...categoriesWithClick]} typeLabel="Categories" />
      </section>
      <button className={Styles.BackButton} onClick={() => history.goBack()}>
        {LeftChevron} <span>Back</span>
      </button>
      {showReportingLabel && (
        <InReportingLabel
          reportingState={reportingState}
          disputeInfo={disputeInfo}
        />
      )}
      {isScalar && <MarketTypeLabel marketType={marketType} />}
      <RedFlag market={market} />
      {market.isTemplate && <TemplateShield market={market} />}
      <WordTrail items={[...categoriesWithClick]} typeLabel="Categories" />
      <SocialMediaButtons marketAddress={id} marketDescription={description} />
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
        <FavoritesButton marketId={id} hideText disabled={!isLogged} />
      )}
    </div>
  );
};

interface InfoTicketProps {
  value: string;
  subheader: string;
  icon: JSX.Element;
}

export const InfoTicket = ({ value, subheader, icon }: InfoTicketProps) => (
  <div className={Styles.InfoTicket}>
    {icon}
    <span>{value}</span>
    <span>{subheader}</span>
  </div>
);
