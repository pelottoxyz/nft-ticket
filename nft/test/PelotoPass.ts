import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PelotoPass } from '../typechain-types/contracts/PelottoPass.sol'
import { PelotoPass__factory } from '../typechain-types/factories/contracts/PelottoPass.sol'

describe('PelottoPass contract', () => {
  let nftContractFactory: PelotoPass__factory
  let contract: PelotoPass
  let _name = 'PelottoPass'
  let _symbol = 'PELOTTO'
  let owner: SignerWithAddress
  let account1: SignerWithAddress

  beforeEach(async () => {
    nftContractFactory = await ethers.getContractFactory(
      'PelottoPass'
    )
    ;[owner, account1] = await ethers.getSigners()
    console.log('owner ', owner.address)
    console.log('address ', account1.address)
  })

  describe('Deploy', () => {
    it('should deploy contract', async () => {
      const nftContract = await nftContractFactory.deploy()
      contract = await nftContract.deployed()
      await contract.deployed()
      expect(await contract.name()).to.equal(_name)
      expect(await contract.symbol()).to.equal(_symbol)
    })

    it('should mint a token', async () => {
      await contract.mint()
      expect(await contract.owner()).to.equal(owner.address)
    })
  })
})
