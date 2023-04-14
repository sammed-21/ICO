import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [walletConneted, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connet();
    const web3Provider = new provider.web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 11155111) {
      window.alert("change the network to sepolia");
      throw new Error("change the newtork to sepolia");
    }
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {}
  };
  useEffect(() => {
    if (!walletConneted) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  });
  return <div>hello</div>;
}
