import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel, Input,
    NumberInput,
    NumberInputField,
} from "@chakra-ui/react";
import {ChangeEvent, useEffect, useState} from "react";

interface TransferProps {
    onAddInstruction: (to: string, amount: string) => void;
    isToken?: boolean;
    decimals?: number;
}

export default function Transfer(props: TransferProps) {
    const decimals = props.decimals ? props.decimals : 9;

    const [to, setTo] = useState("");
    const [amount, setAmount] = useState(Number(1).toFixed(decimals).toString());

    useEffect(() => {
        setAmount(Number().toFixed(decimals).toString());
    }, [decimals]);

    let isInvalidWallet = to == "";
    let isInvalidAmount = amount === "";
    const handleToInputChange = (e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value);
    const handleAmountInputChange = (valueAsString: string, _: number) => setAmount(valueAsString);

    return (
        <Flex direction={["column", "row"]} columnGap={[0, 4]} rowGap={[4, 0]}>
            <FormControl isInvalid={isInvalidAmount}>
                <FormLabel>Amount</FormLabel>
                <NumberInput min={0} precision={decimals} value={amount}
                             onChange={handleAmountInputChange}>
                    <NumberInputField/>
                </NumberInput>
                {
                    !isInvalidAmount ?
                        <FormHelperText>Enter the amount of {props.isToken ? "tokens" : "SOL"} to send</FormHelperText> :
                        <FormErrorMessage>Invalid amount</FormErrorMessage>
                }
            </FormControl>
            <FormControl isInvalid={isInvalidWallet}>
                <FormLabel>To</FormLabel>
                <Input value={to} onChange={handleToInputChange} onBlur={() => props.onAddInstruction(to, amount)}/>
                {
                    !isInvalidWallet ?
                        <FormHelperText>Enter the user address you want to send SOL to</FormHelperText> :
                        <FormErrorMessage>Invalid address</FormErrorMessage>
                }
            </FormControl>
        </Flex>
    );
}