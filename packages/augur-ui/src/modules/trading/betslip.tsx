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

export interface BetslipProps {}

export const Betslip = ({  }: BetslipProps) => {
  const [minimized, setMinimized] = useState(true);
  const [step, setStep] = useState(0);
  const {
    selected,
    toggleHeaderSelected,
    toggleSubHeaderSelected,
    emptyHeader,
  } = useSelected();
  const betslipInfo = useBetslip(selected.header);
  const { betslipAmount, isSelectedEmpty } = betslipInfo;
  const { header } = selected;

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
          {header === 1 && (
            <MyBetsSubheader toggleSelected={toggleSubHeaderSelected} />
          )}
          <section
            className={classNames(Styles.MainSection, {
              [Styles.BetslipEmpty]: isSelectedEmpty,
              [Styles.BetslipList]: (!isSelectedEmpty && header === 0),
            })}
          >
            {isSelectedEmpty ? (
              <EmptyState emptyHeader={emptyHeader} />
            ) : (
              <BetslipStepContext.Provider value={step}>
                <BetslipList ordersInfo={betslipInfo.ordersInfo} actions={betslipInfo.ordersActions} />
                <BetslipFooter betslipInfo={betslipInfo} setStep={setStep} />
              </BetslipStepContext.Provider>
            )}
          </section>
        </SelectedContext.Provider>
      </section>
    </aside>
  );
};
