import dotenv from 'dotenv'
import { ethers } from 'hardhat'

dotenv.config()

async function main() {
  const PelottoNFT = await ethers.getContractFactory('PelottoNFT')
  const contract = await PelottoNFT.deploy(
    `${process.env.DEFENDER_RELAYER_ADDRESS}`
  )
  console.log(`Deploying contract to ${contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(0)
  })
