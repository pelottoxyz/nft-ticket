import dotenv from 'dotenv'
import { ethers } from 'hardhat'

dotenv.config()

async function main() {
  console.log('getting gas price from oracle...')
  const res = await fetch('https://gasstation-mumbai.matic.today/v2')
  const json = await res.json()
  const { standard: { maxPriorityFee } } = json
  console.log('gas price', json)
  console.log('get contract factory...')
  const nftContractFactory = await ethers.getContractFactory(
    'PelottoNFTPass'
  )
  console.log('deploy contract...')
  console.log(`CID: ${process.env.CID}`)

  const contract = await nftContractFactory.deploy(
    'PelottoNFTPass',
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
