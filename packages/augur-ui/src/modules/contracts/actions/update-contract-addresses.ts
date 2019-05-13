export const UPDATE_CONTRACT_ADDRESSES = "UPDATE_CONTRACT_ADDRESSES";

export const updateContractAddresses = (contractAddresses: any) => ({
  type: UPDATE_CONTRACT_ADDRESSES,
  data: { contractAddresses }
});
