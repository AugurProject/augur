import { ethers } from 'ethers';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';

export function generateTxParameterId(parameters: TransactionMetadataParams): string {
  if (!parameters) return null;
  let json = JSON.stringify(parameters).padEnd(32, '0').substring(1, 32);
  return ethers.utils.formatBytes32String(json);
}
