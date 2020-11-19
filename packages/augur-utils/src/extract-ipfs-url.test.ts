import {
  extractIPFSUrl,
  IPFSEndpointInfo,
  IPFSHashVersion,
} from './extract-ipfs-url';

describe('extractIPFSUrl', () => {
  test('cloudflare CIDv0', async () => {
    const result = extractIPFSUrl('https://cloudflare-ipfs.com/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
    expect(result).toEqual({
      version: IPFSHashVersion.CIDv0,
      url: 'https://cloudflare-ipfs.com/ipfs'
    });
  });

  test('cloudflare CIDv1', async () => {
    const result = extractIPFSUrl('https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.cf-ipfs.com/');
    expect(result).toEqual({
      version: IPFSHashVersion.CIDv1,
      url: 'https://cf-ipfs.com/ipfs'
    });
  });

  test('ipfs.io CIDv0', async () => {
    const result = extractIPFSUrl('http://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
    expect(result).toEqual({
      version: IPFSHashVersion.CIDv0,
      url: 'http://ipfs.io/ipfs'
    });
  });

  test('dweb.link CIDv1', async () => {
    const result = extractIPFSUrl('https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link');
    expect(result).toEqual({
      version: IPFSHashVersion.CIDv1,
      url: 'https://dweb.link/ipfs'
    });
  });

  test('localhost ipfs', async () => {
    const result = extractIPFSUrl('http://localhost:5001/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');
    expect(result).toEqual({
      version: IPFSHashVersion.CIDv0,
      url: 'http://localhost:5001/ipfs'
    });
  });

  test('localhost non-ipfs', async () => {
    const result = extractIPFSUrl('http://localhost:8080/#markets');
    expect(result).toEqual({
      version: IPFSHashVersion.Invalid,
      url: undefined
    });
  });

  test('non-ipfs endpoint', async () => {
    const result = extractIPFSUrl('https://somerandomthing.reallybadidea.com');
    expect(result).toEqual({
      version: IPFSHashVersion.Invalid,
      url: undefined
    });
  });

});
