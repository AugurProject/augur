import { ethers } from 'ethers';
import { Template } from 'modules/types';

export function generateTemplateHash(template: Template): string {
  if (!template) return null;
  let minTemplate = delete template.example;
  minTemplate = delete template.hash;
  const value = JSON.stringify(minTemplate, Object.keys(minTemplate).sort());
  return ethers.utils.sha256(value);
}
