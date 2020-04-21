import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import Styles from 'modules/portfolio/components/portfolio-view/my-bets.styles.less';
import { ExternalLinkButton, PrimaryButton } from 'modules/common/buttons';
import { PillSelection, SquareDropdown } from 'modules/common/selection';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { PORTFOLIO_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { SPORTS_MARKET_TYPES, MY_BETS_VIEW_BY, MY_BETS_MARKET_STATUS } from 'modules/common/constants';
import { MARKETS } from 'modules/routes/constants/views';
import { FilterNotice } from 'modules/common/filter-notice';

export const MyBets = () => {
  return (
    <div className={classNames(Styles.MyBets)}>
      <HelmetTag {...PORTFOLIO_VIEW_HEAD_TAGS} />
      <div>
        <div>
          <span>My Bets</span>
          <span>To view your unmatched bets, go to Trading.</span>
          <ExternalLinkButton
            condensedStyle
            customLink={{
              pathname: MARKETS,
            }}
            label={'go to trading'}
          />
        </div>
        <FilterNotice
          showDismissButton={false}
          show
          color="active"
          content={
            <div className={Styles.ClaimWinnings}>
              You have <b>$200.00</b> in winnings to claim.
              <PrimaryButton text={'Claim Bets'} action={null} />
            </div>
          }
        />
        <div>
          <span>
            View by{' '}
            <SquareDropdown
              options={MY_BETS_VIEW_BY}
              defaultValue={'Event'}
              onChange={null}
              minimalStyle
            />
          </span>
          <span>
            Market Status:{' '}
            <SquareDropdown
              options={MY_BETS_MARKET_STATUS}
              defaultValue={'All'}
              onChange={null}
              minimalStyle
            />
          </span>
        </div>
        <PillSelection
          options={SPORTS_MARKET_TYPES}
          defaultSelection={0}
          onChange={selected => null}
          large
        />
        <FilterSearch
          placeholder={'Search markets & outcomes...'}
          search={''}
          isSearchingMarkets={false}
        />
      </div>
    </div>
  );
};
