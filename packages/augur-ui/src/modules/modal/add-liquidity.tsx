import React from 'react';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { CloseButton } from 'modules/common/buttons';
import Styles from 'modules/modal/modal.styles.less';
import { Title, ButtonsRow } from 'modules/modal/common';
import { Trash } from 'modules/common/icons';
import { addPendingOrder, removePendingOrder } from 'modules/orders/actions/pending-order-management';
import { usePendingOrdersStore } from 'modules/app/store/pending-orders';
import { startOrderSending } from 'modules/orders/actions/liquidity-management';

export const ModalAddLiquidity = () => {
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
  const {
    pendingLiquidityOrders,
    actions: { 
      addLiquidity,
      removePendingOrder,
    }
  } = usePendingOrdersStore();
  const { market: {
    transactionHash: txParamHash,
    outcomesFormatted,
    id: marketId,
    description,
  } } = modal;
  const buttons = [
    {
      text: 'Place orders',
      action: () => {
        startOrderSending({ marketId });
        closeModal();
      },
    },
    {
      text: 'Cancel',
      action: () => {
        closeModal();
      },
    },
  ];
  console.log(modal.market, pendingLiquidityOrders);
  return (
    <div className={Styles.AddLiquidityModal}>
      <Title title="Add more liquidity" closeAction={() => closeModal()} />
      <main>
        <h2>{description}</h2>
        <span>Small text indicating why the user should add more liquidity to this market?</span>
        <section>
          form section here
        </section>
        <div>
          <ul key={`tableheader`}>
            <li>Outcome</li>
            <li>Wager</li>
            <li>Odds</li>
            <li>
              <button onClick={() => console.log("cancel all orders")}>
                {Trash}Cancel All
              </button>
            </li>
          </ul>
        </div>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
