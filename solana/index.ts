import {Connection, PublicKey} from "@solana/web3.js";
import {Balance, getBalances, getTokenMetadata, TokenMetadataRes} from "./heliusGateway";

export let userBalances: Balance;
export let tokenMints: TokenMetadataRes[];

export async function getUserSplTokens(address: string | PublicKey, connection: Connection) {
    if (!userBalances || userBalances.tokens.length == 0) userBalances = await getBalances(address, connection);
    if (!tokenMints || tokenMints.length == 0) tokenMints = await getTokenMetadata({
        includeOffChain: true,
        mintAccounts: userBalances.tokens.map(token => token.mint)
    }, connection);

    return userBalances.tokens
        .filter(token => token.decimals !== 0 && token.amount !== 1)
        .map(token => {
        let mint = tokenMints.find(it => it.account === token.mint);

        let hasOnChainMetadata = mint?.onChainMetadata.metadata !== null;

        if (!hasOnChainMetadata && mint?.legacyMetadata == null)
            return {label: `$${token.mint} ${token.amount}`, value: token.mint, image: undefined}

        return hasOnChainMetadata ?
            {
                label: `$${mint?.onChainMetadata.metadata.data.name} ${(token.amount / (10 ** token.decimals)).toLocaleString()}`,
                value: token.mint,
                image: mint?.offChainMetadata.metadata?.image
            } :
            {
                label: `$${mint?.legacyMetadata.name} ${token.amount}`,
                value: token.mint,
                image: mint?.legacyMetadata.logoURI
            };
    });
}