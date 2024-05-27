import { ethers, providers } from 'ethers';

// https://eips.ethereum.org/EIPS/eip-1271#specification
// EIP-1271 states that `isValidSignature` must return the following value if the signature is valid
const ERC_1271_MAGIC_VALUE = '0x1626ba7e';

export const isSignatureValid = async (
  address: string,
  payload: any,
  signature: string,
  zkEvmProvider: providers.Provider, // can be any provider, Passport or not
) => {
  const types = { ...payload.types };
  // Ethers auto-generates the EIP712Domain type in the TypedDataEncoder, and so it needs to be removed
  delete types.EIP712Domain;

  const hash = ethers.utils._TypedDataEncoder.hash(
    payload.domain,
    types,
    payload.message,
  );
  const contract = new ethers.Contract(
    address,
    ['function isValidSignature(bytes32, bytes) public view returns (bytes4)'],
    zkEvmProvider
  );

  const isValidSignatureHex = await contract.isValidSignature(hash, signature);
  return isValidSignatureHex === ERC_1271_MAGIC_VALUE;
};
bacend code