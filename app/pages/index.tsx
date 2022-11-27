import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount, useContractRead } from 'wagmi'
import { ConnectWalletButton } from '@/components/ConnectButton'
import { Box, Container, Text, Header, Logo } from '@/components'
import { PitchLine } from '@/components/PitchLine'

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
        <Logo />
        <Box css={{ marginLeft: 'auto' }}>
          <ConnectWalletButton />
        </Box>
      </Header>

      <Container
        size={{ '@initial': '1', '@bp1': '3' }}
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingY: '$4',
          paddingX: '$5',
          minHeight: '50vh',
        }}
      >
        <PitchLine />
        <Text
          css={{
            maxWidth: 500,
            textAlign: 'center',
            '@bp1': {
              maxWidth: 'none',
            },
            '@bp2': {
              maxWidth: 500,
            },
          }}
        >
          Participa en el World Cup Raffle, NFT tickets collecionables
          PELOTTO, participa y gana hasta.
        </Text>
      </Container>
    </div>
  )
}

export default Home
