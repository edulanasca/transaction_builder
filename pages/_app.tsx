import '../styles/globals.css'
import type {AppProps} from 'next/app'
import WalletContextProvider from "../components/wallet/WalletContextProvider";
import {ChakraProvider} from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </ChakraProvider>
  );
}
