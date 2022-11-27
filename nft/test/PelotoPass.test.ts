import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PelottoPass, PelottoPass__factory } from '../typechain-types'

describe('PelottoPass contract', () => {
  let nftContractFactory: PelottoPass__factory
  let contract: PelottoPass
  let owner: SignerWithAddress
  let account1: SignerWithAddress

  const _name = 'PelottoPass'
  const _symbol = 'PELOTTO'
  const _uriPrefix = `ipfs://mock/`

  beforeEach(async () => {
    nftContractFactory = await ethers.getContractFactory(
      'PelottoPass'
    )
    ;[owner, account1] = await ethers.getSigners()
    console.log('owner ', owner.address)
  })

  describe('Deploy', () => {
    it('should deploy contract', async () => {
      const nftContract = await nftContractFactory.deploy(
        _name,
        _symbol,
        _uriPrefix
      )
      contract = await nftContract.deployed()
      await contract.deployed()
      expect(await contract.name()).to.equal(_name)
      expect(await contract.symbol()).to.equal(_symbol)
    })

    it('should mint 2 pass', async () => {
      await contract.mint(2)
      expect(await contract.owner()).to.equal(owner.address)
    })

    it('shold not mint if contract is paused', async () => {
      let res = true
      try {
        await contract.pause()
        await contract.mint(1)
      } catch (err) {
        res = false
      }
      expect(res).to.be.false
    })

    it('should unpause contract', async () => {
      await contract.unpause()
      expect(await contract.paused()).to.be.false
    })

    it('should not mint more than 3 nfts', async () => {
      let res = true
      const supply = await contract.totalSupply() 

      try {
        await contract.mint(4)
      } catch (err: any) {
        res = false
      }
      expect(await contract.totalSupply()).to.equal(supply)
      expect(res).to.be.false
    })
  })
})
