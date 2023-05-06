import axios from "axios";
import {Connection, PublicKey} from "@solana/web3.js";

const getHeliusUrl = (connection?: Connection) => connection?.rpcEndpoint && connection.rpcEndpoint.includes("devnet") ?
    "https://api-devnet.helius.xyz/v0" : "https://api.helius.xyz/v0";

export interface TokenInfo {
    mint: string;
    amount: number;
    decimals: number;
    tokenAccount: string;
}
export interface Balance {
    tokens: TokenInfo[],
    nativeBalance: number
}

export async function getBalances(address: string | PublicKey, connection?: Connection): Promise<Balance> {
    const res = await fetch(`${getHeliusUrl(connection)}/addresses/${address.toString()}/balances?api-key=${process.env.NEXT_PUBLIC_API_KEY}`);
    return await res.json();
}

export interface TokenMetadataReq {
    mintAccounts: string[];
    includeOffChain: boolean;
}

export interface TokenMetadataRes {
    account: string;
    onChainAccountInfo: {
        accountInfo: {
            key: string;
            isSigner: boolean;
            isWritable: boolean;
            lamports: number;
            data: {
                parsed: {
                    info: {
                        decimals: number;
                        freezeAuthority: string;
                        isInitialized: boolean;
                        mintAuthority: string;
                        supply: string;
                    };
                    type: string;
                };
                program: string;
                space: number;
            };
            owner: string;
            executable: boolean;
            rentEpoch: number;
        };
        error: string;
    };
    onChainMetadata: {
        metadata: {
            key: string;
            mint: string;
            updateAuthority: string;
            data: {
                name: string;
                symbol: string;
                uri: string;
                sellerFeeBasisPoints: number;
                creators: {
                    address: string;
                    share: string;
                    verified: boolean;
                }[];
            };
            tokenStandard: string;
            primarySaleHappened: boolean;
            isMutable: boolean;
            editionNonce: number;
            collection: {
                key: string;
                verified: boolean;
            };
            collectionDetails: {
                size: number;
            };
            uses: {
                useMethod: string;
                remaining: number;
                total: number;
            };
        };
    };
    offChainMetadata: {
        metadata: {
            name: string;
            symbol: string;
            attributes: {
                traitType: string;
                value: string;
            }[];
            sellerFeeBasisPoints: number;
            image: string;
            properties: {
                category: string;
                files: {
                    uri: string;
                    type: string;
                }[];
                creators: {
                    address: string;
                    share: string;
                }[];
            };
        };
        uri: string;
    };
    legacyMetadata: {
        chainId: number;
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        logoURI: string;
        tags: string[];
        extensions: Record<string, any>;
    };
}

export async function getTokenMetadata(req: TokenMetadataReq, connection?: Connection) {
    const {data} = await axios.post<TokenMetadataRes[]>(`${getHeliusUrl(connection)}/token-metadata?api-key=${process.env.NEXT_PUBLIC_API_KEY}`, req);
    return data;
}