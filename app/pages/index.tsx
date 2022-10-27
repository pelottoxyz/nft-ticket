import { ethers } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { createRef, useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { NFT_ABI } from '../constants/abis'

const Home: NextPage = () => {
  const [success, setSuccess] = useState<string | undefined>()
  const [message, setMessage] = useState<string | undefined>()
  const [signer, setSigner] = useState<
    ethers.providers.JsonRpcSigner | undefined
  >()
  const captchaRef = createRef<HCaptcha>()
  const { isConnected } = useAccount()
  const { data } = useSigner()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethereum = (window as any).ethereum
      const provider = new ethers.providers.Web3Provider(ethereum)
      setSigner(provider.getSigner())
    }
  }, [])

  const executeMint = async (hash: string, signature: string) => {
    setMessage('Accept the minting tx on Metamask.')

    try {
      const nftContract = new ethers.Contract(
        `${process.env.NEXT_PUBLIC_NFT_ADDRESS}`,
        NFT_ABI,
        signer
      )
      setMessage('Minting contract...')
      const tx = await nftContract.mint(hash, signature)
      setMessage('Waiting for transaction hash...')
      const receipt = await tx.wait()
      setMessage(undefined)
      setSuccess(receipt.transactionHash)
    } catch (err) {
      console.log(`An error occurred. Did not mint the NFT.`, err)
    }

    setMessage(undefined)
    captchaRef.current?.resetCaptcha()
  }

  const onCaptchaChange = async (token: string, ekey: string) => {
    if (!token) {
      // no token means that captcha wasn't solved
      return
    }

    const address = await data?.getAddress()
    setMessage('Verifying request...')

    const response = await fetch('api/mint', {
      method: 'POST',
      body: JSON.stringify({ address, token }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.ok) {
      // expect `result` to be a stringified JSON object like { hash, signature }
      let { result } = await response.json()
      result = JSON.parse(result)

      // obtained the hash and signature. Now go for the actual mint.
      await executeMint(result.hash, result.signature)
    } else {
      setMessage('Error verifying request!')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pelotto</title>
        <meta name="description" content="Building" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.connect}>
          <ConnectButton />
        </div>
        <h1 className={styles.title}>Pelotto NFT ticket!</h1>

        {!isConnected && <h1>Please, connect your wallet</h1>}

        {isConnected && (
          <>
            <p>Pass the captcha below to mint a NFT.</p>
            <form>
              <HCaptcha
                sitekey={`${process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}`}
                onVerify={(token, ekey) =>
                  onCaptchaChange(token, ekey)
                }
                ref={captchaRef}
              />
            </form>
          </>
        )}

        {message && <p>{message}</p>}

        {success && (
          <>
            <p>Success! You minted a NFT </p>
            <p>
              <a
                href={`https://mumbai.polygonscan.com/tx/${success}`}
              >
                See transaction on polygonscan
              </a>
            </p>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
