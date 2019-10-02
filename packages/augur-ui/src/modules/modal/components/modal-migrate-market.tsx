import React from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  Title,
  DescriptionProps,
  Description,
  MarketTitle,
  Breakdown,
  ButtonsRow,
} from 'modules/modal/common';
import  {
  DismissableNotice,
  DismissableNoticeProps,
} from 'modules/reporting/common';
import {
  LinearPropertyLabelProps,
} from 'modules/common/labels';

import Styles from 'modules/modal/modal.styles.less';

interface ModalMigrateMarketProps {
  closeAction: Function;
  title: string;
  buttons: DefaultButtonProps[];
  marketTitle?: string;
  description?: DescriptionProps;
  breakdown?: LinearPropertyLabelProps[];
  dismissableNotice?: DismissableNoticeProps;
}

export const ModalMigrateMarket = ({
  title,
  closeAction,
  description,
  marketTitle,
  breakdown,
  dismissableNotice,
  buttons
}: ModalMigrateMarketProps) => (
  <div className={Styles.ModalMigrateMarket}>
    <Title title={title} closeAction={closeAction} />
    <main>
      <div>
        {description && <Description description={description} />}
        {marketTitle && <MarketTitle title={marketTitle} />}
        {breakdown && <Breakdown rows={breakdown} />}
        {dismissableNotice && <DismissableNotice {...dismissableNotice} />}
      </div>
    </main>
    {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
  </div>
);
