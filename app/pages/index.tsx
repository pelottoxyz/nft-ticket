import Head from 'next/head'
import { BigNumber } from 'ethers'
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { ConnectWalletButton } from '@/components/ConnectButton'
import {
  Box,
  Container,
  Text,
  Header,
  Logo,
  Button,
  PassPreviewModal,
  Link,
} from '@/components'
import { PitchLine } from '@/components/PitchLine'
import { abi } from 'constants/PelotoPass'
import { useEffect, useState } from 'react'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT

export default function Home() {
  const { isConnected } = useAccount()

  const [totalMinted, setTotalMinted] = useState<Number | undefined>()
  const [totalSupply, setTotalSupply] = useState<Number | undefined>()

  const defaultContract = {
    address: `${CONTRACT_ADDRESS}`,
    abi,
  }

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'mint',
  })

  const {
    data: mintData,
    isError: mintError,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    write: mint,
  } = useContractWrite(config)

  const { data: transationData, isSuccess: txSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  })

  const isMinted = txSuccess

  const contracts = [
    {
      ...defaultContract,
      functionName: 'totalSupply',
    },
    {
      ...defaultContract,
      functionName: 'maxSupply',
    },
  ]

  const {
    data: mintInfoData,
    error: mintInfoDataError,
    isSuccess: mintInfoLoaded,
  } = useContractReads({
    contracts,
  })

  useEffect(() => {
    if (mintInfoData && mintInfoLoaded) {
      try {
        if (!mintInfoData[0] || mintInfoData[1]) return
        const total = mintInfoData[0] as BigNumber
        const supply = mintInfoData[1] as BigNumber
        setTotalMinted(total.toNumber())
        setTotalSupply(supply.toNumber())
      } catch (err) {
        //
      }
    }
  }, [mintInfoData, mintInfoLoaded, setTotalMinted, setTotalSupply])

  if (mintError) console.log('🐞', mintError)
  if (mintInfoDataError) console.log('🐞', mintInfoDataError)
  console.log('--> mintInfoData ', mintInfoData)

  return (
    <Box
      css={{
        position: 'relative',
        padding: '$2',
        zIndex: 2,
      }}
    >
      <Head>
        <title>Pelotto</title>
        <meta name="description" content="Building" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <Logo />
        <Box css={{ marginLeft: 'auto' }}>
          {isConnected && <ConnectWalletButton />}
        </Box>
      </Header>

      <PassPreviewModal
        loading={(isMintStarted || isMintLoading) && !isMinted}
      />

      <Container
        size={{ '@initial': '1', '@bp1': '3' }}
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingX: '$5',
        }}
      >
        <PitchLine />
        <Text
          css={{
            margin: 0,
            maxWidth: 500,
            textAlign: 'center',
            color: '$gray600',
            '@bp1': {
              maxWidth: 300,
            },
            '@bp2': {
              maxWidth: 500,
            },
          }}
        >
          Participa en el World Cup Raffle, NFT tickets collecionables PELOTTO,
          participa y gana hasta.
        </Text>
        <Box
          css={{
            paddingY: '$5',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {isConnected && mintInfoData && !isMinted && (
            <Button
              disabled={isMintLoading || isMintStarted}
              onClick={() => mint && mint()}
            >
              {!isMintStarted && 'Mint pass'}
              {isMintStarted && 'Minting pending...'}
            </Button>
          )}

          {!isConnected && <ConnectWalletButton />}

          {isMinted && (
            <Box
              css={{
                paddingY: '$5',
                maxWidth: 400,
                textAlign: 'center',
              }}
            >
              <Text>
                Your NFT will show up in your wallet in the next few minutes.
                View transaction on{' '}
                <Link
                  href={`https://mumbai.polygonscan.com/tx/${mintData?.hash}`}
                >
                  Polygonscan
                </Link>
              </Text>
            </Box>
          )}
        </Box>

        {isMintLoading && (
          <Box css={{ paddingY: '$4' }}>
            <Text css={{ margin: 0 }}>
              {isMintLoading && 'Waiting for approval...'}
            </Text>
          </Box>
        )}

        {totalMinted && totalSupply && (
          <Box>
            <Text
              css={{ color: '$gray600' }}
            >{`Total minted ${totalMinted} / ${totalSupply}`}</Text>
          </Box>
        )}
      </Container>
    </Box>
  )
}
