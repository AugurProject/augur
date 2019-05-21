export const UPDATE_BLOCKCHAIN = "UPDATE_BLOCKCHAIN";

export const updateBlockchain = (blockchainData: any) => ({
  type: UPDATE_BLOCKCHAIN,
  data: { blockchainData },
});
