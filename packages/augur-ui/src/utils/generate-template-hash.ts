import { ethers } from 'ethers';
import { Template } from 'modules/types';
import deepClone from './deep-clone';

export function generateTemplateHash(template: Template): string {
  if (!template) return null;
  const copyOf = deepClone<Template>(template);
  delete copyOf.example;
  delete copyOf.hash;
  copyOf.inputs.map(i => delete i.values);
  const params = JSON.stringify(copyOf);
  const value = `0x${Buffer.from(params, 'utf8').toString('hex')}`;
  return ethers.utils.sha256(value);
}
