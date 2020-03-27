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
import {
  useBetslip,
  SelectedContext,
  BetslipStepContext,
  BetslipActionsContext,
  BETSLIP_SELECTED,
} from 'modules/trading/hooks/betslip';

import Styles from 'modules/trading/betslip.styles';

export const Betslip = ({ theme = getTheme() }) => {
  const [minimized, setMinimized] = useState(true);
  const state = useBetslip();
  const { step, selected, betslip, unmatched, matched, actions } = state;
  useEffect(() => {
    // this has to be done as useAnything must go above any other declarations.
    const isSportsBook = theme === THEMES.SPORTS;
    if (isSportsBook && selected.subHeader === BETSLIP_SELECTED.UNMATCHED) {
      actions.toggleSubHeader();
    }
  }, [theme]);

  const isSportsBook = theme === THEMES.SPORTS;
  const myBetsCount = isSportsBook
    ? matched.count
    : unmatched.count + matched.count;
  const isMyBets = selected.header === BETSLIP_SELECTED.MY_BETS;
  const isSelectedEmpty = isMyBets ? myBetsCount === 0 : betslip.count === 0;
  const marketItems = isMyBets
    ? Object.entries(state[selected.subHeader].items)
    : Object.entries(betslip.items);
  return (
    <aside
      className={classNames(Styles.Betslip, {
        [Styles.Minimized]: minimized,
      })}
    >
      <div>
        <button onClick={() => setMinimized(!minimized)}>
          Betslip ({betslip.count}) {ThickChevron}
        </button>
      </div>
      <section className={Styles.Container}>
        <BetslipActionsContext.Provider value={actions}>
          <SelectedContext.Provider value={selected}>
            <BetslipHeader
              myBetsCount={myBetsCount}
              betslipCount={betslip.count}
            />
            {isMyBets && (
              <MyBetsSubheader
                unmatchedCount={unmatched.count}
                matchedCount={matched.count}
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
                <BetslipStepContext.Provider value={step}>
                  <BetslipList marketItems={marketItems} />
                  <BetslipFooter betslip={betslip} />
                </BetslipStepContext.Provider>
              )}
            </section>
          </SelectedContext.Provider>
        </BetslipActionsContext.Provider>
      </section>
    </aside>
  );
};
