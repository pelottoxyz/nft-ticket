/** @type import('hardhat/config').HardhatUserConfig */
import dotenv from 'dotenv'
import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

dotenv.config()

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()
  for (const account of accounts) {
    console.log(account.address)
  }
})

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `${process.env.POLYGONSCAN_API_KEY}`,
  },
}

export default config
