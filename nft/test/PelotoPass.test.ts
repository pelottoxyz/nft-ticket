import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { PelottoPass, PelottoPass__factory } from '../typechain-types'

function getAmountInWei(amount: Number) {
  return ethers.utils.parseEther(amount.toString())
}

function getAmountFromWei(amount: BigNumber) {
  return Number(ethers.utils.formatUnits(amount.toString()))
}

describe('PelottoPass contract', () => {
  let nftContractFactory: PelottoPass__factory
  let contract: PelottoPass
  let owner: SignerWithAddress

  const _name = 'PelottoPass'
  const _symbol = 'PELOTTO'
  const _uriPrefix = `ipfs://mock/`

  beforeEach(async () => {
    nftContractFactory = await ethers.getContractFactory(
      'PelottoPass'
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
      const mintCost = await contract.mintCost()
      await contract.mint({ value: mintCost })
      expect(await contract.owner()).to.equal(owner.address)
    })

    it('shold not mint if contract is paused', async () => {
      const mintCost = await contract.mintCost();
      let res = true
      try {
        await contract.pause()
        await contract.mint({ value: mintCost })
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
      const mintCost = await contract.mintCost()
      
      try {
        await contract.mint({ value: mintCost })
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
