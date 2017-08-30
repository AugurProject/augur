import bs58 from 'bs58'

export const base58Decode = encoded => JSON.parse(new Buffer(bs58.decode(encoded)).toString('utf8'))

export const base58Encode = o => bs58.encode(new Buffer(JSON.stringify(o), 'utf8'))
