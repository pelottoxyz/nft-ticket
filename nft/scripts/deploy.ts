import dotenv from 'dotenv'
import { ethers } from 'hardhat'

dotenv.config()

async function main() {
  console.log('get contract factory...')
  const nftContractFactory = await ethers.getContractFactory(
    'PelottoPass'
  )
  console.log('deploy contract...')
  console.log(`CID: ${process.env.CID}`)

  const contract = await nftContractFactory.deploy(
    'PelottoPass',
    'PELOTTO',
    `ipfs://${process.env.CID}/`
  )  
  await contract.deployed()
  console.log(`NFT contract deployed to ${contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(0)
  })
