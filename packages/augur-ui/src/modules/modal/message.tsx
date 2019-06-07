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
} from "modules/modal/common";
import {
  LinearPropertyLabelProps,
} from "modules/common/labels";

import Styles from "modules/modal/modal.styles.less";

interface MessageProps {
  closeAction: Function;
  title: string;
  buttons: Array<DefaultButtonProps>;
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

export const Message = (props: MessageProps) => (
  <div className={Styles.Message}>
    <Title title={props.title} closeAction={props.closeAction} />
    <main>
      {props.alertMessage && <AlertMessage {...props.alertMessage} />}
      {props.marketTitle && <MarketTitle title={props.marketTitle} />}
      {props.callToAction && <CallToAction callToAction={props.callToAction} />}
      // @ts-ignore
      {props.description && <Description description={props.description} />}
      {props.breakdown && <Breakdown rows={props.breakdown} />}
      {props.readableAddress && <ReadableAddress {...props.readableAddress} />}
      {props.depositInfo && <DepositInfo {...props.depositInfo} />}
      {props.marketReview && <MarketReview {...props.marketReview} />}
      {props.checkbox && <CheckboxCTA {...props.checkbox} />}
    </main>
    {props.buttons.length > 0 && <ButtonsRow buttons={props.buttons} />}
  </div>
);
