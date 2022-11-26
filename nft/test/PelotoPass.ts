import dotenv from 'dotenv'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PelottoPass, PelottoPass__factory } from '../typechain-types'

dotenv.config()

describe('PelottoPass contract', () => {
  let nftContractFactory: PelottoPass__factory
  let contract: PelottoPass
  let owner: SignerWithAddress

  const _name = 'PelottoPass'
  const _symbol = 'PELOTTO'
  const _uriPrefix = `ipfs://${process.env.CID}/`

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

    it('should mint pass', async () => {
      await contract.mint()
      expect(await contract.owner()).to.equal(owner.address)
    })

    it('totalSupply should be 2', async () => {
      await contract.mint()
      expect(await contract.totalSupply()).to.equal(2)
    })
  })
})
