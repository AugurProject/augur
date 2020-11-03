export enum IPFSHashVersion {
  Invalid,
  CIDv0,
  CIDv1,
  // Used in testing. Not returned by function below.
  IPFS
}

export interface IPFSEndpointInfo {
  version: IPFSHashVersion,
  url: string | undefined
}
export function extractIPFSUrl(urlString: string): IPFSEndpointInfo {
  const url = new URL(urlString);

  // Check CIDv0
  const cidV0Pattern = /(.*)\/ipfs\/Qm/
  if(cidV0Pattern.test(url.href)) {
    return {
      version: IPFSHashVersion.CIDv0,
      url: `${url.protocol}//${url.host}/ipfs`
    }
  }

  // Check CIDv1
  const cidV1Pattern = /^\w+\.ipfs\.(.+)/
  if(cidV1Pattern.test(url.hostname)) {
    const matches = cidV1Pattern.exec(url.hostname);
    return {
      version: IPFSHashVersion.CIDv1,
      url: `${url.protocol}//${matches[1]}/ipfs`
    }
  }

  // Probably not ipfs or a format we aren't aware of at this point.
  return {
    version: IPFSHashVersion.Invalid,
    url: undefined
  };

}
