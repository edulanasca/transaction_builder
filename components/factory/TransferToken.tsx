import {Flex, SimpleGrid, useToast} from "@chakra-ui/react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {useEffect, useState} from "react";
import Select, {OnChangeValue} from 'react-select';
import Transfer from "./Transfer";
import {getUserSplTokens, userBalances} from "../../solana";
import {TransactionInstructionProps} from "./TransactionInstructionFactory";
import {
    getAccount,
    getAssociatedTokenAddressSync,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError
} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";
import {transferToken} from "../../reducer/transactionActions";
import {TokenInfo} from "../../solana/heliusGateway";

export default function TransferToken({id, dispatch}: TransactionInstructionProps) {
    const wallet = useWallet();
    const {connection} = useConnection();
    const toast = useToast();
    const [tokens, setTokens] = useState<Option[]>([]);
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

    type Option = { label: string, value: string, image?: string };

    useEffect(() => {
        if (wallet.publicKey !== null) getUserSplTokens(wallet.publicKey, connection)
            .then(res => setTokens(res))
            .catch(err => toast({title: "Error fetching tokens", description: err.toString(), status: "error"}));
    }, [wallet.publicKey, connection.rpcEndpoint]);

    const customOption = (props: Option) => (
        <Flex alignItems="center">
            {props.image ? <img src={props.image} alt={props.label} width="20px" height="20px"/> : null}
            <p>&nbsp;&nbsp;{props.label}</p>
        </Flex>
    );

    const changeHandler = (selected: OnChangeValue<Option, false>) =>
        setTokenInfo(userBalances.tokens.find(token => token.mint === selected?.value));

    async function addInstructionHandler(to: string, amount: string) {
        try {
            if (!tokenInfo) return;

            let mint = new PublicKey(tokenInfo.mint);
            let tokenAccount: PublicKey | string | undefined = tokenInfo.tokenAccount;

            if (!tokenAccount) tokenAccount = getAssociatedTokenAddressSync(mint, wallet.publicKey!);

            const toATA = getAssociatedTokenAddressSync(mint, new PublicKey(to));
            let createATA = false;
            try {
                await getAccount(connection, toATA);
            } catch (error: unknown) {
                if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                    createATA = true;
                }
            }

            dispatch(transferToken(id, wallet.publicKey!, new PublicKey(tokenAccount), new PublicKey(to), toATA,
                mint, parseFloat(amount) * (10 ** (tokenInfo.decimals ?? 0)), createATA));
        } catch (err) {
            toast({title: "Error while adding instruction", description: (err as string).toString(), status: "error", isClosable: true});
        }
    }

    return (
        <SimpleGrid columns={1} spacing={5}>
            <Select
                options={tokens}
                formatOptionLabel={data => customOption(data)}
                onChange={changeHandler}
            />
            <Transfer onAddInstruction={addInstructionHandler} isToken decimals={tokenInfo?.decimals}/>
        </SimpleGrid>
    );
}