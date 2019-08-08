import React from "react";

import { DefaultButtonProps } from "modules/common/buttons";
import {
  Title,
  DescriptionProps,
  Description,
  ButtonsRow,
  AlertMessageProps,
  AlertMessage,
  MarketTitle,
  CallToAction,
  Breakdown,
  ReadableAddress,
  ReadableAddressProps,
  DepositInfo,
  DepositInfoProps,
  MarketReview,
  MarketReviewProps,
  CheckboxCTA,
  CheckboxCTAProps,
  Content,
  ContentProps,
  Subheader
} from "modules/modal/common";
import {
  LinearPropertyLabelProps,
} from "modules/common/labels";

import Styles from "modules/modal/modal.styles.less";

interface MessageProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
  content?: ContentProps;
  alertMessage?: AlertMessageProps;
  marketTitle?: string;
  callToAction?: string;
  description?: DescriptionProps;
  breakdown?: Array<LinearPropertyLabelProps>;
  readableAddress?: ReadableAddressProps;
  depositInfo?: DepositInfoProps;
  marketReview?: MarketReviewProps;
  checkbox?: CheckboxCTAProps;
}

export const Message = ({
  title,
  closeAction,
  alertMessage,
  marketTitle,
  callToAction,
  description,
  breakdown,
  readableAddress,
  depositInfo,
  marketReview,
  checkbox,
  content,
  buttons,
  subheader,
  subheader_2
}: MessageProps) => (
  <div className={Styles.Message}>
    <Title title={title} closeAction={closeAction} />
    <main>
      {alertMessage && <AlertMessage {...alertMessage} />}
      {marketTitle && <MarketTitle title={marketTitle} />}
      {callToAction && <CallToAction callToAction={callToAction} />}
      {/*
        // @ts-ignore */}
      {content && <Content content={content} />}
      {/*
        // @ts-ignore */}
      {description && <Description description={description} />}
      {subheader && <Subheader subheaderContent={subheader} />}
      {subheader_2 && <Subheader subheaderContent={subheader_2} />}
      {breakdown && <Breakdown rows={breakdown} />}
      {readableAddress && <ReadableAddress {...readableAddress} />}
      {depositInfo && <DepositInfo {...depositInfo} />}
      {marketReview && <MarketReview {...marketReview} />}
      {checkbox && <CheckboxCTA {...checkbox} />}
    </main>
    {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
  </div>
);
