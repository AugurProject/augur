import { ethers } from 'ethers';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';

export function generateTxParameterId(parameters: TransactionMetadataParams): string {
  if (!parameters) return null;
  const json = `0x${Buffer.from(JSON.stringify(parameters, Object.keys(parameters).sort()), 'utf8').toString('hex')}`;
  return ethers.utils.sha256(json);
}
