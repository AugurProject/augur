import React from "react";

import { DefaultButtonProps } from "modules/common/buttons";
import {
  Title,
  ButtonsRow,
  Content,
  ContentProps,
  CategorySelection,
  CategorySelectionProps
} from "modules/modal/common";

import Styles from "modules/modal/modal.styles.less";

interface CreateMarketProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  content?: ContentProps;
  CategorySelection?: CategorySelectionProps;
}

export const CreateMarket = ({
  title,
  closeAction,
  content,
  buttons,
  categorySelection
}: CreateMarketProps) => {
  console.log(buttons, categorySelection);
  return (
    <div className={Styles.CreateMarketMessage}>
      <Title title={title} closeAction={closeAction} />
      <main>
        {/*
          // @ts-ignore */}
        {!!content && <Content content={content} />}
        {/*
          // @ts-ignore */}
        {!!categorySelection && <CategorySelection {...categorySelection} />}
      </main>
      {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
    </div>
  );
}
