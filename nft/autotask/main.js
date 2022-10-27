const { ethers } = require('ethers')
const {
  DefenderRelayProvider,
  DefenderRelaySigner,
} = require('defender-relay-client/lib/ethers')

const contractAbi = [
  'function tokenIdCounter() view returns (uint256)',
]

exports.handler = async function (event) {
  
  // TODO: look into other possibly validations
  const { userAddress, contractAddress } = event.request.body

  // initialize defender relayer provider and signer
  const provider = new DefenderRelayProvider(event)
  const signer = new DefenderRelaySigner(event, provider, {
    speed: 'fast',
  })

  const nftContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    provider
  )
  const tokenId = await nftContract.tokenIdCounter()

  console.log(
    `User: ${userAddress}\nToken ID: ${tokenId}\nContract: ${contractAddress}`
  )

  // TODO: https://docs.openzeppelin.com/defender/autotasks#kvstore
  // prevent same address to obtain two signed messages

  // build, hash and sign message with relayer key
  const message = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'address'],
    [userAddress, tokenId, contractAddress]
  )
  const hash = ethers.utils.keccak256(message)
  const signature = await signer.signMessage(
    ethers.utils.arrayify(hash)
  )

  return { hash, signature }
}
