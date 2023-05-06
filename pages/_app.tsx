import '../styles/globals.css'
import type {AppProps} from 'next/app'
import WalletContextProvider from "../components/wallet/WalletContextProvider";
import {ChakraProvider} from '@chakra-ui/react'
import {EndpointProvider} from "../components/wallet/endpointContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <EndpointProvider>
        <WalletContextProvider>
          <Component {...pageProps} />
        </WalletContextProvider>
      </EndpointProvider>
    </ChakraProvider>
  );
}
