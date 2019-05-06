import React from "react";

import { DefaultButtonProps } from "modules/common-elements/buttons";
import {
  Title,
  ButtonsRow,
  DescriptionMessageProps,
  DescriptionMessage,
  ActionRowsProps,
  ActionRows,
  LinearPropertyLabelProps,
  Breakdown
} from "modules/modal/common";
import Styles from "modules/modal/modal.styles";

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
        <DescriptionMessage messages={props.descriptionMessage} />
      )}
      {props.rows && <ActionRows rows={props.rows} />}
      {props.breakdown && <Breakdown short rows={props.breakdown} />}
    </main>
    <ButtonsRow buttons={props.buttons} />
  </div>
);
