import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PelottoNFTPass, PelottoNFTPass__factory } from '../typechain-types'

describe('PelottoNFTPass contract', () => {
  let nftContractFactory: PelottoNFTPass__factory
  let contract: PelottoNFTPass
  let owner: SignerWithAddress

  const _name = 'PelottoNFTPass'
  const _symbol = 'PELOTTO'
  const _uriPrefix = `ipfs://mock/`

  beforeEach(async () => {
    nftContractFactory = await ethers.getContractFactory(
      'PelottoNFTPass'
    )
    ;[owner] = await ethers.getSigners()
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

    it('should mint 1 pass', async () => {
      await contract.mint()
      expect(await contract.owner()).to.equal(owner.address)
    })

    it('shold not mint if contract is paused', async () => {
      let res = true
      try {
        await contract.pause()
        await contract.mint()
      } catch (err) {
        res = false
      }
      expect(res).to.be.false
    })

    it('should unpause contract', async () => {
      await contract.unpause()
      expect(await contract.paused()).to.be.false
    })

    it('should not mint more than 1 nfts', async () => {
      let res = true
      const supply = await contract.totalSupply()
      
      try {
        await contract.mint()
      } catch (err: any) {
        res = false
      }
      expect(await contract.totalSupply()).to.equal(supply)
      expect(res).to.be.false
    })

    it('should return invalid token uri', async () => {
      let res = true
      const total = await contract.totalSupply()
      try {
        await contract.getTokenURI(100)
      } catch (err) {
        res = false
      }
      expect(res).to.be.false
      expect(await contract.totalSupply()).to.equal(total)
    })
  })
})
