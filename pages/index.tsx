import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>pelotto</title>
        <meta name="description" content="building" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        building 🛠
      </main>
    </div>
  )
}

export default Home
