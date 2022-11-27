import type { NextPage } from 'next'
import Head from 'next/head'
import { BigNumber, utils } from 'ethers'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import { ConnectWalletButton } from '@/components/ConnectButton'
import {
  Box,
  Container,
  Text,
  Header,
  Logo,
  Button,
  MaticIcon,
} from '@/components'
import { PitchLine } from '@/components/PitchLine'
import { abi } from 'constants/PelotoPass'
import { useEffect, useState } from 'react'

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

  const [totalMinted, setTotalMinted] = useState<Number | undefined>()
  const [totalSupply, setTotalSupply] = useState<Number | undefined>()

  const defaultContract = {
    address: `${CONTRACT_ADDRESS}`,
    abi,
  }

  const contracts = [
    {
      ...defaultContract,
      functionName: 'mintCost',
    },
    {
      ...defaultContract,
      functionName: 'totalSupply',
    },
    {
      ...defaultContract,
      functionName: 'maxSupply',
    },
  ]

  const { data: mintInfoData, isSuccess: mintInfoLoaded } = useContractReads({
    contracts,
  })

  useEffect(() => {
    if (mintInfoData && mintInfoLoaded) {
      const total = mintInfoData[1] as BigNumber
      const supply = mintInfoData[2] as BigNumber
      setTotalMinted(total.toNumber())
      setTotalSupply(supply.toNumber())
    }
  }, [mintInfoData, mintInfoLoaded, setTotalMinted, setTotalSupply])

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
          Participa en el World Cup Raffle, NFT tickets collecionables PELOTTO,
          participa y gana hasta.
        </Text>
        <Box css={{ paddingY: '$3' }}>
          {isConnected && <Button>Mint pass</Button>}
        </Box>
        {mintInfoLoaded && mintInfoData && (
          <>
            <Box
              css={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Text css={{ color: '$gray500' }}>
                Mint price <MaticIcon />{' '}
                {utils.formatUnits(mintInfoData[0] as BigNumber, 'ether')}
              </Text>
            </Box>
            <Box>
              <Text
                css={{ fontWeight: 600 }}
              >{`Total minted ${totalMinted} / ${totalSupply}`}</Text>
            </Box>
          </>
        )}
      </Container>
    </div>
  )
}

export default Home
