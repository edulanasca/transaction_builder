import {FC, ReactNode, useMemo} from "react"
import {ConnectionProvider, WalletProvider,} from "@solana/wallet-adapter-react"
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui"
import {clusterApiUrl} from "@solana/web3.js"
import {SlopeWalletAdapter, SolflareWalletAdapter} from "@solana/wallet-adapter-wallets"
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

require("@solana/wallet-adapter-react-ui/styles.css")

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const url = useMemo(() => process.env.NODE_ENV === 'development' ?
    clusterApiUrl("devnet") : process.env.NEXT_PUBLIC_RPC_URL as string, []);

  const wallets = useMemo(() => [
    new SolflareWalletAdapter({ network: process.env.NODE_ENV === 'development' ?
        WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet }),
    new SlopeWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={url}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WalletContextProvider;