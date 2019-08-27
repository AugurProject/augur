import { ethers } from 'ethers';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';

export function generateTxParameterId(parameters: TransactionMetadataParams): string {
  if (!parameters) return null;
  const params = JSON.stringify(parameters, Object.keys(parameters).sort());
  const json = `0x${Buffer.from(params, 'utf8').toString('hex')}`;
  return ethers.utils.sha256(json);
}
