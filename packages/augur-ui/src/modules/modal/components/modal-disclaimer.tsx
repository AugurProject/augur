import React, { useState, useRef } from 'react';

import ModalActions from 'modules/modal/components/common/modal-actions';
import { Checkbox } from 'modules/common/form';
import classNames from 'classnames';
import { OpenArrow } from 'modules/common/icons';

import Styles from 'modules/modal/components/common/common.styles.less';

const EST_HEIGHT_PERCENT = 0.98;

interface ModalDisclaimerProps {
  closeModal: Function;
  onApprove: Function;
  isReportingOnly: boolean;
}

const ModalDisclaimer = ({ closeModal, onApprove, isReportingOnly }: ModalDisclaimerProps) => {
  const [didScroll, setDidScroll] = useState(false);
  const [didCheck, setDidCheck] = useState(false);
  const containerText = useRef(null);

  const checkScroll = () => {
    const didUserScroll =
      containerText.current.scrollTop + containerText.current.clientHeight >=
      containerText.current.scrollHeight * EST_HEIGHT_PERCENT;
    setDidScroll(didUserScroll);
  };

  return (
    <section className={Styles.ModalDisclaimer}>
      <h1>Disclaimer</h1>
      <div ref={containerText} onScroll={() => checkScroll()}>
      <p>
          <b>{isReportingOnly ? "Welcome to the Augur Reporting & Browsing Client" : "Welcome to the Augur Client"}</b>
        </p>
        <p>
        Augur is a decentralized oracle and peer to peer protocol for user-created
          prediction markets. Augur is free, public, open source software and a
          set of smart contracts written in Solidity that can be deployed to the
          Ethereum Blockchain, collectivley known as (the “<b>Augur Protocol</b>
          ”). Before using the Augur Protocol, please review the{' '}
          <a
            href='https://augur.net/faq'
            target='_blank'
            rel='noopener noreferrer'
          >
            FAQs
          </a>{' '}
          and{' '}
          <a
            href='https://docs.augur.net/'
            target='_blank'
            rel='noopener noreferrer'
          >
            documentation
          </a>{' '}
          (the “<b>Documentation</b>
          ”) for a detailed explanation on how the Augur Protocol works.
        </p>

        <p>
        The Forecast Foundation OU (the “<b>Foundation</b>
          ”) is a not-for-profit entity. It does not own or lead Augur, but
          rather supports and develops the free, open-source protocol that is
          Augur. Portions of the Augur Protocol are made available under the GNU
          General Public License and portions under the MIT license -- and the
          disclaimers contained therein apply including that the Augur Protocol
          is provided “AS IS”, “WITH ALL FAULTS” and “AT YOUR OWN RISK”. The
          Foundation will not be liable for any liability or damages whatsoever
          associated with your use, inability to use, or your interaction with
          other users of, the Augur Protocol, including any direct, indirect,
          incidental, special, exemplary, punitive or consequential damages, loss of
          profits, Dai (DAI) tokens, Reputation (REP) tokens, (REPv2) tokens, Ether (ETH) tokens,
          and any other cryptocurrencies or anything of value, including fiat currency.
        </p>

        <p>
        You acknowledge that the current version of the Augur Protocol is a
          beta version and as such has not been fully-tested and may not perform
          as designed. On the Augur Protocol, Dai (DAI), Reputation (REP), Reputation V2 (REPv2), and Ether (ETH)
          may be used respectively for staking on outcomes and trading, and in
          the future, other tokens or cryptocurrencies may be used. While you
          should always be thoughtful about the DAI, REP, REPv2, ETH or other
          tokens/cryptocurrencies you stake and trade (and can lose) through the
          Augur Protocol, the concerns regarding loss of these tokens or
          cryptocurrencies is particularly acute with beta software that may not
          perform as designed, including that the beta version of the Augur
          Protocol may not accurately reflect the intent of the smart contracts,
          the FAQs or the Documentation. Your use of the Augur Protocol involves
          various risks, including, but not limited to losing
          tokens/cryptocurrencies due to invalidation. Careful due diligence
          should be undertaken as to the amount of DAI, REP, REPv2, ETH or other
          tokens/cryptocurrencies you stake and trade using the Augur Protocol
          in beta format with full understanding that any staking and trading of
          these tokens/cryptocurrencies could be subject to total loss. You
          assume any and all risk associated with your use of the Augur
          Protocol.
        </p>

        <p>
        Although the Foundation has not sought to list REP or REPv2 on cryptocurrency
          exchanges, it is aware that REP and REPv2 has been listed on certain exchanges
          and in the future it may be delisted on these exchanges and/or listed
          on others. The Foundation disavows any obligation with respect to the
          listing of REP or REPv2 on exchanges and it disavows any responsibility with
          respect to the value or trading of REP or REPv2 on exchanges. Persons trading
          REP or REPv2 or otherwise engaged in activities involving REP or REPv2 on exchanges
          assume any and all risk, including that of total loss, associated with
          such activities.
        </p>

        <p>
        You are solely responsible for compliance with all laws that may apply
          to your particular use of the Augur Protocol. Cryptocurrencies and
          blockchain technologies have been the subject of scrutiny by various
          regulatory bodies around the world. The Foundation makes no
          representation regarding the application of any laws, including but by
          no means limited to those relating to gaming, options, derivatives or
          securities, to your use of the Augur Protocol. Indeed, depending on
          the jurisdiction and the contemplated use of the Augur Protocol
          (whether yours or another’s), that use may be considered illegal. You
          agree that the Forecast Foundation OU, PM Research LTD, or any other referrer is not responsible for determining whether
          or which laws may apply to your use of the Augur Protocol. You may
          modify the Augur Protocol under the terms of the applicable open
          source license to effectuate your compliance with any applicable laws.
        </p>

        <div
          onClick={e => {
            e.preventDefault();
            setDidCheck(!didCheck);
          }}
        >
          <label htmlFor='i_have_read_disclaimer'>
            <Checkbox
              id='i_have_read_disclaimer'
              value={didCheck && didScroll}
              isChecked={didCheck && didScroll}
              disabled={!didScroll}
              onClick={e => {
                e.preventDefault();
                setDidCheck(!didCheck);
              }}
            />
            I have read and understood the above.
          </label>
        </div>
        <ModalActions
          buttons={[
            {
              label: 'I agree and accept the above',
              isDisabled: !didScroll || !didCheck,
              action: () => {
                closeModal();
                if (onApprove) onApprove();
              },
            },
          ]}
        />
      </div>
      <div
        onClick={() => {
          containerText.current.scrollBy({
            left: 0,
            top: 400,
            behavior: 'smooth'
          });
        }}
        className={classNames({ [Styles.hidden]: didScroll })}
      >
        <div>{OpenArrow}</div>
      </div>
    </section>
  );
};

export default ModalDisclaimer;
