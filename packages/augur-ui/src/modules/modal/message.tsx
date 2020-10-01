import React from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  AlertMessage,
  AlertMessageProps,
  Breakdown,
  ButtonsRow,
  CallToAction,
  CheckboxCTA,
  CheckboxCTAProps,
  Content,
  ContentProps,
  DepositInfo,
  DepositInfoProps,
  Description,
  DescriptionProps,
  MarketReview,
  MarketReviewProps,
  MarketTitle,
  ReadableAddress,
  ReadableAddressProps,
  Subheader,
  Title,
  DescriptionWithLink,
  DescriptionWithLinkProps,
} from 'modules/modal/common';
import {
  MultipleExplainerBlock,
} from 'modules/create-market/components/common';
import {
  AugurMarketsContent,
  EventDetailsContent,
} from 'modules/create-market/constants';
import {
  LinearPropertyLabelProps,
  DiscordLink,
  AddFundsHelp,
} from 'modules/common/labels';

import Styles from 'modules/modal/modal.styles.less';
import { HelpMenu } from 'modules/app/components/help-resources';
import * as classNames from 'classnames';
import { OptionsMenus } from 'modules/app/components/odds-menu';
import {
  DismissableNotice,
  DismissableNoticeProps,
} from 'modules/reporting/common';

interface MessageProps {
  closeAction: Function;
  title: string;
  buttons: DefaultButtonProps[];
  content?: ContentProps;
  alertMessage?: AlertMessageProps;
  marketTitle?: string;
  callToAction?: string;
  description?: DescriptionProps;
  descriptionWithLink?: DescriptionWithLinkProps;
  breakdown?: LinearPropertyLabelProps[];
  readableAddress?: ReadableAddressProps;
  depositInfo?: DepositInfoProps;
  marketReview?: MarketReviewProps;
  checkbox?: CheckboxCTAProps;
  subheaders?: object[];
  showDiscordLink?: boolean;
  invalidMarketRules?: boolean;
  showAddFundsHelp?: boolean;
  walletType?: string;
  showAddFundsModal?: Function;
  showHelp?: Boolean;
  showOdds?: Boolean;
  migrateMarket?: Boolean;
  dismissableNotice?: DismissableNoticeProps;
}

export const Message = ({
  title,
  closeAction,
  alertMessage,
  marketTitle,
  callToAction,
  description,
  descriptionWithLink,
  breakdown,
  readableAddress,
  depositInfo,
  marketReview,
  checkbox,
  content,
  buttons = [],
  subheaders,
  subheader,
  showDiscordLink,
  invalidMarketRules,
  showAddFundsHelp = false,
  walletType,
  showAddFundsModal,
  showHelp,
  showOdds,
  migrateMarket,
  dismissableNotice,
}: MessageProps) => (
  <div
    className={classNames(Styles.Message, {
      [Styles.Help]: showHelp || showOdds,
      [Styles.ModalMigrateMarket]: migrateMarket,
    })}
  >
    <Title title={title} closeAction={closeAction} />
    <main>
      {alertMessage && <AlertMessage {...alertMessage} />}
      {marketTitle && <MarketTitle title={marketTitle} />}
      {callToAction && <CallToAction callToAction={callToAction} />}
      {content && <Content content={content} />}
      {description && <Description description={description} />}
      {descriptionWithLink && <DescriptionWithLink {...descriptionWithLink} />}
      {showHelp && <HelpMenu />}
      {showOdds && <OptionsMenus showConfirm closeAction={closeAction}/>}
      {showAddFundsHelp && (
        <AddFundsHelp
          showAddFundsModal={showAddFundsModal}
          walletType={walletType}
        />
      )}
      {showDiscordLink && (
        <DiscordLink label="Please try again. If the issue persists please report it on " />
      )}

      {subheaders && (
        subheaders.map(subheader => {
          return <Subheader subheaderContent={subheader} />;
        })
      )}

      {breakdown && <Breakdown rows={breakdown} />}
      {readableAddress && <ReadableAddress {...readableAddress} />}
      {depositInfo && <DepositInfo {...depositInfo} />}
      {marketReview && <MarketReview {...marketReview} />}
      {checkbox && <CheckboxCTA {...checkbox} />}
      {invalidMarketRules && (
        <MultipleExplainerBlock
          isModal
          contents={[
            {
              title: AugurMarketsContent().explainerBlockTitle,
              subtexts: AugurMarketsContent().explainerBlockSubtexts,
              useBullets: AugurMarketsContent().useBullets,
            },
            {
              title: EventDetailsContent().explainerBlockTitle,
              subtexts: EventDetailsContent().explainerBlockSubtexts,
              useBullets: EventDetailsContent().useBullets,
            },
          ]}
        />
      )}
      {dismissableNotice && <DismissableNotice {...dismissableNotice} />}
    </main>
    {buttons.length > 0 && <ButtonsRow buttons={buttons} />}
  </div>
);
