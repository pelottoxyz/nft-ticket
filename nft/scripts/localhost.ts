import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  const contract = await ethers.getContractAt('PelottoPass', contractAddress)
  const accounts = await ethers.getSigners()
  const owner = accounts[0].address
  await contract.mint()
  const id = await contract.balanceOf(owner)
  console.log('id: ', id.toString())
  console.log('\ngeneratePass()\n')
  console.log(await contract.generatePass(id));
  console.log('\ngetTokenURI()\n')
  console.log(await contract.getTokenURI(id));
  process.exit(0);
}

main()