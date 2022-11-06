import { ethers } from 'hardhat'

async function main() {
  const nftContractFactory = await ethers.getContractFactory(
    'PelottoPass'
  )
  const contract = await nftContractFactory.deploy()
  await contract.deployed()
  console.log(`NFT contract deployed to ${contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(0)
  })
