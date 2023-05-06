import WalletButton from "./wallet/WalletButton";
import {heliusClusterApiUrl, useEndpointContext} from "./wallet/endpointContext";
import {Select} from "@chakra-ui/react";
import {Cluster} from "@solana/web3.js";
import {ChangeEvent} from "react";

export default function NavBar() {
  const {setEndpoint} = useEndpointContext();

  function changeHandler(e: ChangeEvent<HTMLSelectElement>) {
    setEndpoint(heliusClusterApiUrl(process.env.NEXT_PUBLIC_API_KEY as string, e.target.value as Cluster));
  }

  return (
    <>
      <Select onChange={changeHandler}>
        <option value="mainnet-beta">Mainnet</option>
        <option value="devnet">Devnet</option>
      </Select>
      <WalletButton/>
    </>
  );
}