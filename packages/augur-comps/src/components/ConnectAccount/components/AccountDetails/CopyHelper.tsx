import React from 'react'
import { CheckCircle } from 'react-feather'
import { useCopyClipboard } from '../../hooks'
import {TinyButton} from '../../../common/buttons';
import { CopyIcon } from '../../../common/icons';

export interface CopyHelperProps {
  toCopy: string;
  copyText: string;
};

const CopyHelper = ({
  toCopy,
  copyText = 'Copy',
}: CopyHelperProps) => {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <TinyButton
      action={() => setCopied(toCopy)}
      icon={isCopied ? <CheckCircle size={'16'} /> : CopyIcon}
      text={isCopied ? 'Copied' : copyText}
    />
  );
}

export default CopyHelper;
