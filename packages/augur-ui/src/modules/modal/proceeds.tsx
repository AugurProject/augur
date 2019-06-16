import React from "react";

import { DefaultButtonProps } from "modules/common/buttons";
import {
  Title,
  ButtonsRow,
  DescriptionMessageProps,
  DescriptionMessage,
  ActionRowsProps,
  ActionRows,
  Breakdown,
} from "modules/modal/common";
import {
  LinearPropertyLabelProps,
} from "modules/common/labels";

import Styles from "modules/modal/modal.styles.less";

interface ProceedsProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  rows: ActionRowsProps;
  breakdown?: Array<LinearPropertyLabelProps>;
  descriptionMessage?: DescriptionMessageProps;
}

export const Proceeds = (props: ProceedsProps) => (
  <div className={Styles.Proceeds}>
    <Title title={props.title} closeAction={props.closeAction} />
    <main>
      {props.descriptionMessage && (
        // @ts-ignore
        <DescriptionMessage messages={props.descriptionMessage} />
      )}
      {/*
        // @ts-ignore */}
      {props.rows && <ActionRows rows={props.rows} />}
      {props.breakdown && <Breakdown short rows={props.breakdown} />}
    </main>
    <ButtonsRow buttons={props.buttons} />
  </div>
);
