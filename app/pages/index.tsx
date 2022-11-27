import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount, useContractRead } from 'wagmi'
import { ConnectWalletButton } from '@/components/ConnectButton'
import { Box, Header } from '@/components'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT

const Home: NextPage = () => {
  const { isConnected } = useAccount()
  // const { config } = usePrepareContractWrite({
  //   address: CONTRACT_ADDRESS,
  //   abi: [
  //     {
  //       inputs: [],
  //       name: 'mint',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'mint',
  // })

  // const {
  //   data: mintData,
  //   isLoading: isMintLoading,
  //   isSuccess: isMintStarted,
  //   write: mint,
  // } = useContractWrite(config)

  // const { isSuccess: txSuccess } = useWaitForTransaction({
  //   hash: mintData?.hash,
  // });

  //const isMinted = txSuccess;

  const { data: totalSupplyData, isSuccess: totalSupplySuccess } =
    useContractRead({
      address: CONTRACT_ADDRESS,
      abi: [
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'totalSupply',
    })

  return (
    <div style={{ padding: 24 }}>
      <Head>
        <title>Pelotto</title>
        <meta name="description" content="Building" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <Box css={{ marginLeft: 'auto' }}>
          <ConnectWalletButton />
        </Box>
      </Header>
    </div>
  )
}

export default Home
