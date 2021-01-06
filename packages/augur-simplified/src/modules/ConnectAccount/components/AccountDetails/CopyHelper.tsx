import React from 'react'
import { CheckCircle, Copy } from 'react-feather'
import { useCopyClipboard } from '../../hooks'
import {TinyButton} from 'modules/common/buttons';

interface CopyHelperProps {
  darkMode: boolean;
  toCopy: string;
  copyText: string;
};

const CopyHelper = ({
  darkMode,
  toCopy,
  copyText = 'Copy',
}: CopyHelperProps) => {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <TinyButton
      action={() => setCopied(toCopy)}
      icon={isCopied ? <CheckCircle size={'16'} /> : <Copy size={'16'} />}
      text={isCopied ? 'Copied' : copyText}
    />
  );
}

export default CopyHelper;
