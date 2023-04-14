// import Image from "next/image";
// import { Calistoga, Inter } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { BigNumber, Contract, providers, utils } from "ethers";

import {
  NFT_COLLECTION_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "@/constants";

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConneted, setWalletConnected] = useState(false);
  const [tokenMinted, setTokenMinted] = useState(zero);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] =
    useState(zero);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokenToBeClaimed, setTokenToBeClaimed] = useState(zero);
  const [loading, setLoading] = useState(false);

  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 11155111) {
      window.alert("Change the network to sepolia or goerli");
      throw new Error("Change network to sepolia or goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
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
  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_COLLECTION_ABI,
        provider
      );
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const signer = await getProviderOrSigner(true);
      const address = signer.getAddress();
      const balance = await nftContract.balanceOf(address);
      if (balance === zero) {
        setTokenToBeClaimed(zero);
      } else {
        var amount = 0;
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const claimed = await tokenContract.tokenIdClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
        setTokenToBeClaimed(BigNumber.from(amount));
      }
    } catch (error) {
      console.error(error.message);
      setTokenToBeClaimed(zero);
    }
  };
  const getBalanceOFCryptoDevTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalanceOfCryptoDevTokens(balance);
    } catch (error) {
      console.error(error);
    }
  };
  const getTotalTokensMinted = async () => {
    const provider = await getProviderOrSigner();
    const tokenContract = new Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_CONTRACT_ABI,
      provider
    );

    const _tokenMinted = await tokenContract.totalSupply();
    // console.log(utils.formatEther(_tokenMinted.toString()));

    setTokenMinted(_tokenMinted);
  };
  const mintCryptoDevToken = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("successfully mint nft dev tokens");
      await getBalanceOFCryptoDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (error) {
      console.log(error.message);
    }
  };
  const claimCryptoDevTokens = async () => {
    try {
      console.log("sammed");
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const tx = await tokenContract.claim();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("you have successfully claimed your tokens");
      await getBalanceOFCryptoDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (error) {
      console.error(error.message);
    }
  };

  const renderButton = () => {
    if (loading) {
      return (
        <div>
          <button className={styles.button}>loading...</button>
        </div>
      );
    }
    if (tokenToBeClaimed > 0) {
      return (
        <div>
          <div className={styles.description}>{tokenToBeClaimed * 10}</div>
          <button className={styles.button} onClick={claimCryptoDevTokens}>
            Claim Token
          </button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
          />
          <button
            className={styles.button}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintCryptoDevToken(tokenAmount)}
          >
            Mint token
          </button>
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (!walletConneted) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getBalanceOFCryptoDevTokens();
      getTotalTokensMinted();
      getTokensToBeClaimed();
    }
  }, [walletConneted]);
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
                You have minted {utils.formatEther(balanceOfCryptoDevTokens)}{" "}
                Crypto Dev Token
              </div>
              <div className={styles.description}>
                Overall {utils.formatEther(tokenMinted)}/10000 have been
                minted!!!
              </div>
              {renderButton()}
            </div>
          ) : (
            <button onClick={connectWallet} className={styles.button}>
              connect
            </button>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        Developed by Sammed
        <div className="app">
          <a href="https://github.com/sammed-21/Ocean_Token">
            {/* <img alt="stack overflow" src={Imae}></img> */}
          </a>
        </div>
      </footer>
    </div>
  );
}
