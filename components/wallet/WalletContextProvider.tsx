import {FC, ReactNode, useMemo} from "react"
import {ConnectionProvider, WalletProvider,} from "@solana/wallet-adapter-react"
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui"
import {SlopeWalletAdapter, SolflareWalletAdapter} from "@solana/wallet-adapter-wallets"
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {useEndpointContext} from "./endpointContext";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { endpoint } = useEndpointContext();

  const wallets = useMemo(() => [
    new SolflareWalletAdapter({
      network: process.env.NODE_ENV === 'development' ?
        WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet
    }),
    new SlopeWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WalletContextProvider;