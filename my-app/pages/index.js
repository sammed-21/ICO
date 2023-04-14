import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { BigNumber, utils } from "ethers";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConneted, setWalletConnected] = useState(false);
  const [tokenMinted, setTokenMinted] = useState(zero);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connet();
    const web3Provider = new provider.web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 11155111) {
      window.alert("change the network to sepolia");
      throw new Error("change the newtork to sepolia");
    }
    if (needSigner) {
      const signer = await web3Provider.getSinger();
      return signer;
    }
    return web3Provider;
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (!walletConneted) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  });
  return (
    <div>
      <Head>
        <title>Crypto Devs ICO</title>
        <meta name="description" content="ICO-dAPP" />
        <link rel="icon" href="./facicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs ICO </h1>

          <div className={styles.description}>
            you can claim or mint crtpto dev tokens here
          </div>
          {walletConneted ? (
            <div>
              <div className={styles.description}>
                total {utils.formatEther(tokenMinted)} number of token minted
              </div>
            </div>
          ) : (
            <button onClick={connectWallet} className={styles.button}>
              connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
