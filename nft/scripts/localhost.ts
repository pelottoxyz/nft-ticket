import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
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