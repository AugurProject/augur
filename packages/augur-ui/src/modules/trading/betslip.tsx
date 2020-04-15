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
import { getTheme } from 'modules/app/actions/update-app-status';
import { THEMES } from 'modules/common/constants';
import { BETSLIP_SELECTED } from 'modules/trading/store/constants';
import { useBetslipStore } from 'modules/trading/store/betslip';

import Styles from 'modules/trading/betslip.styles';

interface BetslipProps {
  theme: string;
}

export const Betslip = ({ theme = getTheme() }: BetslipProps) => {
  const [minimized, setMinimized] = useState(true);
  const {
    selected: { header, subHeader },
    betslip: { count: betslipCount, items: betslipItems },
    unmatched: { count: unmatchedCount, items: unmatchedItems },
    matched: { count: matchedCount, items: matchedItems },
    actions: { toggleSubHeader },
  } = useBetslipStore();

  const isUnmatched = subHeader === BETSLIP_SELECTED.UNMATCHED;
  useEffect(() => {
    // this has to be done as useAnything must go above any other declarations.
    const isSportsBook = theme === THEMES.SPORTS;
    if (isSportsBook && isUnmatched) {
      toggleSubHeader();
    }
  }, [theme]);

  const isSportsBook = theme === THEMES.SPORTS;
  const myBetsCount = isSportsBook
    ? matchedCount
    : unmatchedCount + matchedCount;
  const isMyBets = header === BETSLIP_SELECTED.MY_BETS;
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
      </div>
      <section className={Styles.Container}>
        <BetslipHeader myBetsCount={myBetsCount} betslipCount={betslipCount} />
        {isMyBets && (
          <MyBetsSubheader
            unmatchedCount={unmatchedCount}
            matchedCount={matchedCount}
          />
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
    </aside>
  );
};
