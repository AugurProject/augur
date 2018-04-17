import bs58 from 'bs58'

export const base58Decode = encoded => JSON.parse(Buffer.from(bs58.decode(encoded)).toString('utf8'))

export const base58Encode = o => bs58.encode(Buffer.from(JSON.stringify(o), 'utf8'))
