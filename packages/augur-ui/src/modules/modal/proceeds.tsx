import React from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  Title,
  ButtonsRow,
  DescriptionMessageProps,
  DescriptionMessage,
  ActionRowsProps,
  ActionRows,
  Breakdown,
} from 'modules/modal/common';
import {
  BulkTxLabel,
  LinearPropertyLabelProps,
} from 'modules/common/labels';

import Styles from 'modules/modal/modal.styles.less';
import { CLAIM_ALL_TITLE } from 'modules/common/constants';

interface ProceedsProps {
  closeAction: Function;
  title: string;
  buttons: DefaultButtonProps[];
  rows: ActionRowsProps;
  submitAllTxCount: number;
  breakdown?: LinearPropertyLabelProps[];
  descriptionMessage?: DescriptionMessageProps;
}

export const Proceeds = ({
  closeAction,
  title,
  buttons,
  rows,
  submitAllTxCount,
  breakdown,
  descriptionMessage,
}: ProceedsProps) => (
  <div className={Styles.Proceeds}>
    <Title title={title} closeAction={closeAction} />
    <main>
      {descriptionMessage && (
        // @ts-ignore
        <DescriptionMessage messages={descriptionMessage} />
      )}
      {/*
        // @ts-ignore */}
      {rows && <ActionRows rows={rows} />}
      {breakdown && <Breakdown short rows={breakdown} />}
    </main>
    <BulkTxLabel
      buttonName={CLAIM_ALL_TITLE}
      count={submitAllTxCount}
      needsApproval={false}
    />
    {buttons && <ButtonsRow buttons={buttons} />}
  </div>
);
