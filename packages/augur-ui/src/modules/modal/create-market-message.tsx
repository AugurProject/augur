import React from "react";

import { DefaultButtonProps } from "modules/common/buttons";
import {
  Title,
  ButtonsRow,
  Content,
  ContentProps,
} from "modules/modal/common";

import Styles from "modules/modal/modal.styles.less";

interface CreateMarketMessageProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  content: ContentProps;
}

export const CreateMarketMessage = ({
  title,
  closeAction,
  content,
  buttons
}: CreateMarketMessageProps) => (
  <div className={Styles.CreateMarketMessage}>
    <Title title={title} closeAction={closeAction} />
    <main>
      {/*
        // @ts-ignore */}
      {content && <Content content={content} />}
    </main>
    {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
  </div>
);
