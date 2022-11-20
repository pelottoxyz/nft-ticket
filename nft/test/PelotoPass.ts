import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PelottoPass, PelottoPass__factory } from '../typechain-types'

describe('PelottoPass contract', () => {
  let nftContractFactory: PelottoPass__factory
  let contract: PelottoPass
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
      await contract.mint(1)
      expect(await contract.owner()).to.equal(owner.address)
    })

    it('totalSupply should be 2', async () => {
      await contract.mint(1)
      expect(await contract.totalSupply()).to.equal(2)
    })

    it('should not continue without valid team id', async () => {
      const minted = await contract.mint(2)
      expect(minted).to.be.null
    })
  })
})
