import React from 'react';
import classNames from 'classnames';
import { DefaultButtonProps } from 'modules/common/buttons';
import {
  Title,
  ButtonsRow,
  Content,
  ContentProps,
  CategorySelection,
  CategorySelectionProps,
  Examples,
  ExamplesProps
} from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';

interface CreateMarketProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  content?: ContentProps;
  categorySelection?: CategorySelectionProps;
  examples?: ExamplesProps;
}

export const CreateMarket = ({
  title,
  closeAction,
  content,
  buttons,
  categorySelection,
  examples
}: CreateMarketProps) => {
  return (
    <div
      className={classNames(Styles.CreateMarketMessage, {
        [Styles.NoScroll]: !!categorySelection,
      })}
    >
      <Title title={title} closeAction={closeAction} />
      <main>
        {/*
          // @ts-ignore */}
        {!!content && <Content content={content} />}
        {!!examples && <Examples {...examples} />}
        {/*
          // @ts-ignore */}
        {!!categorySelection && <CategorySelection {...categorySelection} />}
      </main>
      {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
    </div>
  );
};
