export const _1_ETH = 1e18;
export const _1_HUNDRED_ETH = _1_ETH * 100;
export const _1_BILLION_ETH = _1_ETH * 1e9;

export interface Account {
  privateKey: string;
  address: string;
  initialBalance: number;
}

export const ACCOUNTS: Account[] = [
  { // contract owner is the first address
    privateKey: '0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
    address: '0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0x48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712',
    address: '0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0x8a4edfe30b4cdc9064b2e72d28bce9a650c24c6193de5058c96c296bc22d25d1',
    address: '0xE4EC477Bc4Abd2B18225Bb8CBa14BF57867f082B',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0xa08bd4f8e835ba11f5236595f7162b894923422ee6e4ba53b6259699ecd02fa5',
    address: '0x40075b21ee1fc506207ac45c006d68114dae9967',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0xae95b6c42193f3f736ff91e19d19f1cb040672fe9144167c2e29ada17dc95b95',
    address: '0xd1a8d03498407db8299bc912ffc0196564fe91e9',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0xd4cf6736518eaff819676c7822842d239f1b4e182dbfc0e40d735b8c20ab4ba9',
    address: '0x5eb11f4561da21e9070b8f664fc70aec62ec29d5',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0x705d7d3f7a0e35df37e80e07c44ccd6b8757c2b44d50cb2f33bc493cc07f65e7',
    address: '0x53c3d9be61c8375b34970801c5bd4d1a87860343',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0xcfa5622e09afac03fb5dfa5cb54e52c9d37e06a5b07d5598850b62304639b815',
    address: '0x9d4c6d4b84cd046381923c9bc136d6ff1fe292d9',
    initialBalance: _1_BILLION_ETH,
  },
  {
    privateKey: '0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913',
    address: '0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE',
    initialBalance: 0, // NOTE: This isn't funded in the geth-poa genesis
  },
];

export const BASE_MNEMONIC = 'globe draft monster quiz slogan renew smile nature hip donor leisure number';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEADBEEF_ADDRESS = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
