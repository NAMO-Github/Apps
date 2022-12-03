export async function signHireNft(
  proxyAddress: string,
  hirer: string,
  chainId: number,
  signer: any,
  provider: any,
) {
  const nonce = (await provider._hireNftSigNonces(hirer)).toString();
  const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24; // 24 hours
  const types = {
    HireNFT: [
      { name: "proxyAddress", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };
  const message = {
    proxyAddress,
    nonce,
    deadline,
  };

  const domain = {
    name: "LoanNFT",
    version: "1",
    chainId,
    verifyingContract: provider.address,
  };

  return {
    signature: await signer._signTypedData(domain, types, message),
    deadline,
  };
}

