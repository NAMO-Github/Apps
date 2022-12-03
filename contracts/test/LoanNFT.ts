import {time, loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {expect} from "chai";
import {ethers, web3} from "hardhat";
import {signHireNft} from "./utils";
describe("Loan NFT", () => {
  async function deployContractsAndGetSigners() {
    const [deployer, lender, renter, proxy, namo] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT721");
    const nft = await (await NFT.deploy()).deployed();
    const Token = await ethers.getContractFactory("NamoUSD");
    const token = await (await Token.deploy()).deployed();

    const Wrapped = await ethers.getContractFactory("WrappedERC721", deployer);
    const wrappedErc721 = await (await Wrapped.deploy()).deployed();
    const LoanNFT = await ethers.getContractFactory("LoanNftV2");
    const loanNft = await (await LoanNFT.deploy(namo.address, 5, namo.address, wrappedErc721.address)).deployed();
    await wrappedErc721.connect(deployer).setAllowed(loanNft.address);

    return {nft, loanNft, deployer, lender, renter, token, proxy, namo, wrappedErc721};
  }

  it("should set item for rent successfully", async () => {
    const {nft, loanNft, deployer, lender, renter, token, wrappedErc721} = await loadFixture(
      deployContractsAndGetSigners
    );
    // mint for lender the nft
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal("1");

    // start list item for rent
    await nft.connect(lender).approve(loanNft.address, "1");
    const r = await loanNft.connect(lender).listItem(nft.address, "1", [3, 5, 7], [100, 100, 300], token.address)
    const a = await r.wait();
    // transfer success
    expect(await nft.balanceOf(loanNft.address)).to.equal("1");
    expect(await wrappedErc721.balanceOf(loanNft.address)).to.eq(1);
  })
  it("should edit item for rent successfully", async () => {
    const {nft, loanNft, deployer, lender, renter, token} = await loadFixture(
      deployContractsAndGetSigners
    );
    // mint for lender the nft
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal("1");

    // start list item for rent
    await nft.connect(lender).approve(loanNft.address, "1");
    await loanNft.connect(lender).listItem(nft.address, "1", [3, 5, 7], [100, 100, 300], token.address)
    await loanNft.connect(lender).editItem("1", [1,2,5,6], [3,4,7,8], token.address)

  })

  it("should not beable to edit item", async () => {
    const {nft, loanNft, proxy, namo, lender, renter, token} = await loadFixture(
      deployContractsAndGetSigners
    );
    // mint for lender the nft
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal("1");

    // start list item for rent
    await nft.connect(lender).approve(loanNft.address, "1");
    await loanNft.connect(lender).listItem(nft.address, "1", [3, 5, 7], [100, 100, 300], token.address)

    await token.mint(renter.address, 10000)
    await token.connect(renter).approve(loanNft.address, 0xfffffff);
    const gasToCharge = 300000;
    const gasPrice = await ethers.provider.getGasPrice();
    const weiToCharge = gasPrice.mul(gasToCharge);
    const {chainId} = await ethers.provider.getNetwork();
    const {signature, deadline} = await signHireNft(
      proxy.address,
      renter.address,
      chainId,
      namo,
      loanNft
    );
    await loanNft.connect(renter).hireItemWithSig(proxy.address, 1, 0, deadline, signature, {
      value: weiToCharge,
      gasPrice: gasPrice,
    });

    expect(loanNft.connect(lender).editItem("1", [1,2,5,6], [3,4,7,8], token.address)).to.be.revertedWith('[LOAN NFT] cannot edit while the item is renting');

  })
  it("should return item successfully", async () => {
    const {nft, loanNft, deployer, lender, renter, token} = await loadFixture(
      deployContractsAndGetSigners
    );

    // mint for lender the nft
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal("1");

    // start list item for rent
    await nft.connect(lender).approve(loanNft.address, "1");
    let r = await loanNft.connect(lender).listItem(nft.address, "1", [3, 5, 7], [100, 100, 300], token.address)
    const marketId = (await r.wait()).events?.find(i => i.event === "ListItem")?.args?.marketItem;
    // transfer success
    expect(await nft.balanceOf(loanNft.address)).to.equal("1");

    // de-list the item
    await loanNft.connect(lender).delistItem(marketId)
    expect(await nft.balanceOf(lender.address)).to.equal("1");
  })

  it("should get list item successfully", async () => {
    const {nft, loanNft, deployer, lender, renter, token} = await loadFixture(
      deployContractsAndGetSigners
    );

    // mint for lender the nft
    await nft.mint(lender.address);
    await nft.mint(lender.address);
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal("3");

    // start list item for rent
    await nft.connect(lender).setApprovalForAll(loanNft.address, true);
    let r = await loanNft.connect(lender).listItem(nft.address, "1", [3, 5, 7], [100, 100, 300], token.address)
    let r2 = await loanNft.connect(lender).listItem(nft.address, "2", [3, 5, 7], [100, 100, 300], token.address)
    let r3 = await loanNft.connect(lender).listItem(nft.address, "3", [3, 5, 7], [100, 100, 300], token.address)
    const marketId = (await r2.wait()).events?.find(i => i.event === "ListItem")?.args?.marketItem;

    // de-list the item
    await loanNft.connect(lender).delistItem(marketId)
    expect(await nft.balanceOf(lender.address)).to.equal("1");
    const listItem = await loanNft.connect(lender).getListedItem();
    expect(listItem).to.have.length(2);
  })
  it("should not be able to return", async () => {
    const {nft, loanNft, deployer, lender, renter, token} = await loadFixture(
      deployContractsAndGetSigners
    );

    // mint for lender the nft
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal("1");

    // start list item for rent
    await nft.connect(lender).approve(loanNft.address, "1");
    const r = await loanNft.connect(lender).listItem(nft.address, "1", [3, 5, 7], [100, 100, 300], token.address)
    const marketId = (await r.wait()).events?.find(i => i.event === "ListItem")?.args?.marketItem;

    // transfer success
    expect(await nft.balanceOf(loanNft.address)).to.equal("1");

    // de-list the item from another address
    await expect(loanNft.connect(renter).delistItem(marketId)).to.be.revertedWith('[LOAN NFT]: must be owner to delist')
  })

  it("should hire and return nft successfully", async () => {
    const {nft, loanNft, deployer, lender, renter, token, proxy, namo, wrappedErc721} = await loadFixture(
      deployContractsAndGetSigners
    );

    // mint for lender the nft
    await nft.mint(lender.address);
    expect(await nft.balanceOf(lender.address)).to.equal(1);

    // start list item for rent
    await nft.connect(lender).setApprovalForAll(loanNft.address, true);
    const result = await loanNft.connect(lender).listItem(nft.address, "1", [1, 5, 7], [100, 100, 300], token.address)
    const marketId = (await result.wait()).events?.find(i => i.event === "ListItem")?.args?.marketItem;

    // transfer success
    expect(await nft.balanceOf(loanNft.address)).to.equal(1);

    await token.mint(renter.address, 10000)
    const prev = await ethers.provider.getBalance(proxy.address);
    await token.connect(renter).approve(loanNft.address, 0xfffffff);
    const gasToCharge = 310000;
    const gasPrice = await ethers.provider.getGasPrice();
    const weiToCharge = gasPrice.mul(gasToCharge);
    const {chainId} = await ethers.provider.getNetwork();
    const {signature, deadline} = await signHireNft(
      proxy.address,
      renter.address,
      chainId,
      namo,
      loanNft
    );
    const oldNonce = await loanNft.connect(renter)._hireNftSigNonces(renter.address)
    await loanNft.connect(renter).hireItemWithSig(proxy.address, marketId, 0, deadline, signature, {
      value: weiToCharge,
      gasPrice: gasPrice,
    });
    const nonce = await loanNft.connect(renter)._hireNftSigNonces(renter.address)
    expect(nonce).to.eq(oldNonce.add(1));
    expect(await ethers.provider.getBalance(proxy.address)).to.eq(prev.add(weiToCharge))
    expect(await wrappedErc721.balanceOf(renter.address)).to.eq(1);
    expect(await wrappedErc721.balanceOf(loanNft.address)).to.eq(0);
    expect(await token.balanceOf(renter.address)).to.eq(10000 - 100);
    expect(await token.balanceOf(lender.address)).to.eq(0/*100 * 0.95*/); // lender will not receive the rental until the nft is return
    expect(await token.balanceOf(loanNft.address)).to.eq(100 * 0.95); // lender will not receive the rental until the nft is return
    expect(await token.balanceOf(namo.address)).to.eq(100 * 0.05);
    expect(await nft.balanceOf(proxy.address)).to.eq(1);
    expect(await nft.balanceOf(loanNft.address)).to.eq(0);
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
    await wrappedErc721.tokenURI(1).then(console.log)
    await nft.connect(proxy).setApprovalForAll(loanNft.address, true)
    const g = await loanNft.connect(proxy).returnItem(marketId, 'https://gateway.pinata.cloud/ipfs/QmSvfxYf5ut5sUyq5JCYgsBpWkF6swxDuWCfAeHdGAsBEr', {gasPrice});
    g.wait().then(r => console.log(r.gasUsed))
    expect(await wrappedErc721.balanceOf(renter.address)).to.eq(0);
    expect(await wrappedErc721.balanceOf(loanNft.address)).to.eq(1);
    expect(await token.balanceOf(lender.address)).to.eq(100 * 0.95); // lender will not receive the rental until the nft is return
    expect(await nft.balanceOf(loanNft.address)).to.eq(1);
    expect(await ethers.provider.getBalance(proxy.address)).to.gte(prev);
  })
});
