import { useWallet } from "@solana/wallet-adapter-react";
import Solana from "../public/solana.svg";
import Solflare from "../public/solflare-wallet.svg";
import Glow from "../public/glow-wallet.svg";
import Phantom from "../public/phantom-wallet.svg";
import Default from "../public/default-wallet.svg";
import Image from "next/image";

export const WalletIcon = () => {
  const { connected, wallet } = useWallet();

  const [alt, src] = !connected
    ? ["Solana", Solana]
    : wallet?.adapter.name === "Solflare"
    ? ["Solflare", Solflare]
    : wallet?.adapter.name === "Glow"
    ? ["Glow", Glow]
    : wallet?.adapter.name === "Phantom"
    ? ["Phantom", Phantom]
    : ["Wallet", Default];

  return (
    <Image
      alt={alt}
      src={src}
      className="absolute h-4 w-4 lg:h-6 lg:w-6 left-[231px] top-[302px] lg:left-[383px] lg:top-[499px]"
    />
  );
};
