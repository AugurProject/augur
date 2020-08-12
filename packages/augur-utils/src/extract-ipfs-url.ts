export enum IPFSHashVersion {
  Invalid,
  CIDv0,
  CIDv1,
}

export interface IPFSEndpointInfo {
  version: IPFSHashVersion,
  url: string | undefined
}
export function extractIPFSUrl(url: string): IPFSEndpointInfo {
  

}
