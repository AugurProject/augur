import React, { useState } from 'react';
import classNames from 'classnames';
import { ThickChevron } from 'modules/common/icons';
import {
  EmptyState,
  BetslipHeader,
  BetslipFooter,
  BetslipList,
  MyBetsSubheader,
} from 'modules/trading/common';
import {
  useSelected,
  useBetslip,
  SelectedContext,
  BetslipStepContext,
} from 'modules/trading/hooks/betslip';

import Styles from 'modules/trading/betslip.styles';

export const Betslip = () => {
  const [minimized, setMinimized] = useState(true);
  const [step, setStep] = useState(0);
  const {
    selected,
    toggleHeaderSelected,
    toggleSubHeaderSelected,
  } = useSelected();
  const betslipInfo = useBetslip(selected.header);
  const { betslipAmount, isSelectedEmpty } = betslipInfo;
  const isMyBets = selected.header === 1;
  return (
    <aside
      className={classNames(Styles.Betslip, {
        [Styles.Minimized]: minimized,
      })}
    >
      <div>
        <button onClick={() => setMinimized(!minimized)}>
          Betslip ({betslipAmount}) {ThickChevron}
        </button>
      </div>
      <section className={Styles.Container}>
        <SelectedContext.Provider value={selected}>
          <BetslipHeader
            toggleSelected={toggleHeaderSelected}
            betslipInfo={betslipInfo}
          />
          {isMyBets && (
            <MyBetsSubheader toggleSelected={toggleSubHeaderSelected} />
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
                {isMyBets ? (
                  <BetslipList marketItems={Object.entries(betslipInfo.myBets)} actions={betslipInfo.myBetsActions} />
                ): (
                  <BetslipList marketItems={Object.entries(betslipInfo.ordersInfo.orders)} actions={betslipInfo.ordersActions} />
                )}
                <BetslipFooter betslipInfo={betslipInfo} setStep={setStep} />
              </BetslipStepContext.Provider>
            )}
          </section>
        </SelectedContext.Provider>
      </section>
    </aside>
  );
};
