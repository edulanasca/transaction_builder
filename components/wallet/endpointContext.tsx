import {createContext, Dispatch, SetStateAction, useContext, useState} from "react";
import {Cluster} from "@solana/web3.js";

type EndpointContextType = {endpoint: string, setEndpoint: Dispatch<SetStateAction<string>>}
const EndpointContext = createContext<EndpointContextType>({} as EndpointContextType);

export function useEndpointContext() {
  return useContext(EndpointContext);
}

export function heliusClusterApiUrl(
    apiKey: string,
    cluster: Cluster = "devnet"
): string {
  switch (cluster) {
    case "devnet":
      return `https://rpc-devnet.helius.xyz/?api-key=${apiKey}`;
    case "mainnet-beta":
      return `https://rpc.helius.xyz/?api-key=${apiKey}`;
    default:
      return "";
  }
}

export function EndpointProvider({ children }: { children: JSX.Element }) {
  const [endpoint, setEndpoint]
      = useState(heliusClusterApiUrl(process.env.NEXT_PUBLIC_API_KEY as string, "mainnet-beta"));

  return (
    <EndpointContext.Provider value={{ endpoint, setEndpoint }}>
      {children}
    </EndpointContext.Provider>
  );
}