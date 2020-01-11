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
  Subheader,
} from "modules/modal/common";
import {
  LinearPropertyLabelProps, DiscordLink,
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
  subheader?: string;
  subheader_2?: string;
  showDiscordLink?: boolean;
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
  subheader_2,
  showDiscordLink,
}: MessageProps) => (
  <div className={Styles.Message}>
    <Title title={title} closeAction={closeAction} />
    <main>
      {alertMessage && <AlertMessage {...alertMessage} />}
      {marketTitle && <MarketTitle title={marketTitle} />}
      {callToAction && <CallToAction callToAction={callToAction} />}
      {content && <Content content={content} />}
      {description && <Description description={description} />}
      {showDiscordLink && <DiscordLink label='Please try again. If the issue persists please report it on ' /> }
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
