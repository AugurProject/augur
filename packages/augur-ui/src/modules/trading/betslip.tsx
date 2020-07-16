import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { ThickChevron } from 'modules/common/icons';
import {
  EmptyState,
  BetslipHeader,
  BetslipFooter,
  BetslipList,
  MyBetsSubheader,
} from 'modules/trading/common';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';
import { BETSLIP_SELECTED } from 'modules/trading/store/constants';
import { useBetslipStore } from 'modules/trading/store/betslip';
import BannerSportsbook from '../../assets/images/banner-sportsbook.png';
import BannerTrading from '../../assets/images/banner-trading.png';

import Styles from 'modules/trading/betslip.styles';
import { PrimaryButton } from 'modules/common/buttons';

export const Betslip = () => {
  const [minimized, setMinimized] = useState(true);
  const { theme } = useAppStatusStore();
  const {
    selected: { header, subHeader },
    betslip: { count: betslipCount, items: betslipItems },
    unmatched: { count: unmatchedCount, items: unmatchedItems },
    matched: { count: matchedCount, items: matchedItems },
    actions: { toggleSubHeader },
  } = useBetslipStore();

  useEffect(() => {
    // this has to be done as useAnything must go above any other declarations.
    const isSportsBook = theme === THEMES.SPORTS;
    if (isSportsBook) {
      toggleSubHeader(BETSLIP_SELECTED.MATCHED);
    }
  }, [theme]);

  const isSportsBook = theme === THEMES.SPORTS;
  const isMyBets = header === BETSLIP_SELECTED.MY_BETS;
  const isUnmatched = subHeader === BETSLIP_SELECTED.UNMATCHED;
  const myBetsCount = isSportsBook
    ? matchedCount
    : unmatchedCount + matchedCount;
  const isSelectedEmpty = isMyBets ? myBetsCount === 0 : betslipCount === 0;
  const marketItems = isMyBets
    ? Object.entries(isUnmatched ? unmatchedItems : matchedItems)
    : Object.entries(betslipItems);
  return (
    <aside
      className={classNames(Styles.Betslip, {
        [Styles.Minimized]: minimized,
      })}
    >
      <div>
        <button onClick={() => setMinimized(!minimized)}>
          Betslip ({betslipCount}) {ThickChevron}
        </button>
        <PrimaryButton text={`Betslip (${betslipCount})`} action={() => setMinimized(!minimized)} />
      </div>
      <section className={Styles.Container}>
        <BetslipHeader myBetsCount={myBetsCount} />
        {isMyBets && (
          <MyBetsSubheader />
        )}
        <section
          className={classNames(Styles.MainSection, {
            [Styles.BetslipEmpty]: isSelectedEmpty,
            [Styles.BetslipList]: !isSelectedEmpty,
          })}
        >
          {isSelectedEmpty ? (
            <EmptyState />
          ) : (
            <>
              <BetslipList marketItems={marketItems} />
              <BetslipFooter />
            </>
          )}
        </section>
      </section>
      <section className={Styles.SideImages}>
        <a href="" target="_blank" rel="noopener noreferrer">
          <img src={BannerSportsbook} alt="The image shows an American Football player running. The banner says '+1000 markets' and there is a button entitled 'Explore Sportsbook'."/>
        </a>
        <a href="" target="_blank" rel="noopener noreferrer">
          <img src={BannerTrading} alt="The image shows Augur's Trading user interface and it says 'Trade Now!'."/>
        </a>
      </section>
    </aside>
  );
};
