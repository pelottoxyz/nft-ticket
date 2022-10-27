import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('PelottoNFT', function () {
  it('mint with valid signature', async function () {
    const [deployer, relayer, user] = await ethers.getSigners()
    const nftContract = await (
      await ethers.getContractFactory('PelottoNFT', deployer)
    ).deploy(relayer.address)
    const tokenId = await nftContract
      .connect(relayer)
      .tokenIdCounter()

    const message = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'address'],
      [user.address, tokenId, nftContract.address]
    )
    let messageHash = ethers.utils.keccak256(message)
    let signature = await relayer.signMessage(
      ethers.utils.arrayify(messageHash)
    )

    await nftContract.connect(user).mint(messageHash, signature)

    expect(
      (await nftContract.balanceOf(user.address)).toString()
    ).to.eq('1')
    expect(await nftContract.ownerOf(1)).to.eq(user.address)
  })
})
