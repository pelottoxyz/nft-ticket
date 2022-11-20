import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0xBB205683f0d74BE19F4A7c07056eC7E8b16A19fe'
  const contract = await ethers.getContractAt(
    'PelottoPass',
    contractAddress
  )
  const accounts = await ethers.getSigners()
  const owner = accounts[0].address
  const teamId = 1
  await contract.mint(teamId)
  const id = await contract.balanceOf(owner)
  console.log('id: ', id.toString())
  console.log('\ngeneratePass()\n')
  console.log(await contract.generatePass(id))
  console.log('\ngetTokenURI()\n')
  console.log(await contract.getTokenURI(id, teamId))
  process.exit(0)
}

main()
